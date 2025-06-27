export interface DynamoDBTableInfo {
  tableName: string;
  keySchema: {
    attributeName: string;
    keyType: "HASH" | "RANGE";
  }[];
  attributeDefinitions: {
    attributeName: string;
    attributeType: "S" | "N" | "B";
  }[];
}

export interface DynamoDBItem {
  [key: string]: any;
}

export interface DynamoDBQueryParams {
  tableName: string;
  keyConditionExpression?: string;
  filterExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  expressionAttributeValues?: Record<string, any>;
  limit?: number;
  indexName?: string;
}

export interface DynamoDBScanParams {
  tableName: string;
  filterExpression?: string;
  expressionAttributeNames?: Record<string, string>;
  expressionAttributeValues?: Record<string, any>;
  limit?: number;
}

export interface LambdaFunctionInfo {
  functionName: string;
  runtime: string;
  handler: string;
  description?: string;
  timeout?: number;
  memorySize?: number;
}

export interface LambdaInvokeParams {
  functionName: string;
  payload?: any;
  invocationType?: "Event" | "RequestResponse" | "DryRun";
}

export interface APIGatewayRestAPI {
  id: string;
  name: string;
  description?: string;
  version?: string;
  createdDate?: Date;
}

export interface APIGatewayResource {
  id: string;
  parentId?: string;
  pathPart: string;
  path: string;
  resourceMethods?: string[];
}

export interface APIGatewayMethod {
  httpMethod: string;
  resourceId: string;
  authorizationType?: string;
  apiKeyRequired?: boolean;
}

export interface APIGatewayDeployment {
  id: string;
  description?: string;
  createdDate?: Date;
  stageName?: string;
}
