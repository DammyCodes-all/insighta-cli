# Insighta CLI - Profile Management Tool

## Overview

The Insighta CLI is a command-line interface for the Insighta Labs+ platform that provides secure access and multi-interface integration. This tool enables users to interact with the profile intelligence system through GitHub authentication.

## System Architecture

The system consists of three main components:
1. **Backend API** - Handles authentication, profile management, and data processing
2. **CLI Tool** - Command-line interface for analysts and administrators
3. **Web Portal** - Browser-based interface for end users

All interfaces connect to the same backend system, ensuring consistency across platforms.

## Authentication Flow

The system implements a secure GitHub OAuth flow with PKCE (Proof Key for Code Exchange) for both CLI and web authentication:

### GitHub OAuth with PKCE Flow:
1. User initiates authentication via the CLI command `insighta login`
2. System generates a PKCE pair (code_verifier and code_challenge)
3. Opens browser for GitHub authentication
4. After successful authentication, exchanges the code for access tokens
5. Tokens are stored at `~/.insighta/credentials.json`

### Token Management:
- Short-lived access tokens (3 minutes)
- Refresh tokens automatically handle token refresh when needed
- Role-based access control (admin/analyst) enforced across all endpoints

## API Endpoints

The system provides RESTful endpoints for all profile management operations:
- Profile listing with filters and sorting
- Profile search with natural language processing
- Profile creation and management
- Authentication and authorization

## CLI Usage

### Installation
```bash
npm install -g insighta-cli
```

### Authentication Commands
```bash
insighta login          # Authenticate with GitHub OAuth
insighta logout         # Remove authentication tokens
insighta whoami         # Display current user information
```

### Profile Commands
```bash
insighta profiles list     # List all profiles with filtering options
insighta get <id>          # Get specific profile by ID
insighta search <query>     # Search profiles with natural language
insighta create <name>     # Create new profile
insighta export             # Export profiles to CSV
```

## Profile Features
- GitHub OAuth authentication with PKCE implementation
- Role-based access control (admin/analyst)
- Natural language search capabilities
- Comprehensive profile management
- Secure token handling with automatic refresh
- Rate limiting (60 requests/minute for profiles, 10 requests/minute for auth)

## Security Implementation

The system implements robust security measures:
- **Authentication**: GitHub OAuth 2.0 with PKCE
- **Authorization**: Role-based access control (admin/analyst)
- **Token Management**: Short-lived access tokens with automatic refresh
- **Rate Limiting**: 60 requests/minute for profile endpoints, 10 requests/minute for auth endpoints
- **CSRF Protection**: Implemented in web portal
- **HTTP-only cookies**: For secure session management

## Role Enforcement Logic

The system implements role-based access control:
- **admin**: Full access to all commands
- **analyst**: Read-only access (list, search, get, export)
- Roles are enforced at the API level for all endpoints

## Natural Language Parsing Approach

The system implements natural language parsing for profile searches:
- Parse queries like "male from nigeria above 30"
- Support for age-based filters (above/below age)
- Geographic and demographic filters (gender, country, age group)
- Complex query combinations

## API Versioning and Pagination

All API requests include:
- `X-API-Version: 1` header for version control
- Pagination with configurable page size (default 10)
- Support for sorting and filtering
- Consistent response format across all endpoints

## Export Functionality

Profiles can be exported to CSV format with all filters preserved:
- Gender
- Country
- Age group
- Custom query parameters

## System Requirements

- Node.js v14+
- GitHub account for authentication
- Internet connection for GitHub OAuth
- Compatible with Windows, macOS, and Linux