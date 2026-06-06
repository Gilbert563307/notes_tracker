export class UseSessionStorage {
  setItem(key: string, value: string): void {
    if (!key || !value) {
      throw new Error("Key or value must be valid");
    }
    sessionStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    if (!key) {
      throw new Error("Key must be valid");
    }
    return sessionStorage.getItem(key);
  }

  removeItem(key: string): void {
    if (!key) {
      throw new Error("Key must be valid");
    }
    sessionStorage.removeItem(key);
  }
}
