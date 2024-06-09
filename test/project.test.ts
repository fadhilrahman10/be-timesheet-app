import {ProjectTest, UserTest} from "./test-util";
import supertest from "supertest";
import {app} from "../src/application/web";
import {logger} from "../src/application/logging";

describe('POST /api/projects', () => {
    beforeEach(async () => {
        await UserTest.create();
    })
    afterEach(async () => {
        await ProjectTest.delete();
        await UserTest.delete();
    })

    it('should be failed to create project', async () => {
        const response = await supertest(app)
            .post('/api/projects')
            .set('X-API-TOKEN', 'test')
            .send({
                name: '',
            })

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should be success to create project', async () => {
        const response = await supertest(app)
            .post('/api/projects')
            .set('X-API-TOKEN', 'test')
            .send({
                name: 'test',
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.name).toBe("test");
    });
})