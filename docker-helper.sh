#!/bin/bash

# Docker Quick Reference Helper for Infokes Pretest

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
  echo -e "\n${BLUE}=== $1 ===${NC}\n"
}

print_success() {
  echo -e "${GREEN}✓ $1${NC}"
}

print_info() {
  echo -e "${YELLOW}ℹ $1${NC}"
}

if [ $# -eq 0 ]; then
  print_header "Infokes Docker Helper"
  echo "Usage: ./docker-helper.sh [command]"
  echo ""
  echo "Available commands:"
  echo "  dev:start        - Start development environment"
  echo "  dev:stop         - Stop development environment"
  echo "  dev:logs         - View development logs"
  echo "  dev:shell        - Access backend shell"
  echo "  dev:db           - Access PostgreSQL shell"
  echo ""
  echo "  prod:start       - Start production environment"
  echo "  prod:stop        - Stop production environment"
  echo "  prod:logs        - View production logs"
  echo ""
  echo "  build            - Build all Docker images"
  echo "  clean            - Clean Docker resources"
  echo "  status           - Show container status"
  echo ""
  echo "  test:backend     - Run backend tests in Docker"
  echo "  test:frontend    - Run frontend tests in Docker"
  echo ""
  exit 0
fi

case "$1" in
  dev:start)
    print_header "Starting Development Environment"
    # Clean up any lingering containers with metadata issues
    docker-compose -f docker-compose.dev.yml down -v 2>/dev/null || true
    docker-compose -f docker-compose.dev.yml up -d
    sleep 3
    print_success "Development environment started"
    print_info "Frontend: http://localhost:5174"
    print_info "Backend: http://localhost:3001"
    print_info "Swagger: http://localhost:3001/docs"
    print_info "PostgreSQL: localhost:5433"
    ;;
  dev:stop)
    print_header "Stopping Development Environment"
    docker-compose -f docker-compose.dev.yml down
    print_success "Development environment stopped"
    ;;
  dev:logs)
    docker-compose -f docker-compose.dev.yml logs -f --tail=100
    ;;
  dev:shell)
    print_info "Connecting to backend container..."
    docker-compose -f docker-compose.dev.yml exec backend sh
    ;;
  dev:db)
    print_info "Connecting to PostgreSQL..."
    docker-compose -f docker-compose.dev.yml exec postgres psql -U postgres -d infokes_db
    ;;
  prod:start)
    print_header "Starting Production Environment"
    docker-compose up -d
    print_success "Production environment started"
    print_info "Frontend: http://localhost:5173"
    print_info "Backend: http://localhost:3000"
    ;;
  prod:stop)
    print_header "Stopping Production Environment"
    docker-compose down
    print_success "Production environment stopped"
    ;;
  prod:logs)
    docker-compose logs -f --tail=100
    ;;
  build)
    print_header "Building Docker Images"
    docker-compose build
    print_success "Images built successfully"
    ;;
  clean)
    print_header "Cleaning Docker Resources"
    docker-compose down -v
    docker system prune -f
    print_success "Docker resources cleaned"
    ;;
  status)
    print_header "Container Status"
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    ;;
  test:backend)
    print_header "Running Backend Tests"
    docker-compose -f docker-compose.dev.yml exec backend bun test
    ;;
  test:frontend)
    print_header "Running Frontend Tests"
    docker-compose -f docker-compose.dev.yml exec frontend npm run test
    ;;
  *)
    echo "Unknown command: $1"
    exit 1
    ;;
esac
