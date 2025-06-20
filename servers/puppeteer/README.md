# Puppeteer MCP Server

A Model Context Protocol server that provides browser automation tools through Puppeteer. This server enables automated web interactions, scraping, and testing capabilities.

## Features

- **Browser Control**: Launch and manage Puppeteer browser instances
- **Navigation**: Navigate to URLs with configurable wait conditions
- **Screenshots**: Capture full page or element-specific screenshots
- **Element Interaction**: Click, fill, select, and hover over page elements
- **JavaScript Execution**: Run custom JavaScript in the browser context
- **Element Waiting**: Wait for elements to appear or disappear
- **Console Logging**: Capture and retrieve browser console logs
- **Page Information**: Get current page URL, title, and viewport details

## Tools

### Browser Management
- `puppeteer_launch` - Launch a new browser instance with custom options
- `puppeteer_close` - Close the browser instance
- `puppeteer_get_page_info` - Get current page information

### Navigation
- `puppeteer_navigate` - Navigate to a specific URL
- `puppeteer_wait_for_selector` - Wait for elements to appear/disappear

### Screenshots
- `puppeteer_screenshot` - Capture page or element screenshots

### Element Interaction
- `puppeteer_click` - Click on page elements
- `puppeteer_fill` - Fill input fields with text
- `puppeteer_select` - Select dropdown options
- `puppeteer_hover` - Hover over elements

### JavaScript Execution
- `puppeteer_evaluate` - Execute JavaScript code in browser context

### Debugging
- `puppeteer_get_console_logs` - Retrieve browser console logs

## Installation

```bash
cd servers/puppeteer
npm install
```

## Usage

### Starting the Server

```bash
npx @mcp-suite/puppeteer-server
```

### Example Usage

1. **Launch Browser**:
   ```json
   {
     "name": "puppeteer_launch",
     "arguments": {
       "headless": true,
       "args": ["--no-sandbox"]
     }
   }
   ```

2. **Navigate to URL**:
   ```json
   {
     "name": "puppeteer_navigate",
     "arguments": {
       "url": "https://example.com",
       "waitUntil": "networkidle2"
     }
   }
   ```

3. **Take Screenshot**:
   ```json
   {
     "name": "puppeteer_screenshot",
     "arguments": {
       "fullPage": true,
       "type": "png"
     }
   }
   ```

4. **Fill Form Field**:
   ```json
   {
     "name": "puppeteer_fill",
     "arguments": {
       "selector": "#email",
       "value": "user@example.com"
     }
   }
   ```

5. **Click Button**:
   ```json
   {
     "name": "puppeteer_click",
     "arguments": {
       "selector": "#submit-button"
     }
   }
   ```

## Configuration

The server supports various browser launch options:

- `headless`: Run browser in headless mode (default: true)
- `args`: Additional browser arguments
- `executablePath`: Custom browser executable path
- `timeout`: Launch timeout in milliseconds

## Security

The server includes security measures:
- Filters potentially dangerous browser arguments
- Validates user inputs
- Sanitizes JavaScript execution contexts

## Error Handling

All tools return structured responses with success/error status:
```json
{
  "success": true,
  "data": "Operation result"
}
```

or

```json
{
  "success": false,
  "error": "Error description"
}
```

## Requirements

- Node.js 18+
- Puppeteer dependencies (automatically installed)
- System dependencies for running headless browsers

## License

MIT