#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 1 ]; then
  echo "Usage: $0 <TITLE>"
  exit 1
fi

# Assign the arguments to variables
TITLE=$1
TEMPLATE_FILE="blog_template.html"

# Convert the title to snake case for the output file name
OUTPUT_NAME=$(echo "$TITLE" | tr '[:upper:]' '[:lower:]' | sed -e 's/ /_/g' -e 's/[^a-z0-9_]/_/g')

# Use sed to replace placeholders and create the output file
mkdir -p "blogs/$OUTPUT_NAME"
sed -e "s/{TITLE}/$TITLE/g" "$TEMPLATE_FILE" > "blog/$OUTPUT_NAME/index.html"
