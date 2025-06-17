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
}
