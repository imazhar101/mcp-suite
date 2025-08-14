import axios from "axios";
import { Logger } from "../../../../shared/utils/logger.js";
import {
  AIJobSearchConfig,
  SkillsExtractionResponse,
  JobMatchingResponse,
  SkillForJobMatching,
} from "../types/index.js";

export class AIJobSearchService {
  private config: AIJobSearchConfig;
  private logger: Logger;

  constructor(config: AIJobSearchConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
  }

  async extractSkills(args: {
    taxonomy: string;
    context: string;
  }): Promise<SkillsExtractionResponse> {
    try {
      this.logger.debug("Extracting skills", args);

      const response = await axios.post(
        `${this.config.apiUrl}/skills`,
        {
          taxonomy: args.taxonomy,
          context: args.context,
        },
        {
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      this.logger.error("Failed to extract skills", error);
      throw new Error(`Failed to extract skills: ${error.message}`);
    }
  }

  async matchJobs(args: {
    type: "skills" | "text";
    skills_list?: SkillForJobMatching[];
    context?: string;
  }): Promise<JobMatchingResponse> {
    try {
      this.logger.debug("Matching jobs", args);

      let requestBody: any;
      
      if (args.type === "skills") {
        if (!args.skills_list) {
          throw new Error("skills_list is required when type is 'skills'");
        }
        requestBody = {
          type: "skills",
          context: {
            skills_list: args.skills_list,
          },
        };
      } else if (args.type === "text") {
        if (!args.context) {
          throw new Error("context is required when type is 'text'");
        }
        requestBody = {
          type: "text",
          context: args.context,
        };
      } else {
        throw new Error("Invalid type. Must be 'skills' or 'text'");
      }

      const response = await axios.post(
        `${this.config.apiUrl}/jobs`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${this.config.apiToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      this.logger.error("Failed to match jobs", error);
      throw new Error(`Failed to match jobs: ${error.message}`);
    }
  }
}