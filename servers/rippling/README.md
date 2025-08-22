# Rippling MCP Server

A Model Context Protocol (MCP) server for Rippling HR platform integration. This server provides tools to interact with Rippling's API for employee management and HR operations.

## Features

- **Connection Testing**: Verify API connectivity and authentication
- **Employee Management**: List and search employees with pagination
- **Employment Roles**: Get employment role details for specific users
- **Leave Management**: Access eligible leave policies and submit requests
- **Terminated Employees**: List and search terminated employees
- **Document Management**: Access document folders and contents
- **Anniversary Information**: Get anniversary email settings
- **Action Requests**: View and manage requests that need your approval (from team members)
- **Interviews & Feedback**: Manage interview feedback and ATS integration
- **Alerts**: Access and filter alerts from the automation system
- **Time Off Requests**: View your submitted leave requests and their status
- **Holiday Calendar**: Access company holiday calendar for the current year
- **Request Time Off**: Submit new time off requests with approval workflow
- **Cancel Time Off**: Cancel pending time off requests

## Tools

### `rippling_test_connection`
Test the connection to Rippling API and retrieve basic information.

### `rippling_get_employment_roles`
Get detailed employment roles and profile information for a specific user by user ID. Includes basic employment data plus detailed additional information and personal information field values.

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

### `rippling_get_eligible_leave_policies`
Get eligible leave policies for the current user. Returns available leave policies with their IDs, names, descriptions (HTML stripped), and scheduling constraints including minimum/maximum hours to schedule leave.

**Returns:**
- `id`: Policy ID to use with `rippling_request_time_off`
- `numHours`: Number of hours for this policy type
- `customName`: Display name of the leave policy
- `description`: Policy description with HTML tags removed
- `minHoursToScheduleLeave`: Minimum hours that must be scheduled in advance
- `maxHoursToScheduleLeave`: Maximum hours that can be scheduled in advance
- `country`: Country code for the policy
- `leaveTypeId`: Internal leave type identifier

### `rippling_list_terminated_employees`
List terminated employees with optional search and pagination. Returns terminated employee data including termination details.

**Parameters:**
- `page` (number, optional): Page number for pagination (default: 1)
- `searchQuery` (string, optional): Search query to filter terminated employees by name

### `rippling_get_signed_documents`
Get signed documents from Rippling hub API. Returns document metadata including IDs, names, signatures, PDF URLs, and other document properties for the current user's role. Automatically includes all available fields.

**Parameters:**
None - uses the role from your configuration

**Returns:**
- `ids`: Array of document IDs
- `pageSize`: Pagination info (null if not paginated)
- `supportsIDBasedPagination`: Boolean indicating pagination support
- `itemsAvailable`: Boolean indicating if items are available
- `items`: Array of document objects with all available fields (archived, companyDocument, createdAt, displayName, finalPdfUrl, id, isAmended, isConfidential, isDeleted, isUploadedDoc, name, signableCompanyDocument, signableDocument, signatureDate, type, updatedAt, uploadedBy, userDisplayName)

### `rippling_get_anniversary_information`
Get anniversary email settings and information from Rippling anniversary app.

### `rippling_get_action_request_filters`
Get filtered action requests that require YOUR APPROVAL or REVIEW from others (not your own submissions). This shows requests from team members or colleagues waiting for you to approve/review, such as leave requests from your team, expense approvals, or other workflow items. Defaults to showing actions pending your review. For your own time off requests, use `rippling_time_off_requests` instead.

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

### `rippling_time_off_requests`
Get YOUR OWN time off requests (leave requests) that you have personally submitted. Returns a list of only your submitted leave requests with status, dates, duration, and leave type information. For requests that need your approval from others, use `rippling_get_action_request_filters` instead.

**Parameters:**
- `pageSize` (number, optional): Number of results per page (default: 30, max: 100)

**Returns:**
- `timeOffRequests`: Array of your time off requests with:
  - `id`: Request ID
  - `dateRequested`: When the request was submitted
  - `status`: Current status (e.g., EXECUTED, PENDING)
  - `decision`: Approval decision (e.g., APPROVED, DENIED)
  - `requestType`: Type of request (e.g., LEAVE_REQUEST_APPROVAL)
  - `requestSummary`: Details including leave policy, dates, duration, balance
  - `roleBeingAffected`: Basic info about the employee taking leave

### `rippling_get_holiday_calendar`
Get holiday calendar information from Rippling. Returns holidays and calendar events for the current year only, with options to filter by time admin permissions and payable holidays.

**Parameters:**
- `roleId` (string, optional): Role ID to get holiday calendar for. If not provided, defaults to your own role ID
- `allowTimeAdmin` (boolean, optional): Whether to allow time admin access (default: false)
- `onlyPayable` (boolean, optional): Whether to return only payable holidays (default: false)

**Returns:**
- `currentYear`: The current year (e.g., 2025)
- `holidays`: Array of holiday objects for the current year
- `requestedFor`: Role ID the calendar was requested for

### `rippling_request_time_off`
Submit a new time off request (leave request) to Rippling. Creates a leave request with specified dates, leave policy, and reason. The request will go through the normal approval workflow using your role ID automatically.

**Parameters:**
- `leavePolicy` (string, required): Leave policy ID for the type of leave being requested. IMPORTANT: Use the exact 'id' field returned from `rippling_get_eligible_leave_policies`, not the customName or any other field. This should be the actual policy ID from the get_eligible_policies endpoint (e.g., `679a38907ef7dda5d37625a0`)
- `startDate` (string, required): Start date of the leave in YYYY-MM-DD format (e.g., '2025-08-26')
- `endDate` (string, required): End date of the leave in YYYY-MM-DD format (e.g., '2025-08-26'). Can be the same as startDate for single-day leave
- `reasonForLeave` (string, required): Reason or description for the leave request
- `isOpenEnded` (boolean, required): Whether this is an open-ended leave request (true or false)

**Returns:**
- `id`: ID of the submitted leave request
- `status`: Current status of the request (e.g., "PENDING", "APPROVED")
- `actionRequestId`: Associated action request ID for approval workflow
- `startDate`: Requested start date
- `endDate`: Requested end date
- `reasonForLeave`: Reason provided for the request
- `numDays`: Number of days requested (e.g., "1.00")
- `numHours`: Number of hours requested (e.g., "8.00")
- `leaveTypeName`: Human-readable name of leave type (e.g., "Work From Home")
- `policyDisplayName`: Display name of the policy (e.g., "WFH Request")
- `requestedByName`: Full name of the person who submitted the request
- `isPaid`: Whether this is paid leave
- `isAutoApproved`: Whether the request was automatically approved
- `createdAt`: Timestamp when request was created
- `updatedAt`: Timestamp when request was last updated
- `fullResponse`: Complete API response object with all fields

**Usage Workflow:**
1. First, call `rippling_get_eligible_leave_policies` to get available leave policies and their IDs
2. Find the appropriate policy using the `id` field (e.g., `679a38907ef7dda5d37625a0`)
3. Then call `rippling_request_time_off` with the policy ID from step 2

**Example:**
```json
{
  "leavePolicy": "679a38907ef7dda5d37625a0",
  "startDate": "2025-08-29",
  "endDate": "2025-08-29", 
  "reasonForLeave": "Working remotely for the day",
  "isOpenEnded": false
}
```

### `rippling_cancel_time_off`
Cancel a pending time off request in Rippling. This can be used to cancel time off requests that are still pending approval or in progress.

**Parameters:**
- `actionRequestId` (string, required): The ID of the action request to cancel. This can be obtained from the `actionRequestId` field in the response of `rippling_request_time_off` or from `rippling_time_off_requests`
- `channel` (string, optional): The channel from which the cancellation is being performed (default: "DASHBOARD")

**Returns:**
- `actionRequestId`: ID of the canceled action request
- `channel`: Channel used for the cancellation
- `canceled`: Boolean indicating successful cancellation
- `response`: Complete API response from the cancellation

**Example:**
```json
{
  "actionRequestId": "68a8bf68eb628f0869e8bbc3",
  "channel": "DASHBOARD"
}
```

## Configuration

### Obtaining Required Values

To get the required Authorization token, Role ID, and Company ID:

1. **Access Rippling Developer Console**:
   - Go to your Rippling instance
   - Navigate to Developer tools/API section

2. **Get Authorization Token**:
   - In the Developer Console, look for the Bearer token in the Authorization header
   - Copy the full token value (starts with "Bearer ")

3. **Get Role ID**:
   - In the Developer Console network requests, look for `role` parameter
   - This is typically a UUID format (e.g., `123e4567-e89b-12d3-a456-426614174000`)

4. **Get Company ID**:
   - In the Developer Console network requests, look for `company` parameter  
   - This is also typically a UUID format

5. **Get User ID**:
   - Navigate to your profile in Rippling
   - The User ID is visible in the profile URL: `app.rippling.com/profile/{USER_ID}`
   - Copy the ID from the URL (e.g., `67adf91`)

### Environment Variables

Set the following environment variables:

```bash
export RIPPLING_TOKEN="your_rippling_bearer_token"
export RIPPLING_ROLE="your_rippling_role_id"
export RIPPLING_COMPANY="your_rippling_company_id"
export RIPPLING_USER_ID="your_rippling_user_id"
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
- `POST /profile/get_fields_data` - Get detailed profile field information
- `POST /employee_list/find_paginated` - List employees with pagination and search
- `POST /leave_policies/get_eligible_policies/` - Get eligible leave policies for user
- `POST /action_request/filters/find_paginated/` - Get filtered action requests (including time off requests)
- `POST /get_holiday_calendar/` - Get holiday calendar information
- `POST /leave_requests/` - Submit new time off requests
- `POST /action_request/cancel` - Cancel pending action requests

## License

MIT