import {z, ZodType} from "zod";

export class TimesheetValidation {
    static readonly CREATE: ZodType = z.object({
        title: z.string().min(1).max(100),
        start_date: z.string().date(),
        end_date: z.string().date(),
        start_time: z.string().time(),
        end_time: z.string().time(),
        project_id: z.string().min(1).max(100),
    })

    static readonly UPDATE: ZodType = z.object({
        id: z.string().uuid(),
        title: z.string().min(1).max(100).optional(),
        start_date: z.string().date().optional(),
        end_date: z.string().date().optional(),
        start_time: z.string().time().optional(),
        end_time: z.string().time().optional(),
        project_id: z.string().min(1).max(100).optional(),
    })

    // static readonly GET_ALL: ZodType = z.object({
    //     search: z.string().min(1).optional(),
    //     filterByProject: z.string().array().optional()
    // })
}