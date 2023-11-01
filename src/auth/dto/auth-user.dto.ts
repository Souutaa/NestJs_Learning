import { TypeAuth } from '../enum.TypeAuth';
export class AuthUserDto {
  username: string;
  typeAuth: TypeAuth;
  password: string;
}
