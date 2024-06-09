"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTimesheetResponse = void 0;
function toTimesheetResponse(timeSheet) {
    return {
        id: timeSheet.id,
        start_date: timeSheet.start_date.toLocaleDateString('en-CA'),
        end_date: timeSheet.end_date.toLocaleDateString('en-CA'),
        start_time: timeSheet.start_time,
        end_time: timeSheet.end_time,
        title: timeSheet.title,
        duration: Number(timeSheet.duration),
    };
}
exports.toTimesheetResponse = toTimesheetResponse;
