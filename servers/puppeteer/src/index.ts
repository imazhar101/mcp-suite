#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { PuppeteerService } from "./services/puppeteer-service.js";
import { puppeteerTools } from "./tools/index.js";
import {
  NavigateParams,
  ClickParams,
  FillParams,
  SelectParams,
  HoverParams,
  EvaluateParams,
  WaitForSelectorParams,
} from "./types/index.js";

class PuppeteerServer {
  private server: Server;
  private puppeteerService: PuppeteerService;

  constructor() {
    this.server = new Server(
      {
        name: "puppeteer-server",
        version: "2.0.0",
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.puppeteerService = new PuppeteerService();
    this.setupToolHandlers();

    // Error handling
    this.server.onerror = (error) => console.error("[MCP Error]", error);
    process.on("SIGINT", async () => {
      await this.puppeteerService.close();
      await this.server.close();
      process.exit(0);
    });
  }

  private setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: puppeteerTools,
    }));

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case "puppeteer_launch":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.launch(args),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_navigate":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.navigate(
                      args as unknown as NavigateParams
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_screenshot":
            const screenshotResult = await this.puppeteerService.screenshot(
              args
            );
            if (screenshotResult.success && screenshotResult.data?.screenshot) {
              return {
                content: [
                  {
                    type: "text",
                    text: JSON.stringify(
                      {
                        success: true,
                        message: "Screenshot captured successfully",
                      },
                      null,
                      2
                    ),
                  },
                  {
                    type: "image",
                    data: screenshotResult.data.screenshot,
                    mimeType: `image/${screenshotResult.data.type}`,
                  },
                ],
              };
            }
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(screenshotResult, null, 2),
                },
              ],
            };

          case "puppeteer_click":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.click(
                      args as unknown as ClickParams
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_fill":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.fill(
                      args as unknown as FillParams
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_select":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.select(
                      args as unknown as SelectParams
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_hover":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.hover(
                      args as unknown as HoverParams
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_evaluate":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.evaluate(
                      args as unknown as EvaluateParams
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_wait_for_selector":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.waitForSelector(
                      args as unknown as WaitForSelectorParams
                    ),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_get_console_logs":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.getConsoleLogs(),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_get_page_info":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.getPageInfo(),
                    null,
                    2
                  ),
                },
              ],
            };

          case "puppeteer_close":
            return {
              content: [
                {
                  type: "text",
                  text: JSON.stringify(
                    await this.puppeteerService.close(),
                    null,
                    2
                  ),
                },
              ],
            };

          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  success: false,
                  error:
                    error instanceof Error
                      ? error.message
                      : "Unknown error occurred",
                },
                null,
                2
              ),
            },
          ],
          isError: true,
        };
      }
    });
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error("Puppeteer MCP server running on stdio");
  }
}

const server = new PuppeteerServer();
server.run().catch(console.error);
