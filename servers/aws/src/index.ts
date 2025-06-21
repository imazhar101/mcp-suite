#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { DynamoDBService } from "./services/dynamodb-service.js";
import { LambdaService } from "./services/lambda-service.js";
import { APIGatewayService } from "./services/apigateway-service.js";
import { tools } from "./tools/index.js";

class AWSServer {
  private server: Server;
  private dynamoDBService: DynamoDBService | undefined;
  private lambdaService: LambdaService | undefined;
  private apiGatewayService: APIGatewayService | undefined;

  constructor() {
    this.server = new Server(
      {
        name: "aws-server",
        version: "1.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers(): void {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      if (
        !this.dynamoDBService ||
        !this.lambdaService ||
        !this.apiGatewayService
      ) {
        throw new Error(
          "AWS services not initialized. Please check your AWS credentials."
        );
      }

      try {
        return await this.handleToolCall(name, args || {});
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        throw new Error(`Error executing ${name}: ${errorMessage}`);
      }
    });
  }

  private async handleToolCall(name: string, args: any) {
    if (
      !this.dynamoDBService ||
      !this.lambdaService ||
      !this.apiGatewayService
    ) {
      throw new Error("AWS services not initialized");
    }

    const dynamoDBService = this.dynamoDBService;
    const lambdaService = this.lambdaService;
    const apiGatewayService = this.apiGatewayService;

    switch (name) {
      // DynamoDB tools
      case "dynamodb_list_tables":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(await dynamoDBService.listTables(), null, 2),
            },
          ],
        };

      case "dynamodb_describe_table":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await dynamoDBService.describeTable(args.tableName),
                null,
                2
              ),
            },
          ],
        };

      case "dynamodb_put_item":
        await dynamoDBService.putItem(args.tableName, args.item);
        return {
          content: [
            {
              type: "text",
              text: "Item successfully inserted",
            },
          ],
        };

      case "dynamodb_get_item":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await dynamoDBService.getItem(args.tableName, args.key),
                null,
                2
              ),
            },
          ],
        };

      case "dynamodb_update_item":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await dynamoDBService.updateItem(
                  args.tableName,
                  args.key,
                  args.updateExpression,
                  args.expressionAttributeNames,
                  args.expressionAttributeValues
                ),
                null,
                2
              ),
            },
          ],
        };

      case "dynamodb_delete_item":
        await dynamoDBService.deleteItem(args.tableName, args.key);
        return {
          content: [
            {
              type: "text",
              text: "Item successfully deleted",
            },
          ],
        };

      case "dynamodb_query":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await dynamoDBService.query({
                  tableName: args.tableName,
                  keyConditionExpression: args.keyConditionExpression,
                  filterExpression: args.filterExpression,
                  expressionAttributeNames: args.expressionAttributeNames,
                  expressionAttributeValues: args.expressionAttributeValues,
                  limit: args.limit,
                  indexName: args.indexName,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "dynamodb_scan":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await dynamoDBService.scan({
                  tableName: args.tableName,
                  filterExpression: args.filterExpression,
                  expressionAttributeNames: args.expressionAttributeNames,
                  expressionAttributeValues: args.expressionAttributeValues,
                  limit: args.limit,
                }),
                null,
                2
              ),
            },
          ],
        };

      // Lambda tools
      case "lambda_list_functions":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await lambdaService.listFunctions(),
                null,
                2
              ),
            },
          ],
        };

      case "lambda_get_function":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await lambdaService.getFunction(args.functionName),
                null,
                2
              ),
            },
          ],
        };

      case "lambda_invoke_function":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await lambdaService.invokeFunction({
                  functionName: args.functionName,
                  payload: args.payload,
                  invocationType: args.invocationType,
                }),
                null,
                2
              ),
            },
          ],
        };

      case "lambda_update_function_code":
        await lambdaService.updateFunctionCode(
          args.functionName,
          undefined,
          args.s3Bucket,
          args.s3Key
        );
        return {
          content: [
            {
              type: "text",
              text: "Function code updated successfully",
            },
          ],
        };

      case "lambda_create_function":
        const zipFileBuffer = Buffer.from(args.zipFile, "base64");
        await lambdaService.createFunction(
          args.functionName,
          args.runtime,
          args.handler,
          args.roleArn,
          new Uint8Array(zipFileBuffer),
          args.description,
          args.timeout,
          args.memorySize,
          args.environment
        );
        return {
          content: [
            {
              type: "text",
              text: "Function created successfully",
            },
          ],
        };

      case "lambda_update_function_configuration":
        await lambdaService.updateFunctionConfiguration(args.functionName, {
          description: args.description,
          timeout: args.timeout,
          memorySize: args.memorySize,
          environment: args.environment,
          handler: args.handler,
          runtime: args.runtime,
        });
        return {
          content: [
            {
              type: "text",
              text: "Function configuration updated successfully",
            },
          ],
        };

      // API Gateway REST API tools
      case "apigateway_list_rest_apis":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.listRestApis(),
                null,
                2
              ),
            },
          ],
        };

      case "apigateway_get_rest_api":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.getRestApi(args.apiId),
                null,
                2
              ),
            },
          ],
        };

      case "apigateway_create_rest_api":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.createRestApi(
                  args.name,
                  args.description,
                  args.version
                ),
                null,
                2
              ),
            },
          ],
        };

      case "apigateway_delete_rest_api":
        await apiGatewayService.deleteRestApi(args.apiId);
        return {
          content: [
            {
              type: "text",
              text: "REST API deleted successfully",
            },
          ],
        };

      case "apigateway_get_resources":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.getResources(args.apiId),
                null,
                2
              ),
            },
          ],
        };

      case "apigateway_create_resource":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.createResource(
                  args.apiId,
                  args.parentId,
                  args.pathPart
                ),
                null,
                2
              ),
            },
          ],
        };

      case "apigateway_put_method":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.putMethod(
                  args.apiId,
                  args.resourceId,
                  args.httpMethod,
                  args.authorizationType,
                  { apiKeyRequired: args.apiKeyRequired }
                ),
                null,
                2
              ),
            },
          ],
        };

      case "apigateway_put_integration":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.putIntegration(
                  args.apiId,
                  args.resourceId,
                  args.httpMethod,
                  args.type,
                  args.uri,
                  args.integrationHttpMethod
                ),
                null,
                2
              ),
            },
          ],
        };

      case "apigateway_create_deployment":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.createDeployment(
                  args.apiId,
                  args.stageName,
                  args.description
                ),
                null,
                2
              ),
            },
          ],
        };

      // API Gateway v2 tools
      case "apigatewayv2_list_apis":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.listV2Apis(),
                null,
                2
              ),
            },
          ],
        };

      case "apigatewayv2_create_api":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.createV2Api(
                  args.name,
                  args.protocolType,
                  args.description,
                  args.version
                ),
                null,
                2
              ),
            },
          ],
        };

      case "apigatewayv2_get_routes":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.getV2Routes(args.apiId),
                null,
                2
              ),
            },
          ],
        };

      case "apigatewayv2_create_route":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.createV2Route(
                  args.apiId,
                  args.routeKey,
                  args.target,
                  args.authorizationType
                ),
                null,
                2
              ),
            },
          ],
        };

      case "apigatewayv2_get_integrations":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.getV2Integrations(args.apiId),
                null,
                2
              ),
            },
          ],
        };

      case "apigatewayv2_create_integration":
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                await apiGatewayService.createV2Integration(
                  args.apiId,
                  args.integrationType,
                  args.integrationUri,
                  args.integrationMethod
                ),
                null,
                2
              ),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  }

  async run(): Promise<void> {
    const region = process.env.AWS_REGION || "us-east-1";

    this.dynamoDBService = new DynamoDBService(region);
    this.lambdaService = new LambdaService(region);
    this.apiGatewayService = new APIGatewayService(region);

    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("AWS MCP server running on stdio");
  }
}

const server = new AWSServer();
server.run().catch(console.error);
