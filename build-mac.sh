#!/bin/bash
set -e
echo "Building တီၢ်လိကညီကျိာ် for macOS..."
npm install
npm run dist:mac
echo "Done. See the dist folder."
