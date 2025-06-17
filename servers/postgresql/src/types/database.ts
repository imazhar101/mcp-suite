export interface DatabaseConnection {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
}

export interface QueryResult {
  rows: any[];
  rowCount: number;
  fields?: FieldInfo[];
}

export interface FieldInfo {
  name: string;
  dataTypeID: number;
  dataTypeSize: number;
  dataTypeModifier: number;
}

export interface TableSchema {
  tableName: string;
  columns: ColumnInfo[];
}

export interface ColumnInfo {
  columnName: string;
  dataType: string;
  isNullable: boolean;
  defaultValue?: string;
  isPrimaryKey: boolean;
}

export interface DatabaseStats {
  totalTables: number;
  totalRows: number;
  databaseSize: string;
}
