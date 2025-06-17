import { PostgreSQLService } from "../services/postgresql-service";
import { Logger } from "../../../../shared/utils/logger";

const logger = new Logger("info", { server: "DatabaseTools" });

export class DatabaseTools {
  private service: PostgreSQLService;

  constructor(service: PostgreSQLService) {
    this.service = service;
  }

  getAllTools() {
    return {
      executeQuery: this.executeQuery.bind(this),
      getTableSchema: this.getTableSchema.bind(this),
      listTables: this.listTables.bind(this),
      getDatabaseStats: this.getDatabaseStats.bind(this),
      testConnection: this.testConnection.bind(this),
    };
  }

  async executeQuery(query: string, params?: any[]) {
    try {
      logger.info("Executing database query");
      const result = await this.service.executeQuery(query, params);
      return {
        success: true,
        data: result,
      };
    } catch (error) {
      logger.error("Error executing query", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getTableSchema(tableName: string) {
    try {
      logger.info(`Getting schema for table: ${tableName}`);
      const schema = await this.service.getTableSchema(tableName);
      return {
        success: true,
        data: schema,
      };
    } catch (error) {
      logger.error("Error getting table schema", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async listTables() {
    try {
      logger.info("Listing database tables");
      const tables = await this.service.listTables();
      return {
        success: true,
        data: tables,
      };
    } catch (error) {
      logger.error("Error listing tables", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async getDatabaseStats() {
    try {
      logger.info("Getting database statistics");
      const stats = await this.service.getDatabaseStats();
      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      logger.error("Error getting database stats", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  async testConnection() {
    try {
      logger.info("Testing database connection");
      const isConnected = await this.service.testConnection();
      return {
        success: true,
        data: { connected: isConnected },
      };
    } catch (error) {
      logger.error("Error testing connection", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}
