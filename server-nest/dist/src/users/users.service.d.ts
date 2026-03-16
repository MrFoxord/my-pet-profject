import { PrismaService } from '../prisma/prisma.service';
import { UpdateDefaultProfileDto } from './dto/update-default-profile.dto';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getDefaultState(userId: string): Promise<{
        id: string;
        name: string;
        nickname: string;
        firstName: string;
        lastName: string;
        isDefault: boolean;
        workRole: import("../generated/prisma/enums").WorkRole;
    }>;
    updateDefaultProfile(userId: string, dto: UpdateDefaultProfileDto): Promise<{
        id: string;
        name: string;
        nickname: string;
        firstName: string;
        lastName: string;
        isDefault: boolean;
        workRole: import("../generated/prisma/enums").WorkRole;
    }>;
}
