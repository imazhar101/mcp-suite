import {
  DynamoDBClient,
  ListTablesCommand,
  DescribeTableCommand,
  CreateTableCommand,
  DeleteTableCommand,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
  DeleteItemCommand,
  QueryCommand,
  ScanCommand,
  BatchGetItemCommand,
  BatchWriteItemCommand,
} from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import {
  DynamoDBTableInfo,
  DynamoDBItem,
  DynamoDBQueryParams,
  DynamoDBScanParams,
} from "../types/index.js";

export class DynamoDBService {
  private client: DynamoDBClient;

  constructor(region: string = "us-east-1") {
    this.client = new DynamoDBClient({ region });
  }

  async listTables(): Promise<string[]> {
    const command = new ListTablesCommand({});
    const response = await this.client.send(command);
    return response.TableNames || [];
  }

  async describeTable(tableName: string): Promise<DynamoDBTableInfo> {
    const command = new DescribeTableCommand({ TableName: tableName });
    const response = await this.client.send(command);
    
    if (!response.Table) {
      throw new Error(`Table ${tableName} not found`);
    }

    return {
      tableName: response.Table.TableName!,
      keySchema: response.Table.KeySchema?.map((key: any) => ({
        attributeName: key.AttributeName!,
        keyType: key.KeyType! as "HASH" | "RANGE",
      })) || [],
      attributeDefinitions: response.Table.AttributeDefinitions?.map((attr: any) => ({
        attributeName: attr.AttributeName!,
        attributeType: attr.AttributeType! as "S" | "N" | "B",
      })) || [],
    };
  }

  async createTable(
    tableName: string,
    keySchema: { attributeName: string; keyType: "HASH" | "RANGE" }[],
    attributeDefinitions: { attributeName: string; attributeType: "S" | "N" | "B" }[],
    billingMode: "PAY_PER_REQUEST" | "PROVISIONED" = "PAY_PER_REQUEST"
  ): Promise<void> {
    const command = new CreateTableCommand({
      TableName: tableName,
      KeySchema: keySchema.map(key => ({
        AttributeName: key.attributeName,
        KeyType: key.keyType,
      })),
      AttributeDefinitions: attributeDefinitions.map(attr => ({
        AttributeName: attr.attributeName,
        AttributeType: attr.attributeType,
      })),
      BillingMode: billingMode,
      ...(billingMode === "PROVISIONED" && {
        ProvisionedThroughput: {
          ReadCapacityUnits: 5,
          WriteCapacityUnits: 5,
        },
      }),
    });

    await this.client.send(command);
  }

  async deleteTable(tableName: string): Promise<void> {
    const command = new DeleteTableCommand({ TableName: tableName });
    await this.client.send(command);
  }

  async putItem(tableName: string, item: DynamoDBItem): Promise<void> {
    const command = new PutItemCommand({
      TableName: tableName,
      Item: marshall(item),
    });
    await this.client.send(command);
  }

  async getItem(tableName: string, key: DynamoDBItem): Promise<DynamoDBItem | null> {
    const command = new GetItemCommand({
      TableName: tableName,
      Key: marshall(key),
    });
    
    const response = await this.client.send(command);
    return response.Item ? unmarshall(response.Item) : null;
  }

  async updateItem(
    tableName: string,
    key: DynamoDBItem,
    updateExpression: string,
    expressionAttributeNames?: Record<string, string>,
    expressionAttributeValues?: Record<string, any>
  ): Promise<DynamoDBItem | null> {
    const command = new UpdateItemCommand({
      TableName: tableName,
      Key: marshall(key),
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues ? marshall(expressionAttributeValues) : undefined,
      ReturnValues: "ALL_NEW",
    });
    
    const response = await this.client.send(command);
    return response.Attributes ? unmarshall(response.Attributes) : null;
  }

  async deleteItem(tableName: string, key: DynamoDBItem): Promise<void> {
    const command = new DeleteItemCommand({
      TableName: tableName,
      Key: marshall(key),
    });
    await this.client.send(command);
  }

  async query(params: DynamoDBQueryParams): Promise<DynamoDBItem[]> {
    const command = new QueryCommand({
      TableName: params.tableName,
      KeyConditionExpression: params.keyConditionExpression,
      FilterExpression: params.filterExpression,
      ExpressionAttributeNames: params.expressionAttributeNames,
      ExpressionAttributeValues: params.expressionAttributeValues ? marshall(params.expressionAttributeValues) : undefined,
      Limit: params.limit,
      IndexName: params.indexName,
    });
    
    const response = await this.client.send(command);
    return response.Items?.map(item => unmarshall(item)) || [];
  }

  async scan(params: DynamoDBScanParams): Promise<DynamoDBItem[]> {
    const command = new ScanCommand({
      TableName: params.tableName,
      FilterExpression: params.filterExpression,
      ExpressionAttributeNames: params.expressionAttributeNames,
      ExpressionAttributeValues: params.expressionAttributeValues ? marshall(params.expressionAttributeValues) : undefined,
      Limit: params.limit,
    });
    
    const response = await this.client.send(command);
    return response.Items?.map(item => unmarshall(item)) || [];
  }

  async batchGetItems(
    requestItems: Record<string, { keys: DynamoDBItem[] }>
  ): Promise<Record<string, DynamoDBItem[]>> {
    const marshalledRequestItems: Record<string, any> = {};
    
    for (const [tableName, { keys }] of Object.entries(requestItems)) {
      marshalledRequestItems[tableName] = {
        Keys: keys.map(key => marshall(key)),
      };
    }

    const command = new BatchGetItemCommand({
      RequestItems: marshalledRequestItems,
    });
    
    const response = await this.client.send(command);
    const result: Record<string, DynamoDBItem[]> = {};
    
    if (response.Responses) {
      for (const [tableName, items] of Object.entries(response.Responses)) {
        result[tableName] = (items as any[]).map((item: any) => unmarshall(item));
      }
    }
    
    return result;
  }

  async batchWriteItems(
    requestItems: Record<string, { putRequests?: DynamoDBItem[]; deleteRequests?: DynamoDBItem[] }>
  ): Promise<void> {
    const marshalledRequestItems: Record<string, any> = {};
    
    for (const [tableName, { putRequests, deleteRequests }] of Object.entries(requestItems)) {
      const requests = [];
      
      if (putRequests) {
        requests.push(...putRequests.map(item => ({
          PutRequest: { Item: marshall(item) },
        })));
      }
      
      if (deleteRequests) {
        requests.push(...deleteRequests.map(key => ({
          DeleteRequest: { Key: marshall(key) },
        })));
      }
      
      marshalledRequestItems[tableName] = requests;
    }

    const command = new BatchWriteItemCommand({
      RequestItems: marshalledRequestItems,
    });
    
    await this.client.send(command);
  }
}