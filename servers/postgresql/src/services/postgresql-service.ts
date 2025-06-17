import { Pool } from "pg";
import { Logger } from "../../../../shared/utils/logger.js";
import { DatabaseStats } from "../types/database.js";

export class PostgreSQLService {
  private pool: Pool;
  private logger: Logger;

  constructor(connectionString: string, logger: Logger) {
    this.logger = logger;
    this.pool = new Pool({ connectionString });

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

      // Validate query for safety (block potentially dangerous operations)
      const trimmedQuery = query.trim();
      const lowerQuery = trimmedQuery.toLowerCase();
      
      // Block dangerous operations
      const dangerousKeywords = ['drop', 'delete', 'insert', 'update', 'create', 'alter', 'truncate', 'grant', 'revoke'];
      const hasDangerousKeyword = dangerousKeywords.some(keyword => 
        lowerQuery.includes(keyword + ' ') || lowerQuery.startsWith(keyword)
      );
      
      if (hasDangerousKeyword) {
        return {
          success: false,
          error: "Query contains potentially dangerous operations. Only SELECT queries are allowed for safety.",
        };
      }

      // Start a read-only transaction for additional safety
      await client.query('BEGIN READ ONLY');
      
      // Add LIMIT 100 to SELECT queries for safety
      let modifiedQuery = trimmedQuery;
      
      if (lowerQuery.startsWith("select") && !lowerQuery.includes("limit")) {
        // Remove trailing semicolon if present, add LIMIT, then add semicolon back
        if (modifiedQuery.endsWith(";")) {
          modifiedQuery = modifiedQuery.slice(0, -1) + " LIMIT 100;";
        } else {
          modifiedQuery += " LIMIT 100";
        }
      }

      const result = await client.query(modifiedQuery, params);
      
      // Commit the read-only transaction
      await client.query('COMMIT');

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
      
      // Rollback transaction on error
      try {
        await client.query('ROLLBACK');
      } catch (rollbackError) {
        this.logger.error("Error rolling back transaction", rollbackError);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    } finally {
      client.release();
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
