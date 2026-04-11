type SameSite = "lax" | "strict" | "none";

interface CookieData {
  name: string;
  value: string;
  expires?: number | null;
  partitioned?: boolean;
  domain?: string | null;
  path?: string;
  sameSite?: SameSite;
}

export class UseCookieStorage {
  static async createCookie(data: CookieData): Promise<void> {
    await cookieStore.set({
      name: data.name,
      value: data.value,
      expires: data.expires,
      partitioned: data.partitioned,
      domain: data.domain,
      path: data.path,
      sameSite: data.sameSite,
    });
  }

  async readCookie(cookieName: string): Promise<CookieListItem | null> {
    if (!cookieName) {
      throw new Error("Cookie name cannot be empty or null");
    }
    return cookieStore.get(cookieName);
  }

  async readCookieValue(cookieName: string): Promise<string | null> {
    if (!cookieName) {
      throw new Error("Cookie name cannot be empty or null");
    }

    const cookie = await cookieStore.get(cookieName);
    return cookie?.value ?? null;
  }

  async deleteCookie(cookieName: string): Promise<void> {
    if (!cookieName) {
      throw new Error("Cookie name cannot be empty or null");
    }
    await cookieStore.delete({ name: cookieName, path: "/" });
  }

  static CookieBuilder = class {
    private _name?: string;
    private _value?: string;
    private _expires?: number;
    private _partitioned: boolean = false;
    private _domain: string | null = null;
    private _path: string = "/";
    private _sameSite: SameSite = "lax";

    name(name: string): this {
      this._name = name;
      return this;
    }

    value(value: string): this {
      this._value = value;
      return this;
    }

    expires(expires: number): this {
      this._expires = expires;
      return this;
    }

    partitioned(partitioned: boolean): this {
      this._partitioned = partitioned;
      return this;
    }

    domain(domain: string | null): this {
      this._domain = domain;
      return this;
    }

    path(path: string): this {
      this._path = path;
      return this;
    }

    sameSite(sameSite: SameSite): this {
      this._sameSite = sameSite;
      return this;
    }

    build(): Required<CookieData> {
      if (!this._name) {
        throw new Error("Cookie name cannot be empty");
      }

      if (!this._value) {
        throw new Error("Cookie value cannot be empty");
      }

      const validSameSites: SameSite[] = ["strict", "lax", "none"];
      if (!validSameSites.includes(this._sameSite)) {
        throw new Error("Same site is invalid, must be of type 'strict' | 'lax' | 'none'");
      }

      return {
        name: this._name,
        value: this._value,
        expires: this._expires ?? null,
        partitioned: this._partitioned,
        domain: this._domain,
        path: this._path,
        sameSite: this._sameSite,
      };
    }
  };
}
