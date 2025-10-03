#!/usr/bin/env just --justfile

project_dir := justfile_directory()

export PY_COLORS := "1"
export PYTHONBREAKPOINT := "pdb.set_trace"
export PATH := project_dir + "/node_modules/.bin:" + env_var('PATH')

[private]
default:
    @just help

# Install Docusaurus dependencies
[group("docusaurus")]
install:
    @echo "📦 Installing Docusaurus dependencies..."
    git submodule update --force
    git submodule update --remote --init --recursive --merge
    yarn install

# Start Docusaurus development server
[group("docusaurus")]
dev: install
    @echo "🚀 Starting Docusaurus development server..."
    yarn start

# Start Docusaurus development server on specific port
[group("docusaurus")]
dev-port port="3000": install
    @echo "🚀 Starting Docusaurus development server on port {{port}}..."
    yarn start --port {{port}}

# Build Docusaurus for production
[group("docusaurus")]
build: install
    @echo "🏗️ Building Docusaurus for production..."
    node scripts/transform-cli-links.js /cli/
    yarn build

# Serve built Docusaurus site locally
[group("docusaurus")]
serve: build
    @echo "🌐 Serving built Docusaurus site..."
    yarn serve

# Clean Docusaurus build artifacts
[group("docusaurus")]
clean:
    @echo "🧹 Cleaning Docusaurus build artifacts..."
    rm -rf build .docusaurus

# Show available documentation commands
[group("docusaurus")]
help:
    @echo "📚 Docusaurus Commands:"
    @echo "  install    - Install dependencies"
    @echo "  dev        - Start development server"
    @echo "  dev-port   - Start dev server on specific port"
    @echo "  build      - Build for production"
    @echo "  serve      - Serve built site"
    @echo "  clean      - Clean build artifacts"
