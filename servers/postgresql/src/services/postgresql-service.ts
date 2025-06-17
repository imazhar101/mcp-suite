import { Pool } from "pg";
import { Logger } from "../../../../shared/utils/logger.js";
import { DatabaseStats } from "../types/database.js";

export class PostgreSQLService {
  private pool: Pool;
  private logger: Logger;

  constructor(connectionString: string, logger: Logger) {
    this.logger = logger;
    this.pool = new Pool({
      connectionString,
    });

    this.pool.on("error", (err: Error) => {
      this.logger.error("Unexpected PostgreSQL client error", err);
    });
  }

  async executeQuery(
    query: string,
    params?: any[]
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    const client = await this.pool.connect();
    try {
      this.logger.info(`Executing query: ${query}`);

      // Add LIMIT 100 to SELECT queries for safety
      let modifiedQuery = query.trim();
      if (
        modifiedQuery.toLowerCase().startsWith("select") &&
        !modifiedQuery.toLowerCase().includes("limit")
      ) {
        modifiedQuery += " LIMIT 100";
      }

      const result = await client.query(modifiedQuery, params);
      return {
        success: true,
        data: {
          rows: result.rows,
          rowCount: result.rowCount || 0,
          fields: result.fields?.map((field: any) => ({
            name: field.name,
            dataTypeID: field.dataTypeID,
            dataTypeSize: field.dataTypeSize,
            dataTypeModifier: field.dataTypeModifier,
          })),
        },
      };
    } catch (error) {
      this.logger.error("Error executing query", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      client.release();
    }
  }

  async listTables(): Promise<{
    success: boolean;
    data?: string[];
    error?: string;
  }> {
    const query = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name;
    `;

    try {
      const result = await this.executeQuery(query);
      if (!result.success) {
        return result;
      }

      return {
        success: true,
        data: result.data.rows.map((row: any) => row.table_name),
      };
    } catch (error) {
      this.logger.error("Error listing tables", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getDatabaseStats(): Promise<{
    success: boolean;
    data?: DatabaseStats;
    error?: string;
  }> {
    const tablesQuery = `
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public';
    `;

    const sizeQuery = `
      SELECT pg_size_pretty(pg_database_size(current_database())) as size;
    `;

    try {
      const [tablesResult, sizeResult] = await Promise.all([
        this.executeQuery(tablesQuery),
        this.executeQuery(sizeQuery),
      ]);

      if (!tablesResult.success || !sizeResult.success) {
        return {
          success: false,
          error: "Failed to get database statistics",
        };
      }

      // Get total row count across all tables
      const tablesListResult = await this.listTables();
      if (!tablesListResult.success) {
        return {
          success: false,
          error: tablesListResult.error || "Failed to get tables list",
        };
      }

      let totalRows = 0;
      const tables = tablesListResult.data || [];

      for (const table of tables) {
        try {
          const rowCountResult = await this.executeQuery(
            `SELECT COUNT(*) as count FROM "${table}"`
          );
          if (rowCountResult.success) {
            totalRows += parseInt(rowCountResult.data.rows[0].count);
          }
        } catch (error) {
          this.logger.warn(`Could not get row count for table ${table}`, error);
        }
      }

      return {
        success: true,
        data: {
          totalTables: parseInt(tablesResult.data.rows[0].table_count),
          totalRows,
          databaseSize: sizeResult.data.rows[0].size,
        },
      };
    } catch (error) {
      this.logger.error("Error getting database stats", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async testConnection(): Promise<{
    success: boolean;
    data?: { connected: boolean };
    error?: string;
  }> {
    try {
      const result = await this.executeQuery("SELECT 1 as test");
      return {
        success: true,
        data: { connected: result.success && result.data.rows.length > 0 },
      };
    } catch (error) {
      this.logger.error("Connection test failed", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.pool.end();
      this.logger.info("Disconnected from PostgreSQL database");
    } catch (err) {
      this.logger.error("Error disconnecting from PostgreSQL database", err);
    }
  }
}
