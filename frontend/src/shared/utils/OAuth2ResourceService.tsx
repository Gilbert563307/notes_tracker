import { RequestHandler } from "./RequestHandler";

/**
 * Usage for spring OAuth2 credential based API'S
 */
export class OAuth2ResourceService {
  #resource: string;
  #requestHandler: RequestHandler;

  constructor(resource: string, requestHandler: RequestHandler) {
    this.#resource = resource;
    this.#requestHandler = requestHandler;
  }

  async create(data: unknown): Promise<Response> {
    const request = new RequestHandler.RequestBuilder()
      .post()
      .url(this.#requestHandler.getBaseUrl() + this.#resource)
      .withCredentials()
      .content(data)
      .build();

    return await this.#requestHandler.perform(request);
  }

  async read(id: string | number): Promise<Response> {
    const request = new RequestHandler.RequestBuilder()
      .get()
      .url(this.#requestHandler.getBaseUrl() + this.#resource + `/${id}`)
      .withCredentials()
      .build();

    return await this.#requestHandler.perform(request);
  }

  async update(data: unknown): Promise<Response> {
    const request = new RequestHandler.RequestBuilder()
      .put()
      .url(this.#requestHandler.getBaseUrl() + this.#resource)
      .withCredentials()
      .content(data)
      .build();
    return await this.#requestHandler.perform(request);
  }

  async delete(id: string | number): Promise<Response> {
    const request = new RequestHandler.RequestBuilder()
      .delete()
      .url(this.#requestHandler.getBaseUrl() + this.#resource + `/${id}`)
      .withCredentials()
      .build();

    return await this.#requestHandler.perform(request);
  }

  async findAll(): Promise<Response> {
    const request = new RequestHandler.RequestBuilder()
      .get()
      .url(this.#requestHandler.getBaseUrl() + this.#resource)
      .withCredentials()
      .build();

    return await this.#requestHandler.perform(request);
  }

  getRequestHandler(): RequestHandler {
    return this.#requestHandler;
  }

  getResource(): string {
    return this.#resource;
  }
}
