import jwt_decode from 'jwt-decode';

import { User } from '../store/models/user';

export type ApplicatoinToken = { sub: string; name: string; role: string; exp: number };

export class AuthUtils {
  static decodeToken(token: string): ApplicatoinToken {
    return jwt_decode<ApplicatoinToken>(token);
  }

  static tokenToUser(token: string, permissions: string[]): Partial<User> {
    const jwtToken = this.decodeToken(token);
    return {
      id: jwtToken.sub,
      name: jwtToken.name,
      role: jwtToken.role,
      permissions: permissions
    };
  }
}
