import { AxiosInstance } from "axios";
import {
  Admin,
  AdminCreateParams,
  AdminRemoveParams,
  AdminListParams,
  AdminSelfRolesParams,
} from "../types/admin.js";

export class AdminService {
  constructor(private canvasClient: AxiosInstance) {}

  async createAdmin(params: AdminCreateParams): Promise<Admin> {
    const { account_id, ...adminData } = params;

    const response = await this.canvasClient.post(
      `/accounts/${account_id}/admins`,
      adminData
    );
    return response.data;
  }

  async removeAdmin(params: AdminRemoveParams): Promise<Admin> {
    const { account_id, user_id, ...queryParams } = params;

    const response = await this.canvasClient.delete(
      `/accounts/${account_id}/admins/${user_id}`,
      {
        params: queryParams,
      }
    );
    return response.data;
  }

  async listAdmins(params: AdminListParams): Promise<Admin[]> {
    const { account_id, ...queryParams } = params;

    // Convert array parameters to Canvas API format
    const apiParams: any = {};
    if (queryParams.user_id) {
      apiParams["user_id[]"] = queryParams.user_id;
    }

    const response = await this.canvasClient.get(
      `/accounts/${account_id}/admins`,
      {
        params: apiParams,
      }
    );
    return response.data;
  }

  async listSelfAdminRoles(params: AdminSelfRolesParams): Promise<Admin[]> {
    const { account_id } = params;

    const response = await this.canvasClient.get(
      `/accounts/${account_id}/admins/self`
    );
    return response.data;
  }
}
