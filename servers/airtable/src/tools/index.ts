import { McpTool } from '../../../../shared/types/mcp.js';

export const airtableTools: McpTool[] = [
  {
    name: 'list_bases',
    description: 'List all accessible Airtable bases',
    inputSchema: {
      type: 'object',
      properties: {},
    },
  },
  {
    name: 'list_tables',
    description: 'List all tables in an Airtable base',
    inputSchema: {
      type: 'object',
      properties: {
        baseId: {
          type: 'string',
          description: "The ID of the base (e.g., 'appXXXXXXXXXXXXXX')",
        },
      },
      required: ['baseId'],
    },
  },
  {
    name: 'get_table_schema',
    description: 'Get the schema (fields and their types) for a table',
    inputSchema: {
      type: 'object',
      properties: {
        baseId: {
          type: 'string',
          description: 'The ID of the base',
        },
        tableIdOrName: {
          type: 'string',
          description: 'The ID or name of the table',
        },
      },
      required: ['baseId', 'tableIdOrName'],
    },
  },
  {
    name: 'list_records',
    description:
      'List records from a table with optional filtering, sorting, and pagination',
    inputSchema: {
      type: 'object',
      properties: {
        baseId: {
          type: 'string',
          description: 'The ID of the base',
        },
        tableIdOrName: {
          type: 'string',
          description: 'The ID or name of the table',
        },
        pageSize: {
          type: 'number',
          description: 'Number of records per page (max 100, default 100)',
          minimum: 1,
          maximum: 100,
        },
        offset: {
          type: 'string',
          description: 'Pagination offset from previous response',
        },
        fields: {
          type: 'array',
          items: { type: 'string' },
          description:
            'Specific fields to return (optional, returns all if not specified)',
        },
        filterByFormula: {
          type: 'string',
          description:
            'Airtable formula to filter records (e.g., \'{Status} = "Active"\')',
        },
        sort: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              field: { type: 'string' },
              direction: { type: 'string', enum: ['asc', 'desc'] },
            },
          },
          description: 'Sort order for records',
        },
      },
      required: ['baseId', 'tableIdOrName'],
    },
  },
  {
    name: 'get_record',
    description: 'Get a specific record by ID',
    inputSchema: {
      type: 'object',
      properties: {
        baseId: {
          type: 'string',
          description: 'The ID of the base',
        },
        tableIdOrName: {
          type: 'string',
          description: 'The ID or name of the table',
        },
        recordId: {
          type: 'string',
          description: "The ID of the record (e.g., 'recXXXXXXXXXXXXXX')",
        },
      },
      required: ['baseId', 'tableIdOrName', 'recordId'],
    },
  },
  {
    name: 'create_record',
    description: 'Create a new record in a table',
    inputSchema: {
      type: 'object',
      properties: {
        baseId: {
          type: 'string',
          description: 'The ID of the base',
        },
        tableIdOrName: {
          type: 'string',
          description: 'The ID or name of the table',
        },
        fields: {
          type: 'object',
          description: 'Field names and values for the record',
        },
        typecast: {
          type: 'boolean',
          description:
            'Automatically convert field values to appropriate types (default: false)',
          default: false,
        },
      },
      required: ['baseId', 'tableIdOrName', 'fields'],
    },
  },
  {
    name: 'update_record',
    description: 'Update an existing record',
    inputSchema: {
      type: 'object',
      properties: {
        baseId: {
          type: 'string',
          description: 'The ID of the base',
        },
        tableIdOrName: {
          type: 'string',
          description: 'The ID or name of the table',
        },
        recordId: {
          type: 'string',
          description: 'The ID of the record to update',
        },
        fields: {
          type: 'object',
          description: 'Field names and values to update',
        },
        replace: {
          type: 'boolean',
          description:
            'Replace all fields (true) or merge (false, default: false)',
          default: false,
        },
        typecast: {
          type: 'boolean',
          description:
            'Automatically convert field values to appropriate types (default: false)',
          default: false,
        },
      },
      required: ['baseId', 'tableIdOrName', 'recordId', 'fields'],
    },
  },
  {
    name: 'delete_record',
    description: 'Delete a record from a table',
    inputSchema: {
      type: 'object',
      properties: {
        baseId: {
          type: 'string',
          description: 'The ID of the base',
        },
        tableIdOrName: {
          type: 'string',
          description: 'The ID or name of the table',
        },
        recordId: {
          type: 'string',
          description: 'The ID of the record to delete',
        },
      },
      required: ['baseId', 'tableIdOrName', 'recordId'],
    },
  },
];
