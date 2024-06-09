import {Request, Response, NextFunction} from "express";
import {UserRequest} from "../type/user-request";
import {ProjectRequest} from "../model/project-model";
import {ProjectService} from "../service/project-service";

export class ProjectController {
    static async create(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const request: ProjectRequest = req.body as ProjectRequest;
            const response = await ProjectService.create(req.user!, request);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }

    static async getAll(req: UserRequest, res: Response, next: NextFunction) {
        try {
            const response = await ProjectService.getAll(req.user!);
            res.status(200).json({
                data: response
            });
        } catch (e) {
            next(e);
        }
    }
}