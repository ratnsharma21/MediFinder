#!/usr/bin/env bash
# MediFinder - Automated Setup Script for Linux & macOS
set -e

echo "=========================================="
echo "MediFinder Setup & Verification Script"
echo "=========================================="

echo -e "\n[1/4] Checking Java..."
java -version

echo -e "\n[2/4] Checking Node.js & npm..."
node -v
npm -v

echo -e "\n[3/4] Testing Spring Boot Backend..."
cd "$(dirname "$0")/../backend"
chmod +x ./mvnw || true
./mvnw test

echo -e "\n[4/4] Installing Frontend Dependencies..."
cd "$(dirname "$0")/../frontend"
npm install

cd "$(dirname "$0")/.."
echo -e "\n=========================================="
echo "MediFinder setup completed successfully!"
echo "=========================================="
