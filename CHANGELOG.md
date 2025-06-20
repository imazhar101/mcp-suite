# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-06-19

### Added
- **Salesforce MCP Server** - Complete Salesforce CRM integration with OAuth authentication
  - OAuth username-password flow authentication support
  - CRUD operations for Salesforce objects (create, read, update, delete, query)
  - Metadata tools for describing objects and listing available objects
  - Dynamic token management and authentication status checking
  - Support for both environment variable and OAuth authentication methods

- **PostgreSQL MCP Server** - Database management and analytics server
  - SQL query execution with safety controls
  - `POSTGRESQL_ALLOW_DANGEROUS_OPERATIONS` environment variable for write operation control
  - Read-only mode by default with optional write operations when enabled
  - Transaction handling with read-write support when dangerous operations are allowed
  - Automatic LIMIT 100 removal when dangerous operations are enabled

- **Canvas LMS Server** - Comprehensive learning management system integration
  - Course management tools (185 total tools)
  - User and enrollment management
  - Assignment and submission handling
  - Module and page management
  - Quiz and grading functionality
  - Authentication and external tool integration
  - Admin management capabilities

- **Figma Server** - Design file and workflow management
  - File operations and component retrieval
  - Comment management
  - Team & project management
  - Components & styles retrieval
  - Comprehensive Figma API coverage

### Enhanced
- **Build System Refactoring**
  - Centralized build system with all dist files at root level under `dist/servers/`
  - Removed individual server dist folders
  - Updated build scripts for better maintainability
  - Shared TypeScript compilation with dependencies

- **Documentation Improvements**
  - Added comprehensive MCP Setup Guide for AI coding assistants
  - Collapsible sections in README for better organization
  - Streamlined server startup instructions
  - Enhanced server documentation with detailed tool listings
  - Added environment variable configuration guides

### Technical Improvements
- Enhanced OAuth authentication flows
- Improved error handling and logging
- Better environment variable management
- Standardized server architecture patterns
- Comprehensive TypeScript type definitions

### Infrastructure
- Updated package.json configurations
- Improved build and deployment scripts
- Enhanced testing infrastructure
- Better configuration management

## [Unreleased]

### Planned
- Additional MCP server integrations
- Enhanced monitoring and observability
- Performance optimizations
- Extended API coverage for existing servers
