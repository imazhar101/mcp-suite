export interface SalesforceConfig {
  instanceUrl?: string;
  accessToken?: string;
  apiVersion?: string;
}

export interface SalesforceOAuthConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  grantType: string;
  loginUrl?: string;
}

export interface SalesforceAuthResponse {
  access_token: string;
  instance_url: string;
  id: string;
  token_type: string;
  issued_at: string;
  signature: string;
}

export interface SalesforceRecord {
  Id?: string;
  [key: string]: any;
}

export interface SalesforceQueryResponse {
  totalSize: number;
  done: boolean;
  records: SalesforceRecord[];
  nextRecordsUrl?: string;
}

export interface SalesforceCreateResponse {
  id: string;
  success: boolean;
  errors: any[];
}

export interface SalesforceUpdateResponse {
  success: boolean;
  errors: any[];
}

export interface SalesforceDeleteResponse {
  success: boolean;
  errors: any[];
}

export interface SalesforceBulkDeleteResponse {
  results: {
    id: string;
    success: boolean;
    errors?: any[];
  }[];
}

export interface SalesforceDescribeResponse {
  name: string;
  label: string;
  labelPlural: string;
  fields: SalesforceField[];
  createable: boolean;
  updateable: boolean;
  deletable: boolean;
  queryable: boolean;
}

export interface SalesforceField {
  name: string;
  label: string;
  type: string;
  length?: number;
  required: boolean;
  createable: boolean;
  updateable: boolean;
}

export interface SalesforceError {
  message: string;
  statusCode: string;
  fields: string[];
}