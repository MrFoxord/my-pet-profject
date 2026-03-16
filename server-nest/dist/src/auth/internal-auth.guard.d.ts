import { CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
export interface ServiceJwtPayload {
    sub?: string;
    iat?: number;
    exp?: number;
}
export declare class InternalAuthGuard implements CanActivate {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    canActivate(context: ExecutionContext): boolean;
}
