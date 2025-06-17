import { AuthenticationProviderService } from "../services/authentication-provider-service.js";

export class AuthenticationProviderTools {
  constructor(private authProviderService: AuthenticationProviderService) {}

  getToolDefinitions() {
    return [
      {
        name: "list_authentication_providers",
        description: "List authentication providers for an account",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
          },
          required: ["account_id"],
        },
      },
      {
        name: "get_authentication_provider",
        description: "Get details of a specific authentication provider",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            id: {
              type: "string",
              description: "Authentication provider ID",
            },
          },
          required: ["account_id", "id"],
        },
      },
      {
        name: "create_authentication_provider",
        description: "Create a new authentication provider",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            auth_type: {
              type: "string",
              enum: [
                "apple",
                "canvas",
                "cas",
                "clever",
                "facebook",
                "github",
                "google",
                "ldap",
                "linkedin",
                "microsoft",
                "openid_connect",
                "saml",
              ],
              description: "Authentication provider type",
            },
            position: {
              type: "number",
              description: "Position of the provider (1st position is default)",
            },
            jit_provisioning: {
              type: "boolean",
              description: "Enable Just In Time provisioning",
            },
            mfa_required: {
              type: "boolean",
              description: "Require multi-factor authentication",
            },
            // Apple specific
            client_id: {
              type: "string",
              description:
                "Client ID (Apple, Clever, Facebook, GitHub, Google, LinkedIn)",
            },
            login_attribute: {
              type: "string",
              description: "Attribute to use for login lookup",
            },
            // Canvas specific
            self_registration: {
              type: "string",
              enum: ["all", "none", "observer"],
              description: "Who can self-register (Canvas only)",
            },
            // CAS specific
            auth_base: {
              type: "string",
              description: "CAS server URL or LDAP base",
            },
            log_in_url: {
              type: "string",
              description: "SSO login URL",
            },
            // Provider secrets
            client_secret: {
              type: "string",
              description:
                "Client secret (Clever, Facebook, GitHub, Google, LinkedIn)",
            },
            app_id: {
              type: "string",
              description: "Facebook App ID",
            },
            app_secret: {
              type: "string",
              description: "Facebook App Secret",
            },
            application_id: {
              type: "string",
              description: "Microsoft Application ID",
            },
            application_secret: {
              type: "string",
              description: "Microsoft Application Secret",
            },
            // Additional parameters
            domain: {
              type: "string",
              description: "GitHub Enterprise domain",
            },
            hosted_domain: {
              type: "string",
              description: "Google Apps domain restriction",
            },
            district_id: {
              type: "string",
              description: "Clever district ID",
            },
            tenant: {
              type: "string",
              description: "Microsoft tenant",
            },
            // LDAP specific
            auth_host: {
              type: "string",
              description: "LDAP server URL",
            },
            auth_port: {
              type: "number",
              description: "LDAP server port",
            },
            auth_over_tls: {
              type: "string",
              enum: ["simple_tls", "start_tls"],
              description: "LDAP TLS configuration",
            },
            auth_filter: {
              type: "string",
              description: "LDAP search filter",
            },
            auth_username: {
              type: "string",
              description: "LDAP username",
            },
            auth_password: {
              type: "string",
              description: "LDAP password",
            },
            identifier_format: {
              type: "string",
              description: "LDAP or SAML identifier format",
            },
            // OpenID Connect specific
            authorize_url: {
              type: "string",
              description: "OAuth 2.0 authorization URL",
            },
            token_url: {
              type: "string",
              description: "OAuth 2.0 token URL",
            },
            scope: {
              type: "string",
              description: "Additional OAuth scopes",
            },
            end_session_endpoint: {
              type: "string",
              description: "Logout endpoint URL",
            },
            userinfo_endpoint: {
              type: "string",
              description: "UserInfo endpoint URL",
            },
            // SAML specific
            metadata: {
              type: "string",
              description: "SAML metadata XML",
            },
            metadata_uri: {
              type: "string",
              description: "SAML metadata URI",
            },
            idp_entity_id: {
              type: "string",
              description: "SAML IdP entity ID",
            },
            log_out_url: {
              type: "string",
              description: "SAML logout URL",
            },
            certificate_fingerprint: {
              type: "string",
              description: "SAML certificate fingerprint",
            },
            requested_authn_context: {
              type: "string",
              description: "SAML AuthnContext",
            },
            sig_alg: {
              type: "string",
              enum: [
                "http://www.w3.org/2000/09/xmldsig#rsa-sha1",
                "http://www.w3.org/2001/04/xmldsig-more#rsa-sha256",
                "RSA-SHA1",
                "RSA-SHA256",
              ],
              description: "SAML signature algorithm",
            },
          },
          required: ["account_id", "auth_type"],
        },
      },
      {
        name: "update_authentication_provider",
        description: "Update an existing authentication provider",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            id: {
              type: "string",
              description: "Authentication provider ID",
            },
            // Same properties as create, but all optional except account_id and id
            position: {
              type: "number",
              description: "Position of the provider",
            },
            jit_provisioning: {
              type: "boolean",
              description: "Enable Just In Time provisioning",
            },
            mfa_required: {
              type: "boolean",
              description: "Require multi-factor authentication",
            },
            login_attribute: {
              type: "string",
              description: "Attribute to use for login lookup",
            },
            log_in_url: {
              type: "string",
              description: "SSO login URL",
            },
            log_out_url: {
              type: "string",
              description: "SSO logout URL",
            },
            idp_entity_id: {
              type: "string",
              description: "SAML IdP entity ID",
            },
            certificate_fingerprint: {
              type: "string",
              description: "SAML certificate fingerprint",
            },
          },
          required: ["account_id", "id"],
        },
      },
      {
        name: "delete_authentication_provider",
        description: "Delete an authentication provider",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            id: {
              type: "string",
              description: "Authentication provider ID",
            },
          },
          required: ["account_id", "id"],
        },
      },
      {
        name: "restore_authentication_provider",
        description: "Restore a deleted authentication provider",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            id: {
              type: "string",
              description: "Authentication provider ID",
            },
          },
          required: ["account_id", "id"],
        },
      },
      {
        name: "get_sso_settings",
        description: "Get account SSO settings",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
          },
          required: ["account_id"],
        },
      },
      {
        name: "update_sso_settings",
        description: "Update account SSO settings",
        inputSchema: {
          type: "object",
          properties: {
            account_id: {
              type: "string",
              description: "Account ID",
            },
            sso_settings: {
              type: "object",
              properties: {
                login_handle_name: {
                  type: "string",
                  description: "Label for login identifiers",
                },
                change_password_url: {
                  type: "string",
                  description: "URL for password resets",
                },
                auth_discovery_url: {
                  type: "string",
                  description: "Discovery URL for authentication",
                },
                unknown_user_url: {
                  type: "string",
                  description: "URL for unknown users",
                },
              },
              description: "SSO settings to update",
            },
          },
          required: ["account_id", "sso_settings"],
        },
      },
    ];
  }

  async handleToolCall(name: string, args: any) {
    switch (name) {
      case "list_authentication_providers":
        return await this.authProviderService.listAuthenticationProviders(args);

      case "get_authentication_provider":
        return await this.authProviderService.getAuthenticationProvider(args);

      case "create_authentication_provider":
        return await this.authProviderService.createAuthenticationProvider(
          args
        );

      case "update_authentication_provider":
        return await this.authProviderService.updateAuthenticationProvider(
          args
        );

      case "delete_authentication_provider":
        return await this.authProviderService.deleteAuthenticationProvider(
          args
        );

      case "restore_authentication_provider":
        return await this.authProviderService.restoreAuthenticationProvider(
          args
        );

      case "get_sso_settings":
        return await this.authProviderService.getSSOSettings(args);

      case "update_sso_settings":
        return await this.authProviderService.updateSSOSettings(args);

      default:
        throw new Error(`Unknown authentication provider tool: ${name}`);
    }
  }
}
