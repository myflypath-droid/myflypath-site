@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo ============================================
echo   MyFlyPath - Mise en ligne (commit + push)
echo ============================================
echo.

REM 1. Supprimer un eventuel verrou git restant
if exist ".git\index.lock" del /f /q ".git\index.lock"

REM 2. Ajouter TOUS les fichiers modifies
git add -A

REM 3. Creer le commit (avec la date/heure dans le message)
git commit -m "Mise a jour du site MyFlyPath (%date% %time%)"

REM 4. Pousser sur GitHub (declenche le deploiement Netlify en production)
echo.
echo Envoi vers GitHub...
git push origin main

echo.
echo ============================================
echo   RESULTAT :
echo   - Si tu vois "Everything up-to-date" ou une
echo     ligne avec "main -^> main" = c'est ENVOYE.
echo   - Si on te demande un identifiant GitHub,
echo     entre ton nom + un TOKEN (pas le mot de passe).
echo ============================================
echo.
pause
