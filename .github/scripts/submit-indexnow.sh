#!/usr/bin/env bash
set -euo pipefail

site_host="willguimont.com"
site_url="https://${site_host}"
indexnow_endpoints=("https://www.bing.com/indexnow", "https://api.indexnow.org/indexnow" "https://yandex.com/indexnow")

if [[ -z "${INDEXNOW_KEY:-}" ]]; then
	echo "INDEXNOW_KEY is not configured; skipping submission."
	exit 0
fi

if [[ ! "$INDEXNOW_KEY" =~ ^[A-Za-z0-9-]{8,128}$ ]]; then
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

if [[ "${INDEXNOW_DRY_RUN:-}" == "1" ]]; then
	printf '%s\n' "${sorted_urls[@]}"
	exit 0
fi

# The deploy action pushes gh-pages; publication happens asynchronously.
# Verify the same public URL that IndexNow will fetch before submitting.
key_location="${site_url}/${INDEXNOW_KEY}.txt"
key_ready=false
for ((attempt = 1; attempt <= 18; attempt++)); do
	if key_content="$(curl --fail --silent --show-error \
		--connect-timeout 5 --max-time 15 "$key_location")" && \
		[[ "$key_content" == "$INDEXNOW_KEY" ]]; then
		key_ready=true
		break
	fi
	echo "Waiting for GitHub Pages to publish the IndexNow key (${attempt}/18)."
	if (( attempt < 18 )); then
		sleep 10
	fi
done
if [[ "$key_ready" != true ]]; then
	echo "::error::The public IndexNow key file is unavailable or does not match INDEXNOW_KEY. Check GitHub Pages publication and the key file on ${site_host}."
	exit 1
fi

echo "Submitting ${#sorted_urls[@]} URL(s) to IndexNow."
response_file="$(mktemp)"
trap 'rm -f "$response_file"' EXIT
for indexnow_endpoint in "${indexnow_endpoints[@]}"; do
	echo "Using ${indexnow_endpoint}."
	status="$(curl --silent --show-error \
		--connect-timeout 5 --max-time 30 \
		--output "$response_file" --write-out '%{http_code}' \
		-X POST \
		-H 'Content-Type: application/json; charset=utf-8' \
		--data-binary "$payload" \
		"$indexnow_endpoint")"
	case "$status" in
		200)
			echo "IndexNow submission accepted (HTTP ${status})."
			exit 0
			;;
		202)
			echo "IndexNow submission received; key verification is pending (HTTP 202)."
			exit 0
			;;
		403)
			echo "${indexnow_endpoint} rejected key verification (HTTP 403)." >&2
			cat "$response_file" >&2
			printf '\n' >&2
			continue
			;;
	esac
	cat "$response_file" >&2
	printf '\n' >&2
	echo "::error::IndexNow submission failed (HTTP ${status})." >&2
	exit 1
done
echo "::error::All IndexNow endpoints rejected key verification (HTTP 403), although the public key file matched. Retry later or investigate crawler access to ${key_location}." >&2
exit 1
