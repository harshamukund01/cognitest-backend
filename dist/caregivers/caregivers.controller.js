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
exports.CaregiversController = void 0;
const common_1 = require("@nestjs/common");
const caregivers_service_1 = require("./caregivers.service");
const jwt_1 = require("@nestjs/jwt");
let CaregiversController = class CaregiversController {
    caregiversService;
    jwtService;
    constructor(caregiversService, jwtService) {
        this.caregiversService = caregiversService;
        this.jwtService = jwtService;
    }
    getUserId(authHeader) {
        if (!authHeader)
            throw new common_1.UnauthorizedException();
        const token = authHeader.split(' ')[1];
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'super-secret-key-12345',
            });
            return decoded.sub;
        }
        catch {
            throw new common_1.UnauthorizedException();
        }
    }
    create(authHeader, caregiverId) {
        const userId = this.getUserId(authHeader);
        return this.caregiversService.createRelation(userId, caregiverId);
    }
    findAll(authHeader) {
        const userId = this.getUserId(authHeader);
        return this.caregiversService.getCaregivers(userId);
    }
    update(id, status) {
        return this.caregiversService.updateStatus(id, status);
    }
};
exports.CaregiversController = CaregiversController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)('caregiverId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CaregiversController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CaregiversController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], CaregiversController.prototype, "update", null);
exports.CaregiversController = CaregiversController = __decorate([
    (0, common_1.Controller)('caregivers'),
    __metadata("design:paramtypes", [caregivers_service_1.CaregiversService,
        jwt_1.JwtService])
], CaregiversController);
//# sourceMappingURL=caregivers.controller.js.map