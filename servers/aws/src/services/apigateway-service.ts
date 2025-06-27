import {
  APIGatewayClient,
  GetRestApisCommand,
  GetRestApiCommand,
  CreateRestApiCommand,
  DeleteRestApiCommand,
  GetResourcesCommand,
  CreateResourceCommand,
  DeleteResourceCommand,
  PutMethodCommand,
  DeleteMethodCommand,
  GetMethodCommand,
  PutIntegrationCommand,
  DeleteIntegrationCommand,
  CreateDeploymentCommand,
  GetDeploymentsCommand,
  GetStagesCommand,
  CreateStageCommand,
  DeleteStageCommand,
  GetUsagePlansCommand,
  CreateUsagePlanCommand,
  GetApiKeysCommand,
  CreateApiKeyCommand,
} from "@aws-sdk/client-api-gateway";
import {
  ApiGatewayV2Client,
  GetApisCommand,
  CreateApiCommand,
  DeleteApiCommand,
  GetRoutesCommand,
  CreateRouteCommand,
  DeleteRouteCommand,
  GetIntegrationsCommand,
  CreateIntegrationCommand,
  DeleteIntegrationCommand as DeleteIntegrationV2Command,
  GetStagesCommand as GetStagesV2Command,
  CreateStageCommand as CreateStageV2Command,
  DeleteStageCommand as DeleteStageV2Command,
} from "@aws-sdk/client-apigatewayv2";
import {
  APIGatewayRestAPI,
  APIGatewayResource,
  APIGatewayMethod,
  APIGatewayDeployment,
} from "../types/index.js";

export class APIGatewayService {
  private restClient: APIGatewayClient;
  private v2Client: ApiGatewayV2Client;

  constructor(region: string = "us-east-1") {
    this.restClient = new APIGatewayClient({ region });
    this.v2Client = new ApiGatewayV2Client({ region });
  }

  // REST API v1 Methods
  async listRestApis(): Promise<APIGatewayRestAPI[]> {
    const command = new GetRestApisCommand({});
    const response = await this.restClient.send(command);

    return (
      response.items?.map((api: any) => ({
        id: api.id!,
        name: api.name!,
        description: api.description,
        version: api.version,
        createdDate: api.createdDate,
      })) || []
    );
  }

  async getRestApi(apiId: string): Promise<APIGatewayRestAPI> {
    const command = new GetRestApiCommand({ restApiId: apiId });
    const response = await this.restClient.send(command);

    return {
      id: response.id!,
      name: response.name!,
      description: response.description,
      version: response.version,
      createdDate: response.createdDate,
    };
  }

  async createRestApi(
    name: string,
    description?: string,
    version?: string,
    endpointConfiguration?: any
  ): Promise<APIGatewayRestAPI> {
    const command = new CreateRestApiCommand({
      name,
      description,
      version,
      endpointConfiguration,
    });

    const response = await this.restClient.send(command);

    return {
      id: response.id!,
      name: response.name!,
      description: response.description,
      version: response.version,
      createdDate: response.createdDate,
    };
  }

  async deleteRestApi(apiId: string): Promise<void> {
    const command = new DeleteRestApiCommand({ restApiId: apiId });
    await this.restClient.send(command);
  }

  async getResources(apiId: string): Promise<APIGatewayResource[]> {
    const command = new GetResourcesCommand({ restApiId: apiId });
    const response = await this.restClient.send(command);

    return (
      response.items?.map((resource: any) => ({
        id: resource.id!,
        parentId: resource.parentId,
        pathPart: resource.pathPart!,
        path: resource.path!,
        resourceMethods: resource.resourceMethods
          ? Object.keys(resource.resourceMethods)
          : undefined,
      })) || []
    );
  }

  async createResource(
    apiId: string,
    parentId: string,
    pathPart: string
  ): Promise<APIGatewayResource> {
    const command = new CreateResourceCommand({
      restApiId: apiId,
      parentId,
      pathPart,
    });

    const response = await this.restClient.send(command);

    return {
      id: response.id!,
      parentId: response.parentId,
      pathPart: response.pathPart!,
      path: response.path!,
    };
  }

  async deleteResource(apiId: string, resourceId: string): Promise<void> {
    const command = new DeleteResourceCommand({
      restApiId: apiId,
      resourceId,
    });
    await this.restClient.send(command);
  }

  async putMethod(
    apiId: string,
    resourceId: string,
    httpMethod: string,
    authorizationType: string = "NONE",
    options?: {
      apiKeyRequired?: boolean;
      requestParameters?: Record<string, boolean>;
      requestModels?: Record<string, string>;
    }
  ): Promise<APIGatewayMethod> {
    const command = new PutMethodCommand({
      restApiId: apiId,
      resourceId,
      httpMethod,
      authorizationType,
      apiKeyRequired: options?.apiKeyRequired,
      requestParameters: options?.requestParameters,
      requestModels: options?.requestModels,
    });

    const response = await this.restClient.send(command);

    return {
      httpMethod: response.httpMethod!,
      resourceId,
      authorizationType: response.authorizationType,
      apiKeyRequired: response.apiKeyRequired,
    };
  }

  async deleteMethod(
    apiId: string,
    resourceId: string,
    httpMethod: string
  ): Promise<void> {
    const command = new DeleteMethodCommand({
      restApiId: apiId,
      resourceId,
      httpMethod,
    });
    await this.restClient.send(command);
  }

  async getMethod(
    apiId: string,
    resourceId: string,
    httpMethod: string
  ): Promise<APIGatewayMethod> {
    const command = new GetMethodCommand({
      restApiId: apiId,
      resourceId,
      httpMethod,
    });

    const response = await this.restClient.send(command);

    return {
      httpMethod: response.httpMethod!,
      resourceId,
      authorizationType: response.authorizationType,
      apiKeyRequired: response.apiKeyRequired,
    };
  }

  async putIntegration(
    apiId: string,
    resourceId: string,
    httpMethod: string,
    type: string,
    uri?: string,
    integrationHttpMethod?: string,
    credentials?: string
  ): Promise<any> {
    const command = new PutIntegrationCommand({
      restApiId: apiId,
      resourceId,
      httpMethod,
      type: type as any,
      uri,
      integrationHttpMethod,
      credentials,
    });

    return await this.restClient.send(command);
  }

  async deleteIntegration(
    apiId: string,
    resourceId: string,
    httpMethod: string
  ): Promise<void> {
    const command = new DeleteIntegrationCommand({
      restApiId: apiId,
      resourceId,
      httpMethod,
    });
    await this.restClient.send(command);
  }

  async createDeployment(
    apiId: string,
    stageName: string,
    description?: string
  ): Promise<APIGatewayDeployment> {
    const command = new CreateDeploymentCommand({
      restApiId: apiId,
      stageName,
      description,
    });

    const response = await this.restClient.send(command);

    return {
      id: response.id!,
      description: response.description,
      createdDate: response.createdDate,
      stageName,
    };
  }

  async getDeployments(apiId: string): Promise<APIGatewayDeployment[]> {
    const command = new GetDeploymentsCommand({ restApiId: apiId });
    const response = await this.restClient.send(command);

    return (
      response.items?.map((deployment: any) => ({
        id: deployment.id!,
        description: deployment.description,
        createdDate: deployment.createdDate,
      })) || []
    );
  }

  async getStages(apiId: string): Promise<any[]> {
    const command = new GetStagesCommand({ restApiId: apiId });
    const response = await this.restClient.send(command);
    return response.item || [];
  }

  async createStage(
    apiId: string,
    stageName: string,
    deploymentId: string,
    description?: string
  ): Promise<any> {
    const command = new CreateStageCommand({
      restApiId: apiId,
      stageName,
      deploymentId,
      description,
    });

    return await this.restClient.send(command);
  }

  async deleteStage(apiId: string, stageName: string): Promise<void> {
    const command = new DeleteStageCommand({
      restApiId: apiId,
      stageName,
    });
    await this.restClient.send(command);
  }

  async getUsagePlans(): Promise<any[]> {
    const command = new GetUsagePlansCommand({});
    const response = await this.restClient.send(command);
    return response.items || [];
  }

  async createUsagePlan(
    name: string,
    description?: string,
    throttle?: { rateLimit?: number; burstLimit?: number },
    quota?: { limit?: number; period?: "DAY" | "WEEK" | "MONTH" }
  ): Promise<any> {
    const command = new CreateUsagePlanCommand({
      name,
      description,
      throttle,
      quota: quota
        ? {
            limit: quota.limit,
            period: quota.period as any,
          }
        : undefined,
    });

    return await this.restClient.send(command);
  }

  async getApiKeys(): Promise<any[]> {
    const command = new GetApiKeysCommand({});
    const response = await this.restClient.send(command);
    return response.items || [];
  }

  async createApiKey(
    name: string,
    description?: string,
    enabled?: boolean
  ): Promise<any> {
    const command = new CreateApiKeyCommand({
      name,
      description,
      enabled,
    });

    return await this.restClient.send(command);
  }

  // API Gateway v2 Methods (HTTP APIs, WebSocket APIs)
  async listV2Apis(): Promise<any[]> {
    const command = new GetApisCommand({});
    const response = await this.v2Client.send(command);
    return response.Items || [];
  }

  async createV2Api(
    name: string,
    protocolType: "HTTP" | "WEBSOCKET",
    description?: string,
    version?: string,
    routeSelectionExpression?: string
  ): Promise<any> {
    const command = new CreateApiCommand({
      Name: name,
      ProtocolType: protocolType,
      Description: description,
      Version: version,
      RouteSelectionExpression: routeSelectionExpression,
    });

    return await this.v2Client.send(command);
  }

  async deleteV2Api(apiId: string): Promise<void> {
    const command = new DeleteApiCommand({ ApiId: apiId });
    await this.v2Client.send(command);
  }

  async getV2Routes(apiId: string): Promise<any[]> {
    const command = new GetRoutesCommand({ ApiId: apiId });
    const response = await this.v2Client.send(command);
    return response.Items || [];
  }

  async createV2Route(
    apiId: string,
    routeKey: string,
    target?: string,
    authorizationType?: "NONE" | "AWS_IAM" | "CUSTOM" | "JWT"
  ): Promise<any> {
    const command = new CreateRouteCommand({
      ApiId: apiId,
      RouteKey: routeKey,
      Target: target,
      AuthorizationType: authorizationType as any,
    });

    return await this.v2Client.send(command);
  }

  async deleteV2Route(apiId: string, routeId: string): Promise<void> {
    const command = new DeleteRouteCommand({
      ApiId: apiId,
      RouteId: routeId,
    });
    await this.v2Client.send(command);
  }

  async getV2Integrations(apiId: string): Promise<any[]> {
    const command = new GetIntegrationsCommand({ ApiId: apiId });
    const response = await this.v2Client.send(command);
    return response.Items || [];
  }

  async createV2Integration(
    apiId: string,
    integrationType: string,
    integrationUri?: string,
    integrationMethod?: string
  ): Promise<any> {
    const command = new CreateIntegrationCommand({
      ApiId: apiId,
      IntegrationType: integrationType as any,
      IntegrationUri: integrationUri,
      IntegrationMethod: integrationMethod,
    });

    return await this.v2Client.send(command);
  }

  async deleteV2Integration(
    apiId: string,
    integrationId: string
  ): Promise<void> {
    const command = new DeleteIntegrationV2Command({
      ApiId: apiId,
      IntegrationId: integrationId,
    });
    await this.v2Client.send(command);
  }

  async getV2Stages(apiId: string): Promise<any[]> {
    const command = new GetStagesV2Command({ ApiId: apiId });
    const response = await this.v2Client.send(command);
    return response.Items || [];
  }

  async createV2Stage(
    apiId: string,
    stageName: string,
    description?: string,
    deploymentId?: string
  ): Promise<any> {
    const command = new CreateStageV2Command({
      ApiId: apiId,
      StageName: stageName,
      Description: description,
      DeploymentId: deploymentId,
    });

    return await this.v2Client.send(command);
  }

  async deleteV2Stage(apiId: string, stageName: string): Promise<void> {
    const command = new DeleteStageV2Command({
      ApiId: apiId,
      StageName: stageName,
    });
    await this.v2Client.send(command);
  }
}
