for ($i = 0; $i -le 100; $i++) {
    Write-Host "\rProgress ... $i%" -NoNewline
    Start-Sleep -Seconds 1.5
}

Write-Host "\nDone"
