# Canvas MCP Server v2.0.0

A comprehensive Model Context Protocol (MCP) server for interacting with Canvas LMS API. This server provides a modular architecture with extensive enrollment management utilities and course operations.

## Features

### 🏗️ Modular Architecture

- **Type-safe interfaces** for all Canvas entities
- **Service layer** for business logic separation
- **Tool layer** for MCP tool definitions and handlers
- **Organized by data types** (courses, enrollments, users)

### 📚 Course Management

- List, create, update, and delete courses
- Manage course settings and configurations
- Handle course users and progress tracking
- Support for all Canvas course properties

### 👥 Comprehensive Enrollment Utilities

- **List enrollments** across courses, sections, or users
- **Create enrollments** with full parameter support
- **Bulk enrollment operations** for efficiency
- **Enrollment state management** (active, invited, concluded, etc.)
- **Accept/reject course invitations**
- **Reactivate inactive enrollments**
- **Track last attended dates**
- **Temporary enrollment status** management
- **Role-based filtering** and advanced queries

### 🔐 Admin Management

- **Create and remove account admins** with role-based permissions
- **List account administrators** with filtering capabilities
- **Manage admin roles** and permissions
- **Self-service admin role queries**

### 📊 Grade Change Auditing

- **Query grade changes** by assignment, course, student, or grader
- **Advanced filtering** with time ranges and multiple criteria
- **Comprehensive audit trails** for grade modifications
- **Support for all Canvas grading events**

## Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the project:
   ```bash
   npm run build
   ```

## Development

### Development Mode

For active development with automatic rebuilding:

```bash
npm run dev
```

This runs TypeScript in watch mode, automatically recompiling when files change.

### Code Structure

The server follows a modular architecture:

- **Types** (`src/types/`): TypeScript interfaces for Canvas API entities
- **Services** (`src/services/`): Business logic and Canvas API interactions
- **Tools** (`src/tools/`): MCP tool definitions and request handlers
- **Helpers** (`src/helpers/`): Utility functions and shared code

### Adding New Features

1. Define types in the appropriate `src/types/*.ts` file
2. Implement service logic in `src/services/*-service.ts`
3. Create tool definitions in `src/tools/*-tools.ts`
4. Update the main server class to register new tools
5. Add documentation and examples to this README

### Testing

Currently, the server uses manual testing with Canvas API endpoints. For automated testing:

1. Set up test Canvas instance or use Canvas API mocking
2. Create test cases for each service method
3. Test tool integrations with MCP client
4. Validate error handling and edge cases

## Configuration

Set the following environment variables:

```bash
export CANVAS_BASE_URL="https://your-canvas-instance.instructure.com"
export CANVAS_API_TOKEN="your_canvas_api_token"
```

## Usage

### Running the Server

```bash
npm start
```

### MCP Client Configuration

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "canvas": {
      "command": "node",
      "args": ["/path/to/canvas-server/build/index.js"],
      "env": {
        "CANVAS_BASE_URL": "https://your-canvas-instance.instructure.com",
        "CANVAS_API_TOKEN": "your_canvas_api_token"
      }
    }
  }
}
```

## Available Tools

### Course Tools

#### Basic Course Operations

- `list_courses` - List courses for the current user
- `get_course` - Get details of a specific course
- `create_course` - Create a new course in an account
- `update_course` - Update an existing course
- `delete_course` - Delete or conclude a course

#### Course Users & Settings

- `list_course_users` - List users enrolled in a course
- `get_course_user` - Get details of a specific user in a course
- `get_user_progress` - Get user progress in a course
- `get_course_settings` - Get course settings
- `update_course_settings` - Update course settings

### Enrollment Tools

#### Core Enrollment Operations

- `list_enrollments` - List enrollments for a course, section, or user
- `get_enrollment` - Get a specific enrollment by ID
- `create_enrollment` - Create a new enrollment in a course or section
- `update_enrollment` - Conclude, deactivate, or delete an enrollment

#### Enrollment Management

- `accept_enrollment` - Accept a course invitation
- `reject_enrollment` - Reject a course invitation
- `reactivate_enrollment` - Reactivate an inactive enrollment
- `add_last_attended_date` - Add last attended date to student enrollment
- `get_temporary_enrollment_status` - Get temporary enrollment status for a user

#### Bulk Operations

- `bulk_create_enrollments` - Create multiple enrollments at once
- `enroll_students` - Enroll multiple users as students in a course
- `remove_enrollments` - Remove multiple enrollments from a course

#### Convenience Methods

- `get_active_students` - Get active student enrollments for a course
- `get_course_teachers` - Get teacher enrollments for a course
- `get_pending_enrollments` - Get pending enrollments (invitations) for a course

### Admin Tools

#### Account Administration

- `make_account_admin` - Make a user an account admin with specified role
- `remove_account_admin` - Remove admin privileges from a user
- `list_account_admins` - List all administrators for an account
- `list_my_admin_roles` - List current user's admin roles

### Grade Change Log Tools

#### Audit Queries

- `query_grade_changes_by_assignment` - Query grade changes for a specific assignment
- `query_grade_changes_by_course` - Query grade changes for a specific course
- `query_grade_changes_by_student` - Query grade changes for a specific student
- `query_grade_changes_by_grader` - Query grade changes by a specific grader
- `query_grade_changes_advanced` - Advanced query with multiple filter criteria

### Grading Standards Tools

#### Grading Standards Management

- `create_grading_standard` - Create a new grading standard in a course or account
- `list_grading_standards` - List grading standards available in a context
- `get_grading_standard` - Get details of a specific grading standard

### Page Tools

#### Course Page Management

- `list_course_pages` - List pages in a course with sorting and filtering options
- `get_course_page` - Get details of a specific course page
- `create_course_page` - Create a new page in a course
- `update_course_page` - Update an existing course page
- `delete_course_page` - Delete a course page

### Login Tools

#### User Login Management

- `list_user_logins` - List user logins for an account or specific user
- `create_user_login` - Create a new login for an existing user
- `edit_user_login` - Edit an existing user login
- `delete_user_login` - Delete a user login

### Authentication Provider Tools

#### Authentication Provider Management

- `list_authentication_providers` - List authentication providers for an account
- `get_authentication_provider` - Get details of a specific authentication provider
- `create_authentication_provider` - Create a new authentication provider
- `update_authentication_provider` - Update an existing authentication provider
- `delete_authentication_provider` - Delete an authentication provider

### LTI Launch Definition Tools

#### LTI Integration Management

- `list_lti_launch_definitions` - List LTI launch definitions for a course or account

## Architecture

### Directory Structure

```
src/
├── types/           # TypeScript interfaces and types
│   ├── index.ts     # Common types and base interfaces
│   ├── course.ts    # Course-related types
│   ├── enrollment.ts # Enrollment-related types
│   ├── user.ts      # User-related types
│   ├── assignment.ts # Assignment-related types
│   ├── submission.ts # Submission-related types
│   ├── module.ts    # Module-related types
│   ├── external-tool.ts # External tool types
│   ├── quiz.ts      # Quiz-related types
│   ├── admin.ts     # Admin-related types
│   ├── grade-change-log.ts # Grade change log types
│   └── grading-standard.ts # Grading standard types
├── services/        # Business logic layer
│   ├── course-service.ts     # Course operations
│   ├── enrollment-service.ts # Enrollment operations
│   ├── user-service.ts       # User operations
│   ├── assignment-service.ts # Assignment operations
│   ├── submission-service.ts # Submission operations
│   ├── module-service.ts     # Module operations
│   ├── external-tool-service.ts # External tool operations
│   ├── quiz-service.ts       # Quiz operations
│   ├── admin-service.ts      # Admin operations
│   ├── grade-change-log-service.ts # Grade change log operations
│   └── grading-standard-service.ts # Grading standard operations
├── tools/           # MCP tool definitions and handlers
│   ├── course-tools.ts       # Course tool definitions
│   ├── enrollment-tools.ts   # Enrollment tool definitions
│   ├── user-tools.ts         # User tool definitions
│   ├── assignment-tools.ts   # Assignment tool definitions
│   ├── submission-tools.ts   # Submission tool definitions
│   ├── module-tools.ts       # Module tool definitions
│   ├── external-tool-tools.ts # External tool definitions
│   ├── quiz-tools.ts         # Quiz tool definitions
│   ├── admin-tools.ts        # Admin tool definitions
│   ├── grade-change-log-tools.ts # Grade change log tool definitions
│   └── grading-standard-tools.ts # Grading standard tool definitions
└── index.ts         # Main server entry point
```

### Key Design Principles

1. **Separation of Concerns**: Types, services, and tools are clearly separated
2. **Type Safety**: Full TypeScript support with comprehensive interfaces
3. **Modularity**: Easy to extend with new Canvas API endpoints
4. **Error Handling**: Comprehensive error handling with meaningful messages
5. **Canvas API Compliance**: Follows Canvas API patterns and conventions

## Enrollment Features Deep Dive

### Supported Enrollment Types

- `StudentEnrollment` - Regular students
- `TeacherEnrollment` - Course instructors
- `TaEnrollment` - Teaching assistants
- `ObserverEnrollment` - Course observers (parents, mentors)
- `DesignerEnrollment` - Course designers

### Enrollment States

- `active` - Active enrollment
- `invited` - Pending invitation
- `creation_pending` - Being created
- `deleted` - Removed enrollment
- `rejected` - Declined invitation
- `completed` - Concluded enrollment
- `inactive` - Temporarily disabled

### Advanced Filtering

- Filter by enrollment type and state
- SIS integration support
- Grading period filtering
- Custom role support
- Date range filtering

### Bulk Operations

The server supports efficient bulk operations for:

- Creating multiple enrollments simultaneously
- Removing multiple enrollments
- Enrolling multiple students with consistent settings

## Examples

### List Active Students in a Course

```javascript
// Using the list_enrollments tool
{
  "context": "course",
  "context_id": "12345",
  "type": ["StudentEnrollment"],
  "state": ["active"],
  "include": ["user"]
}
```

### Bulk Enroll Students

```javascript
// Using the enroll_students tool
{
  "course_id": "12345",
  "user_ids": ["user1", "user2", "user3"],
  "enrollment_state": "active",
  "notify": true
}
```

### Create Course with Settings

```javascript
// Using the create_course tool
{
  "account_id": "1",
  "name": "Introduction to Programming",
  "course_code": "CS101",
  "start_at": "2024-01-15T00:00:00Z",
  "end_at": "2024-05-15T00:00:00Z",
  "default_view": "modules",
  "grading_standard_id": 5,
  "offer": true
}
```

### Make Account Admin

```javascript
// Using the make_account_admin tool
{
  "account_id": "1",
  "user_id": 12345,
  "role_id": 2,
  "send_confirmation": true
}
```

### Query Grade Changes by Course

```javascript
// Using the query_grade_changes_by_course tool
{
  "course_id": "12345",
  "start_time": "2024-01-01T00:00:00Z",
  "end_time": "2024-12-31T23:59:59Z"
}
```

### Advanced Grade Change Query

```javascript
// Using the query_grade_changes_advanced tool
{
  "course_id": 12345,
  "student_id": 67890,
  "start_time": "2024-01-01T00:00:00Z",
  "end_time": "2024-12-31T23:59:59Z"
}
```

### Create Grading Standard

```javascript
// Using the create_grading_standard tool
{
  "context_type": "course",
  "context_id": "12345",
  "title": "Standard Letter Grades",
  "points_based": false,
  "scaling_factor": 1.0,
  "grading_scheme_entry": [
    {"name": "A", "value": 94},
    {"name": "A-", "value": 90},
    {"name": "B+", "value": 87},
    {"name": "B", "value": 84},
    {"name": "B-", "value": 80},
    {"name": "C+", "value": 77},
    {"name": "C", "value": 74},
    {"name": "C-", "value": 70},
    {"name": "D+", "value": 67},
    {"name": "D", "value": 64},
    {"name": "D-", "value": 61},
    {"name": "F", "value": 0}
  ]
}
```

### List Grading Standards

```javascript
// Using the list_grading_standards tool
{
  "context_type": "course",
  "context_id": "12345"
}
```

### Get Grading Standard Details

```javascript
// Using the get_grading_standard tool
{
  "context_type": "course",
  "context_id": "12345",
  "grading_standard_id": "5"
}
```

### List Course Pages

```javascript
// Using the list_course_pages tool
{
  "course_id": "12345",
  "sort": "title",
  "order": "asc",
  "published": true,
  "include": ["body"]
}
```

### Create Course Page

```javascript
// Using the create_course_page tool
{
  "course_id": "12345",
  "title": "Course Syllabus",
  "body": "<h1>Welcome to the Course</h1><p>This is the course syllabus...</p>",
  "published": true,
  "front_page": false
}
```

### List User Logins

```javascript
// Using the list_user_logins tool
{
  "user_id": "12345"
}
```

### Create Authentication Provider

```javascript
// Using the create_authentication_provider tool
{
  "account_id": "1",
  "auth_type": "saml",
  "idp_entity_id": "https://example.com/saml/metadata",
  "log_in_url": "https://example.com/saml/login",
  "log_out_url": "https://example.com/saml/logout",
  "certificate_fingerprint": "aa:bb:cc:dd:ee:ff",
  "identifier_format": "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress"
}
```

### List LTI Launch Definitions

```javascript
// Using the list_lti_launch_definitions tool
{
  "course_id": "12345",
  "placements": ["course_navigation", "assignment_menu"],
  "only_visible": true
}
```

## Error Handling

The server provides comprehensive error handling:

- Canvas API errors are properly formatted and returned
- Network errors are handled gracefully
- Invalid parameters are validated before API calls
- Bulk operations continue processing even if individual items fail

## Troubleshooting

### Common Issues

#### Authentication Errors

**Problem**: `401 Unauthorized` or `Invalid access token`

**Solutions**:
- Verify your `CANVAS_API_TOKEN` is correct and has not expired
- Ensure the token has appropriate permissions for the operations you're attempting
- Check that your Canvas instance URL in `CANVAS_BASE_URL` is correct
- Test the token directly with Canvas API using curl:
  ```bash
  curl -H "Authorization: Bearer YOUR_TOKEN" https://your-canvas-instance.instructure.com/api/v1/users/self
  ```

#### Rate Limiting

**Problem**: `403 Forbidden` with rate limit messages

**Solutions**:
- Canvas API has rate limits (typically 3000 requests per hour per token)
- Implement delays between bulk operations
- Consider using multiple API tokens for high-volume operations
- Monitor the `X-Rate-Limit-Remaining` header in responses

#### Network Connectivity

**Problem**: Connection timeouts or network errors

**Solutions**:
- Verify your Canvas instance is accessible from your network
- Check firewall settings if running in corporate environment
- Test basic connectivity: `ping your-canvas-instance.instructure.com`
- Verify SSL certificates are valid

#### Tool Not Found Errors

**Problem**: `Unknown tool` or `Method not found` errors

**Solutions**:
- Ensure you're using the exact tool name from the documentation
- Check that the server is running the latest version
- Verify the tool is properly registered in the main server class
- Restart the MCP server if tools seem outdated

#### Permission Errors

**Problem**: `Insufficient privileges` or specific Canvas permission errors

**Solutions**:
- Verify your Canvas user account has the required permissions
- Admin tools require account admin privileges
- Course operations require appropriate course-level permissions
- Some operations require specific Canvas feature flags to be enabled

#### Data Format Issues

**Problem**: Invalid parameter or malformed request errors

**Solutions**:
- Check that all required parameters are provided
- Verify date formats use ISO 8601 format (e.g., `2024-01-15T00:00:00Z`)
- Ensure numeric IDs are passed as strings, not numbers
- Validate array parameters contain expected value types

### Debugging Tips

1. **Enable Debug Logging**: Check MCP client logs for detailed error messages
2. **Test Individual Tools**: Test problematic tools in isolation
3. **Validate Canvas Data**: Verify that referenced courses, users, etc. exist in Canvas
4. **Check Canvas API Documentation**: Reference [Canvas API docs](https://canvas.instructure.com/doc/api/) for parameter requirements
5. **Monitor Canvas Status**: Check [Canvas Status Page](https://status.instructure.com/) for service issues

### Getting Help

- Review Canvas API documentation for specific endpoint requirements
- Check Canvas community forums for common integration issues
- Verify Canvas instance configuration with your Canvas administrator
- Test operations directly in Canvas UI to confirm permissions and data availability

## Contributing

1. Follow the existing modular architecture
2. Add new types to the appropriate type files
3. Implement business logic in service classes
4. Create tool definitions in tool classes
5. Update this README with new features

## License

MIT License - see LICENSE file for details.

## Changelog

### v2.0.0

- Complete architectural refactor for modularity
- Added comprehensive enrollment utilities
- Improved type safety with detailed interfaces
- Added bulk enrollment operations
- Enhanced error handling
- Added convenience methods for common operations
- **NEW**: Admin management tools for account administration
- **NEW**: Grade change log auditing capabilities
- **NEW**: Assignment management with full CRUD operations
- **NEW**: Submission handling and grading tools
- **NEW**: Module and content management
- **NEW**: External tool (LTI) integration
- **NEW**: Quiz creation and management
- **NEW**: User management and profile operations
- **NEW**: Grading standards management with full CRUD operations
- Expanded to support all major Canvas API endpoints
- Added comprehensive type definitions for all Canvas entities

### v1.0.0

- Initial Canvas MCP server implementation
- Basic course and user operations
