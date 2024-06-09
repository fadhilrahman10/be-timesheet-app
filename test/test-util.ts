import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {User} from "@prisma/client";
import {ResponseError} from "../src/error/response-error";
import {TimesheetResponse} from "../src/model/timesheet-model";
import {differenceInMinutes, parse} from "date-fns";
import {logger} from "../src/application/logging";

export class UserTest {
    static async delete() {
        await prismaClient.user.deleteMany({
            where: {
                username: 'test'
            }
        });
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                username: 'test',
                password: await bcrypt.hash("test", 10),
                name: 'test',
                rate: 12000,
                token: 'test'
            }
        })
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: 'test'
            }
        });

        if (!user) {
            throw new Error("User not found!");
        }

        return user;
    }
}

export class ProjectTest {
    static async delete() {
        await prismaClient.project.deleteMany({
            where: {
                name: 'test'
            }
        });
    }

    static async create() {
        await prismaClient.project.create({
            data: {
                name: 'test'
            }
        })
    }

    static async get() {
        const project = await prismaClient.project.findFirst({
            where: {
                name: 'test'
            }
        })

        if (!project) {
            throw new Error("Project not found!");
        }

        return project;
    }
}

export class TimesheetTest {
    static async delete() {
        await prismaClient.timeSheet.deleteMany({
            where: {
                title: 'test'
            }
        });
    }

    static async create() {
        await UserTest.create();
        await ProjectTest.create();

        const project = await ProjectTest.get();
        const user = await UserTest.get();

        await prismaClient.timeSheet.create({
            data: {
                title: "test",
                start_date: new Date('2019-02-01').toISOString(),
                end_date: new Date('2019-02-01').toISOString(),
                start_time: "09:00:00",
                end_time: "17:00:00",
                project_id: project.id,
                duration: 480,
                user_id: user.id
            }
        })
    }

    static async get() {
        const project = await ProjectTest.get();
        const user = await UserTest.get();

        const timesheet = await prismaClient.timeSheet.findFirst({
            where: {
                title: 'test',
                user_id: user.id,
                project_id: project.id,
            }
        })

        if (!timesheet) {
            throw new Error("Timesheet not found!");
        }

        return timesheet;
    }
}