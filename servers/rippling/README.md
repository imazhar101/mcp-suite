# Rippling MCP Server

A Model Context Protocol (MCP) server for Rippling HR platform integration. This server provides tools to interact with Rippling's API for employee management and HR operations.

## Features

- **Connection Testing**: Verify API connectivity and authentication
- **Employee Management**: List and search employees with pagination
- **Employment Roles**: Get employment role details for specific users
- **Leave Management**: Access company leave types
- **Terminated Employees**: List and search terminated employees
- **Document Management**: Access document folders and contents
- **Anniversary Information**: Get anniversary email settings
- **Action Requests**: Filter and manage action requests with pagination
- **Interviews & Feedback**: Manage interview feedback and ATS integration
- **Alerts**: Access and filter alerts from the automation system

## Tools

### `rippling_test_connection`
Test the connection to Rippling API and retrieve basic information.

### `rippling_get_employment_roles`
Get employment roles for a specific user by user ID.

**Parameters:**
- `userId` (string, required): The user ID to get employment roles for

### `rippling_list_employees`
List employees with optional search and pagination. Returns simplified employee data including:
- Employee ID
- Full name
- Email
- Title
- Department
- Employee number
- Start date
- Role state

**Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `searchQuery` (string, optional): Search query to filter employees by name

### `rippling_get_company_leave_types`
Get all company leave types including long-term leave types. Returns available leave types for the company.

### `rippling_list_terminated_employees`
List terminated employees with optional search and pagination. Returns terminated employee data including termination details.

**Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `searchQuery` (string, optional): Search query to filter terminated employees by name

### `rippling_get_document_folder_contents`
Get folder contents from Rippling documents platform. Returns files and folders in the specified folder.

**Parameters:**
- `parent` (string, optional): The parent folder ID (default: 'root')
- `resource` (string, required): The resource ID to filter documents by

### `rippling_get_anniversary_information`
Get anniversary email settings and information from Rippling anniversary app.

### `rippling_get_action_request_filters`
Get filtered action requests with pagination. Use 'requestedByRoles' to see actions YOU submitted (your own requests). Use 'pendingReviewerRoles' to see actions waiting for YOUR review. Defaults to showing actions pending your review if neither is specified.

**Parameters:**
- `pageSize` (number, optional): Number of results per page (default: 30)
- `actionTypes` (array, optional): Filter by action types (e.g., LEAVE_REQUEST_APPROVAL)
- `pendingReviewerRoles` (array, optional): Role IDs for actions awaiting review
- `requestedByRoles` (array, optional): Role IDs for actions that were submitted/requested
- `sortColumn` (string, optional): Column to sort by (default: dateRequested)
- `sortOrder` (string, optional): Sort order - "ASC" or "DESC" (default: DESC)
- `includeRoleDetails` (boolean, optional): Include role details in the response (default: true)

### `rippling_get_open_interviews_and_feedbacks`
Get open interviews and feedbacks for an employee from ATS. Returns today's interviews, pending interviews/feedbacks, and upcoming interviews.

**Parameters:**
- `searchQuery` (string, optional): Search query to filter results
- `timezone` (string, optional): Timezone for the request (default: America/Phoenix)

### `rippling_update_feedback_form_response`
Update (submit) feedback form response for an interview. Used to submit interview feedback with ratings and comments.

**Parameters:**
- `feedbackFormResponse` (object, required): Complete feedback form response object containing:
  - `id` (string, required): ID of the feedback form response to update
  - `role` (string, required): Role ID of the person providing feedback
  - `submittedBy` (string): User ID of the person submitting the feedback
  - `interview` (string, required): Interview ID this feedback is for
  - `applicant` (string, required): Applicant ID this feedback is for
  - `overallRating` (number, required): Overall rating (1-4 scale)
  - `status` (string): Status of the feedback (e.g., SUBMITTED)
  - `formResponse` (object, required): Form response containing answers and comments
  - `owner` (string, required): Owner ID
  - `milestone` (string): Milestone ID

### `rippling_get_alerts`
Get alerts from Rippling automation system. Returns paginated list of alerts with filtering options for read status.

**Parameters:**
- `readStatus` (string, optional): Filter alerts by read status - "READ_STATUS_ALL", "READ_STATUS_READ", or "READ_STATUS_UNREAD" (default: READ_STATUS_ALL)
- `pageSize` (number, optional): Number of alerts per page (default: 30, max: 100)
- `pageToken` (string, optional): Page token for pagination (empty for first page)

## Configuration

Set the following environment variables:

```bash
export RIPPLING_TOKEN="your_rippling_bearer_token"
export RIPPLING_ROLE="your_rippling_role_id"
export RIPPLING_COMPANY="your_rippling_company_id"
```

## Installation

```bash
npm install
npm run build
```

## Usage

```bash
npx @imazhar101/mcp-rippling-server
```

## API Endpoints Used

- `GET /employment_roles_with_company/{userId}/` - Get employment roles for a user
- `POST /employee_list/find_paginated` - List employees with pagination and search

## License

MIT