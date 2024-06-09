import {UserRequest} from "../type/user-request";
import {Response, NextFunction} from "express";
import {TimesheetRequest, UpdateTimesheetRequest} from "../model/timesheet-model";
import {TimesheetService} from "../service/timesheet-service";
import {UpdateUserRequest} from "../model/user-model";

export class TimesheetController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: TimesheetRequest = req.body as TimesheetRequest;
            const response = await TimesheetService.create(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async get(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const timesheetId = req.params.id;
            const response = await TimesheetService.get(req.user!, timesheetId);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async update(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: UpdateTimesheetRequest = req.body as UpdateTimesheetRequest;
            request.id = req.params.id;
            const response = await TimesheetService.update(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async remove(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const timesheetId = req.params.id;
            const response = await TimesheetService.remove(req.user!, timesheetId);
            res.status(200).json({
                data: "OK"
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await TimesheetService.getAll(req.user!);
            res.status(200).json({
                data: response.timesheets
            });
        } catch (e) {
            next(e);
        }
    }
}