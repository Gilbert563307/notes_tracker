import type { UserDto } from "./domain/User";


export type CreateUserResponse = {
  created: boolean;
  message: string;
  user: UserDto | null;
};
