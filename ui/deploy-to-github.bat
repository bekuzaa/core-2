@echo off
REM ========================================
REM datarhei Core UI - GitHub Deployment Script (Windows)
REM ========================================
REM This script helps you push the UI code to your GitHub repository
REM Repository: https://github.com/bekuzaa/core-2.git
REM ========================================

setlocal enabledelayedexpansion

REM Configuration
set "GITHUB_REPO=https://github.com/bekuzaa/core-2.git"
set "BRANCH=main"
set "COMMIT_MESSAGE="

REM Colors (Windows 10+)
set "GREEN=[92m"
set "YELLOW=[93m"
set "RED=[91m"
set "BLUE=[94m"
set "NC=[0m"

:main
echo.
echo ==========================================
echo   datarhei Core UI - GitHub Deployment
echo ==========================================
echo.

REM Check if git is installed
call :check_git
if errorlevel 1 goto :error

REM Check if we're in the right directory
call :check_directory
if errorlevel 1 goto :error

REM Check git configuration
call :check_git_config

REM Initialize git if needed
call :init_git

REM Configure remote
call :configure_remote

REM Show status
call :show_status

REM Check for changes
git diff-index --quiet HEAD -- 2>nul
if errorlevel 1 (
    REM There are changes
    call :get_commit_message
    call :add_files
    if errorlevel 1 goto :error
    call :commit_changes
    call :push_to_github
) else (
    echo %YELLOW%No changes to commit%NC%
    set /p "push_anyway=Push anyway? (y/N): "
    if /i "!push_anyway!"=="y" (
        call :push_to_github
    ) else (
        echo %BLUE%Nothing to do. Goodbye!%NC%
        goto :end
    )
)

echo.
echo %GREEN%Deployment completed successfully!%NC%
echo %BLUE%Repository: %GITHUB_REPO%%NC%
echo.
goto :end

:check_git
echo %BLUE%Checking Git installation...%NC%
where git >nul 2>&1
if errorlevel 1 (
    echo %RED%Git is not installed. Please install Git first.%NC%
    echo Download from: https://git-scm.com/download/win
    exit /b 1
)
echo %GREEN%Git is installed%NC%
exit /b 0

:check_directory
echo %BLUE%Checking current directory...%NC%
if not exist "package.json" (
    echo %RED%Error: package.json not found%NC%
    echo Please run this script from the ui\ directory
    exit /b 1
)
echo %GREEN%In correct directory%NC%
exit /b 0

:check_git_config
git config user.name >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Git user not configured. Please configure:%NC%
    echo.
    echo   git config --global user.name "Your Name"
    echo   git config --global user.email "your.email@example.com"
    echo.
    pause
)
for /f "tokens=*" %%a in ('git config user.name') do set "git_name=%%a"
for /f "tokens=*" %%a in ('git config user.email') do set "git_email=%%a"
if defined git_name (
    echo %GREEN%Git user configured: !git_name! ^<!git_email!^>%NC%
)
exit /b 0

:init_git
if not exist ".git" (
    echo %YELLOW%Initializing Git repository...%NC%
    git init
    echo %GREEN%Git repository initialized%NC%
) else (
    echo %GREEN%Git repository already initialized%NC%
)
exit /b 0

:configure_remote
git remote | findstr "origin" >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%Adding remote origin: %GITHUB_REPO%%NC%
    git remote add origin %GITHUB_REPO%
    echo %GREEN%Remote origin added%NC%
) else (
    for /f "tokens=*" %%a in ('git remote get-url origin') do set "current_remote=%%a"
    if not "!current_remote!"=="%GITHUB_REPO%" (
        echo %YELLOW%Updating remote origin to %GITHUB_REPO%%NC%
        git remote set-url origin %GITHUB_REPO%
    ) else (
        echo %GREEN%Remote origin already configured correctly%NC%
    )
)
exit /b 0

:show_status
echo.
echo %BLUE%Current Git Status:%NC%
git status --short
echo.
exit /b 0

:get_commit_message
echo %BLUE%Enter commit message (or press Enter for default):%NC%
set /p "user_message="
if "!user_message!"=="" (
    for /f "tokens=*" %%a in ('powershell -command "Get-Date -Format 'yyyy-MM-dd HH:mm:ss'"') do set "timestamp=%%a"
    set "COMMIT_MESSAGE=Update datarhei Core UI - !timestamp!"
) else (
    set "COMMIT_MESSAGE=!user_message!"
)
echo %GREEN%Commit message: !COMMIT_MESSAGE!%NC%
exit /b 0

:add_files
echo.
echo %BLUE%Adding files to Git...%NC%
git add .
echo.
echo %YELLOW%Files to be committed:%NC%
git diff --cached --name-status
echo.
set /p "confirm=Continue with these files? (y/N): "
if /i not "!confirm!"=="y" (
    echo %RED%Aborted by user%NC%
    exit /b 1
)
exit /b 0

:commit_changes
echo.
echo %BLUE%Committing changes...%NC%
git commit -m "!COMMIT_MESSAGE!"
if errorlevel 1 (
    echo %RED%Commit failed%NC%
    exit /b 1
)
echo %GREEN%Changes committed%NC%
exit /b 0

:push_to_github
echo.
echo %BLUE%Pushing to GitHub...%NC%

REM Check if branch exists on remote
git ls-remote --exit-code --heads origin %BRANCH% >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%First push to branch '%BRANCH%'%NC%
    git push -u origin %BRANCH%
) else (
    git push origin %BRANCH%
)

if errorlevel 1 (
    echo %RED%Push failed%NC%
    echo.
    echo Common issues:
    echo   1. Authentication required - make sure Git credentials are configured
    echo   2. Network connection issue
    echo   3. No permission to push to repository
    echo.
    echo To configure credentials:
    echo   git config --global credential.helper wincred
    echo.
    pause
    exit /b 1
)

echo %GREEN%Successfully pushed to GitHub!%NC%
exit /b 0

:error
echo.
echo %RED%Deployment failed!%NC%
echo.
pause
exit /b 1

:end
echo.
pause
exit /b 0
