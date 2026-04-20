export class CreateKanBoardRequest {
  #name: string;
  #color: string;

  constructor(name: string, color: string) {
    this.#name = name;
    this.#color = color;
  }

  getName() {
    return this.#name;
  }
  getColor() {
    return this.#color;
  }
}
