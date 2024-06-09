export class ResponseError extends Error {
    constructor(public statusCode: number, public statusMessage: string) {
        super(statusMessage);
    }
}