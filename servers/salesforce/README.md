# Salesforce MCP Server

A Model Context Protocol (MCP) server for Salesforce CRM operations using REST APIs. This server provides CRUD (Create, Read, Update, Delete) operations for Salesforce objects.

## Features

- **Query**: Execute SOQL queries to retrieve records
- **Create**: Create new records in any Salesforce object
- **Read**: Retrieve specific records by ID
- **Update**: Update existing records
- **Delete**: Delete records from Salesforce
- **Describe**: Get metadata information about Salesforce objects
- **List Objects**: List all available Salesforce object types

## Configuration

### Option 1: OAuth Authentication (Recommended)

Use the built-in OAuth authentication tool to authenticate at runtime:

```json
{
  "tool": "salesforce_oauth_login",
  "client_id": "your_connected_app_client_id",
  "client_secret": "your_connected_app_client_secret",
  "username": "your_salesforce_username",
  "password": "your_password_with_security_token",
  "grant_type": "password",
  "login_url": "https://login.salesforce.com"
}
```

**Setting up a Connected App:**
1. Go to Setup → App Manager → New Connected App
2. Enable OAuth Settings
3. Add OAuth Scopes: `Full access (full)` or specific scopes
4. Set Callback URL (can be placeholder for username-password flow)
5. Note down Consumer Key (Client ID) and Consumer Secret (Client Secret)

### Option 2: Environment Variables

Set the following environment variables (optional):

```bash
export SALESFORCE_INSTANCE_URL="https://your-instance.salesforce.com"
export SALESFORCE_ACCESS_TOKEN="your_access_token"
export SALESFORCE_API_VERSION="v59.0"  # Optional, defaults to v59.0
```

## Usage

### Authentication Status
Check if you're authenticated:

```json
{
  "tool": "salesforce_auth_status"
}
```

### OAuth Login
Authenticate using OAuth credentials:

```json
{
  "tool": "salesforce_oauth_login",
  "client_id": "3MVG9...",
  "client_secret": "your_secret",
  "username": "user@example.com",
  "password": "passwordSecurityToken",
  "grant_type": "password",
  "login_url": "https://login.salesforce.com"
}
```

### Query Records
Execute SOQL queries to retrieve data:

```json
{
  "tool": "salesforce_query",
  "soql": "SELECT Id, Name, Email FROM Contact WHERE AccountId != null LIMIT 10"
}
```

### Create Records
Create new records in Salesforce:

```json
{
  "tool": "salesforce_create",
  "sobject_type": "Account",
  "record": {
    "Name": "New Account",
    "Industry": "Technology",
    "Phone": "555-1234"
  }
}
```

### Read Records
Retrieve specific records by ID:

```json
{
  "tool": "salesforce_read",
  "sobject_type": "Account",
  "id": "0013D00000AbCdEf",
  "fields": ["Id", "Name", "Industry", "Phone"]
}
```

### Update Records
Update existing records:

```json
{
  "tool": "salesforce_update",
  "sobject_type": "Account",
  "id": "0013D00000AbCdEf",
  "record": {
    "Phone": "555-5678",
    "Industry": "Finance"
  }
}
```

### Delete Records
Delete records from Salesforce:

```json
{
  "tool": "salesforce_delete",
  "sobject_type": "Account",
  "id": "0013D00000AbCdEf"
}
```

### Describe Objects
Get metadata information about Salesforce objects:

```json
{
  "tool": "salesforce_describe",
  "sobject_type": "Account"
}
```

### List Available Objects
List all available Salesforce object types:

```json
{
  "tool": "salesforce_list_objects"
}
```

## Common Salesforce Objects

- **Account**: Companies and organizations
- **Contact**: People associated with accounts
- **Lead**: Potential customers
- **Opportunity**: Sales deals
- **Case**: Customer service cases
- **Task**: Activities and to-dos
- **Event**: Calendar events and meetings
- **User**: Salesforce users
- **Campaign**: Marketing campaigns

## Error Handling

The server provides detailed error messages for common issues:
- Invalid SOQL syntax
- Missing required fields
- Permission errors
- Record not found
- Field validation errors

## Security

- Uses Salesforce REST API with OAuth authentication
- All operations respect Salesforce field-level security
- Object-level permissions are enforced by Salesforce
- Access token should be kept secure and rotated regularly

## Limitations

- Requires valid Salesforce access token
- Subject to Salesforce API rate limits
- Large query results may be truncated (use LIMIT clause)
- Binary data and attachments require special handling