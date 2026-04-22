import { User } from "../../domain/User";

export type AuthenticationCookie = {
  token: string;
  user: { id: string; displayName: string; photoURL: string };
};

export class Authentication {
  private token: string | null;
  private user: User | null;

  private constructor(token: string | null, user: User | null) {
    this.token = token;
    this.user = user;
  }

  getToken() {
    return this.token;
  }
  getUser() {
    return this.user;
  }

  toJson() {
    if (!this.token || !this.user) {
      throw new Error("The user or token are null");
    }
    return { token: this.token, user: this.user.toJson() };
  }

  static from(cookie: AuthenticationCookie): Authentication {
    if (!cookie.token || !cookie.user) {
      throw new Error("The user or token are null");
    }
    return new Authentication(cookie.token, User.from(cookie.user));
  }

  static Builder = class {
    private _token: string | null = null;
    private _user: User | null = null;

    token(token: string) {
      this._token = token;
      return this;
    }

    user(user: User) {
      if (!(user instanceof User)) {
        throw new Error("The provided user must be an instance of the User");
      }
      this._user = user;
      return this;
    }

    build() {
      if (this._token === null || this._user === null) {
        throw new Error("The user or token are null");
      }
      return new Authentication(this._token, this._user);
    }
  };
}
