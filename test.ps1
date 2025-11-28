# Test script para Windows PowerShell
# Script de validación del proyecto ITP

Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🧪 INICIANDO VALIDACIÓN DEL SISTEMA" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan

$tests_passed = 0
$tests_failed = 0

# Test 1: Node.js
Write-Host "`n[1/7] Verificando Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = & node --version
    Write-Host "✅ Node.js instalado: $nodeVersion" -ForegroundColor Green
    $tests_passed++
} catch {
    Write-Host "❌ Node.js NO está instalado" -ForegroundColor Red
    $tests_failed++
}

# Test 2: npm
Write-Host "`n[2/7] Verificando npm..." -ForegroundColor Yellow
try {
    $npmVersion = & npm --version
    Write-Host "✅ npm instalado: $npmVersion" -ForegroundColor Green
    $tests_passed++
} catch {
    Write-Host "❌ npm NO está instalado" -ForegroundColor Red
    $tests_failed++
}

# Test 3: Carpeta backend
Write-Host "`n[3/7] Verificando carpeta backend..." -ForegroundColor Yellow
if (Test-Path "backend") {
    Write-Host "✅ Carpeta backend encontrada" -ForegroundColor Green
    $tests_passed++
} else {
    Write-Host "❌ Carpeta backend NO encontrada" -ForegroundColor Red
    $tests_failed++
}

# Test 4: Carpeta frontend
Write-Host "`n[4/7] Verificando carpeta frontend..." -ForegroundColor Yellow
if (Test-Path "frontend") {
    Write-Host "✅ Carpeta frontend encontrada" -ForegroundColor Green
    $tests_passed++
} else {
    Write-Host "❌ Carpeta frontend NO encontrada" -ForegroundColor Red
    $tests_failed++
}

# Test 5: SQL
Write-Host "`n[5/7] Verificando archivo SQL..." -ForegroundColor Yellow
if (Test-Path "001_database_schema.sql") {
    $lines = (Get-Content "001_database_schema.sql" | Measure-Object -Line).Lines
    Write-Host "✅ SQL encontrado ($lines líneas)" -ForegroundColor Green
    $tests_passed++
} else {
    Write-Host "❌ SQL NO encontrado" -ForegroundColor Red
    $tests_failed++
}

# Test 6: Backend package.json
Write-Host "`n[6/7] Verificando backend/package.json..." -ForegroundColor Yellow
if (Test-Path "backend/package.json") {
    Write-Host "✅ Backend package.json encontrado" -ForegroundColor Green
    $tests_passed++
} else {
    Write-Host "❌ Backend package.json NO encontrado" -ForegroundColor Red
    $tests_failed++
}

# Test 7: Frontend package.json
Write-Host "`n[7/7] Verificando frontend/package.json..." -ForegroundColor Yellow
if (Test-Path "frontend/package.json") {
    Write-Host "✅ Frontend package.json encontrado" -ForegroundColor Green
    $tests_passed++
} else {
    Write-Host "❌ Frontend package.json NO encontrado" -ForegroundColor Red
    $tests_failed++
}

# Resumen
Write-Host "`n═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📊 RESULTADOS:" -ForegroundColor Cyan
Write-Host "  ✅ Tests pasados: $tests_passed" -ForegroundColor Green
Write-Host "  ❌ Tests fallidos: $tests_failed" -ForegroundColor Red

if ($tests_failed -eq 0) {
    Write-Host "`n✨ ¡TODAS LAS VALIDACIONES PASARON! ✨" -ForegroundColor Green
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
    
    Write-Host "`n📝 PRÓXIMOS PASOS:" -ForegroundColor Yellow
    Write-Host "1. Abre COMIENZA_AQUI.txt para guía rápida" -ForegroundColor White
    Write-Host "2. Lee README.md para documentación completa" -ForegroundColor White
    Write-Host "3. Configura Supabase (5 minutos)" -ForegroundColor White
    Write-Host "4. Instala Backend: cd backend && npm install && npm run dev" -ForegroundColor White
    Write-Host "5. Instala Frontend: cd frontend && npm install && npm run dev" -ForegroundColor White
    Write-Host "6. Abre http://localhost:3001" -ForegroundColor White
    Write-Host "`n¡Sistema listo para usar! 🎉" -ForegroundColor Green
} else {
    Write-Host "`n⚠️  Hay problemas que resolver" -ForegroundColor Yellow
    Write-Host "═══════════════════════════════════════════════════════════════" -ForegroundColor Cyan
}

Write-Host ""
