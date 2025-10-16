#!/bin/bash
# 自动同步英文页面脚本

EN_DIR="src/pages/en"
mkdir -p "$EN_DIR"

# 复制所有 .astro 文件到 en 目录
for file in src/pages/*.astro; do
  filename=$(basename "$file")
  cp "$file" "$EN_DIR/$filename"
done

echo "✅ 英文页面已同步"