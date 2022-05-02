import $RefParser from '@apidevtools/json-schema-ref-parser';
import * as converter from 'swagger2openapi';

import { OpenAPI2, OpenAPI3, Schema, Response, RequestBody } from 'src/model';

const sematicVersionenRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;

// Loads the swagger json file from an given url
export class SwaggerService {
  public async loadOpenApiSpecJson(url: string): Promise<any> {
    // Load and dereference all $ref in the specification
    const resolvedSpec = await $RefParser.dereference(url);
    return resolvedSpec;
  }

  public async transformSpecification(spec: any): Promise<OpenAPI3> {
    let transformedSpec: OpenAPI3;

    // If the spec is nether OpenAPI version 2 or 3, continue 
    if (!(this.isV2(spec) || this.isV3(spec))) {
      throw Error('Not valid OpenAPI spec found!');
    }
    // Check whether it is OpenAPI 2, if so we transform it to OpenApi 3 
    if (this.isV2(spec)) {
      transformedSpec = await this.toV3(spec as OpenAPI2);
    } else if (this.isV3(spec)) {
      transformedSpec = spec as OpenAPI3;
    }

    return transformedSpec;
  }

  public isV2(spec: any): boolean {
    return spec.swagger != null && spec.swagger === '2.0';
  }

  public isV3(spec: any): boolean {
    return spec.openapi != null && spec.openapi.match(sematicVersionenRegex);
  }

  public async toV3(spec: OpenAPI2): Promise<OpenAPI3> {
    return (await converter.convertObj(spec, {})).openapi;
  }

  public simplifySchema(schema: Schema): Record<string, any> | string {
    if (schema.type === 'array') {
      return { isArray: true, type: this.simplifySchema(schema.items)};
    } else if(schema.type === 'object') {
      const typeRecord: Record<string, string> = {};
      for (const prop in schema.properties) {
        typeRecord[prop] = this.simplifySchema(schema.properties[prop] as Schema) as string;
      }
      return typeRecord;
    } else if(schema.type === 'string' || schema.type === 'boolean' || schema.type === 'number') {
      return schema.type;
    } else {
      return '';
    }
  }

  public findOkRes(responses: Record<string, Response>): Schema {
    for (const res in responses) {
      // 2xx like 200 or 201 are okish responses
      if (res.startsWith('2')) {
        const okRefOrObj: Response = responses[res] as Response;
        if (okRefOrObj.content) {
          for (const type in okRefOrObj.content) {
            const schema: Schema = okRefOrObj.content[type].schema as Schema;
            switch (type) {
              case 'application/json':
                return schema;

              default:
                break;
            }
          }
        }
      }
    }
    return { type: 'string' };
  }

  public findReq(requestBody: RequestBody): Schema {
    if (requestBody.content) {
      for (const type in requestBody.content) {
        const schema: Schema = requestBody.content[type].schema as Schema;
        switch (type) {
          case 'application/json':
            return schema;

          default:
            break;
        }
      }
    }
    return { type: 'string' };
  }
}