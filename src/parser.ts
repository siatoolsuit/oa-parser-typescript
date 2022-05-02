import { API, OpenAPI3, Operation, Schema } from './model';
import { SwaggerService } from './service';

export class OpenAPIParser {
  private swaggerService: SwaggerService;

  constructor() {
    this.swaggerService = new SwaggerService();
  }

  public async fromURL(urls: string[]): Promise<API[]> {
    const result: API[] = [];

    for (const url of urls) {
      const spec = await this.swaggerService.loadOpenApiSpecJson(url);

      // Ensure that the specification is OpenAPI 3
      const transformedSpec: OpenAPI3 = await this.swaggerService.transformSpecification(spec);

      // Parse the api specification and transform it to an easier api specification
      const api = this.parseSpecification(transformedSpec, url); 
      result.push(api);
    }
    return result;
  }

  private parseSpecification(transformedSpec: OpenAPI3, uri: string): API {
    if ((uri.startsWith('http://') || uri.startsWith('https://')) && transformedSpec.servers.length === 0) {
      uri = new URL(uri).origin;
    }

    const api = {
      name: transformedSpec.info.title,
      baseUri: transformedSpec.servers[0].url || uri,
      endpoints: [],
    };
    for (const pathKey in transformedSpec.paths) {
      const path = transformedSpec.paths[pathKey];
      for (const methodKey in path) {
        const method: Operation = path[methodKey];
        // Create the base endpoint object
        const endpoint = {
          path: pathKey,
          method: methodKey.toUpperCase(),
        };

        // Add the response
        const okRes: Schema = this.swaggerService.findOkRes(method.responses);
        const response = this.swaggerService.simplifySchema(okRes);
        endpoint['response'] = response;

        // Add a request body if there is one defined in the specification
        if (method.requestBody) {
          const req: Schema = this.swaggerService.findReq(method.requestBody);
          const request = this.swaggerService.simplifySchema(req);
          endpoint['request'] = request;
        }

        api.endpoints.push(endpoint);
      }
    }
    return api as API;
  }
}
