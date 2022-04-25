// This file contains interfaces which are generalizations of OpenAPI specifications

export interface API {
  name: string;
  baseURI: string;
  endpoints: Endpoint[];
}

export interface Endpoint {
  path: string;
  method: string;
  response: Record<string, string> | string;
  request?: Record<string, string>;
}
