#!/usr/bin/env bash
set -euo pipefail

site_host="willguimont.com"
site_url="https://${site_host}"
indexnow_endpoint="https://api.indexnow.org/indexnow"

if [[ -z "${INDEXNOW_KEY:-}" ]]; then
	echo "INDEXNOW_KEY is not configured; skipping submission."
	exit 0
fi

if [[ ! "$INDEXNOW_KEY" =~ ^[A-Za-z0-9_-]{8,128}$ ]]; then
	echo "INDEXNOW_KEY has an invalid format." >&2
	exit 1
fi

declare -A urls=()
add_url() {
	local url="$1"
	[[ "$url" == "$site_url"* ]] && urls["$url"]=1
}

add_sitemap_urls() {
	while IFS= read -r url; do
		add_url "$url"
	done < <(sed -n 's:.*<loc>\([^<]*\)</loc>.*:\1:p' public/sitemap.xml)
}

base_sha="${INDEXNOW_BASE_SHA:-}"
if [[ -z "$base_sha" || "$base_sha" =~ ^0+$ ]] || ! git cat-file -e "${base_sha}^{commit}" 2>/dev/null; then
	add_sitemap_urls
else
	mapfile -t changed_files < <(git diff --name-only "$base_sha" "${GITHUB_SHA:-HEAD}")
	global_change=false
	for path in "${changed_files[@]}"; do
		case "$path" in
			config.toml|templates/*|themes/*|sass/*|static/*)
				global_change=true
				break
				;;
		esac
	done

	if [[ "$global_change" == true ]]; then
		add_sitemap_urls
	else
		add_url "${site_url}/"
		for path in "${changed_files[@]}"; do
			[[ "$path" == content/*.md || "$path" == content/*/*.md || "$path" == content/*/*/*.md ]] || continue
			relative="${path#content/}"
			if [[ "$relative" == "_index.md" ]]; then
				add_url "${site_url}/"
			elif [[ "$relative" == */_index.md ]]; then
				section="${relative%/_index.md}"
				while IFS= read -r url; do
					add_url "$url"
				done < <(sed -n "s:.*<loc>\(${site_url}/${section}/[^<]*\|${site_url}/${section}/\)</loc>.*:\1:p" public/sitemap.xml)
			elif [[ "$relative" == */index.md ]]; then
				bundle="${relative%/index.md}"
				section="${bundle%%/*}"
				slug="${bundle##*/}"
				slug="${slug#[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]-}"
				add_url "${site_url}/${section}/${slug}/"
				add_url "${site_url}/${section}/"
			else
				add_url "${site_url}/${relative%.md}/"
			fi
		done
	fi
fi

if (( ${#urls[@]} == 0 )); then
	echo "No public URLs changed; skipping IndexNow submission."
	exit 0
fi

mapfile -t sorted_urls < <(printf '%s\n' "${!urls[@]}" | sort)
url_json="$(printf '%s\n' "${sorted_urls[@]}" | jq -R . | jq -s .)"
payload="$(jq -n \
	--arg host "$site_host" \
	--arg key "$INDEXNOW_KEY" \
	--arg key_location "${site_url}/${INDEXNOW_KEY}.txt" \
	--argjson url_list "$url_json" \
	'{host: $host, key: $key, keyLocation: $key_location, urlList: $url_list}')"

echo "Submitting ${#sorted_urls[@]} URL(s) to IndexNow."
if [[ "${INDEXNOW_DRY_RUN:-}" == "1" ]]; then
	printf '%s\n' "${sorted_urls[@]}"
	exit 0
fi
curl --fail-with-body --silent --show-error \
	-X POST \
	-H 'Content-Type: application/json; charset=utf-8' \
	--data-binary "$payload" \
	"$indexnow_endpoint"
echo "IndexNow submission accepted."
