export class AuthenticateRequest {
  #email: string;
  #password: string;

  constructor(email: string, password: string) {
    this.#email = email;
    this.#password = password;
  }

  validate() {
    if (!this.#email.trim()) {
      throw new Error("Email is required");
    }

    if (!this.#isValidEmail(this.#email)) {
      throw new Error("Invalid email address");
    }

    if (!this.#password.trim()) {
      throw new Error("Password is required");
    }
  }

  toJson() {
    // Always validate before returning payload
    this.validate();

    return {
      email: this.#email,
      password: this.#password,
    };
  }

  #isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
