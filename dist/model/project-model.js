"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProjectResponse = void 0;
function toProjectResponse(project) {
    return {
        id: project.id,
        name: project.name,
    };
}
exports.toProjectResponse = toProjectResponse;
