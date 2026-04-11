export class RegisterRequest {
  #displayName: string;
  #emailAddress: string;
  #password: string;
  #passwordConfirm: string;

  constructor(
    displayName: string = "",
    emailAddress: string = "",
    password: string = "",
    passwordConfirm: string = "",
  ) {
    this.#displayName = displayName;
    this.#emailAddress = emailAddress;
    this.#password = password;
    this.#passwordConfirm = passwordConfirm;
  }

  #validate() {
    if (!this.#displayName.trim()) {
      throw new Error("Your username is required");
    }

    if (!this.#emailAddress.trim()) {
      throw new Error("Email address is required");
    }

    if (!this.#isValidEmail(this.#emailAddress)) {
      throw new Error("Invalid email address format");
    }

    if (!this.#password || this.#password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    if (!this.#passwordsMatch()) {
      throw new Error("Passwords do not match");
    }
  }

  toJson() {
    this.#validate();
    return {
      displayName: this.#displayName,
      emailAddress: this.#emailAddress,
      password: this.#password,
      passwordConfirm: this.#passwordConfirm,
    };
  }
  #passwordsMatch(): boolean {
    return this.#password === this.#passwordConfirm && this.#password !== "";
  }

  #isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
}
