#!/bin/bash

# ========================================
# datarhei Core API Connection Test Script
# ========================================
# This script tests API connectivity and functionality
# ========================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
API_URL="${API_URL:-http://localhost:8080}"
USERNAME="${USERNAME:-admin}"
PASSWORD="${PASSWORD:-admin123}"
VERBOSE="${VERBOSE:-false}"

# Counters
TESTS_RUN=0
TESTS_PASSED=0
TESTS_FAILED=0

# Print functions
print_header() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}  datarhei Core API Connection Test${NC}"
    echo -e "${CYAN}========================================${NC}\n"
}

print_test() {
    echo -e "${BLUE}Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✓ PASSED${NC} - $1"
    ((TESTS_PASSED++))
}

print_failure() {
    echo -e "${RED}✗ FAILED${NC} - $1"
    ((TESTS_FAILED++))
}

print_info() {
    echo -e "${CYAN}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_summary() {
    echo -e "\n${CYAN}========================================${NC}"
    echo -e "${CYAN}  Test Summary${NC}"
    echo -e "${CYAN}========================================${NC}"
    echo -e "Total Tests: ${TESTS_RUN}"
    echo -e "${GREEN}Passed: ${TESTS_PASSED}${NC}"
    echo -e "${RED}Failed: ${TESTS_FAILED}${NC}"

    if [ $TESTS_FAILED -eq 0 ]; then
        echo -e "\n${GREEN}🎉 All tests passed!${NC}\n"
        return 0
    else
        echo -e "\n${RED}❌ Some tests failed!${NC}\n"
        return 1
    fi
}

# Test function
run_test() {
    local test_name=$1
    local endpoint=$2
    local require_auth=$3
    local expected_status=${4:-200}

    ((TESTS_RUN++))
    print_test "$test_name"

    local url="${API_URL}${endpoint}"
    local auth_header=""

    if [ "$require_auth" = "true" ]; then
        auth_header="-u ${USERNAME}:${PASSWORD}"
    fi

    # Run the test
    local response
    local http_code

    if [ "$VERBOSE" = "true" ]; then
        response=$(curl -s -w "\n%{http_code}" $auth_header "$url" 2>&1)
    else
        response=$(curl -s -w "\n%{http_code}" $auth_header "$url" 2>/dev/null)
    fi

    http_code=$(echo "$response" | tail -n1)
    local body=$(echo "$response" | sed '$d')

    # Check result
    if [ "$http_code" = "$expected_status" ]; then
        print_success "$test_name (HTTP $http_code)"

        if [ "$VERBOSE" = "true" ] && [ -n "$body" ]; then
            echo -e "${CYAN}Response:${NC}"
            echo "$body" | jq '.' 2>/dev/null || echo "$body"
            echo ""
        fi
    else
        print_failure "$test_name (Expected: $expected_status, Got: $http_code)"

        if [ -n "$body" ]; then
            echo -e "${RED}Response:${NC} $body"
        fi
        echo ""
    fi
}

# Check dependencies
check_dependencies() {
    print_info "Checking dependencies..."

    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is not installed${NC}"
        echo "Please install curl: sudo apt install curl (Ubuntu/Debian) or brew install curl (macOS)"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        print_warning "jq is not installed. JSON output will not be formatted."
        print_info "Install with: sudo apt install jq (Ubuntu/Debian) or brew install jq (macOS)"
    fi

    echo ""
}

# Pre-flight checks
preflight_check() {
    print_info "Pre-flight checks..."

    # Check if Core is running
    print_test "Core backend reachability"
    if curl -s --connect-timeout 5 "${API_URL}/api/v3" > /dev/null 2>&1; then
        print_success "Core backend is reachable at ${API_URL}"
    else
        print_failure "Cannot reach Core backend at ${API_URL}"
        print_warning "Make sure datarhei Core is running:"
        echo "  docker-compose up -d"
        echo ""
        exit 1
    fi

    echo ""
}

# Main test suite
run_tests() {
    print_header
    check_dependencies
    preflight_check

    print_info "Starting API tests..."
    print_info "API URL: ${API_URL}"
    print_info "Username: ${USERNAME}"
    echo ""

    # Test 1: Basic connectivity (no auth)
    run_test "Basic Connectivity" "/api/v3" false 200

    # Test 2: Authentication
    run_test "Authentication" "/api/v3" true 200

    # Test 3: System information
    run_test "System Information" "/api/v3" true 200

    # Test 4: Configuration
    run_test "Configuration" "/api/v3/config" true 200

    # Test 5: Process list
    run_test "Process List" "/api/v3/process" true 200

    # Test 6: Skills/Capabilities
    run_test "Skills/Capabilities" "/api/v3/skills" true 200

    # Test 7: Metrics
    run_test "Metrics" "/api/v3/metrics" true 200

    # Test 8: Active sessions
    run_test "Active Sessions" "/api/v3/session/active" true 200

    # Test 9: Filesystems
    run_test "Filesystems" "/api/v3/fs" true 200

    # Test 10: About
    run_test "About" "/api/v3/about" false 200

    # Test 11: Check unauthorized access (should fail)
    print_test "Unauthorized Access (should fail)"
    ((TESTS_RUN++))
    local response=$(curl -s -w "\n%{http_code}" "${API_URL}/api/v3/config" 2>/dev/null)
    local http_code=$(echo "$response" | tail -n1)

    if [ "$http_code" = "401" ] || [ "$http_code" = "403" ]; then
        print_success "Correctly rejected unauthorized access (HTTP $http_code)"
    else
        print_failure "Should reject unauthorized access (Got: $http_code)"
    fi

    # Test 12: CORS headers
    print_test "CORS Headers"
    ((TESTS_RUN++))
    local cors_response=$(curl -s -I -X OPTIONS "${API_URL}/api/v3" 2>/dev/null)

    if echo "$cors_response" | grep -qi "access-control-allow"; then
        print_success "CORS headers are present"
    else
        print_warning "CORS headers not found (may cause browser issues)"
        ((TESTS_PASSED++))
    fi

    # Test 13: Response time
    print_test "Response Time"
    ((TESTS_RUN++))
    local start_time=$(date +%s%N)
    curl -s -u "${USERNAME}:${PASSWORD}" "${API_URL}/api/v3" > /dev/null 2>&1
    local end_time=$(date +%s%N)
    local response_time=$(( (end_time - start_time) / 1000000 ))

    if [ $response_time -lt 1000 ]; then
        print_success "Response time: ${response_time}ms (Good)"
    elif [ $response_time -lt 3000 ]; then
        print_warning "Response time: ${response_time}ms (Acceptable)"
        ((TESTS_PASSED++))
    else
        print_failure "Response time: ${response_time}ms (Too slow)"
    fi

    # Print summary
    print_summary
    return $?
}

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -u|--url)
            API_URL="$2"
            shift 2
            ;;
        -U|--username)
            USERNAME="$2"
            shift 2
            ;;
        -p|--password)
            PASSWORD="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -u, --url URL         API URL (default: http://localhost:8080)"
            echo "  -U, --username USER   Username (default: admin)"
            echo "  -p, --password PASS   Password (default: admin123)"
            echo "  -v, --verbose         Verbose output"
            echo "  -h, --help            Show this help"
            echo ""
            echo "Examples:"
            echo "  $0"
            echo "  $0 -u http://192.168.1.100:8080"
            echo "  $0 -U myuser -p mypassword"
            echo "  $0 -v"
            echo ""
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            echo "Use -h or --help for usage information"
            exit 1
            ;;
    esac
done

# Run the tests
run_tests
exit $?
