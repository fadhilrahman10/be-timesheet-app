"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimesheetValidation = void 0;
const zod_1 = require("zod");
class TimesheetValidation {
}
exports.TimesheetValidation = TimesheetValidation;
TimesheetValidation.CREATE = zod_1.z.object({
    title: zod_1.z.string().min(1).max(100),
    start_date: zod_1.z.string().date(),
    end_date: zod_1.z.string().date(),
    start_time: zod_1.z.string().time(),
    end_time: zod_1.z.string().time(),
    project_id: zod_1.z.string().min(1).max(100),
});
TimesheetValidation.UPDATE = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    title: zod_1.z.string().min(1).max(100).optional(),
    start_date: zod_1.z.string().date().optional(),
    end_date: zod_1.z.string().date().optional(),
    start_time: zod_1.z.string().time().optional(),
    end_time: zod_1.z.string().time().optional(),
    project_id: zod_1.z.string().min(1).max(100).optional(),
});
