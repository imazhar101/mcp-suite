export interface Login {
  id: number;
  user_id: number;
  account_id: number;
  unique_id: string;
  sis_user_id?: string;
  integration_id?: string;
  authentication_provider_id?: number;
  authentication_provider_type?: string;
  workflow_state: "active" | "suspended";
  declared_user_type?:
    | "administrative"
    | "observer"
    | "staff"
    | "student"
    | "student_other"
    | "teacher";
  created_at?: string;
}

export interface ListLoginsParams {
  account_id?: string;
  user_id?: string;
}

export interface CreateLoginParams {
  account_id: string;
  user: {
    id?: string;
    existing_user_id?: string;
    existing_integration_id?: string;
    existing_sis_user_id?: string;
    trusted_account?: string;
  };
  login: {
    unique_id: string;
    password?: string;
    sis_user_id?: string;
    integration_id?: string;
    authentication_provider_id?: string;
    declared_user_type?:
      | "administrative"
      | "observer"
      | "staff"
      | "student"
      | "student_other"
      | "teacher";
  };
}

export interface UpdateLoginParams {
  account_id: string;
  id: string;
  login: {
    unique_id?: string;
    password?: string;
    old_password?: string;
    sis_user_id?: string;
    integration_id?: string;
    authentication_provider_id?: string;
    workflow_state?: "active" | "suspended";
    declared_user_type?:
      | "administrative"
      | "observer"
      | "staff"
      | "student"
      | "student_other"
      | "teacher";
  };
  override_sis_stickiness?: boolean;
}

export interface DeleteLoginParams {
  user_id: string;
  id: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ForgotPasswordResponse {
  requested: boolean;
}
