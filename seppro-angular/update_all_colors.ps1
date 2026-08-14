$targetFolder = "d:\PROYECTOS\dedos\Proyecto SEPPRO\2025\seppro-angular\src\app"

function Replace-Colors-In-File($path) {
    $content = Get-Content $path -Raw
    $original = $content
    
    # Replace Green tones with Blue tones
    $content = $content -replace '#4CAF50', '#0072c6'
    $content = $content -replace '#00BFA5', '#00509d'
    $content = $content -replace 'rgba\(76, 175, 80', 'rgba(0, 114, 198'
    $content = $content -replace 'rgba\(76,175,80', 'rgba(0,114,198'
    $content = $content -replace 'rgba\(0, 191, 165', 'rgba(0, 80, 157'
    $content = $content -replace 'rgba\(27, 94, 32', 'rgba(0, 61, 122'
    $content = $content -replace 'rgba\(27,94,32', 'rgba(0,61,122'
    
    # Replace white text with dark text
    $content = $content -replace '#F1F5F9', '#0F172A'
    $content = $content -replace '#94A3B8', '#334155'
    
    # Replace dark backgrounds with light backgrounds
    $content = $content -replace '#0A0F1C', '#F1F5F9'
    $content = $content -replace '#111827', '#E2E8F0'
    $content = $content -replace '#1E293B', '#CBD5E1'
    
    # Replace white transparent borders/backgrounds with dark transparent
    $content = $content -replace 'rgba\(255,255,255,0.08\)', 'rgba(0,0,0,0.08)'
    $content = $content -replace 'rgba\(255,255,255,0.2\)', 'rgba(0,0,0,0.2)'
    $content = $content -replace 'rgba\(255,255,255,0.06\)', 'rgba(0,0,0,0.06)'
    $content = $content -replace 'rgba\(255,255,255,0.15\)', 'rgba(0,0,0,0.15)'
    $content = $content -replace 'rgba\(255,255,255,0.1\)', 'rgba(0,0,0,0.1)'
    $content = $content -replace 'rgba\(255,255,255,0.03\)', 'rgba(0,0,0,0.03)'
    $content = $content -replace 'rgba\(255,255,255,0.04\)', 'rgba(0,0,0,0.04)'

    if ($original -ne $content) {
        Set-Content -Path $path -Value $content
        Write-Host "Updated $path"
    }
}

Get-ChildItem -Path $targetFolder -Recurse -Include *.ts, *.html | ForEach-Object {
    Replace-Colors-In-File $_.FullName
}

Write-Host "Done replacing colors in all files"
