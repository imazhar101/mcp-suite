# Elasticsearch MCP Server

A comprehensive Model Context Protocol (MCP) server for Elasticsearch operations, providing search, analytics, and document management capabilities with built-in data limiting controls.

## Features

### 🔍 **Search & Analytics**
- Full-text search with query DSL support
- Aggregations and analytics with result limiting
- Document counting and statistics
- Pagination support (max 1000 results per search)

### 📊 **Index Management**
- List all indices with health information
- Create and delete indices
- Get detailed index information (stats, mappings, settings)
- Index existence checks

### 📄 **Document Operations**
- CRUD operations for individual documents
- Bulk operations (limited to 100 operations per request)
- Delete by query (limited to 10,000 documents)
- Reindexing with optional query filters

### 🏥 **Cluster Health & Monitoring**
- Connection testing and cluster information
- Cluster health status and statistics
- Node statistics (CPU, memory, disk usage)

### 🛡️ **Built-in Safety Controls**
- Search results limited to 1000 documents maximum
- Bulk operations limited to 100 operations per request
- Delete by query limited to 10,000 documents maximum
- Aggregation results limited to prevent memory issues
- Connection timeout and retry controls

## Quick Setup

### Environment Variables

**Required:**
- `ELASTICSEARCH_NODE` - Elasticsearch node URL (default: `http://localhost:9200`)

**Authentication (choose one):**
- `ELASTICSEARCH_USERNAME` and `ELASTICSEARCH_PASSWORD` - Basic authentication
- `ELASTICSEARCH_API_KEY` - API key authentication

**Optional:**
- `ELASTICSEARCH_MAX_RETRIES` - Maximum retry attempts (default: 3)
- `ELASTICSEARCH_REQUEST_TIMEOUT` - Request timeout in milliseconds (default: 30000)

### Example Configuration

```bash
# Basic setup with local Elasticsearch
export ELASTICSEARCH_NODE="http://localhost:9200"

# With basic authentication
export ELASTICSEARCH_NODE="https://elasticsearch.example.com:9200"
export ELASTICSEARCH_USERNAME="elastic"
export ELASTICSEARCH_PASSWORD="your-password"

# With API key authentication
export ELASTICSEARCH_NODE="https://elasticsearch.example.com:9200"
export ELASTICSEARCH_API_KEY="your-api-key"

# With custom timeout and retries
export ELASTICSEARCH_MAX_RETRIES="5"
export ELASTICSEARCH_REQUEST_TIMEOUT="60000"
```

## Available Tools (19)

### Connection & Health Tools (3)
```
elasticsearch_test_connection    - Test connection and get cluster info
elasticsearch_cluster_health     - Get cluster health status and statistics  
elasticsearch_node_stats         - Get simplified node statistics
```

### Index Management Tools (5)
```
elasticsearch_list_indices       - List all indices with basic information
elasticsearch_get_index_info     - Get detailed index information
elasticsearch_create_index       - Create a new index with mappings/settings
elasticsearch_delete_index       - Delete an index (irreversible)
elasticsearch_index_exists       - Check if an index exists
```

### Search Tools (3)
```
elasticsearch_search             - Search documents with query DSL (max 1000 results)
elasticsearch_count              - Count documents matching a query
elasticsearch_aggregation        - Perform aggregations with optional query filter
```

### Document Management Tools (4)
```
elasticsearch_get_document       - Get a specific document by ID
elasticsearch_index_document     - Index (create/update) a document
elasticsearch_update_document    - Update an existing document
elasticsearch_delete_document    - Delete a document by ID
```

### Bulk & Advanced Operations (4)
```
elasticsearch_bulk_operation     - Multiple document operations (max 100 ops)
elasticsearch_delete_by_query    - Delete documents by query (max 10,000 docs)
elasticsearch_reindex            - Copy documents between indices
```

## Usage Examples

### Search Documents
```json
{
  "name": "elasticsearch_search",
  "arguments": {
    "index": "my-index",
    "query": {
      "match": {
        "title": "elasticsearch"
      }
    },
    "size": 10,
    "sort": [{"timestamp": {"order": "desc"}}]
  }
}
```

### Create Index with Mapping
```json
{
  "name": "elasticsearch_create_index", 
  "arguments": {
    "index": "products",
    "mappings": {
      "properties": {
        "name": {"type": "text"},
        "price": {"type": "float"},
        "created_at": {"type": "date"}
      }
    },
    "settings": {
      "number_of_shards": 1,
      "number_of_replicas": 0
    }
  }
}
```

### Perform Aggregations
```json
{
  "name": "elasticsearch_aggregation",
  "arguments": {
    "index": "sales",
    "aggs": {
      "sales_per_month": {
        "date_histogram": {
          "field": "date",
          "calendar_interval": "month"
        }
      }
    }
  }
}
```

### Bulk Operations
```json
{
  "name": "elasticsearch_bulk_operation",
  "arguments": {
    "index": "logs",
    "operations": [
      {
        "action": "index",
        "id": "1",
        "document": {"message": "Log entry 1", "level": "info"}
      },
      {
        "action": "update", 
        "id": "2",
        "document": {"level": "error"}
      }
    ],
    "refresh": true
  }
}
```

## Security Best Practices

1. **Use HTTPS** for production Elasticsearch clusters
2. **Enable authentication** with username/password or API keys
3. **Limit network access** to Elasticsearch from trusted sources only
4. **Monitor queries** to prevent expensive operations
5. **Set up proper indices** with appropriate mappings and settings
6. **Use aliases** instead of direct index names for flexibility

## Data Limiting Controls

This server includes several built-in controls to prevent overwhelming your Elasticsearch cluster:

- **Search Results**: Limited to 1000 documents per search request
- **Bulk Operations**: Limited to 100 operations per request
- **Delete by Query**: Limited to 10,000 documents per operation
- **Aggregation Size**: Default to 0 document hits for aggregation-only queries
- **Connection Timeouts**: 30-second default timeout with configurable retries
- **Node Stats**: Simplified to essential metrics only

## Development

### Build and Run
```bash
# Install dependencies
npm install

# Build the server
npm run build

# Run the server
npm start

# Development with auto-rebuild
npm run dev
```

### Dependencies
- `@elastic/elasticsearch` - Official Elasticsearch client
- `@modelcontextprotocol/sdk` - MCP SDK for server implementation

## Troubleshooting

### Connection Issues
- Verify `ELASTICSEARCH_NODE` URL is correct
- Check if Elasticsearch is running and accessible
- Ensure authentication credentials are valid
- Check network connectivity and firewall settings

### Performance Issues
- Use pagination (`from` and `size`) for large result sets
- Implement query filters to reduce result sets
- Use aggregations instead of large searches when possible
- Monitor cluster health and node statistics

### Authentication Issues
- Verify username/password or API key are correct
- Ensure the user has appropriate permissions
- Check if the authentication method is enabled in Elasticsearch

## License

MIT License - see the root LICENSE file for details.