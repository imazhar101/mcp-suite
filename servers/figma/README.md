# Figma MCP Server

A Model Context Protocol (MCP) server that provides tools for interacting with the Figma API. This server enables you to retrieve files, components, styles, comments, and more from your Figma workspace.

## Features

### File Operations

- **get_file**: Get a complete Figma file by key
- **get_file_nodes**: Get specific nodes from a Figma file
- **get_images**: Export images from Figma nodes
- **get_image_fills**: Get image fill URLs from a file

### Comments

- **get_comments**: Retrieve comments from a file
- **post_comment**: Add comments to a file
- **delete_comment**: Remove comments from a file

### Team & Project Management

- **get_me**: Get current user information
- **get_team_projects**: List projects in a team
- **get_project_files**: Get files within a project

### Components & Styles

- **get_component**: Get component details by key
- **get_component_sets**: Get component set details
- **get_team_components**: List team components
- **get_file_components**: Get components from a specific file
- **get_team_styles**: List team styles
- **get_file_styles**: Get styles from a specific file

## Setup

### Prerequisites

- Node.js 18 or higher
- A Figma account with API access
- Figma Personal Access Token

### Installation

1. Clone or download this server
2. Install dependencies:

   ```bash
   npm install
   ```

3. Build the server:
   ```bash
   npm run build
   ```

### Configuration

1. Get your Figma Personal Access Token:

   - Go to Figma → Settings → Account → Personal access tokens
   - Generate a new token with appropriate permissions

2. Set the environment variable:
   ```bash
   export FIGMA_ACCESS_TOKEN="your_figma_token_here"
   ```

### Usage with MCP

Add this server to your MCP settings:

```json
{
  "mcpServers": {
    "figma": {
      "command": "node",
      "args": ["/path/to/figma-server/build/index.js"],
      "env": {
        "FIGMA_ACCESS_TOKEN": "your_figma_token_here"
      }
    }
  }
}
```

## Tool Examples

### Get a Figma File

```json
{
  "name": "get_file",
  "arguments": {
    "file_key": "ABC123DEF456"
  }
}
```

### Export Images

```json
{
  "name": "get_images",
  "arguments": {
    "file_key": "ABC123DEF456",
    "ids": "1:2,1:3",
    "format": "png",
    "scale": 2
  }
}
```

### Post a Comment

```json
{
  "name": "post_comment",
  "arguments": {
    "file_key": "ABC123DEF456",
    "message": "This looks great!",
    "client_meta": {
      "x": 100,
      "y": 200,
      "node_id": "1:2"
    }
  }
}
```

### Get Team Components

```json
{
  "name": "get_team_components",
  "arguments": {
    "team_id": "123456789",
    "page_size": 50
  }
}
```

## Finding Figma IDs

### File Key

The file key is found in the Figma URL:
`https://www.figma.com/file/ABC123DEF456/My-Design-File`
The file key is `ABC123DEF456`

### Node IDs

- Right-click on any element in Figma
- Select "Copy/Paste as" → "Copy link"
- The node ID is in the URL after `node-id=`

### Team ID

- Go to your team page in Figma
- The team ID is in the URL: `https://www.figma.com/files/team/123456789/`

## API Reference

This server implements the Figma REST API v1. For detailed information about request/response formats, see the [official Figma API documentation](https://www.figma.com/developers/api).

## Error Handling

The server provides detailed error messages for common issues:

- Invalid or missing access token
- File not found or access denied
- Invalid node IDs
- Rate limiting

## Development

### Building

```bash
npm run build
```

### Watching for changes

```bash
npm run watch
```

### Testing with MCP Inspector

```bash
npm run inspector
```

## License

This project is licensed under the MIT License.
