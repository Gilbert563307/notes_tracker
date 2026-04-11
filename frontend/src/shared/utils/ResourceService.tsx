import { RequestHandler } from "./RequestHandler";

export class ResourceService {
  #resource: string;
  #requestHandler: RequestHandler;

  constructor(resource: string, requestHandler: RequestHandler) {
    this.#resource = resource;
    this.#requestHandler = requestHandler;
  }

  async create(token: string, data: unknown) {
    const request = new RequestHandler.RequestBuilder()
      .post()
      .url(this.#requestHandler.getBaseUrl() + this.#resource)
      .bearer(token)
      .content(data)
      .build();

    return await this.#requestHandler.perform(request);
  }

  async read(token: string, id: string | number) {
    const request = new RequestHandler.RequestBuilder()
      .get()
      .url(this.#requestHandler.getBaseUrl() + this.#resource + `/${id}`)
      .bearer(token)
      .build();

    return await this.#requestHandler.perform(request);
  }

  async update(token: string, data: unknown) {
    const request = new RequestHandler.RequestBuilder()
      .put()
      .url(this.#requestHandler.getBaseUrl() + this.#resource)
      .bearer(token)
      .content(data)
      .build();

    return await this.#requestHandler.perform(request);
  }

  async delete(token: string, id: string | number) {
    const request = new RequestHandler.RequestBuilder()
      .delete()
      .url(this.#requestHandler.getBaseUrl() + this.#resource + `/${id}`)
      .bearer(token)
      .build();

    return await this.#requestHandler.perform(request);
  }

  async findAll(token: string){
const request = new RequestHandler.RequestBuilder()
      .get()
      .url(this.#requestHandler.getBaseUrl() + this.#resource)
      .bearer(token)
      .build();

    return await this.#requestHandler.perform(request);
  }
}
