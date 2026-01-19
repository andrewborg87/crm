export interface KrakendServiceArg {
  serviceUrl: string;
  serviceDirectory?: string;
  serviceName: string;
}

export interface KrakendSchema extends Record<string, unknown> {
  $schema: string;
  endpoints: KrakendEndpoint[];
}

export type Method = 'GET' | 'OPTIONS' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface KrakendEndpoint {
  backend: [{ method: Method; url_pattern: string; host: [string] }];
  endpoint: string;
  method: Method;
  output_encoding?: 'json' | 'no-op' | 'string' | 'xml';
  extra_config?: Record<string, unknown>;
  input_headers?: string[];
  input_query_strings?: string[];
}

interface ParameterSchema {
  name: string;
  required: boolean;
  in: string;
  description: string;
  schema: {
    default?: number;
    type: string;
  };
}

export interface RequestInfo {
  operationId: string;
  parameters: ParameterSchema[];
  security: Record<string, string[]>[];
  tags?: string[];
}

interface PathInfo {
  get?: RequestInfo;
  post?: RequestInfo;
  put?: RequestInfo;
  patch?: RequestInfo;
  delete?: RequestInfo;
  options?: RequestInfo;
  head?: RequestInfo;
  externalPath?: string;
  localPath?: string;
}

type Paths = Record<string, PathInfo>;

export interface SwaggerDoc {
  paths: Paths;
  openapi: string;
}
