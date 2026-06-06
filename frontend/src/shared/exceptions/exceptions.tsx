// export type BaseExceptionTypes = {
//   INFO: 0;
//   DANGER: 1;
//   SUCCESS: 2;
//   PRIMARY: 3;
// };

export abstract class BaseException extends Error {
  type: 0 | 1 | 2 | 3;
  constructor(message: string, type: 0 | 1 | 2 | 3) {
    super(message);
    this.type = type;
  }
}
