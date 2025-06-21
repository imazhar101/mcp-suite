import {
  LambdaClient,
  ListFunctionsCommand,
  GetFunctionCommand,
  CreateFunctionCommand,
  DeleteFunctionCommand,
  UpdateFunctionCodeCommand,
  UpdateFunctionConfigurationCommand,
  InvokeCommand,
  ListLayersCommand,
  PublishVersionCommand,
  CreateAliasCommand,
  ListAliasesCommand,
  GetAccountSettingsCommand,
} from "@aws-sdk/client-lambda";
import { LambdaFunctionInfo, LambdaInvokeParams } from "../types/index.js";

export class LambdaService {
  private client: LambdaClient;

  constructor(region: string = "us-east-1") {
    this.client = new LambdaClient({ region });
  }

  async listFunctions(): Promise<LambdaFunctionInfo[]> {
    const command = new ListFunctionsCommand({});
    const response = await this.client.send(command);
    
    return response.Functions?.map((func: any) => ({
      functionName: func.FunctionName!,
      runtime: func.Runtime!,
      handler: func.Handler!,
      description: func.Description,
      timeout: func.Timeout,
      memorySize: func.MemorySize,
    })) || [];
  }

  async getFunction(functionName: string): Promise<LambdaFunctionInfo> {
    const command = new GetFunctionCommand({ FunctionName: functionName });
    const response = await this.client.send(command);
    
    if (!response.Configuration) {
      throw new Error(`Function ${functionName} not found`);
    }

    return {
      functionName: response.Configuration.FunctionName!,
      runtime: response.Configuration.Runtime!,
      handler: response.Configuration.Handler!,
      description: response.Configuration.Description,
      timeout: response.Configuration.Timeout,
      memorySize: response.Configuration.MemorySize,
    };
  }

  async createFunction(
    functionName: string,
    runtime: string,
    handler: string,
    roleArn: string,
    zipFile: Uint8Array,
    description?: string,
    timeout?: number,
    memorySize?: number,
    environment?: Record<string, string>
  ): Promise<void> {
    const command = new CreateFunctionCommand({
      FunctionName: functionName,
      Runtime: runtime as any,
      Handler: handler,
      Role: roleArn,
      Code: { ZipFile: zipFile },
      Description: description,
      Timeout: timeout,
      MemorySize: memorySize,
      Environment: environment ? { Variables: environment } : undefined,
    });

    await this.client.send(command);
  }

  async deleteFunction(functionName: string): Promise<void> {
    const command = new DeleteFunctionCommand({ FunctionName: functionName });
    await this.client.send(command);
  }

  async updateFunctionCode(
    functionName: string,
    zipFile?: Uint8Array,
    s3Bucket?: string,
    s3Key?: string
  ): Promise<void> {
    const command = new UpdateFunctionCodeCommand({
      FunctionName: functionName,
      ...(zipFile && { ZipFile: zipFile }),
      ...(s3Bucket && s3Key && { S3Bucket: s3Bucket, S3Key: s3Key }),
    });

    await this.client.send(command);
  }

  async updateFunctionConfiguration(
    functionName: string,
    options: {
      description?: string;
      timeout?: number;
      memorySize?: number;
      environment?: Record<string, string>;
      handler?: string;
      runtime?: string;
    }
  ): Promise<void> {
    const command = new UpdateFunctionConfigurationCommand({
      FunctionName: functionName,
      Description: options.description,
      Timeout: options.timeout,
      MemorySize: options.memorySize,
      Environment: options.environment ? { Variables: options.environment } : undefined,
      Handler: options.handler,
      Runtime: options.runtime as any,
    });

    await this.client.send(command);
  }

  async invokeFunction(params: LambdaInvokeParams): Promise<any> {
    const command = new InvokeCommand({
      FunctionName: params.functionName,
      Payload: params.payload ? new TextEncoder().encode(JSON.stringify(params.payload)) : undefined,
      InvocationType: params.invocationType || "RequestResponse",
    });

    const response = await this.client.send(command);
    
    if (response.Payload) {
      const payloadString = new TextDecoder().decode(response.Payload);
      try {
        return JSON.parse(payloadString);
      } catch {
        return payloadString;
      }
    }
    
    return null;
  }

  async listLayers(): Promise<any[]> {
    const command = new ListLayersCommand({});
    const response = await this.client.send(command);
    return response.Layers || [];
  }

  async publishVersion(functionName: string, description?: string): Promise<any> {
    const command = new PublishVersionCommand({
      FunctionName: functionName,
      Description: description,
    });
    
    return await this.client.send(command);
  }

  async createAlias(
    functionName: string,
    aliasName: string,
    functionVersion: string,
    description?: string
  ): Promise<any> {
    const command = new CreateAliasCommand({
      FunctionName: functionName,
      Name: aliasName,
      FunctionVersion: functionVersion,
      Description: description,
    });
    
    return await this.client.send(command);
  }

  async listAliases(functionName: string): Promise<any[]> {
    const command = new ListAliasesCommand({ FunctionName: functionName });
    const response = await this.client.send(command);
    return response.Aliases || [];
  }

  async getAccountSettings(): Promise<any> {
    const command = new GetAccountSettingsCommand({});
    return await this.client.send(command);
  }
}