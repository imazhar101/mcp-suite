import axios, { AxiosInstance } from 'axios';
import { Logger } from '../../../../shared/utils/logger.js';
import { ErrorHandler } from '../../../../shared/middleware/error-handler.js';
import { AuthMiddleware } from '../../../../shared/middleware/auth.js';
import { ServerResponse } from '../../../../shared/types/common.js';
import {
  AirtableConfig,
  AirtableBase,
  AirtableTable,
  AirtableTableSchema,
  AirtableRecord,
  ListRecordsRequest,
  CreateRecordRequest,
  UpdateRecordRequest,
  ListRecordsResponse,
} from '../types/index.js';

export class AirtableService {
  private client: AxiosInstance;
  private logger: Logger;
  private errorHandler: ErrorHandler;
  private config: AirtableConfig;

  constructor(config: AirtableConfig, logger: Logger) {
    this.config = config;
    this.logger = logger.withContext({ server: 'airtable' });
    this.errorHandler = new ErrorHandler(this.logger);

    const auth = new AuthMiddleware({
      apiKey: config.apiKey,
    });

    this.client = axios.create({
      baseURL: 'https://api.airtable.com/v0',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...auth.getAuthHeaders(),
      },
    });
  }

  async listBases(): Promise<ServerResponse<AirtableBase[]>> {
    try {
      this.logger.info('Listing bases');
      const response = await this.client.get('/meta/bases');

      const bases: AirtableBase[] = response.data.bases.map((base: any) => ({
        id: base.id,
        name: base.name,
        permissionLevel: base.permissionLevel,
      }));

      return {
        success: true,
        data: bases,
        message: `Found ${bases.length} base(s)`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }

  async listTables(baseId: string): Promise<ServerResponse<AirtableTable[]>> {
    try {
      this.logger.info('Listing tables', { baseId });
      const response = await this.client.get(`/meta/bases/${baseId}/tables`);

      const tables: AirtableTable[] = response.data.tables.map(
        (table: any) => ({
          id: table.id,
          name: table.name,
          primaryFieldId: table.primaryFieldId,
          description: table.description,
        })
      );

      return {
        success: true,
        data: tables,
        message: `Found ${tables.length} table(s) in base ${baseId}`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }

  async getTableSchema(
    baseId: string,
    tableIdOrName: string
  ): Promise<ServerResponse<AirtableTableSchema>> {
    try {
      this.logger.info('Getting table schema', { baseId, tableIdOrName });
      const response = await this.client.get(`/meta/bases/${baseId}/tables`);

      const table = response.data.tables.find(
        (t: any) => t.id === tableIdOrName || t.name === tableIdOrName
      );

      if (!table) {
        return {
          success: false,
          error: `Table '${tableIdOrName}' not found in base ${baseId}`,
        };
      }

      const schema: AirtableTableSchema = {
        id: table.id,
        name: table.name,
        primaryFieldId: table.primaryFieldId,
        description: table.description,
        fields: table.fields.map((field: any) => ({
          id: field.id,
          name: field.name,
          type: field.type,
          description: field.description,
          options: field.options,
        })),
        views: table.views.map((view: any) => ({
          id: view.id,
          name: view.name,
          type: view.type,
        })),
      };

      return {
        success: true,
        data: schema,
        message: `Retrieved schema for table '${table.name}'`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }

  async listRecords(
    request: ListRecordsRequest
  ): Promise<ServerResponse<ListRecordsResponse>> {
    try {
      this.logger.info('Listing records', {
        baseId: request.baseId,
        tableIdOrName: request.tableIdOrName,
        pageSize: request.pageSize,
      });

      const params: any = {
        pageSize: request.pageSize || 100,
      };

      if (request.offset) {
        params.offset = request.offset;
      }

      if (request.fields && request.fields.length > 0) {
        params.fields = request.fields;
      }

      if (request.filterByFormula) {
        params.filterByFormula = request.filterByFormula;
      }

      if (request.sort && request.sort.length > 0) {
        request.sort.forEach((sortItem, index) => {
          params[`sort[${index}][field]`] = sortItem.field;
          params[`sort[${index}][direction]`] = sortItem.direction;
        });
      }

      const response = await this.client.get(
        `/${request.baseId}/${encodeURIComponent(request.tableIdOrName)}`,
        { params }
      );

      const result: ListRecordsResponse = {
        records: response.data.records.map((record: any) => ({
          id: record.id,
          fields: record.fields,
          createdTime: record.createdTime,
        })),
        offset: response.data.offset,
      };

      return {
        success: true,
        data: result,
        message: `Retrieved ${result.records.length} record(s)${
          result.offset ? ' (more available)' : ''
        }`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }

  async getRecord(
    baseId: string,
    tableIdOrName: string,
    recordId: string
  ): Promise<ServerResponse<AirtableRecord>> {
    try {
      this.logger.info('Getting record', { baseId, tableIdOrName, recordId });
      const response = await this.client.get(
        `/${baseId}/${encodeURIComponent(tableIdOrName)}/${recordId}`
      );

      const record: AirtableRecord = {
        id: response.data.id,
        fields: response.data.fields,
        createdTime: response.data.createdTime,
      };

      return {
        success: true,
        data: record,
        message: `Retrieved record ${recordId}`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }

  async createRecord(
    request: CreateRecordRequest
  ): Promise<ServerResponse<AirtableRecord>> {
    try {
      this.logger.info('Creating record', {
        baseId: request.baseId,
        tableIdOrName: request.tableIdOrName,
      });

      const body: any = {
        fields: request.fields,
      };

      if (request.typecast) {
        body.typecast = true;
      }

      const response = await this.client.post(
        `/${request.baseId}/${encodeURIComponent(request.tableIdOrName)}`,
        body
      );

      const record: AirtableRecord = {
        id: response.data.id,
        fields: response.data.fields,
        createdTime: response.data.createdTime,
      };

      return {
        success: true,
        data: record,
        message: `Created record ${record.id}`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }

  async updateRecord(
    request: UpdateRecordRequest
  ): Promise<ServerResponse<AirtableRecord>> {
    try {
      this.logger.info('Updating record', {
        baseId: request.baseId,
        tableIdOrName: request.tableIdOrName,
        recordId: request.recordId,
      });

      const body: any = {
        fields: request.fields,
      };

      if (request.typecast) {
        body.typecast = true;
      }

      const method = request.replace ? 'put' : 'patch';
      const response = await this.client[method](
        `/${request.baseId}/${encodeURIComponent(request.tableIdOrName)}/${
          request.recordId
        }`,
        body
      );

      const record: AirtableRecord = {
        id: response.data.id,
        fields: response.data.fields,
        createdTime: response.data.createdTime,
      };

      return {
        success: true,
        data: record,
        message: `Updated record ${record.id}`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }

  async deleteRecord(
    baseId: string,
    tableIdOrName: string,
    recordId: string
  ): Promise<ServerResponse<{ deleted: boolean; id: string }>> {
    try {
      this.logger.info('Deleting record', { baseId, tableIdOrName, recordId });
      const response = await this.client.delete(
        `/${baseId}/${encodeURIComponent(tableIdOrName)}/${recordId}`
      );

      const result = {
        deleted: response.data.deleted,
        id: response.data.id,
      };

      return {
        success: true,
        data: result,
        message: `Deleted record ${recordId}`,
      };
    } catch (error) {
      return this.errorHandler.handleApiError(error, 'Airtable');
    }
  }
}
