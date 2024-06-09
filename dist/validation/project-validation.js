"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectValidation = void 0;
const zod_1 = require("zod");
class ProjectValidation {
}
exports.ProjectValidation = ProjectValidation;
ProjectValidation.CREATE = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100)
});
