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
exports.BoardsAccessService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("../generated/prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const boards_types_1 = require("./boards.types");
let BoardsAccessService = class BoardsAccessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    normalizeRolePermissions(permissions) {
        if (!Array.isArray(permissions)) {
            return [];
        }
        const validPermissions = new Set(boards_types_1.ALL_TICKET_PERMISSIONS);
        return Array.from(new Set(permissions
            .filter((permission) => typeof permission === 'string')
            .map((permission) => permission.trim())
            .filter((permission) => validPermissions.has(permission))));
    }
    normalizeTicketAccessPolicy(accessPolicy) {
        const source = (accessPolicy && typeof accessPolicy === 'object' ? accessPolicy : {});
        const getRoles = (key) => {
            const value = source[key];
            if (!Array.isArray(value)) {
                return [];
            }
            const normalized = value
                .filter((role) => typeof role === 'string')
                .map((role) => role.trim())
                .filter(Boolean);
            return Array.from(new Set(normalized));
        };
        return {
            view: getRoles('view'),
            fill: getRoles('fill'),
            edit: getRoles('edit'),
            delete: getRoles('delete'),
            estimate: getRoles('estimate'),
            comment: getRoles('comment'),
            manageAccess: getRoles('manageAccess'),
        };
    }
    async ensureBoardMembership(boardId, userId) {
        if (!userId) {
            throw new common_1.BadRequestException('user is required');
        }
        const membership = await this.prisma.boardMember.findUnique({
            where: { boardId_userId: { boardId, userId } },
            select: {
                id: true,
                role: true,
                customRole: { select: { name: true, permissions: true } },
            },
        });
        if (!membership) {
            throw new common_1.BadRequestException('board access denied');
        }
        return {
            role: membership.role,
            customRoleName: membership.customRole?.name ?? null,
            customRolePermissions: this.normalizeRolePermissions(membership.customRole?.permissions ?? []),
        };
    }
    canUseTicketPermission(accessPolicy, membership, permission) {
        if (!membership.role) {
            return false;
        }
        if (this.canManageTicketAccess(membership)) {
            return true;
        }
        if (membership.customRoleName?.trim() && membership.customRolePermissions.length > 0) {
            const customRolePermissions = new Set(membership.customRolePermissions);
            if (!customRolePermissions.has(permission)) {
                return false;
            }
        }
        const normalizedPolicy = this.normalizeTicketAccessPolicy(accessPolicy);
        const allowedRoles = normalizedPolicy[permission] ?? [];
        if (!allowedRoles.length) {
            return true;
        }
        const effectiveRoles = this.getEffectiveTicketRoles(membership);
        return allowedRoles.some((role) => effectiveRoles.has(role.toLowerCase()));
    }
    canAccessTicket(accessPolicy, membership) {
        return this.canUseTicketPermission(accessPolicy, membership, 'view');
    }
    canManageTicketAccess(membership) {
        return membership.role === client_1.BoardMemberRole.OWNER || membership.role === client_1.BoardMemberRole.ADMIN;
    }
    getEffectiveTicketRoles(membership) {
        const roles = new Set();
        if (membership.role) {
            roles.add(membership.role.toLowerCase());
        }
        const customRoleName = membership.customRoleName?.trim().toLowerCase();
        if (customRoleName) {
            roles.add(customRoleName);
        }
        return roles;
    }
};
exports.BoardsAccessService = BoardsAccessService;
exports.BoardsAccessService = BoardsAccessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BoardsAccessService);
//# sourceMappingURL=boards-access.service.js.map