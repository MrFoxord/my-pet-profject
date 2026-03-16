"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDefaultState(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                firstName: true,
                lastName: true,
                nickname: true,
                workRole: true,
                isDefault: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('user not found');
        return user;
    }
    async updateDefaultProfile(userId, dto) {
        const firstName = dto.firstName.trim();
        const lastName = dto.lastName.trim();
        const nickname = dto.nickname?.trim() || null;
        if (!firstName || !lastName) {
            throw new common_1.BadRequestException('firstName and lastName are required');
        }
        try {
            const updated = await this.prisma.user.update({
                where: { id: userId },
                data: {
                    firstName,
                    lastName,
                    name: `${firstName} ${lastName}`,
                    nickname,
                    workRole: dto.workRole,
                    isDefault: false,
                },
                select: {
                    id: true,
                    name: true,
                    firstName: true,
                    lastName: true,
                    nickname: true,
                    workRole: true,
                    isDefault: true,
                },
            });
            return updated;
        }
        catch (error) {
            if (typeof error === 'object' &&
                error !== null &&
                'code' in error &&
                error.code === 'P2002') {
                throw new common_1.BadRequestException('nickname already exists');
            }
            throw error;
        }
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map