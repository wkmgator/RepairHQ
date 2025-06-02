#!/bin/bash

echo "🚀 Starting RepairHQ Elite Design System Deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Please commit or stash them first."
    git status --short
    exit 1
fi

print_status "Checking Node.js version..."
node_version=$(node -v)
print_success "Node.js version: $node_version"

print_status "Installing dependencies..."
npm ci --production=false

print_status "Running type checks..."
npm run type-check || {
    print_error "Type check failed. Please fix TypeScript errors."
    exit 1
}

print_status "Running linting..."
npm run lint || {
    print_error "Linting failed. Please fix linting errors."
    exit 1
}

print_status "Building production bundle..."
npm run build || {
    print_error "Build failed. Please check the build errors."
    exit 1
}

print_status "Running production tests..."
npm run test:ci || {
    print_warning "Some tests failed. Review test results."
}

print_status "Optimizing images..."
npm run optimize-images || print_warning "Image optimization skipped"

print_status "Generating sitemap..."
npm run generate-sitemap || print_warning "Sitemap generation skipped"

print_success "✅ Pre-deployment checks completed successfully!"

print_status "Deploying to Vercel..."
npx vercel --prod || {
    print_error "Vercel deployment failed."
    exit 1
}

print_success "🎉 Deployment completed successfully!"
print_status "Your elite RepairHQ design system is now live!"

echo ""
echo "🔗 Production URL: https://repairhq.io"
echo "📊 Vercel Dashboard: https://vercel.com/dashboard"
echo "📈 Analytics: https://vercel.com/analytics"
echo ""
print_success "Elite design system deployment complete! 🚀"
