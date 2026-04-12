import { UserDto } from "../../domain/UserDto";

export type AuthResponseCookie = {
  token: string;
  user: { id: string; displayName: string; photoURL: string };
};

export class AuthResponse {
  private token: string | null;
  private user: UserDto | null;

  private constructor(token: string | null, user: UserDto | null) {
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

  static from(cookie: AuthResponseCookie): AuthResponse {
    if (!cookie.token || !cookie.user) {
      throw new Error("The user or token are null");
    }
    return new AuthResponse(cookie.token, UserDto.from(cookie.user));
  }

  static Builder = class {
    private _token: string | null = null;
    private _user: UserDto | null = null;

    token(token: string) {
      this._token = token;
      return this;
    }

    user(user: UserDto) {
      if (!(user instanceof UserDto)) {
        throw new Error("The provided user must be an instance of the UserDto");
      }
      this._user = user;
      return this;
    }

    build() {
      if (this._token === null || this._user === null) {
        throw new Error("The user or token are null");
      }
      return new AuthResponse(this._token, this._user);
    }
  };
}
