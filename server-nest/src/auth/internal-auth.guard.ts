import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

export interface ServiceJwtPayload {
  sub?: string; // userId — may be absent for unauthenticated sessions
  iat?: number;
  exp?: number;
}

@Injectable()
export class InternalAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<Request & { serviceUser?: ServiceJwtPayload }>();

    const auth = req.headers['authorization'];
    if (!auth?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = auth.slice(7);
    try {
      const payload = this.jwtService.verify<ServiceJwtPayload>(token);
      // Attach decoded claims to the request so controllers can read them
      req.serviceUser = payload;
      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
