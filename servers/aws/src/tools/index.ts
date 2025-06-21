import { McpTool } from "../../../../shared/types/mcp.js";

export const tools: McpTool[] = [
  // DynamoDB Tools
  {
    name: "dynamodb_list_tables",
    description: "List all DynamoDB tables in the account",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "dynamodb_describe_table",
    description: "Get detailed information about a DynamoDB table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "Name of the table" },
      },
      required: ["tableName"],
    },
  },
  {
    name: "dynamodb_put_item",
    description: "Insert or replace an item in a DynamoDB table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "Name of the table" },
        item: { type: "object", description: "The item to put" },
      },
      required: ["tableName", "item"],
    },
  },
  {
    name: "dynamodb_get_item",
    description: "Retrieve an item from a DynamoDB table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "Name of the table" },
        key: { type: "object", description: "The primary key of the item" },
      },
      required: ["tableName", "key"],
    },
  },
  {
    name: "dynamodb_update_item",
    description: "Update an item in a DynamoDB table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "Name of the table" },
        key: { type: "object", description: "The primary key of the item" },
        updateExpression: { type: "string", description: "Update expression" },
        expressionAttributeNames: {
          type: "object",
          description: "Expression attribute names",
        },
        expressionAttributeValues: {
          type: "object",
          description: "Expression attribute values",
        },
      },
      required: ["tableName", "key", "updateExpression"],
    },
  },
  {
    name: "dynamodb_delete_item",
    description: "Delete an item from a DynamoDB table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "Name of the table" },
        key: { type: "object", description: "The primary key of the item" },
      },
      required: ["tableName", "key"],
    },
  },
  {
    name: "dynamodb_query",
    description: "Query items from a DynamoDB table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "Name of the table" },
        keyConditionExpression: {
          type: "string",
          description: "Key condition expression",
        },
        filterExpression: { type: "string", description: "Filter expression" },
        expressionAttributeNames: {
          type: "object",
          description: "Expression attribute names",
        },
        expressionAttributeValues: {
          type: "object",
          description: "Expression attribute values",
        },
        limit: {
          type: "number",
          description: "Maximum number of items to return",
        },
        indexName: {
          type: "string",
          description: "Name of the index to query",
        },
      },
      required: ["tableName"],
    },
  },
  {
    name: "dynamodb_scan",
    description: "Scan all items from a DynamoDB table",
    inputSchema: {
      type: "object",
      properties: {
        tableName: { type: "string", description: "Name of the table" },
        filterExpression: { type: "string", description: "Filter expression" },
        expressionAttributeNames: {
          type: "object",
          description: "Expression attribute names",
        },
        expressionAttributeValues: {
          type: "object",
          description: "Expression attribute values",
        },
        limit: {
          type: "number",
          description: "Maximum number of items to return",
        },
      },
      required: ["tableName"],
    },
  },

  // Lambda Tools
  {
    name: "lambda_list_functions",
    description: "List all Lambda functions in the account",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "lambda_get_function",
    description: "Get detailed information about a Lambda function",
    inputSchema: {
      type: "object",
      properties: {
        functionName: { type: "string", description: "Name of the function" },
      },
      required: ["functionName"],
    },
  },
  {
    name: "lambda_invoke_function",
    description: "Invoke a Lambda function",
    inputSchema: {
      type: "object",
      properties: {
        functionName: { type: "string", description: "Name of the function" },
        payload: {
          type: "object",
          description: "Payload to send to the function",
        },
        invocationType: {
          type: "string",
          enum: ["Event", "RequestResponse", "DryRun"],
          description: "Type of invocation",
        },
      },
      required: ["functionName"],
    },
  },
  {
    name: "lambda_update_function_code",
    description: "Update the code of a Lambda function",
    inputSchema: {
      type: "object",
      properties: {
        functionName: { type: "string", description: "Name of the function" },
        s3Bucket: {
          type: "string",
          description: "S3 bucket containing the code",
        },
        s3Key: { type: "string", description: "S3 key of the code file" },
      },
      required: ["functionName"],
    },
  },
  {
    name: "lambda_create_function",
    description: "Create a new Lambda function",
    inputSchema: {
      type: "object",
      properties: {
        functionName: { type: "string", description: "Name of the function" },
        runtime: {
          type: "string",
          description: "Function runtime (e.g., nodejs18.x, python3.9)",
        },
        handler: {
          type: "string",
          description: "Function handler (e.g., index.handler)",
        },
        roleArn: {
          type: "string",
          description: "IAM role ARN for the function",
        },
        zipFile: {
          type: "string",
          description: "Base64 encoded zip file content",
        },
        description: { type: "string", description: "Function description" },
        timeout: { type: "number", description: "Function timeout in seconds" },
        memorySize: {
          type: "number",
          description: "Function memory size in MB",
        },
        environment: { type: "object", description: "Environment variables" },
      },
      required: ["functionName", "runtime", "handler", "roleArn", "zipFile"],
    },
  },
  {
    name: "lambda_update_function_configuration",
    description: "Update the configuration of a Lambda function",
    inputSchema: {
      type: "object",
      properties: {
        functionName: { type: "string", description: "Name of the function" },
        description: { type: "string", description: "Function description" },
        timeout: { type: "number", description: "Function timeout in seconds" },
        memorySize: {
          type: "number",
          description: "Function memory size in MB",
        },
        environment: { type: "object", description: "Environment variables" },
        handler: { type: "string", description: "Function handler" },
        runtime: { type: "string", description: "Function runtime" },
      },
      required: ["functionName"],
    },
  },

  // API Gateway REST API Tools
  {
    name: "apigateway_list_rest_apis",
    description: "List all REST APIs in API Gateway",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "apigateway_get_rest_api",
    description: "Get detailed information about a REST API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
      },
      required: ["apiId"],
    },
  },
  {
    name: "apigateway_create_rest_api",
    description: "Create a new REST API",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the API" },
        description: { type: "string", description: "Description of the API" },
        version: { type: "string", description: "Version of the API" },
      },
      required: ["name"],
    },
  },
  {
    name: "apigateway_delete_rest_api",
    description: "Delete a REST API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
      },
      required: ["apiId"],
    },
  },
  {
    name: "apigateway_get_resources",
    description: "Get all resources for a REST API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
      },
      required: ["apiId"],
    },
  },
  {
    name: "apigateway_create_resource",
    description: "Create a new resource in a REST API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
        parentId: { type: "string", description: "ID of the parent resource" },
        pathPart: { type: "string", description: "Path part for the resource" },
      },
      required: ["apiId", "parentId", "pathPart"],
    },
  },
  {
    name: "apigateway_put_method",
    description: "Add a method to a resource",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
        resourceId: { type: "string", description: "ID of the resource" },
        httpMethod: {
          type: "string",
          description: "HTTP method (GET, POST, etc.)",
        },
        authorizationType: {
          type: "string",
          description: "Authorization type",
        },
        apiKeyRequired: {
          type: "boolean",
          description: "Whether API key is required",
        },
      },
      required: ["apiId", "resourceId", "httpMethod"],
    },
  },
  {
    name: "apigateway_put_integration",
    description: "Add an integration to a method",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
        resourceId: { type: "string", description: "ID of the resource" },
        httpMethod: { type: "string", description: "HTTP method" },
        type: { type: "string", description: "Integration type" },
        uri: { type: "string", description: "Integration URI" },
        integrationHttpMethod: {
          type: "string",
          description: "Integration HTTP method",
        },
      },
      required: ["apiId", "resourceId", "httpMethod", "type"],
    },
  },
  {
    name: "apigateway_create_deployment",
    description: "Create a deployment for a REST API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
        stageName: { type: "string", description: "Name of the stage" },
        description: {
          type: "string",
          description: "Description of the deployment",
        },
      },
      required: ["apiId", "stageName"],
    },
  },

  // API Gateway v2 Tools (HTTP/WebSocket APIs)
  {
    name: "apigatewayv2_list_apis",
    description: "List all HTTP/WebSocket APIs in API Gateway v2",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
    },
  },
  {
    name: "apigatewayv2_create_api",
    description: "Create a new HTTP/WebSocket API",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the API" },
        protocolType: {
          type: "string",
          enum: ["HTTP", "WEBSOCKET"],
          description: "Protocol type",
        },
        description: { type: "string", description: "Description of the API" },
        version: { type: "string", description: "Version of the API" },
      },
      required: ["name", "protocolType"],
    },
  },
  {
    name: "apigatewayv2_get_routes",
    description: "Get all routes for an HTTP/WebSocket API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
      },
      required: ["apiId"],
    },
  },
  {
    name: "apigatewayv2_create_route",
    description: "Create a new route in an HTTP/WebSocket API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
        routeKey: {
          type: "string",
          description: "Route key (e.g., 'GET /users')",
        },
        target: { type: "string", description: "Route target" },
        authorizationType: {
          type: "string",
          description: "Authorization type",
        },
      },
      required: ["apiId", "routeKey"],
    },
  },
  {
    name: "apigatewayv2_get_integrations",
    description: "Get all integrations for an HTTP/WebSocket API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
      },
      required: ["apiId"],
    },
  },
  {
    name: "apigatewayv2_create_integration",
    description: "Create a new integration for an HTTP/WebSocket API",
    inputSchema: {
      type: "object",
      properties: {
        apiId: { type: "string", description: "ID of the API" },
        integrationType: { type: "string", description: "Integration type" },
        integrationUri: { type: "string", description: "Integration URI" },
        integrationMethod: {
          type: "string",
          description: "Integration HTTP method",
        },
      },
      required: ["apiId", "integrationType"],
    },
  },
];
