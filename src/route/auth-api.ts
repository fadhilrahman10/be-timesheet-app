import express from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {ProjectController} from "../controller/project-controller";
import {TimesheetController} from "../controller/timesheet-controller";

export const authApi = express.Router();
authApi.use(authMiddleware);

authApi.get('/api/users/current', UserController.get);
authApi.patch('/api/users/current', UserController.update);
authApi.delete('/api/users/current', UserController.logout);

// project
authApi.post('/api/projects', ProjectController.create);
authApi.get('/api/projects', ProjectController.getAll);

// timesheet
authApi.post('/api/timesheets', TimesheetController.create);
authApi.get('/api/timesheets/:id', TimesheetController.get);
authApi.put('/api/timesheets/:id', TimesheetController.update);
authApi.delete('/api/timesheets/:id', TimesheetController.remove);
authApi.get('/api/timesheets', TimesheetController.getAll);