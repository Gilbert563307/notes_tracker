import type { UserDto } from "../../domain/UserDto";

export class AuthResponse {
  private token: string;
  private user: UserDto;

  protected constructor(token: string, user: UserDto) {
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
    return { token: this.token, user: this.user.toJson() };
  }

  static Builder = class {
    private _token: string;
    private _user: UserDto;

    token(token: string) {
      this._token = token;
      return this;
    }

    user(user: UserDto) {
      this._user = user;
      return this;
    }

    build() {
      return new AuthResponse(this._token, this._user);
    }
  };
}
