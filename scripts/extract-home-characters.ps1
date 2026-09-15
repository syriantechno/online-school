Add-Type -AssemblyName System.Drawing

function Export-Character {
    param(
        [string]$Source,
        [System.Drawing.Rectangle]$Crop,
        [string]$Destination
    )

    $sourceImage = [System.Drawing.Bitmap]::FromFile($Source)
    try {
        $output = New-Object System.Drawing.Bitmap($Crop.Width, $Crop.Height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
        try {
            $graphics = [System.Drawing.Graphics]::FromImage($output)
            try {
                $graphics.Clear([System.Drawing.Color]::Transparent)
                $graphics.DrawImage($sourceImage, (New-Object System.Drawing.Rectangle(0, 0, $Crop.Width, $Crop.Height)), $Crop, [System.Drawing.GraphicsUnit]::Pixel)
            } finally {
                $graphics.Dispose()
            }

            for ($y = 0; $y -lt $output.Height; $y++) {
                for ($x = 0; $x -lt $output.Width; $x++) {
                    $pixel = $output.GetPixel($x, $y)
                    $minimum = [Math]::Min($pixel.R, [Math]::Min($pixel.G, $pixel.B))
                    if ($minimum -ge 250) {
                        $alpha = [Math]::Max(0, [Math]::Min(255, (255 - $minimum) * 51))
                        $output.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($alpha, $pixel.R, $pixel.G, $pixel.B))
                    }
                }
            }

            $directory = Split-Path -Parent $Destination
            [System.IO.Directory]::CreateDirectory($directory) | Out-Null
            $output.Save($Destination, [System.Drawing.Imaging.ImageFormat]::Png)
        } finally {
            $output.Dispose()
        }
    } finally {
        $sourceImage.Dispose()
    }
}

$projectRoot = Split-Path -Parent $PSScriptRoot
$assetRoot = Join-Path $projectRoot 'public\assets\home\characters'

Export-Character `
    -Source (Join-Path $projectRoot 'Girl.png') `
    -Crop (New-Object System.Drawing.Rectangle(155, 35, 390, 875)) `
    -Destination (Join-Path $assetRoot 'girl-hero.png')

Export-Character `
    -Source (Join-Path $projectRoot 'Boy1.png') `
    -Crop (New-Object System.Drawing.Rectangle(708, 500, 250, 405)) `
    -Destination (Join-Path $assetRoot 'boy-hero.png')

Export-Character `
    -Source (Join-Path $projectRoot 'Boy1.png') `
    -Crop (New-Object System.Drawing.Rectangle(265, 515, 175, 375)) `
    -Destination (Join-Path $assetRoot 'boy-schoolbag.png')

Export-Character `
    -Source (Join-Path $projectRoot 'Girl.png') `
    -Crop (New-Object System.Drawing.Rectangle(1240, 355, 215, 410)) `
    -Destination (Join-Path $assetRoot 'girl-schoolbag.png')
