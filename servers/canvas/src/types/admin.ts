export interface Admin {
  id: number;
  role: string;
  user: any; // User object from Users API
  workflow_state: string;
}

export interface AdminCreateParams {
  account_id: string;
  user_id: number;
  role?: string;
  role_id?: number;
  send_confirmation?: boolean;
}

export interface AdminRemoveParams {
  account_id: string;
  user_id: string;
  role?: string;
  role_id: number;
}

export interface AdminListParams {
  account_id: string;
  user_id?: number[];
}

export interface AdminSelfRolesParams {
  account_id: string;
}
