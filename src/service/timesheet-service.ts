import {TimeSheet, User} from "@prisma/client";
import {
    GetAllTimesheetResponse,
    TimesheetRequest,
    TimesheetResponse,
    toTimesheetResponse,
    UpdateTimesheetRequest
} from "../model/timesheet-model";
import {Validation} from "../validation/validation";
import {TimesheetValidation} from "../validation/timesheet-validation";
import {prismaClient} from "../application/database";
import {parse, differenceInMinutes} from "date-fns";
import {ResponseError} from "../error/response-error";
import {logger} from "../application/logging";

export class TimesheetService {
    static async create(user: User, request: TimesheetRequest): Promise<TimesheetResponse> {
        const createRequest = Validation.validate(TimesheetValidation.CREATE, request);

        const projectExists = await prismaClient.project.count({
            where: {
                id: createRequest.project_id
            }
        })

        if (projectExists == 0) {
            throw new ResponseError(404, "Project not found");
        }

        const timesheetExists = await prismaClient.timeSheet.count({
            where: {
                title: createRequest.title,
                project_id: createRequest.project_id,
                start_date: new Date(createRequest.start_date).toISOString(),
                end_date: new Date(createRequest.end_date).toISOString(),
                start_time: createRequest.start_time,
                end_time: createRequest.end_time,
                user_id: user.id
            }
        })

        if (timesheetExists != 0) {
            throw new ResponseError(400, "Timesheet already exists");
        }

        const dateStart = `${createRequest.start_date} ${createRequest.start_time}`;
        const dateEnd = `${createRequest.end_date} ${createRequest.end_time}`;

        const formatString = 'yyyy-MM-dd HH:mm:ss';

        const start = parse(dateStart, formatString, new Date());
        const end = parse(dateEnd, formatString, new Date());

        const duration = differenceInMinutes(end, start);

        createRequest.start_date = new Date(createRequest.start_date).toISOString();
        createRequest.end_date = new Date(createRequest.end_date).toISOString();

        const result = {
            ...createRequest,
            ...{
                user_id: user.id,
                duration: duration
            }
        }

        const timesheet = await prismaClient.timeSheet.create({
            data: result
        });

        return toTimesheetResponse(timesheet);
    }

    static async get(user: User, id: string): Promise<TimesheetResponse> {
        const timesheet = await prismaClient.timeSheet.findFirst({
            where: {
                id: id,
                user_id: user.id
            }
        });

        if (!timesheet) {
            throw new ResponseError(404, "Timesheet not found!");
        }

        return toTimesheetResponse(timesheet);
    }

    static async update(user: User, request: UpdateTimesheetRequest): Promise<TimesheetResponse> {
        const updateRequest = Validation.validate(TimesheetValidation.UPDATE, request);
        const timesheetExists = await prismaClient.timeSheet.findFirst({
            where: {
                user_id: user.id,
                id: updateRequest.id
            }
        })

        if (!timesheetExists) {
            throw new ResponseError(404, "Timesheet not found!");
        }

        const oldTimesheet = toTimesheetResponse(timesheetExists);

        if (updateRequest.project_id) {
            const projectExists = await prismaClient.project.count({
                where: {
                    id: updateRequest.project_id
                }
            })

            if (projectExists == 0) {
                throw new ResponseError(404, "Project not found");
            }
        }

        logger.info("old timee " + oldTimesheet.duration);
        let duration = oldTimesheet.duration;

        if (
            oldTimesheet.start_time != updateRequest.start_time ||
            oldTimesheet.end_time != updateRequest.end_time ||
            oldTimesheet.start_date != oldTimesheet.start_date ||
            oldTimesheet.end_date != oldTimesheet.end_date
        ) {
            const dateStart = `${updateRequest.start_date ?? oldTimesheet.start_date} ${updateRequest.start_time ?? oldTimesheet.start_time}`;
            const dateEnd = `${updateRequest.end_date ?? oldTimesheet.end_date} ${updateRequest.end_time ?? oldTimesheet.end_time}`;

            const formatString = 'yyyy-MM-dd HH:mm:ss';

            const start = parse(dateStart, formatString, new Date());
            const end = parse(dateEnd, formatString, new Date());

            logger.info("start " + dateStart)
            duration = differenceInMinutes(end, start);
        }

        if (updateRequest.start_date) {
            updateRequest.start_date = new Date(updateRequest.start_date).toISOString();
        }

        if (updateRequest.end_date) {
            updateRequest.end_date = new Date(updateRequest.end_date).toISOString();
        }

        const result = {
            ...updateRequest,
            ...{
                duration: duration
            }
        }

        const timesheet = await prismaClient.timeSheet.update({
            where: {
                id: updateRequest.id,
                user_id: user.id
            },
            data: result
        })

        return toTimesheetResponse(timesheet);
    }

    static async remove(user: User, id: string): Promise<TimesheetResponse> {
        const timesheet = await prismaClient.timeSheet.findFirst({
            where: {
                id: id,
            }
        })

        if (!timesheet) {
            throw new ResponseError(404, "Timesheet not found!");
        }

        const removeTimesheet = await prismaClient.timeSheet.delete({
            where: {
                id: id,
            }
        });

        return toTimesheetResponse(removeTimesheet);
    }

    static async getAll(user: User): Promise<GetAllTimesheetResponse<TimeSheet>> {
        const timesheets = await prismaClient.timeSheet.findMany({
            include: {
                project: true
            },
            where: {
                user_id: user.id,
            }
        });

        return {
            timesheets: timesheets
        }

    }
}