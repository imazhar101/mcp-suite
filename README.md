# MCP Suite

A comprehensive monorepo suite of MCP (Model Context Protocol) servers built for standardized development and deployment.

## 🏗️ Architecture

```
mcp-suite/
├── shared/              # Shared utilities and types
│   ├── types/          # Common TypeScript interfaces
│   ├── utils/          # Utility functions (logger, config, validation)
│   └── middleware/     # Reusable middleware (auth, error handling)
├── servers/            # Individual MCP servers
│   ├── jira/          # Jira server for issue management
│   └── canvas/        # Canvas LMS server for educational workflows
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

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Build all servers:**
   ```bash
   npm run build
   ```

4. **Start a specific server:**
   ```bash
   npm run build:server jira
   ```

## 📦 Available Servers

### Jira Server
**Package:** `@mcp-suite/jira-server`  
**Description:** Comprehensive Jira integration for issue management, project tracking, and workflow automation.

📖 **[Full Documentation](servers/jira/README.md)**

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

### Canvas Server
**Package:** `@mcp-suite/canvas-server`  
**Description:** Comprehensive Canvas LMS integration for course management, enrollment operations, grading, and administrative tasks.

📖 **[Full Documentation](servers/canvas/README.md)**

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
# Start a specific server
npm run build:server jira

# Start all servers
npm run start:all
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
- `npm run build:server <name>` - Start specific server
- `npm run start:all` - Start all servers
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