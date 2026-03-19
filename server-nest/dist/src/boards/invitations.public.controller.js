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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvitationsPublicController = void 0;
const common_1 = require("@nestjs/common");
const boards_service_1 = require("./boards.service");
let InvitationsPublicController = class InvitationsPublicController {
    constructor(boardsService) {
        this.boardsService = boardsService;
    }
    async getInvitationByToken(token) {
        return this.boardsService.getInvitationByToken(token);
    }
    async acceptInvitationByToken(token, body) {
        return this.boardsService.acceptInvitationByToken(token, body.userId);
    }
};
exports.InvitationsPublicController = InvitationsPublicController;
__decorate([
    (0, common_1.Get)(':token'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvitationsPublicController.prototype, "getInvitationByToken", null);
__decorate([
    (0, common_1.Post)(':token/accept'),
    __param(0, (0, common_1.Param)('token')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvitationsPublicController.prototype, "acceptInvitationByToken", null);
exports.InvitationsPublicController = InvitationsPublicController = __decorate([
    (0, common_1.Controller)('invitations'),
    __metadata("design:paramtypes", [boards_service_1.BoardsService])
], InvitationsPublicController);
//# sourceMappingURL=invitations.public.controller.js.map