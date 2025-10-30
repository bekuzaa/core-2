#!/bin/bash

# ========================================
# datarhei Core UI - GitHub Deployment Script
# ========================================
# This script helps you push the UI code to your GitHub repository
# Repository: https://github.com/bekuzaa/core-2.git
# ========================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
GITHUB_REPO="https://github.com/bekuzaa/core-2.git"
BRANCH="main"
COMMIT_MESSAGE=""

# Print colored message
print_message() {
    local color=$1
    local message=$2
    echo -e "${color}${message}${NC}"
}

# Print header
print_header() {
    echo ""
    echo "=========================================="
    echo "  datarhei Core UI - GitHub Deployment"
    echo "=========================================="
    echo ""
}

# Check if git is installed
check_git() {
    if ! command -v git &> /dev/null; then
        print_message "$RED" "❌ Git is not installed. Please install Git first."
        exit 1
    fi
    print_message "$GREEN" "✓ Git is installed"
}

# Check if we're in the right directory
check_directory() {
    if [ ! -f "package.json" ]; then
        print_message "$RED" "❌ Error: package.json not found. Please run this script from the ui/ directory"
        exit 1
    fi
    print_message "$GREEN" "✓ In correct directory"
}

# Initialize git if needed
init_git() {
    if [ ! -d ".git" ]; then
        print_message "$YELLOW" "⚠ Git repository not initialized. Initializing..."
        git init
        print_message "$GREEN" "✓ Git repository initialized"
    else
        print_message "$GREEN" "✓ Git repository already initialized"
    fi
}

# Configure git remote
configure_remote() {
    # Check if remote exists
    if git remote | grep -q "origin"; then
        local current_remote=$(git remote get-url origin)
        if [ "$current_remote" != "$GITHUB_REPO" ]; then
            print_message "$YELLOW" "⚠ Updating remote origin from $current_remote to $GITHUB_REPO"
            git remote set-url origin "$GITHUB_REPO"
        else
            print_message "$GREEN" "✓ Remote origin already configured correctly"
        fi
    else
        print_message "$YELLOW" "⚠ Adding remote origin: $GITHUB_REPO"
        git remote add origin "$GITHUB_REPO"
        print_message "$GREEN" "✓ Remote origin added"
    fi
}

# Check git user configuration
check_git_config() {
    if [ -z "$(git config user.name)" ] || [ -z "$(git config user.email)" ]; then
        print_message "$YELLOW" "⚠ Git user not configured. Please configure:"
        echo ""
        echo "  git config --global user.name \"Your Name\""
        echo "  git config --global user.email \"your.email@example.com\""
        echo ""
        read -p "Press Enter after configuring Git..."
    else
        print_message "$GREEN" "✓ Git user configured: $(git config user.name) <$(git config user.email)>"
    fi
}

# Show current status
show_status() {
    print_message "$BLUE" "\n📊 Current Git Status:"
    git status --short
    echo ""
}

# Get commit message
get_commit_message() {
    if [ -z "$COMMIT_MESSAGE" ]; then
        echo ""
        print_message "$BLUE" "Enter commit message (or press Enter for default):"
        read -r user_message
        if [ -z "$user_message" ]; then
            COMMIT_MESSAGE="Update datarhei Core UI - $(date +'%Y-%m-%d %H:%M:%S')"
        else
            COMMIT_MESSAGE="$user_message"
        fi
    fi
    print_message "$GREEN" "✓ Commit message: $COMMIT_MESSAGE"
}

# Add files
add_files() {
    print_message "$BLUE" "\n📦 Adding files to Git..."

    # Add all files
    git add .

    # Show what will be committed
    echo ""
    print_message "$YELLOW" "Files to be committed:"
    git diff --cached --name-status
    echo ""

    # Confirm
    read -p "Continue with these files? (y/N): " confirm
    if [[ ! $confirm =~ ^[Yy]$ ]]; then
        print_message "$RED" "❌ Aborted by user"
        exit 1
    fi
}

# Commit changes
commit_changes() {
    print_message "$BLUE" "\n💾 Committing changes..."
    git commit -m "$COMMIT_MESSAGE"
    print_message "$GREEN" "✓ Changes committed"
}

# Push to GitHub
push_to_github() {
    print_message "$BLUE" "\n🚀 Pushing to GitHub..."

    # Check if branch exists on remote
    if git ls-remote --exit-code --heads origin "$BRANCH" &>/dev/null; then
        # Branch exists, normal push
        git push origin "$BRANCH"
    else
        # First push, set upstream
        print_message "$YELLOW" "⚠ First push to branch '$BRANCH'"
        git push -u origin "$BRANCH"
    fi

    print_message "$GREEN" "✓ Successfully pushed to GitHub!"
}

# Main deployment function
deploy() {
    print_header

    print_message "$BLUE" "🔍 Pre-flight checks..."
    check_git
    check_directory
    check_git_config

    print_message "$BLUE" "\n🔧 Setting up repository..."
    init_git
    configure_remote

    show_status

    # Check if there are changes
    if git diff-index --quiet HEAD -- 2>/dev/null; then
        print_message "$YELLOW" "⚠ No changes to commit"
        read -p "Push anyway? (y/N): " push_anyway
        if [[ $push_anyway =~ ^[Yy]$ ]]; then
            push_to_github
        else
            print_message "$BLUE" "👋 Nothing to do. Goodbye!"
            exit 0
        fi
    else
        get_commit_message
        add_files
        commit_changes
        push_to_github
    fi

    print_message "$GREEN" "\n✅ Deployment completed successfully!"
    print_message "$BLUE" "🔗 Repository: $GITHUB_REPO"
    echo ""
}

# Cleanup function
cleanup() {
    print_message "$RED" "\n\n❌ Deployment interrupted"
    exit 1
}

# Trap Ctrl+C
trap cleanup INT

# Show help
show_help() {
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -m, --message MESSAGE    Commit message"
    echo "  -b, --branch BRANCH      Branch name (default: main)"
    echo "  -h, --help               Show this help"
    echo ""
    echo "Examples:"
    echo "  $0"
    echo "  $0 -m \"Add new features\""
    echo "  $0 -b develop -m \"Update UI\""
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -m|--message)
            COMMIT_MESSAGE="$2"
            shift 2
            ;;
        -b|--branch)
            BRANCH="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_message "$RED" "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Run deployment
deploy
