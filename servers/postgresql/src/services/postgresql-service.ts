import { Pool } from "pg";
import { Logger } from "../../../../shared/utils/logger.js";
import { DatabaseStats } from "../types/database.js";

export class PostgreSQLService {
  private pool: Pool;
  private logger: Logger;
  private allowDangerousOperations: boolean;

  constructor(connectionString: string, logger: Logger, allowDangerousOperations: boolean = false) {
    this.logger = logger;
    this.allowDangerousOperations = allowDangerousOperations;
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
      
      // Enhanced safety checks - only allow SELECT statements and utility commands unless dangerous operations are enabled
      if (!this.allowDangerousOperations && !this.isReadOnlyQuery(lowerQuery)) {
        return {
          success: false,
          error: "Only read-only queries are allowed. Permitted operations: SELECT, SHOW, DESCRIBE, EXPLAIN. Set allowDangerousOperations to true to enable write operations.",
        };
      }

      // Additional safety: Check for dangerous functions and procedures (unless dangerous operations are allowed)
      if (!this.allowDangerousOperations) {
        const dangerousFunctions = [
          'pg_sleep', 'pg_terminate_backend', 'pg_cancel_backend',
          'current_setting', 'set_config', 'pg_reload_conf',
          'pg_rotate_logfile', 'pg_stat_file', 'pg_read_file',
          'copy', 'lo_', 'dblink', 'file_fdw'
        ];
        
        const hasDangerousFunction = dangerousFunctions.some(func => 
          lowerQuery.includes(func.toLowerCase())
        );
        
        if (hasDangerousFunction) {
          return {
            success: false,
            error: "Query contains potentially dangerous functions. Only safe read operations are allowed.",
          };
        }
      }

      // Start a transaction (read-only for safety unless dangerous operations are allowed)
      if (this.allowDangerousOperations && !this.isReadOnlyQuery(lowerQuery)) {
        await client.query('BEGIN');
      } else {
        await client.query('BEGIN READ ONLY');
      }
      
      // Add LIMIT 100 to SELECT queries for safety (unless dangerous operations are allowed)
      let modifiedQuery = trimmedQuery;
      
      if (!this.allowDangerousOperations && lowerQuery.startsWith("select") && !lowerQuery.includes("limit")) {
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

  private isReadOnlyQuery(query: string): boolean {
    const allowedOperations = [
      'select',
      'show',
      'describe',
      'desc',
      'explain',
      'with' // Common Table Expressions for complex SELECT queries
    ];
    
    // Check if query starts with allowed operations
    const startsWithAllowed = allowedOperations.some(op => 
      query.startsWith(op + ' ') || query === op
    );
    
    if (!startsWithAllowed) {
      return false;
    }
    
    // Block dangerous keywords even in SELECT contexts
    const dangerousKeywords = [
      'drop', 'delete', 'insert', 'update', 'create', 'alter', 
      'truncate', 'grant', 'revoke', 'commit', 'rollback',
      'savepoint', 'release', 'lock', 'unlock', 'call', 'exec'
    ];
    
    const hasDangerousKeyword = dangerousKeywords.some(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'i');
      return regex.test(query);
    });
    
    return !hasDangerousKeyword;
  }

  isDangerousOperationsAllowed(): boolean {
    return this.allowDangerousOperations;
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
