"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toUserResponse = void 0;
function toUserResponse(user) {
    return {
        username: user.username,
        name: user.name,
        rate: user.rate,
    };
}
exports.toUserResponse = toUserResponse;
