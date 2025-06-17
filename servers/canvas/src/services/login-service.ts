import { AxiosInstance } from "axios";
import {
  Login,
  ListLoginsParams,
  CreateLoginParams,
  UpdateLoginParams,
  DeleteLoginParams,
  ForgotPasswordParams,
  ForgotPasswordResponse,
} from "../types/login.js";

export class LoginService {
  constructor(private canvasClient: AxiosInstance) {}

  async listLogins(params: ListLoginsParams): Promise<Login[]> {
    let endpoint: string;

    if (params.account_id) {
      endpoint = `/accounts/${params.account_id}/logins`;
    } else if (params.user_id) {
      endpoint = `/users/${params.user_id}/logins`;
    } else {
      throw new Error("Either account_id or user_id must be provided");
    }

    const response = await this.canvasClient.get(endpoint);
    return response.data;
  }

  async createLogin(params: CreateLoginParams): Promise<Login> {
    const { account_id, ...loginData } = params;

    const response = await this.canvasClient.post(
      `/accounts/${account_id}/logins`,
      loginData
    );
    return response.data;
  }

  async updateLogin(params: UpdateLoginParams): Promise<Login> {
    const { account_id, id, ...updateData } = params;

    const response = await this.canvasClient.put(
      `/accounts/${account_id}/logins/${id}`,
      updateData
    );
    return response.data;
  }

  async deleteLogin(params: DeleteLoginParams): Promise<Login> {
    const { user_id, id } = params;

    const response = await this.canvasClient.delete(
      `/users/${user_id}/logins/${id}`
    );
    return response.data;
  }

  async forgotPassword(
    params: ForgotPasswordParams
  ): Promise<ForgotPasswordResponse> {
    const response = await this.canvasClient.post(`/users/reset_password`, {
      email: params.email,
    });
    return response.data;
  }
}
