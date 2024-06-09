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
exports.TimesheetService = void 0;
const timesheet_model_1 = require("../model/timesheet-model");
const validation_1 = require("../validation/validation");
const timesheet_validation_1 = require("../validation/timesheet-validation");
const database_1 = require("../application/database");
const date_fns_1 = require("date-fns");
const response_error_1 = require("../error/response-error");
const logging_1 = require("../application/logging");
class TimesheetService {
    static create(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            const createRequest = validation_1.Validation.validate(timesheet_validation_1.TimesheetValidation.CREATE, request);
            const projectExists = yield database_1.prismaClient.project.count({
                where: {
                    id: createRequest.project_id
                }
            });
            if (projectExists == 0) {
                throw new response_error_1.ResponseError(404, "Project not found");
            }
            const timesheetExists = yield database_1.prismaClient.timeSheet.count({
                where: {
                    title: createRequest.title,
                    project_id: createRequest.project_id,
                    start_date: new Date(createRequest.start_date).toISOString(),
                    end_date: new Date(createRequest.end_date).toISOString(),
                    start_time: createRequest.start_time,
                    end_time: createRequest.end_time,
                    user_id: user.id
                }
            });
            if (timesheetExists != 0) {
                throw new response_error_1.ResponseError(400, "Timesheet already exists");
            }
            const dateStart = `${createRequest.start_date} ${createRequest.start_time}`;
            const dateEnd = `${createRequest.end_date} ${createRequest.end_time}`;
            const formatString = 'yyyy-MM-dd HH:mm:ss';
            const start = (0, date_fns_1.parse)(dateStart, formatString, new Date());
            const end = (0, date_fns_1.parse)(dateEnd, formatString, new Date());
            const duration = (0, date_fns_1.differenceInMinutes)(end, start);
            createRequest.start_date = new Date(createRequest.start_date).toISOString();
            createRequest.end_date = new Date(createRequest.end_date).toISOString();
            const result = Object.assign(Object.assign({}, createRequest), {
                user_id: user.id,
                duration: duration
            });
            const timesheet = yield database_1.prismaClient.timeSheet.create({
                data: result
            });
            return (0, timesheet_model_1.toTimesheetResponse)(timesheet);
        });
    }
    static get(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const timesheet = yield database_1.prismaClient.timeSheet.findFirst({
                where: {
                    id: id,
                    user_id: user.id
                }
            });
            if (!timesheet) {
                throw new response_error_1.ResponseError(404, "Timesheet not found!");
            }
            return (0, timesheet_model_1.toTimesheetResponse)(timesheet);
        });
    }
    static update(user, request) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const updateRequest = validation_1.Validation.validate(timesheet_validation_1.TimesheetValidation.UPDATE, request);
            const timesheetExists = yield database_1.prismaClient.timeSheet.findFirst({
                where: {
                    user_id: user.id,
                    id: updateRequest.id
                }
            });
            if (!timesheetExists) {
                throw new response_error_1.ResponseError(404, "Timesheet not found!");
            }
            const oldTimesheet = (0, timesheet_model_1.toTimesheetResponse)(timesheetExists);
            if (updateRequest.project_id) {
                const projectExists = yield database_1.prismaClient.project.count({
                    where: {
                        id: updateRequest.project_id
                    }
                });
                if (projectExists == 0) {
                    throw new response_error_1.ResponseError(404, "Project not found");
                }
            }
            logging_1.logger.info("old timee " + oldTimesheet.duration);
            let duration = oldTimesheet.duration;
            if (oldTimesheet.start_time != updateRequest.start_time ||
                oldTimesheet.end_time != updateRequest.end_time ||
                oldTimesheet.start_date != oldTimesheet.start_date ||
                oldTimesheet.end_date != oldTimesheet.end_date) {
                const dateStart = `${(_a = updateRequest.start_date) !== null && _a !== void 0 ? _a : oldTimesheet.start_date} ${(_b = updateRequest.start_time) !== null && _b !== void 0 ? _b : oldTimesheet.start_time}`;
                const dateEnd = `${(_c = updateRequest.end_date) !== null && _c !== void 0 ? _c : oldTimesheet.end_date} ${(_d = updateRequest.end_time) !== null && _d !== void 0 ? _d : oldTimesheet.end_time}`;
                const formatString = 'yyyy-MM-dd HH:mm:ss';
                const start = (0, date_fns_1.parse)(dateStart, formatString, new Date());
                const end = (0, date_fns_1.parse)(dateEnd, formatString, new Date());
                logging_1.logger.info("start " + dateStart);
                duration = (0, date_fns_1.differenceInMinutes)(end, start);
            }
            if (updateRequest.start_date) {
                updateRequest.start_date = new Date(updateRequest.start_date).toISOString();
            }
            if (updateRequest.end_date) {
                updateRequest.end_date = new Date(updateRequest.end_date).toISOString();
            }
            const result = Object.assign(Object.assign({}, updateRequest), {
                duration: duration
            });
            logging_1.logger.info("Durasi " + duration);
            const timesheet = yield database_1.prismaClient.timeSheet.update({
                where: {
                    id: updateRequest.id,
                    user_id: user.id
                },
                data: result
            });
            return (0, timesheet_model_1.toTimesheetResponse)(timesheet);
        });
    }
    static remove(user, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const timesheet = yield database_1.prismaClient.timeSheet.findFirst({
                where: {
                    id: id,
                }
            });
            if (!timesheet) {
                throw new response_error_1.ResponseError(404, "Timesheet not found!");
            }
            const removeTimesheet = yield database_1.prismaClient.timeSheet.delete({
                where: {
                    id: id,
                }
            });
            return (0, timesheet_model_1.toTimesheetResponse)(removeTimesheet);
        });
    }
    static getAll(user) {
        return __awaiter(this, void 0, void 0, function* () {
            const timesheets = yield database_1.prismaClient.timeSheet.findMany({
                include: {
                    project: true
                },
                where: {
                    user_id: user.id,
                }
            });
            return {
                timesheets: timesheets
            };
        });
    }
}
exports.TimesheetService = TimesheetService;
