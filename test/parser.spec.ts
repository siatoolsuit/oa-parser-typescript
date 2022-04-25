import { readFileSync } from 'fs';
import { API, OpenAPIParser } from '../src';

describe('OpenAPIParser', () => {
  let parser: OpenAPIParser;

  beforeAll(() => {
    parser = new OpenAPIParser();
  });

  describe('fromURL', () => {
    it('should return a generalized api specification', async () => {
      // Parse OpenAPI specification
      const api: API[] = await parser.fromURL(['./test/example.json']);
      const pioneers = api[0];

      // Load simplified api specification TODO: Das example händisch fertig schreiben und dann die arrays bauen
      const example = JSON.parse(readFileSync('./test/example.siarc.json').toString());

      // Compare generated and defined simplified api specification
      expect(pioneers).toBe(example);
    }); 
  });
});