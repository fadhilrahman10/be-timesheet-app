import {ProjectRequest, ProjectResponse, toProjectResponse} from "../model/project-model";
import {Validation} from "../validation/validation";
import {ProjectValidation} from "../validation/project-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../error/response-error";
import {Project, User} from "@prisma/client";

export class ProjectService {
    static async create(user: User, request: ProjectRequest): Promise<ProjectResponse> {
        const createRequest: ProjectRequest = Validation.validate(ProjectValidation.CREATE, request);

        const nameExists = await prismaClient.project.count({
            where: {
                name: createRequest.name
            }
        })

        if (nameExists != 0) {
            throw new ResponseError(400, "Name already exists");
        }

        const project = await prismaClient.project.create({
            data: createRequest
        })

        return toProjectResponse(project);
    }

    static async checkProjectExists(projectId: string): Promise<Project> {
        const project = await prismaClient.project.findFirst({
            where: {
                id: projectId
            }
        })

        if (!project) {
            throw new ResponseError(404, "Project not found");
        }

        return project;
    }

    static async getAll(user: User): Promise<Project[]> {
        const projects = await prismaClient.project.findMany({});

        if (!projects) {
            throw new ResponseError(404, "Project not found");
        }

        return projects;
    }
}