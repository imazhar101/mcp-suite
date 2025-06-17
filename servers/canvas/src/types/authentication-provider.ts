export interface AuthenticationProvider {
  id: number;
  auth_type: string;
  position: number;
  identifier_format?: string;
  log_out_url?: string;
  log_in_url?: string;
  certificate_fingerprint?: string;
  requested_authn_context?: string;
  auth_host?: string;
  auth_filter?: string;
  auth_over_tls?: string | boolean;
  auth_base?: string;
  auth_username?: string;
  auth_port?: number;
  idp_entity_id?: string;
  login_attribute?: string;
  sig_alg?: string;
  jit_provisioning?: boolean;
  federated_attributes?: FederatedAttributesConfig;
  mfa_required?: boolean;
}

export interface SSOSettings {
  login_handle_name?: string;
  change_password_url?: string;
  auth_discovery_url?: string;
  unknown_user_url?: string;
}

export interface FederatedAttributesConfig {
  admin_roles?: FederatedAttributeConfig | string;
  display_name?: FederatedAttributeConfig | string;
  email?: FederatedAttributeConfig | string;
  given_name?: FederatedAttributeConfig | string;
  integration_id?: FederatedAttributeConfig | string;
  locale?: FederatedAttributeConfig | string;
  name?: FederatedAttributeConfig | string;
  sis_user_id?: FederatedAttributeConfig | string;
  sortable_name?: FederatedAttributeConfig | string;
  surname?: FederatedAttributeConfig | string;
  timezone?: FederatedAttributeConfig | string;
}

export interface FederatedAttributeConfig {
  attribute: string;
  provisioning_only?: boolean;
  autoconfirm?: boolean;
}

export interface ListAuthenticationProvidersParams {
  account_id: string;
}

export interface GetAuthenticationProviderParams {
  account_id: string;
  id: string;
}

export interface CreateAuthenticationProviderParams {
  account_id: string;
  auth_type: string;
  position?: number;
  jit_provisioning?: boolean;
  mfa_required?: boolean;

  // Apple specific
  client_id?: string;
  login_attribute?: string;
  federated_attributes?: FederatedAttributesConfig;

  // Canvas specific
  self_registration?: string;

  // CAS specific
  auth_base?: string;
  log_in_url?: string;

  // Clever specific
  client_secret?: string;
  district_id?: string;

  // Facebook specific
  app_id?: string;
  app_secret?: string;

  // GitHub specific
  domain?: string;

  // Google specific
  hosted_domain?: string;

  // LDAP specific
  auth_host?: string;
  auth_port?: number;
  auth_over_tls?: string | boolean;
  auth_filter?: string;
  identifier_format?: string;
  auth_username?: string;
  auth_password?: string;

  // LinkedIn specific
  // Uses client_id and client_secret

  // Microsoft specific
  application_id?: string;
  application_secret?: string;
  tenant?: string;

  // OpenID Connect specific
  authorize_url?: string;
  token_url?: string;
  scope?: string;
  end_session_endpoint?: string;
  userinfo_endpoint?: string;

  // SAML specific
  metadata?: string;
  metadata_uri?: string;
  idp_entity_id?: string;
  log_out_url?: string;
  certificate_fingerprint?: string;
  requested_authn_context?: string;
  sig_alg?: string;
}

export interface UpdateAuthenticationProviderParams
  extends CreateAuthenticationProviderParams {
  id: string;
}

export interface DeleteAuthenticationProviderParams {
  account_id: string;
  id: string;
}

export interface RestoreAuthenticationProviderParams {
  account_id: string;
  id: string;
}

export interface GetSSOSettingsParams {
  account_id: string;
}

export interface UpdateSSOSettingsParams {
  account_id: string;
  sso_settings: Partial<SSOSettings>;
}
