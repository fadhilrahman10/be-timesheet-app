import {TimeSheet} from "@prisma/client";

export type TimesheetResponse = {
    id: string,
    start_date: string,
    end_date: string,
    start_time: string,
    end_time: string,
    title: string,
    duration: number,
}

export type TimesheetRequest = {
    start_date: string,
    end_date: string,
    start_time: string,
    end_time: string,
    title: string,
    project_id: string
}

export type UpdateTimesheetRequest = {
    id: string,
    start_date?: string,
    end_date?: string,
    start_time?: string,
    end_time?: string,
    title?: string,
    project_id?: string
}

// export type GetAllTimesheetRequest = {
//     search?: string;
//     filterByProject?: string;
// }

export type GetAllTimesheetResponse<T> = {
    timesheets: Array<T>
}

export function toTimesheetResponse(timeSheet: TimeSheet): TimesheetResponse {
    return {
        id: timeSheet.id,
        start_date: timeSheet.start_date.toLocaleDateString('en-CA'),
        end_date: timeSheet.end_date.toLocaleDateString('en-CA'),
        start_time: timeSheet.start_time,
        end_time: timeSheet.end_time,
        title: timeSheet.title,
        duration: Number(timeSheet.duration),
    }
}