
param (
    [Parameter(Position=0, Mandatory=$false)]
    [string]$htmlFileName
)

if (-not $htmlFileName) {
    Write-Host "Usage: SendDemoEmail.ps1 <html-file-name>"
    Write-Host "Example: SendDemoEmail.ps1 active-alarm"
    exit
}

$ErrorActionPreference = 'Stop'

$smtpServer = "192.168.96.24"
$smtpPort = 25
$from = "From <from@example.com>"
$to = "To <to@example.com>"
$subject = $htmlFileName


$htmlFilePath =  "$PSScriptRoot\Results\$htmlFileName.html"

Write-Host "Sending $htmlFilePath to $($smtpServer):$smtpPort.."

$htmlBody = Get-Content $htmlFilePath -Raw

# suppress Send-MailMessage non-secure warning
$originalWarningPreference = $WarningPreference
$WarningPreference = 'SilentlyContinue'
Send-MailMessage -To $to -Subject $subject -Body $htmlBody -BodyAsHtml -SmtpServer $smtpServer -From $from -Port $smtpPort

# Restore the original warning preference
$WarningPreference = $originalWarningPreference

Write-Host "Email sent!"
