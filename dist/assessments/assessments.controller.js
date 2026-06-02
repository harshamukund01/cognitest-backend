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
exports.AssessmentsController = void 0;
const common_1 = require("@nestjs/common");
const assessments_service_1 = require("./assessments.service");
const jwt_1 = require("@nestjs/jwt");
let AssessmentsController = class AssessmentsController {
    assessmentsService;
    jwtService;
    constructor(assessmentsService, jwtService) {
        this.assessmentsService = assessmentsService;
        this.jwtService = jwtService;
    }
    getUserId(authHeader, fallbackToken) {
        const token = (authHeader ? authHeader.split(' ')[1] : fallbackToken) || '';
        if (!token)
            throw new common_1.UnauthorizedException('Missing Authorization Header or Query Token');
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || 'super-secret-key-12345',
            });
            return decoded.sub;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid or Expired JWT Token');
        }
    }
    create(authHeader, createAssessmentDto) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.create(userId, createAssessmentDto);
    }
    getDashboard(authHeader) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.getDashboardStatus(userId);
    }
    getReports(authHeader) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.getReports(userId);
    }
    async downloadReport(authHeader, queryToken, id, res) {
        const userId = this.getUserId(authHeader, queryToken);
        const filePath = await this.assessmentsService.getReportPdfFile(id, userId);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="CogniTest_Report_${id}.pdf"`);
        return res.sendFile(filePath);
    }
    getArticles(search, category) {
        return this.assessmentsService.getArticles(search, category);
    }
    getArticleById(id) {
        return this.assessmentsService.getArticleById(id);
    }
    getTrends(authHeader) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.getHistoricalTrends(userId);
    }
    submitPreScreening(authHeader, answers) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.submitPreScreening(userId, answers);
    }
    getPreScreening(authHeader) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.getPreScreening(userId);
    }
    submitMeditationSession(authHeader, sessionData) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.submitMeditationSession(userId, sessionData);
    }
    getMeditationSessions(authHeader) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.getMeditationSessions(userId);
    }
    createLegacy(authHeader, createAssessmentDto) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.create(userId, createAssessmentDto);
    }
    findAll(authHeader) {
        const userId = this.getUserId(authHeader);
        return this.assessmentsService.findAll(userId);
    }
    findOne(id) {
        return this.assessmentsService.findOne(id);
    }
};
exports.AssessmentsController = AssessmentsController;
__decorate([
    (0, common_1.Post)('submit'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('dashboard'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getDashboard", null);
__decorate([
    (0, common_1.Get)('reports'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getReports", null);
__decorate([
    (0, common_1.Get)('reports/download/:id'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Query)('token')),
    __param(2, (0, common_1.Param)('id')),
    __param(3, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AssessmentsController.prototype, "downloadReport", null);
__decorate([
    (0, common_1.Get)('articles'),
    __param(0, (0, common_1.Query)('search')),
    __param(1, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getArticles", null);
__decorate([
    (0, common_1.Get)('articles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getArticleById", null);
__decorate([
    (0, common_1.Get)('trends'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getTrends", null);
__decorate([
    (0, common_1.Post)('pre-screening'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "submitPreScreening", null);
__decorate([
    (0, common_1.Get)('pre-screening'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getPreScreening", null);
__decorate([
    (0, common_1.Post)('meditation'),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "submitMeditationSession", null);
__decorate([
    (0, common_1.Get)('meditation'),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "getMeditationSessions", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "createLegacy", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Headers)('authorization')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AssessmentsController.prototype, "findOne", null);
exports.AssessmentsController = AssessmentsController = __decorate([
    (0, common_1.Controller)('assessments'),
    __metadata("design:paramtypes", [assessments_service_1.AssessmentsService,
        jwt_1.JwtService])
], AssessmentsController);
//# sourceMappingURL=assessments.controller.js.map