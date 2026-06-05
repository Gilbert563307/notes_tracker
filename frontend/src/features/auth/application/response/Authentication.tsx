import { User } from "../../domain/User";

export type AuthenticationCookie = {
  user: { id: string; displayName: string; photoURL: string };
};

export class Authentication {
  private user: User | null;

  private constructor(user: User | null) {
    this.user = user;
  }

  getUser() {
    return this.user;
  }

  toJson() {
    return this.user.toJson();
  }

  static from(cookie: AuthenticationCookie): Authentication {
    if (!cookie.user) {
      throw new Error("The user is  null");
    }
    return new Authentication(User.from(cookie.user));
  }

  static Builder = class {
    private _user: User | null = null;

    user(user: User) {
      if (!(user instanceof User)) {
        throw new Error("The provided user must be an instance of the User");
      }
      this._user = user;
      return this;
    }

    build() {
      if (this._user === null) {
        throw new Error("The user or token are null");
      }
      return new Authentication(this._user);
    }
  };
}
