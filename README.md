# Insighta CLI - Profile Management Tool

## Overview

The Insighta CLI is a command-line interface for the Insighta Labs+ platform that provides secure access and multi-interface integration. This tool enables users to interact with the profile intelligence system through GitHub authentication.

## System Architecture

The system consists of three main components that work together:

1. **Backend API** - Handles authentication, profile management, and data processing. Serves as the central point for all data operations and enforces role-based access control. The backend uses a SQLite database for storage and implements GitHub OAuth with PKCE for authentication.

2. **CLI Tool** - Command-line interface that connects to the backend via REST API. All API requests include authentication headers for access token management.

3. **Web Portal** - Browser-based interface that uses HTTP-only cookies for secure session management and implements CSRF protection.

The architecture implements a secure system with:
- GitHub OAuth 2.0 with PKCE for authentication
- HTTP-only cookies and CSRF protection for the web portal
- Automatic token refresh when access tokens expire
- Role-based access control enforced at the API level
- Rate limiting (60 requests/minute for profiles, 10 requests/minute for auth)
- All components connect to the same backend but use different authentication mechanisms

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

Credentials are stored at `~/.insighta/credentials.json`

### Profile Commands
```bash
insighta profiles list     # List all profiles with filtering options
insighta profiles get <id> # Get specific profile by ID
insighta profiles search <query> # Search profiles with natural language
insighta profiles create --name <name> # Create new profile
insighta profiles export # Export profiles to CSV
```

### Profile List Options
```bash
insighta profiles list --gender male
insighta profiles list --country NG --age-group adult
insighta profiles list --min-age 25 --max-age 40
insighta profiles list --sort-by age --order desc
insighta profiles list --page 2 --limit 20
```

### Token Refresh Behavior
The CLI automatically handles token refresh when access tokens expire. When a 401 Unauthorized response is received, the CLI will:
1. Use the refresh token to obtain new access and refresh tokens
2. Retry the original request with the new access token
3. If refresh fails, prompt the user to re-authenticate with `insighta login`

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

### Export with Filters
```bash
insighta profiles export --format csv --gender male --country NG
```

## System Requirements

- Node.js v14+
- GitHub account for authentication
- Internet connection for GitHub OAuth
- Compatible with Windows, macOS, and Linux