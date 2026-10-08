# Run Spring Boot Backend
Set-Location "$PSScriptRoot\..\backend"
if (Test-Path ".\mvnw.cmd") {
    .\mvnw.cmd spring-boot:run
} else {
    mvn spring-boot:run
}
