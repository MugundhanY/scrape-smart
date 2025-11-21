# Read .env file and parse variables
$envParams = @()
if (Test-Path .env) {
    Get-Content .env | ForEach-Object {
        if ($_ -match '^([^#=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($key -and $value) {
                $envParams += "-e"
                $envParams += "$key=$value"
            }
        }
    }
}

# Run k6 with the environment variables
Write-Host "Starting K6 Load Test..." -ForegroundColor Green
Write-Host "Using configuration from .env" -ForegroundColor Gray

# Add default BASE_URL if not in .env
if (!($envParams -contains "BASE_URL")) {
    $envParams += "-e"
    $envParams += "BASE_URL=http://localhost:3000"
}

$k6Command = "k6"
$k6Args = @("run") + $envParams + @("tests/load/k6-script.js")

# Print command for debugging (optional)
# Write-Host "$k6Command $k6Args"

& $k6Command $k6Args
