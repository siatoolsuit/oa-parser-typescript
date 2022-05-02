// This file contains interfaces which are generalizations of OpenAPI specifications

export interface API {
  name: string;
  baseUri: string;
  endpoints: Endpoint[];
}

export interface Endpoint {
  path: string;
  method: string;
  response: Record<string, any> | string;
  request?: Record<string, any>;
}
