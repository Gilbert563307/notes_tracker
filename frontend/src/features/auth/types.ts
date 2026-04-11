import type { UserDto } from "./domain/UserDto";


export type CreateUserResponse = {
  created: boolean;
  message: string;
  user: UserDto | null;
};
