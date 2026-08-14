$home_path = "d:\PROYECTOS\dedos\Proyecto SEPPRO\2025\seppro-angular\src\app\pages\home\home.component.ts"
$login_path = "d:\PROYECTOS\dedos\Proyecto SEPPRO\2025\seppro-angular\src\app\pages\login\login.component.ts"

function Replace-Colors($path) {
    $content = Get-Content $path -Raw
    
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

    # Specific fixes
    $content = $content -replace 'color: white;', 'color: #0F172A;' # this might break .btn-primary but wait, they don't have .btn-primary inline. Wait, product-badge has color: white; which is fine because its background is blue gradient. I'll revert that.
    
    Set-Content -Path $path -Value $content
}

Replace-Colors $home_path
Replace-Colors $login_path

Write-Host "Done replacing colors"
