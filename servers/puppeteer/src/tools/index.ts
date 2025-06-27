import { Tool } from "@modelcontextprotocol/sdk/types.js";

export const puppeteerTools: Tool[] = [
  {
    name: "puppeteer_launch",
    description:
      "Launch a new Puppeteer browser instance with configurable options",
    inputSchema: {
      type: "object",
      properties: {
        headless: {
          type: "boolean",
          description: "Run browser in headless mode (default: true)",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description: "Additional browser launch arguments",
        },
        executablePath: {
          type: "string",
          description: "Path to browser executable",
        },
        timeout: {
          type: "number",
          description: "Launch timeout in milliseconds (default: 30000)",
        },
      },
    },
  },
  {
    name: "puppeteer_navigate",
    description: "Navigate to a specific URL",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description: "URL to navigate to",
        },
        waitUntil: {
          type: "string",
          enum: ["load", "domcontentloaded", "networkidle0", "networkidle2"],
          description:
            "When to consider navigation successful (default: networkidle2)",
        },
        timeout: {
          type: "number",
          description: "Navigation timeout in milliseconds (default: 30000)",
        },
      },
      required: ["url"],
    },
  },
  {
    name: "puppeteer_screenshot",
    description: "Take a screenshot of the current page or a specific element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector to screenshot specific element",
        },
        fullPage: {
          type: "boolean",
          description: "Take full page screenshot (default: false)",
        },
        quality: {
          type: "number",
          minimum: 0,
          maximum: 100,
          description: "Image quality for JPEG (0-100)",
        },
        type: {
          type: "string",
          enum: ["png", "jpeg", "webp"],
          description: "Image format (default: png)",
        },
        clip: {
          type: "object",
          properties: {
            x: { type: "number" },
            y: { type: "number" },
            width: { type: "number" },
            height: { type: "number" },
          },
          required: ["x", "y", "width", "height"],
          description: "Clip screenshot to specific coordinates",
        },
      },
    },
  },
  {
    name: "puppeteer_click",
    description: "Click on an element specified by CSS selector",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of element to click",
        },
        button: {
          type: "string",
          enum: ["left", "right", "middle"],
          description: "Mouse button to use (default: left)",
        },
        clickCount: {
          type: "number",
          description: "Number of clicks (default: 1)",
        },
        delay: {
          type: "number",
          description: "Delay between clicks in milliseconds (default: 0)",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "puppeteer_fill",
    description: "Fill an input field with text",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of input element to fill",
        },
        value: {
          type: "string",
          description: "Text to fill into the input",
        },
        delay: {
          type: "number",
          description: "Delay between keystrokes in milliseconds (default: 0)",
        },
      },
      required: ["selector", "value"],
    },
  },
  {
    name: "puppeteer_select",
    description: "Select options from a dropdown/select element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of select element",
        },
        values: {
          type: "array",
          items: { type: "string" },
          description: "Array of values to select",
        },
      },
      required: ["selector", "values"],
    },
  },
  {
    name: "puppeteer_hover",
    description: "Hover over an element",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector of element to hover over",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "puppeteer_evaluate",
    description: "Execute JavaScript code in the browser context",
    inputSchema: {
      type: "object",
      properties: {
        script: {
          type: "string",
          description: "JavaScript code to execute",
        },
        args: {
          type: "array",
          description: "Arguments to pass to the script",
        },
      },
      required: ["script"],
    },
  },
  {
    name: "puppeteer_wait_for_selector",
    description: "Wait for an element to appear on the page",
    inputSchema: {
      type: "object",
      properties: {
        selector: {
          type: "string",
          description: "CSS selector to wait for",
        },
        timeout: {
          type: "number",
          description: "Timeout in milliseconds (default: 30000)",
        },
        visible: {
          type: "boolean",
          description: "Wait for element to be visible",
        },
        hidden: {
          type: "boolean",
          description: "Wait for element to be hidden",
        },
      },
      required: ["selector"],
    },
  },
  {
    name: "puppeteer_get_console_logs",
    description: "Get browser console logs",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "puppeteer_get_page_info",
    description: "Get current page information (URL, title, viewport)",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "puppeteer_close",
    description: "Close the browser instance",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];
