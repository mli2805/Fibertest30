# powershell -ExecutionPolicy Bypass -File progress.ps1


for ($i = 0; $i -le 100; $i += 3) {
    $timestamp = Get-Date -Format "HH:mm:ss"
    Write-Host "`r[$timestamp] Progress ... $i%" -NoNewline
    Start-Sleep -Seconds 1
}

Write-Host "`nDone"