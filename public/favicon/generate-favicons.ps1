# Ensure we're in the favicon directory
Set-Location $PSScriptRoot

# Convert the original PNG to different sizes
sharp resize 512 512 favicon.png -o android-chrome-512x512.png
sharp resize 192 192 favicon.png -o android-chrome-192x192.png
sharp resize 180 180 favicon.png -o apple-touch-icon.png
sharp resize 32 32 favicon.png -o favicon-32x32.png
sharp resize 16 16 favicon.png -o favicon-16x16.png

# Convert to ICO
sharp resize 32 32 favicon.png -o favicon.ico 