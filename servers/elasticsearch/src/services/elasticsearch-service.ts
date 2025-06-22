import { Client } from '@elastic/elasticsearch';
import {
  ElasticsearchConfig,
  SearchOptions,
  SearchResult,
  IndexInfo,
  ClusterHealth,
  DocumentOperation,
  BulkOperation,
  AggregationOptions,
  CreateIndexOptions,
} from '../types/index.js';

export class ElasticsearchService {
  private client: Client;

  constructor(config: ElasticsearchConfig) {
    this.client = new Client({
      node: config.node,
      auth: config.auth,
      maxRetries: config.maxRetries || 3,
      requestTimeout: config.requestTimeout || 30000,
      sniffOnStart: config.sniffOnStart || false,
      sniffInterval: config.sniffInterval || false
    });
  }

  async testConnection(): Promise<{ connected: boolean; cluster_name?: string; version?: string }> {
    try {
      const response = await this.client.info();
      return {
        connected: true,
        cluster_name: response.cluster_name,
        version: response.version.number,
      };
    } catch (error) {
      return {
        connected: false,
      };
    }
  }

  async getClusterHealth(): Promise<ClusterHealth> {
    const response = await this.client.cluster.health();
    return response;
  }

  async listIndices(): Promise<IndexInfo[]> {
    const response = await this.client.cat.indices({
      format: 'json',
      h: 'health,status,index,uuid,pri,rep,docs.count,docs.deleted,store.size,pri.store.size',
    });
    return response.map((item: any) => ({
      health: item.health || 'unknown',
      status: item.status || 'unknown',
      index: item.index || '',
      uuid: item.uuid || '',
      pri: parseInt(item.pri || '0'),
      rep: parseInt(item.rep || '0'),
      'docs.count': parseInt(item['docs.count'] || '0'),
      'docs.deleted': parseInt(item['docs.deleted'] || '0'),
      'store.size': item['store.size'] || '0b',
      'pri.store.size': item['pri.store.size'] || '0b',
    }));
  }

  async getIndexInfo(index: string): Promise<any> {
    try {
      const [stats, mappings, settings] = await Promise.all([
        this.client.indices.stats({ index }),
        this.client.indices.getMapping({ index }),
        this.client.indices.getSettings({ index }),
      ]);

      return {
        stats: stats.indices?.[index],
        mappings: mappings[index]?.mappings,
        settings: settings[index]?.settings,
      };
    } catch (error) {
      throw new Error(`Failed to get index info: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  async createIndex(options: CreateIndexOptions): Promise<{ acknowledged: boolean; shards_acknowledged: boolean }> {
    const body: any = {};
    
    if (options.mappings) {
      body.mappings = options.mappings;
    }
    
    if (options.settings) {
      body.settings = options.settings;
    }

    const response = await this.client.indices.create({
      index: options.index,
      body: Object.keys(body).length > 0 ? body : undefined,
    });

    return response;
  }

  async deleteIndex(index: string): Promise<{ acknowledged: boolean }> {
    const response = await this.client.indices.delete({ index });
    return response;
  }

  async indexExists(index: string): Promise<boolean> {
    try {
      const response = await this.client.indices.exists({ index });
      return response;
    } catch {
      return false;
    }
  }

  async search(options: SearchOptions): Promise<SearchResult> {
    const searchParams: any = {
      index: options.index,
      size: Math.min(options.size || 10, 1000), // Limit to max 1000 results
      from: options.from || 0,
    };

    if (options.query) {
      searchParams.body = { query: options.query };
    }

    if (options.sort) {
      searchParams.body = { ...searchParams.body, sort: options.sort };
    }

    if (options._source !== undefined) {
      searchParams.body = { ...searchParams.body, _source: options._source };
    }

    if (options.highlight) {
      searchParams.body = { ...searchParams.body, highlight: options.highlight };
    }

    if (options.aggs) {
      searchParams.body = { ...searchParams.body, aggs: options.aggs };
    }

    if (options.track_total_hits !== undefined) {
      searchParams.body = { ...searchParams.body, track_total_hits: options.track_total_hits };
    }

    const response = await this.client.search(searchParams);
    
    // Transform the response to match our SearchResult interface
    return {
      took: response.took,
      timed_out: response.timed_out,
      hits: {
        total: {
          value: typeof response.hits.total === 'number' ? response.hits.total : (response.hits.total?.value || 0),
          relation: typeof response.hits.total === 'object' ? (response.hits.total?.relation || 'eq') : 'eq',
        },
        max_score: response.hits.max_score || 0,
        hits: response.hits.hits.map((hit: any) => ({
          _index: hit._index,
          _id: hit._id,
          _score: hit._score || 0,
          _source: hit._source,
          highlight: hit.highlight,
        })),
      },
      aggregations: response.aggregations,
    };
  }

  async count(index: string, query?: any): Promise<{ count: number }> {
    const params: any = { index };
    
    if (query) {
      params.body = { query };
    }

    const response = await this.client.count(params);
    return response;
  }

  async getDocument(index: string, id: string): Promise<any> {
    try {
      const response = await this.client.get({ index, id });
      return {
        _index: response._index,
        _id: response._id,
        _version: response._version,
        found: response.found,
        _source: response._source,
      };
    } catch (error: any) {
      if (error.statusCode === 404) {
        return { found: false };
      }
      throw error;
    }
  }

  async indexDocument(operation: DocumentOperation): Promise<any> {
    const params: any = {
      index: operation.index,
      body: operation.document,
    };

    if (operation.id) {
      params.id = operation.id;
    }

    if (operation.refresh) {
      params.refresh = operation.refresh;
    }

    const response = await this.client.index(params);
    return {
      _index: response._index,
      _id: response._id,
      _version: response._version,
      result: response.result,
    };
  }

  async updateDocument(index: string, id: string, document: any, refresh?: boolean): Promise<any> {
    const params: any = {
      index,
      id,
      body: { doc: document },
    };

    if (refresh) {
      params.refresh = refresh;
    }

    const response = await this.client.update(params);
    return {
      _index: response._index,
      _id: response._id || '',
      _version: response._version,
      result: response.result,
    };
  }

  async deleteDocument(index: string, id: string, refresh?: boolean): Promise<any> {
    const params: any = { index, id };

    if (refresh) {
      params.refresh = refresh;
    }

    const response = await this.client.delete(params);
    return {
      _index: response._index,
      _id: response._id,
      _version: response._version,
      result: response.result,
    };
  }

  async bulkOperation(operation: BulkOperation): Promise<any> {
    const body: any[] = [];

    operation.operations.forEach(op => {
      const action: any = { [op.action]: { _index: operation.index } };
      
      if (op.id) {
        action[op.action]._id = op.id;
      }

      body.push(action);

      if (op.action !== 'delete' && op.document) {
        body.push(op.document);
      }
    });

    const params: any = { body };

    if (operation.refresh) {
      params.refresh = operation.refresh;
    }

    const response = await this.client.bulk(params);
    
    return {
      took: response.took,
      errors: response.errors,
      items: response.items.map((item: any) => {
        const action = Object.keys(item)[0];
        return {
          action,
          _index: item[action]._index,
          _id: item[action]._id,
          _version: item[action]._version,
          result: item[action].result,
          status: item[action].status,
          error: item[action].error,
        };
      }),
    };
  }

  async performAggregation(options: AggregationOptions): Promise<any> {
    const searchParams: any = {
      index: options.index,
      size: options.size || 0, // Default to 0 to only get aggregations
      body: {
        aggs: options.aggs,
      },
    };

    if (options.query) {
      searchParams.body.query = options.query;
    }

    const response = await this.client.search(searchParams);
    
    return {
      took: response.took,
      hits: {
        total: response.hits.total,
      },
      aggregations: response.aggregations,
    };
  }

  async deleteByQuery(index: string, query: any, refresh?: boolean): Promise<any> {
    const params: any = {
      index,
      body: { query },
      // Limit deletions to prevent accidental mass deletions
      max_docs: 10000,
    };

    if (refresh) {
      params.refresh = refresh;
    }

    const response = await this.client.deleteByQuery(params);
    
    return {
      took: response.took,
      timed_out: response.timed_out,
      total: response.total,
      deleted: response.deleted,
      batches: response.batches,
      version_conflicts: response.version_conflicts,
      noops: response.noops,
      retries: response.retries,
      throttled_millis: response.throttled_millis,
      requests_per_second: response.requests_per_second,
      throttled_until_millis: response.throttled_until_millis,
      failures: response.failures,
    };
  }

  async reindex(sourceIndex: string, destIndex: string, query?: any): Promise<any> {
    const reindexParams: any = {
      source: { index: sourceIndex },
      dest: { index: destIndex },
    };

    if (query) {
      reindexParams.source.query = query;
    }

    const response = await this.client.reindex(reindexParams);
    
    return {
      took: response.took,
      timed_out: response.timed_out,
      total: response.total,
      updated: response.updated,
      created: response.created,
      deleted: response.deleted,
      batches: response.batches,
      version_conflicts: response.version_conflicts,
      noops: response.noops,
      retries: response.retries,
      throttled_millis: response.throttled_millis,
      requests_per_second: response.requests_per_second,
      throttled_until_millis: response.throttled_until_millis,
      failures: response.failures,
    };
  }

  async getNodeStats(): Promise<any> {
    const response = await this.client.nodes.stats({
      metric: ['indices', 'jvm', 'process', 'fs'],
    });
    
    // Simplify the response to avoid huge data dumps
    const simplifiedStats: any = {};
    
    Object.keys(response.nodes).forEach(nodeId => {
      const node = response.nodes[nodeId];
      simplifiedStats[nodeId] = {
        name: node.name,
        roles: node.roles,
        indices: {
          docs: node.indices?.docs,
          store: node.indices?.store,
          search: node.indices?.search,
          indexing: node.indices?.indexing,
        },
        jvm: {
          heap_used_percent: node.jvm?.mem?.heap_used_percent,
          heap_used: node.jvm?.mem?.heap_used_in_bytes,
          heap_max: node.jvm?.mem?.heap_max_in_bytes,
        },
        process: {
          cpu_percent: node.process?.cpu?.percent,
          open_file_descriptors: node.process?.open_file_descriptors,
        },
        fs: {
          total: node.fs?.total?.total_in_bytes,
          available: node.fs?.total?.available_in_bytes,
          free: node.fs?.total?.free_in_bytes,
        },
      };
    });
    
    return simplifiedStats;
  }
}