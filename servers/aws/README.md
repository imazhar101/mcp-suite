# AWS MCP Server

AWS MCP Server provides Model Context Protocol tools for interacting with AWS services including DynamoDB, Lambda, and API Gateway.

## Features

### DynamoDB
- List tables
- Describe table schema
- Put, get, update, delete items
- Query and scan operations
- Batch operations

### Lambda
- List functions
- Get function details
- Invoke functions
- Update function code and configuration

### API Gateway
- REST API management (v1)
- HTTP/WebSocket API management (v2)
- Resource and method management
- Integration setup
- Deployment management

## Configuration

Set the following environment variables:

```bash
export AWS_REGION=us-east-1
export AWS_ACCESS_KEY_ID=your-access-key
export AWS_SECRET_ACCESS_KEY=your-secret-key
```

Or use AWS profiles, IAM roles, or other AWS credential methods.

## Usage

```bash
npx @mcp-suite/aws-server
```

## Tools

### DynamoDB Tools
- `dynamodb_list_tables` - List all DynamoDB tables
- `dynamodb_describe_table` - Get table schema and details
- `dynamodb_put_item` - Insert or replace an item
- `dynamodb_get_item` - Retrieve an item by key
- `dynamodb_update_item` - Update an existing item
- `dynamodb_delete_item` - Delete an item
- `dynamodb_query` - Query items with conditions
- `dynamodb_scan` - Scan all items in a table

### Lambda Tools
- `lambda_list_functions` - List all Lambda functions
- `lambda_get_function` - Get function details
- `lambda_invoke_function` - Invoke a function
- `lambda_update_function_code` - Update function code
- `lambda_update_function_configuration` - Update function settings

### API Gateway Tools
- `apigateway_list_rest_apis` - List REST APIs
- `apigateway_create_rest_api` - Create a new REST API
- `apigateway_get_resources` - Get API resources
- `apigateway_create_resource` - Create a new resource
- `apigateway_put_method` - Add a method to a resource
- `apigateway_put_integration` - Add integration to a method
- `apigateway_create_deployment` - Deploy the API
- `apigatewayv2_list_apis` - List HTTP/WebSocket APIs
- `apigatewayv2_create_api` - Create HTTP/WebSocket API
- `apigatewayv2_get_routes` - Get API routes
- `apigatewayv2_create_route` - Create a new route

## Required AWS Permissions

The server requires appropriate AWS IAM permissions for the services you want to use:

### DynamoDB
- `dynamodb:ListTables`
- `dynamodb:DescribeTable`
- `dynamodb:PutItem`
- `dynamodb:GetItem`
- `dynamodb:UpdateItem`
- `dynamodb:DeleteItem`
- `dynamodb:Query`
- `dynamodb:Scan`
- `dynamodb:BatchGetItem`
- `dynamodb:BatchWriteItem`

### Lambda
- `lambda:ListFunctions`
- `lambda:GetFunction`
- `lambda:InvokeFunction`
- `lambda:UpdateFunctionCode`
- `lambda:UpdateFunctionConfiguration`

### API Gateway
- `apigateway:GET`
- `apigateway:POST`
- `apigateway:PUT`
- `apigateway:DELETE`