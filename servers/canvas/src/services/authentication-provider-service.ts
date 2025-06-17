import { AxiosInstance } from "axios";
import {
  AuthenticationProvider,
  SSOSettings,
  ListAuthenticationProvidersParams,
  GetAuthenticationProviderParams,
  CreateAuthenticationProviderParams,
  UpdateAuthenticationProviderParams,
  DeleteAuthenticationProviderParams,
  RestoreAuthenticationProviderParams,
  GetSSOSettingsParams,
  UpdateSSOSettingsParams,
} from "../types/authentication-provider.js";

export class AuthenticationProviderService {
  constructor(private canvasClient: AxiosInstance) {}

  async listAuthenticationProviders(
    params: ListAuthenticationProvidersParams
  ): Promise<AuthenticationProvider[]> {
    const response = await this.canvasClient.get(
      `/accounts/${params.account_id}/authentication_providers`
    );
    return response.data;
  }

  async getAuthenticationProvider(
    params: GetAuthenticationProviderParams
  ): Promise<AuthenticationProvider> {
    const response = await this.canvasClient.get(
      `/accounts/${params.account_id}/authentication_providers/${params.id}`
    );
    return response.data;
  }

  async createAuthenticationProvider(
    params: CreateAuthenticationProviderParams
  ): Promise<AuthenticationProvider> {
    const { account_id, ...providerData } = params;

    const response = await this.canvasClient.post(
      `/accounts/${account_id}/authentication_providers`,
      providerData
    );
    return response.data;
  }

  async updateAuthenticationProvider(
    params: UpdateAuthenticationProviderParams
  ): Promise<AuthenticationProvider> {
    const { account_id, id, ...updateData } = params;

    const response = await this.canvasClient.put(
      `/accounts/${account_id}/authentication_providers/${id}`,
      updateData
    );
    return response.data;
  }

  async deleteAuthenticationProvider(
    params: DeleteAuthenticationProviderParams
  ): Promise<void> {
    await this.canvasClient.delete(
      `/accounts/${params.account_id}/authentication_providers/${params.id}`
    );
  }

  async restoreAuthenticationProvider(
    params: RestoreAuthenticationProviderParams
  ): Promise<AuthenticationProvider> {
    const response = await this.canvasClient.put(
      `/accounts/${params.account_id}/authentication_providers/${params.id}/restore`
    );
    return response.data;
  }

  async getSSOSettings(params: GetSSOSettingsParams): Promise<SSOSettings> {
    const response = await this.canvasClient.get(
      `/accounts/${params.account_id}/sso_settings`
    );
    return response.data;
  }

  async updateSSOSettings(
    params: UpdateSSOSettingsParams
  ): Promise<SSOSettings> {
    const response = await this.canvasClient.put(
      `/accounts/${params.account_id}/sso_settings`,
      params.sso_settings
    );
    return response.data;
  }
}
