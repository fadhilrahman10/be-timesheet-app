import {Project} from "@prisma/client";

export type ProjectResponse = {
    id: string;
    name: string;
}

export type ProjectRequest = {
    name: string
}

export function toProjectResponse(project: Project): ProjectResponse {
    return {
        id: project.id,
        name: project.name,
    }
}