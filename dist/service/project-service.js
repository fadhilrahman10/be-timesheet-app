"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectService = void 0;
const project_model_1 = require("../model/project-model");
const validation_1 = require("../validation/validation");
const project_validation_1 = require("../validation/project-validation");
const database_1 = require("../application/database");
const response_error_1 = require("../error/response-error");
class ProjectService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(project_validation_1.ProjectValidation.CREATE, request);
            const nameExists = yield database_1.prismaClient.project.count({
                where: {
                    name: createRequest.name
                }
            });
            if (nameExists != 0) {
                throw new response_error_1.ResponseError(400, "Name already exists");
            }
            const project = yield database_1.prismaClient.project.create({
                data: createRequest
            });
            return (0, project_model_1.toProjectResponse)(project);
        });
    }
    static checkProjectExists(projectId) {
        return __awaiter(this, void 0, void 0, function* () {
            const project = yield database_1.prismaClient.project.findFirst({
                where: {
                    id: projectId
                }
            });
            if (!project) {
                throw new response_error_1.ResponseError(404, "Project not found");
            }
            return project;
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const projects = yield database_1.prismaClient.project.findMany({});
            if (!projects) {
                throw new response_error_1.ResponseError(404, "Project not found");
            }
            return projects;
        });
    }
}
exports.ProjectService = ProjectService;
