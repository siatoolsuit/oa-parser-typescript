// https://github.com/drwpow/openapi-typescript/blob/main/src/types.ts
// This files contains a typed model for OpenApi3 and OpenApi2 (Swagger)

export interface OpenAPI2 {
  swagger: string;
  paths?: Record<string, PathItem>;
  definitions?: Record<string, Schema>;
  parameters?: Parameter;
  responses: Record<string, Response>; 
}

export interface OpenAPI3 {
  openapi: string;
  info?: Info;
  servers?: Server[],
  paths?: Record<string, PathItem>;
  components?: {
    schemas?: Record<string, Schema>;
    response?: Record<string, Response>;
    parameters?: Record<string, Parameter>;
    requestBodies?: Record<string, RequestBody>;
    headers?: Record<string, Header>
    links?: Record<string, Link>;
  }
}

export interface Info {
  description?: string;
  title?: string;
  version?: string;
}

export interface Server {
  url?: string;
  description?: string;
}

export interface PathItem {
  $ref?: string;
  summary?: string;
  description?: string;
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation; 
  parameters?: Parameter[];
}

export interface Schema {
  title?: string;
  description?: string;
  required?: string[];
  enum?: string[];
  type?: string; 
  items?: Schema;
  allOf?: Schema;
  properties?: Record<string, Schema>;
  default?: any;
  additionalProperties?: boolean | Schema;
  nullable?: boolean;
  oneOf?: Schema[];
  anyOf?: Schema[];
  format?: string;
}

export interface Parameter {
  name?: string;
  in?: "query" | "header" | "path" | "cookie" | "formData" | "body";
  description?: string;
  required?: boolean;
  deprecated?: boolean;
  schema?: Schema;
  type?: "string" | "number" | "integer" | "boolean" | "array" | "file";
  items?: Schema;
  enum?: string[];
}

export interface Response {
  description?: string;
  headers?: Record<string, Header>;
  schema?: Schema;
  links?: Record<string, Link>;
  content?: {
    [contentType: string]: { schema: Schema };
  };
}

export interface Header {
  type?: string;
  description?: string;
  required?: boolean;
  schema: Schema;
}

export interface Link {
  operationRef?: string;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  description?: string;
}

export interface Operation {
  description?: string;
  tags?: string[];
  summary?: string;
  operationId?: string;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses?: Record<string, Response>;
}

export interface RequestBody {
  description?: string;
  content?: {
    [contentType: string]: { schema: Schema };
  };
}
