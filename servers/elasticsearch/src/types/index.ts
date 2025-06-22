export interface ElasticsearchConfig {
  node: string;
  auth?: {
    username: string;
    password: string;
  } | {
    apiKey: string;
  };
  maxRetries?: number;
  requestTimeout?: number;
  sniffOnStart?: boolean;
  sniffInterval?: number;
}

export interface SearchOptions {
  index: string;
  query?: any;
  size?: number;
  from?: number;
  sort?: any[];
  _source?: string[] | boolean;
  highlight?: any;
  aggs?: any;
  track_total_hits?: boolean;
}

export interface SearchResult {
  took: number;
  timed_out: boolean;
  hits: {
    total: {
      value: number;
      relation: string;
    };
    max_score: number;
    hits: Array<{
      _index: string;
      _id: string;
      _score: number;
      _source: any;
      highlight?: any;
    }>;
  };
  aggregations?: any;
}

export interface IndexInfo {
  health: string;
  status: string;
  index: string;
  uuid: string;
  pri: number;
  rep: number;
  'docs.count': number;
  'docs.deleted': number;
  'store.size': string;
  'pri.store.size': string;
}

export interface ClusterHealth {
  cluster_name: string;
  status: string;
  timed_out: boolean;
  number_of_nodes: number;
  number_of_data_nodes: number;
  active_primary_shards: number;
  active_shards: number;
  relocating_shards: number;
  initializing_shards: number;
  unassigned_shards: number;
  delayed_unassigned_shards: number;
  number_of_pending_tasks: number;
  number_of_in_flight_fetch: number;
  task_max_waiting_in_queue_millis: number;
  active_shards_percent_as_number: number;
}

export interface DocumentOperation {
  index: string;
  id?: string;
  document: any;
  refresh?: boolean;
}

export interface BulkOperation {
  index: string;
  operations: Array<{
    action: 'index' | 'create' | 'update' | 'delete';
    id?: string;
    document?: any;
  }>;
  refresh?: boolean;
}

export interface AggregationOptions {
  index: string;
  aggs: any;
  query?: any;
  size?: number;
}

export interface MappingProperty {
  type: string;
  properties?: Record<string, MappingProperty>;
  fields?: Record<string, MappingProperty>;
  analyzer?: string;
  search_analyzer?: string;
  format?: string;
  [key: string]: any;
}

export interface IndexMapping {
  properties: Record<string, MappingProperty>;
}

export interface IndexSettings {
  number_of_shards?: number;
  number_of_replicas?: number;
  refresh_interval?: string;
  max_result_window?: number;
  [key: string]: any;
}

export interface CreateIndexOptions {
  index: string;
  mappings?: IndexMapping;
  settings?: IndexSettings;
}