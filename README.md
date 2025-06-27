# MCP Suite

A comprehensive monorepo suite of MCP (Model Context Protocol) servers built for standardized development and deployment.

## 🏗️ Architecture

```
mcp-suite/
├── docs/               # Documentation and setup guides
├── shared/             # Shared utilities and types
│   ├── types/          # Common TypeScript interfaces
│   ├── utils/          # Utility functions (logger, config, validation)
│   └── middleware/     # Reusable middleware (auth, error handling)
├── servers/            # Individual MCP servers
│   ├── jira/          # Jira server for issue management
│   ├── canvas/        # Canvas LMS server for educational workflows
│   ├── postgresql/    # PostgreSQL database management server
│   ├── salesforce/    # Salesforce CRM server with OAuth authentication
│   ├── clickup/       # ClickUp server for task and project management
│   ├── figma/         # Figma server for design file management
│   ├── notion/        # Notion server for knowledge management
│   ├── bitbucket/     # Bitbucket server for repository management
│   ├── aws/           # AWS services (DynamoDB, Lambda, API Gateway)
│   ├── puppeteer/     # Puppeteer server for browser automation
│   ├── paypal/        # PayPal server for payment processing and management
│   └── elasticsearch/ # Elasticsearch server for search and analytics
├── scripts/           # Build and deployment scripts
├── config/            # Environment-specific configurations
└── tests/             # Test suite (unit, integration, fixtures)
```

## 🚀 Quick Start

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd mcp-suite
   npm install
   ```

2. **Build all servers:**

   ```bash
   npm run build
   ```

## 📖 Setup Documentation

For detailed setup instructions with AI coding assistants like Continue.dev, Claude Code, and Cline, see:

📋 **[MCP Setup Guide](docs/MCP_SETUP_GUIDE.md)**

## 📦 Available Servers

<details>
<summary><strong>🎫 Jira Server</strong> - Issue management and project tracking</summary>

### [Jira Server](servers/jira/README.md)

**Package:** `@mcp-suite/jira-server`  
**Description:** Comprehensive Jira integration for issue management, project tracking, and workflow automation.

**Quick Setup:**

- `JIRA_BASE_URL` - Your Jira instance URL
- `JIRA_EMAIL` - Your Jira account email
- `JIRA_API_TOKEN` - Your Jira API token

**Key Features:** Issue management, JQL search, workflow automation, project tracking, comments, and assignments.

**Available Tools (11):**

```
search_issues, get_issue, create_issue, update_issue, transition_issue,
add_comment, list_projects, get_project, get_issue_transitions,
assign_issue, delete_issue
```

</details>

<details>
<summary><strong>🐘 PostgreSQL Server</strong> - Database management and analytics</summary>

### [PostgreSQL Server](servers/postgresql/README.md)

**Package:** `@mcp-suite/postgresql-server`  
**Description:** PostgreSQL database management and query execution server for database operations, schema inspection, and analytics.

**Quick Setup:**

- `POSTGRESQL_CONNECTION_STRING` - Your PostgreSQL connection string (e.g., `postgresql://user:password@localhost:5432/database`)

**Key Features:** SQL query execution, table schema inspection, database statistics, connection testing, and comprehensive PostgreSQL database management.

**Available Tools (5):**

```
execute_query, list_tables, get_database_stats, test_connection
```

</details>

<details>
<summary><strong>☁️ Salesforce Server</strong> - CRM integration with OAuth</summary>

### [Salesforce Server](servers/salesforce/README.md)

**Package:** `@mcp-suite/salesforce-server`  
**Description:** Salesforce CRM integration with CRUD operations using REST APIs and OAuth authentication support.

**Quick Setup:**

- **Required Environment Variables**: `SALESFORCE_CLIENT_ID`, `SALESFORCE_CLIENT_SECRET`, `SALESFORCE_USERNAME`, `SALESFORCE_PASSWORD`
- **Optional Variables**: `SALESFORCE_GRANT_TYPE`, `SALESFORCE_LOGIN_URL`, `SALESFORCE_API_VERSION`

**Key Features:** Automatic OAuth authentication with token persistence, SOQL queries, record CRUD operations, object metadata inspection, auto token renewal, and comprehensive Salesforce REST API coverage.

**Available Tools (7):**

```
salesforce_query, salesforce_create, salesforce_read, salesforce_update,
salesforce_delete, salesforce_describe, salesforce_list_objects
```

</details>

<details>
<summary><strong>🏗️ Bitbucket Server</strong> - Repository management and pull request workflows</summary>

### [Bitbucket Server](servers/bitbucket/README.md)

**Package:** `@mcp-suite/bitbucket-server`  
**Description:** Comprehensive Bitbucket integration for repository management, pull request operations, code reviews, and team collaboration workflows.

**Quick Setup:**

- `BITBUCKET_USERNAME` - Your Bitbucket username
- `BITBUCKET_APP_PASSWORD` - Your Bitbucket app password
- `BITBUCKET_WORKSPACE` - Your Bitbucket workspace name

**Key Features:** Repository management, pull request lifecycle, review workflows, comment system, task management, reviewer assignment, build status tracking, and merge strategies.

**Available Tools (40):**

```
get_repositories, get_repository, get_pull_requests, get_pull_request, 
create_pull_request, update_pull_request, merge_pull_request, decline_pull_request,
get_pull_request_activity, get_pull_request_comments, create_pull_request_comment,
update_pull_request_comment, delete_pull_request_comment, get_pull_request_diff,
get_pull_request_commits, approve_pull_request, unapprove_pull_request,
request_changes, remove_change_request, get_pull_request_tasks,
create_pull_request_task, update_pull_request_task, delete_pull_request_task,
get_default_reviewers, get_effective_default_reviewers, add_default_reviewer,
remove_default_reviewer, get_commits, get_commit, get_branches,
get_pull_requests_for_commit, get_pull_request_statuses
```

</details>

<details>
<summary><strong>📋 ClickUp Server</strong> - Task management and project organization</summary>

### [ClickUp Server](servers/clickup/README.md)

**Package:** `@mcp-suite/clickup-server`  
**Description:** Comprehensive ClickUp integration for task management, project organization, time tracking, and team collaboration.

**Quick Setup:**

- `CLICKUP_API_TOKEN` - Your ClickUp API token

**Key Features:** Task CRUD operations, project hierarchy management (spaces/folders/lists), comment system, team collaboration, time tracking, and goal management.

**Available Tools (29):**

```
get_tasks, get_task, create_task, update_task, delete_task, get_task_comments,
create_task_comment, get_lists, get_folderless_lists, create_list,
create_folderless_list, update_list, delete_list, get_folders, create_folder,
update_folder, delete_folder, get_spaces, get_space, create_space, update_space,
delete_space, get_teams, get_team_members, get_user, get_time_entries,
create_time_entry, get_goals, create_goal
```

</details>

<details>
<summary><strong>🎨 Figma Server</strong> - Design file and workflow management</summary>

### [Figma Server](servers/figma/README.md)

**Package:** `@mcp-suite/figma-server`  
**Description:** Figma API integration for retrieving files, components, styles, comments, and managing design workflows.

**Quick Setup:**

- `FIGMA_ACCESS_TOKEN` - Your Figma Personal Access Token

**Key Features:** File operations, comment management, team & project management, components & styles retrieval, and comprehensive Figma API coverage.

**Available Tools (14):**

```
get_file, get_file_nodes, get_images, get_image_fills, get_comments, post_comment,
delete_comment, get_me, get_team_projects, get_project_files, get_component,
get_component_sets, get_team_components, get_file_components, get_team_styles,
get_file_styles
```

</details>

<details>
<summary><strong>🎓 Canvas Server</strong> - Learning management system integration</summary>

### [Canvas Server](servers/canvas/README.md)

**Package:** `@mcp-suite/canvas-server`  
**Description:** Comprehensive Canvas LMS integration for course management, enrollment operations, grading, and administrative tasks.

**Quick Setup:**

- `CANVAS_BASE_URL` - Your Canvas instance URL (e.g., `https://your-school.instructure.com`)
- `CANVAS_API_TOKEN` - Your Canvas API access token

**Key Features:** Course management, enrollment utilities, user administration, assignment/quiz tools, grading standards, grade change auditing, admin management, and comprehensive Canvas API coverage.

**Available Tools (185):**

```
# Admin Tools (4)
make_account_admin, remove_account_admin, list_account_admins, list_my_admin_roles

# Assignment Tools (14)
list_assignments, get_assignment, create_assignment, update_assignment, delete_assignment,
duplicate_assignment, bulk_update_assignment_dates, list_assignment_overrides,
get_assignment_override, create_assignment_override, update_assignment_override,
delete_assignment_override

# Authentication Provider Tools (8)
list_authentication_providers, get_authentication_provider, create_authentication_provider,
update_authentication_provider, delete_authentication_provider, restore_authentication_provider,
get_sso_settings, update_sso_settings

# Course Tools (12)
list_courses, get_course, create_course, update_course, delete_course, list_course_users,
get_course_user, get_user_progress, get_course_settings, update_course_settings

# Enrollment Tools (17)
list_enrollments, get_enrollment, create_enrollment, update_enrollment, accept_enrollment,
reject_enrollment, reactivate_enrollment, add_last_attended_date, get_temporary_enrollment_status,
bulk_create_enrollments, get_active_students, get_course_teachers, get_pending_enrollments,
enroll_students, remove_enrollments

# External Tool Tools (14)
list_external_tools, get_external_tool, create_external_tool, update_external_tool,
delete_external_tool, get_sessionless_launch, add_rce_favorite, remove_rce_favorite,
add_top_nav_favorite, remove_top_nav_favorite, get_visible_course_nav_tools,
get_visible_course_nav_tools_for_course

# Grade Change Log Tools (5)
query_grade_changes_by_assignment, query_grade_changes_by_course, query_grade_changes_by_student,
query_grade_changes_by_grader, query_grade_changes_advanced

# Grading Standard Tools (3)
create_grading_standard, list_grading_standards, get_grading_standard

# Login Tools (5)
list_user_logins, create_user_login, update_user_login, delete_user_login, forgot_password

# LTI Launch Definition Tools (1)
list_lti_launch_definitions

# Module Tools (22)
list_modules, get_module, create_module, update_module, delete_module, relock_module,
list_module_items, get_module_item, create_module_item, update_module_item, delete_module_item,
mark_module_item_done, mark_module_item_not_done, mark_module_item_read, get_module_item_sequence,
select_mastery_path, list_module_overrides, update_module_overrides

# Page Tools (24)
list_course_pages, get_course_page, create_course_page, update_course_page, delete_course_page,
duplicate_course_page, get_course_front_page, update_course_front_page, list_course_page_revisions,
get_course_page_revision, revert_course_page_to_revision, list_group_pages, get_group_page,
create_group_page, update_group_page, delete_group_page, get_group_front_page,
update_group_front_page, list_group_page_revisions, get_group_page_revision,
revert_group_page_to_revision

# Quiz Tools (14)
list_quizzes, get_quiz, create_quiz, update_quiz, delete_quiz, reorder_quiz_items,
validate_quiz_access_code, list_quiz_questions, get_quiz_question, create_quiz_question,
update_quiz_question, delete_quiz_question

# Submission Tools (23)
submit_assignment, list_assignment_submissions, list_submissions_for_multiple_assignments,
get_submission, get_submission_by_anonymous_id, grade_submission, grade_submission_by_anonymous_id,
list_gradeable_students, list_multiple_assignments_gradeable_students, bulk_update_grades,
bulk_update_grades_for_course, mark_submission_as_read, mark_submission_as_unread,
mark_bulk_submissions_as_read, mark_submission_item_as_read, get_submission_summary,
get_gradebook_history_days, get_gradebook_history_day_details, get_gradebook_history_submissions,
get_gradebook_history_feed

# User Tools (37)
list_account_users, get_user, create_user, update_user, get_user_profile, list_avatar_options,
list_page_views, get_activity_stream, get_activity_stream_summary, get_todo_items,
get_todo_item_count, get_upcoming_events, get_missing_submissions, hide_stream_item,
hide_all_stream_items, get_user_settings, update_user_settings, get_custom_colors,
get_custom_color, update_custom_color, update_text_editor_preference,
update_files_ui_version_preference, get_dashboard_positions, update_dashboard_positions,
terminate_all_sessions, expire_mobile_sessions, merge_user, split_user, get_graded_submissions,
store_custom_data, load_custom_data, delete_custom_data, list_course_nicknames,
get_course_nickname, set_course_nickname, remove_course_nickname, clear_course_nicknames,
upload_user_file, get_pandata_events_token
```

</details>

<details>
<summary><strong>💳 PayPal Server</strong> - Payment processing and transaction management</summary>

### [PayPal Server](servers/paypal/README.md)

**Package:** `@mcp-suite/paypal-server`  
**Description:** Comprehensive PayPal integration for payment processing, transaction management, and PayPal API operations with OAuth authentication.

**Quick Setup:**

- `PAYPAL_CLIENT_ID` - Your PayPal application client ID
- `PAYPAL_CLIENT_SECRET` - Your PayPal application client secret
- `PAYPAL_ENVIRONMENT` - Environment ("sandbox" or "production", defaults to "sandbox")

**Key Features:** Payment creation and execution, transaction management (sales, authorizations, captures, refunds), OAuth authentication with automatic token management, webhook event monitoring, multi-environment support, and comprehensive PayPal API coverage.

**Available Tools (9):**

```
paypal_create_payment, paypal_execute_payment, paypal_get_payment, paypal_list_payments,
paypal_refund_sale, paypal_capture_authorization, paypal_void_authorization,
paypal_get_webhook_events, paypal_test_connection
```

</details>

<details>
<summary><strong>☁️ AWS Server</strong> - AWS services integration for DynamoDB, Lambda, and API Gateway</summary>

### [AWS Server](servers/aws/README.md)

**Package:** `@mcp-suite/aws-server`  
**Description:** Comprehensive AWS integration for DynamoDB, Lambda, and API Gateway services with full CRUD operations and management capabilities.

**Quick Setup:**

- `AWS_REGION` - Your AWS region (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID` - Your AWS access key ID
- `AWS_SECRET_ACCESS_KEY` - Your AWS secret access key

**Key Features:** DynamoDB table management and operations, Lambda function management and invocation, API Gateway REST and HTTP API management, resource and deployment management, comprehensive AWS service integration.

**Available Tools (29):**

```
dynamodb_list_tables, dynamodb_describe_table, dynamodb_put_item, dynamodb_get_item,
dynamodb_update_item, dynamodb_delete_item, dynamodb_query, dynamodb_scan,
lambda_list_functions, lambda_get_function, lambda_invoke_function, lambda_create_function,
lambda_update_function_code, lambda_update_function_configuration, apigateway_list_rest_apis,
apigateway_get_rest_api, apigateway_create_rest_api, apigateway_delete_rest_api,
apigateway_get_resources, apigateway_create_resource, apigateway_put_method,
apigateway_put_integration, apigateway_create_deployment, apigatewayv2_list_apis,
apigatewayv2_create_api, apigatewayv2_get_routes, apigatewayv2_create_route,
apigatewayv2_get_integrations, apigatewayv2_create_integration
```

</details>

<details>
<summary><strong>🎭 Puppeteer Server</strong> - Browser automation and web scraping</summary>

### [Puppeteer Server](servers/puppeteer/README.md)

**Package:** `@mcp-suite/puppeteer-server`  
**Description:** Browser automation server using Puppeteer for web scraping, testing, and automated browsing tasks.

**Quick Setup:**

No environment variables required for basic usage.

**Key Features:** Browser automation, web scraping, screenshot capture, PDF generation, form automation, and comprehensive browser control.

**Available Tools:** Browser management, page navigation, element interaction, data extraction, and automated testing capabilities.

</details>

<details>
<summary><strong>🔍 Elasticsearch Server</strong> - Search, analytics, and document management</summary>

### [Elasticsearch Server](servers/elasticsearch/README.md)

**Package:** `@mcp-suite/elasticsearch-server`  
**Description:** Comprehensive Elasticsearch integration for search, analytics, and document management with built-in data limiting controls.

**Quick Setup:**

- `ELASTICSEARCH_NODE` - Elasticsearch node URL (default: http://localhost:9200)
- `ELASTICSEARCH_USERNAME` and `ELASTICSEARCH_PASSWORD` - Basic authentication (optional)
- `ELASTICSEARCH_API_KEY` - API key authentication (optional)

**Key Features:** Full-text search with query DSL, aggregations and analytics, index management, document CRUD operations, bulk operations with safety limits, cluster health monitoring, and comprehensive data limiting controls.

**Available Tools (19):**

```
elasticsearch_test_connection, elasticsearch_cluster_health, elasticsearch_node_stats,
elasticsearch_list_indices, elasticsearch_get_index_info, elasticsearch_create_index,
elasticsearch_delete_index, elasticsearch_index_exists, elasticsearch_search,
elasticsearch_count, elasticsearch_aggregation, elasticsearch_get_document,
elasticsearch_index_document, elasticsearch_update_document, elasticsearch_delete_document,
elasticsearch_bulk_operation, elasticsearch_delete_by_query, elasticsearch_reindex
```

</details>

## 🛠️ Development

### Building Servers

```bash
# Build all servers
npm run build

# Build specific server
cd servers/jira && npm run build
```

### Running Servers

```bash
# Build and run a specific server
cd servers/jira && npm run build
```

### Testing

```bash
# Run integration tests
npm test

# Run specific test file
npx vitest run tests/integration/jira-server.test.ts
```

### Creating New Servers

1. Create server directory:

   ```bash
   mkdir -p servers/your-server/src/{handlers,tools,types}
   ```

2. Set up package.json following the existing pattern
3. Implement your server using the shared utilities
4. Add configuration to `config/servers.json`
5. Update this README

## 📋 Scripts

- `npm run build` - Build all servers
- `npm run deploy <server> [version-type]` - Deploy server with version bump
- `npm test` - Run integration tests
- `npm run lint` - Lint codebase
- `npm run type-check` - TypeScript type checking

## 🔧 Configuration

### Environment-specific configs

- `config/development.json` - Development settings
- `config/production.json` - Production settings
- `config/servers.json` - Server registry and metadata

### Shared Utilities

- **Logger:** Structured logging with context
- **Config:** Environment variable management
- **Validation:** Input validation utilities
- **Auth:** Authentication middleware
- **Error Handling:** Standardized error responses

## 🧪 Testing

The test suite includes:

- **Integration tests:** Test server startup and MCP protocol communication using Vitest
- Tests require environment variables (e.g., `JIRA_BASE_URL`) to run against real services
- Tests are skipped automatically when environment variables are not configured

## 📈 Monitoring

Each server includes built-in monitoring capabilities:

- Structured logging with contextual information
- Error tracking and reporting
- Performance metrics collection
- Health check endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes following the established patterns
4. Add tests for your changes
5. Ensure all tests pass: `npm test`
6. Commit your changes: `git commit -m 'Add your feature'`
7. Push to the branch: `git push origin feature/your-feature`
8. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- Create an issue for bug reports or feature requests
- Check existing documentation in individual server README files
- Review the shared utilities documentation for development guidance
