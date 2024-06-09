import express from "express";
import {publicApi} from "../route/public-api";
import {errorMiddleware} from "../middleware/error-middleware";
import {authApi} from "../route/auth-api";
import cors from "cors";

export const app = express();
app.use(cors());
app.use(express.json());
app.use(publicApi);
app.use(authApi);
app.use(errorMiddleware)