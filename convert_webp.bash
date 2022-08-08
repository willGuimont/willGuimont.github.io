for file in $(find . -type f -print); do
  if [[ "$file" == *".png" ]]; then
    cwebp -q 80 -m 6 "$file" -o "${file%.png}.webp"
  fi
done