export interface AirtableConfig {
  apiKey: string;
}

export interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: string;
}

export interface AirtableTable {
  id: string;
  name: string;
  primaryFieldId: string;
  description?: string;
}

export interface AirtableField {
  id: string;
  name: string;
  type: string;
  description?: string;
  options?: Record<string, any>;
}

export interface AirtableTableSchema extends AirtableTable {
  fields: AirtableField[];
  views: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

export interface AirtableRecord {
  id: string;
  fields: Record<string, any>;
  createdTime: string;
}

export interface ListRecordsRequest {
  baseId: string;
  tableIdOrName: string;
  pageSize?: number;
  offset?: string;
  fields?: string[];
  filterByFormula?: string;
  sort?: Array<{
    field: string;
    direction: 'asc' | 'desc';
  }>;
}

export interface CreateRecordRequest {
  baseId: string;
  tableIdOrName: string;
  fields: Record<string, any>;
  typecast?: boolean;
}

export interface UpdateRecordRequest {
  baseId: string;
  tableIdOrName: string;
  recordId: string;
  fields: Record<string, any>;
  replace?: boolean;
  typecast?: boolean;
}

export interface ListRecordsResponse {
  records: AirtableRecord[];
  offset?: string;
}
