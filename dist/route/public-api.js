"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicApi = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controller/user-controller");
exports.publicApi = express_1.default.Router();
exports.publicApi.post('/api/users', user_controller_1.UserController.register);
exports.publicApi.post('/api/users/login', user_controller_1.UserController.login);
