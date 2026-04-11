export class RequestHandler {
  #baseUrl: string;

  /**
   * @param baseUrl
   */
  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error("Base url is missing");
    }
    this.#baseUrl = baseUrl;
  }

  getBaseUrl(): string {
    return this.#baseUrl;
  }

  /**
   * Executes a Request and returns parsed response
   * @param request
   */
  async perform(request: Request): Promise<Response> {
    if (!(request instanceof Request)) {
      throw new Error("Invalid request type");
    }
    return await fetch(request);
  }

  static RequestBuilder = class {
    #method: string = "";
    #url: string = "";
    #headers: Headers = new Headers();
    #content: unknown = null;

    get() {
      this.#method = "GET";
      return this;
    }

    post() {
      this.#method = "POST";
      return this;
    }

    patch() {
      this.#method = "PATCH";
      return this;
    }

    delete() {
      this.#method = "DELETE";
      return this;
    }

    put() {
      this.#method = "PUT";
      return this;
    }

    content(value: unknown) {
      this.#content = value;
      return this;
    }

    url(url: string) {
      this.#url = url;
      return this;
    }

    header(header: string, value: string) {
      this.#headers.set(header, value);
      return this;
    }

    bearer(value: string) {
      this.#headers.set("Authorization", `Bearer ${value}`);
      return this;
    }

    #getBody(): BodyInit | undefined {
      if (this.#content == null) return undefined;

      // allow raw types
      if (typeof this.#content === "string" || this.#content instanceof FormData || this.#content instanceof Blob) {
        return this.#content;
      }

      // Auto JSON if content-type not set
      if (!this.#headers.has("Content-Type")) {
        this.#headers.set("Content-Type", "application/json");
      }

      return JSON.stringify(this.#content);
    }

    build(): Request {
      if (!this.#url) {
        throw new Error("RequestBuilder: URL is required");
      }

      if (!this.#method) {
        throw new Error("RequestBuilder: HTTP method is required");
      }

      const options: RequestInit = {
        method: this.#method,
        headers: this.#headers,
      };

      if (this.#method !== "GET" && this.#method !== "DELETE") {
        const body = this.#getBody();
        if (body !== undefined) {
          options.body = body;
        }
      }

      return new Request(this.#url, options);
    }
  };
}
