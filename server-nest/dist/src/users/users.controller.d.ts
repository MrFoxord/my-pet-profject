import { Request } from 'express';
import { ServiceJwtPayload } from '../auth/internal-auth.guard';
import { UpdateDefaultProfileDto } from './dto/update-default-profile.dto';
import { UsersService } from './users.service';
type AuthRequest = Request & {
    serviceUser?: ServiceJwtPayload;
};
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getDefaultState(req: AuthRequest): Promise<{
        id: string;
        name: string;
        firstName: string;
        lastName: string;
        nickname: string;
        isDefault: boolean;
        workRole: import("../generated/prisma/enums").WorkRole;
    }>;
    updateDefaultProfile(req: AuthRequest, dto: UpdateDefaultProfileDto): Promise<{
        id: string;
        name: string;
        firstName: string;
        lastName: string;
        nickname: string;
        isDefault: boolean;
        workRole: import("../generated/prisma/enums").WorkRole;
    }>;
}
export {};
