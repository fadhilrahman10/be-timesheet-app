"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authApi = void 0;
const express_1 = __importDefault(require("express"));
const auth_middleware_1 = require("../middleware/auth-middleware");
const user_controller_1 = require("../controller/user-controller");
const project_controller_1 = require("../controller/project-controller");
const timesheet_controller_1 = require("../controller/timesheet-controller");
exports.authApi = express_1.default.Router();
exports.authApi.use(auth_middleware_1.authMiddleware);
exports.authApi.get('/api/users/current', user_controller_1.UserController.get);
exports.authApi.patch('/api/users/current', user_controller_1.UserController.update);
exports.authApi.delete('/api/users/current', user_controller_1.UserController.logout);
// project
exports.authApi.post('/api/projects', project_controller_1.ProjectController.create);
exports.authApi.get('/api/projects', project_controller_1.ProjectController.getAll);
// timesheet
exports.authApi.post('/api/timesheets', timesheet_controller_1.TimesheetController.create);
exports.authApi.get('/api/timesheets/:id', timesheet_controller_1.TimesheetController.get);
exports.authApi.put('/api/timesheets/:id', timesheet_controller_1.TimesheetController.update);
exports.authApi.delete('/api/timesheets/:id', timesheet_controller_1.TimesheetController.remove);
exports.authApi.get('/api/timesheets', timesheet_controller_1.TimesheetController.getAll);
