# Builds web-sized copies of the original camera photos in assets/img/.
#
#   assets/img/web/<name>.jpg    long edge 1600px  (backgrounds, lightbox)
#   assets/img/thumb/<name>.jpg  long edge 640px   (gallery grid, portraits)
#   assets/img/web/og-cover.jpg  1200x630 crop     (link-preview thumbnail)
#
# EXIF orientation is applied and all metadata (camera info, GPS) is dropped,
# because every image is redrawn onto a fresh bitmap.
#
# Usage (from the repo root, Windows PowerShell):
#   powershell -ExecutionPolicy Bypass -File scripts/optimize-images.ps1
param(
  [string]$SrcDir = (Join-Path $PSScriptRoot "..\assets\img"),
  [string]$OgSource = "DSC_6854",
  [double]$OgFocusY = 0.56
)
Add-Type -AssemblyName System.Drawing

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq "image/jpeg" }

function Save-Jpeg($bitmap, [string]$path, [long]$quality) {
  $params = New-Object System.Drawing.Imaging.EncoderParameters 1
  $params.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $quality
  $bitmap.Save($path, $jpegCodec, $params)
}

function Open-Oriented([string]$path) {
  $img = [System.Drawing.Image]::FromFile($path)
  if ($img.PropertyIdList -contains 0x0112) {
    switch ([BitConverter]::ToUInt16($img.GetPropertyItem(0x0112).Value, 0)) {
      3 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate180FlipNone) }
      6 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate90FlipNone) }
      8 { $img.RotateFlip([System.Drawing.RotateFlipType]::Rotate270FlipNone) }
    }
  }
  return $img
}

function Draw-Resized($img, [int]$w, [int]$h, $srcRect) {
  $bmp = New-Object System.Drawing.Bitmap $w, $h
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
  $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
  $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
  $dest = New-Object System.Drawing.Rectangle 0, 0, $w, $h
  $g.DrawImage($img, $dest, $srcRect, [System.Drawing.GraphicsUnit]::Pixel)
  $g.Dispose()
  return $bmp
}

$webDir = Join-Path $SrcDir "web"
$thumbDir = Join-Path $SrcDir "thumb"
New-Item -ItemType Directory -Force $webDir, $thumbDir | Out-Null

$sizes = @(
  @{ Dir = $webDir; Edge = 1600; Quality = 82 },
  @{ Dir = $thumbDir; Edge = 640; Quality = 80 }
)

Get-ChildItem $SrcDir -File | Where-Object { $_.Name -match '^DSC_\d+\.jpe?g$' } | Sort-Object Name | ForEach-Object {
  $name = $_.BaseName + ".jpg"
  $img = Open-Oriented $_.FullName
  $full = New-Object System.Drawing.Rectangle 0, 0, $img.Width, $img.Height
  foreach ($s in $sizes) {
    $out = Join-Path $s.Dir $name
    if (Test-Path $out) { continue }
    $scale = $s.Edge / [Math]::Max($img.Width, $img.Height)
    $bmp = Draw-Resized $img ([int]($img.Width * $scale)) ([int]($img.Height * $scale)) $full
    Save-Jpeg $bmp $out $s.Quality
    $bmp.Dispose()
  }

  if ($_.BaseName -eq $OgSource) {
    # 1200x630 crop across the full width, centered vertically on OgFocusY.
    $cropH = [int]($img.Width * 630 / 1200)
    $top = [int]([Math]::Min([Math]::Max($img.Height * $OgFocusY - $cropH / 2, 0), $img.Height - $cropH))
    $rect = New-Object System.Drawing.Rectangle 0, $top, $img.Width, $cropH
    $bmp = Draw-Resized $img 1200 630 $rect
    Save-Jpeg $bmp (Join-Path $webDir "og-cover.jpg") 84
    $bmp.Dispose()
  }
  $img.Dispose()
  Write-Output "  $name"
}
