# MediFinder - Automated Setup Script for Windows PowerShell
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "MediFinder Setup & Verification Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan

# 1. Check Java
Write-Host "`n[1/4] Checking Java..." -ForegroundColor Yellow
if (Get-Command java -ErrorAction SilentlyContinue) {
    java -version
    Write-Host "Java is available." -ForegroundColor Green
} else {
    Write-Host "Java JDK 17+ is required. Please install Java." -ForegroundColor Red
}

# 2. Check Node & npm
Write-Host "`n[2/4] Checking Node.js & npm..." -ForegroundColor Yellow
if (Get-Command node -ErrorAction SilentlyContinue) {
    node -v
    npm -v
    Write-Host "Node.js is available." -ForegroundColor Green
} else {
    Write-Host "Node.js v18+ is required. Please install Node.js." -ForegroundColor Red
}

# 3. Build Backend & Run Tests
Write-Host "`n[3/4] Testing Spring Boot Backend..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\..\backend"
if (Test-Path ".\mvnw.cmd") {
    .\mvnw.cmd test
} else {
    mvn test
}

# 4. Install Frontend Dependencies
Write-Host "`n[4/4] Installing Frontend Dependencies..." -ForegroundColor Yellow
Set-Location "$PSScriptRoot\..\frontend"
npm install

Set-Location "$PSScriptRoot\.."
Write-Host "`n==========================================" -ForegroundColor Green
Write-Host "MediFinder setup completed successfully!" -ForegroundColor Green
Write-Host "Run Backend: .\scripts\run-backend.ps1" -ForegroundColor Cyan
Write-Host "Run Frontend: .\scripts\run-frontend.ps1" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Green
