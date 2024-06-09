import supertest from "supertest";
import {app} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util";
import bcrypt from "bcrypt";

describe('POST /api/users', () => {

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should error user request is invalid', async () => {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                username: "",
                password: "",
                name: "",
                rate: -12
            })

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined()
    });

    it('should success to register', async () => {
        const response = await supertest(app)
            .post('/api/users')
            .send({
                username: "test",
                password: "test",
                name: "test",
                rate: 12000
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });
})

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await UserTest.create();
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should be success to login', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: "test",
                password: "test",
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.token).toBeDefined();
    });

    it('should be failed if username invalid', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: "salah",
                password: "test",
            })

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('should be failed if password invalid', async () => {
        const response = await supertest(app)
            .post('/api/users/login')
            .send({
                username: "test",
                password: "salah",
            })

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
})

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should be success to get user', async () => {
        const response = await supertest(app)
            .get('/api/users/current')
            .set('X-API-TOKEN', "test")

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });

    it('should be failed to get user', async () => {
        const response = await supertest(app)
            .get('/api/users/current')
            .set('X-API-TOKEN', "salah")

        logger.debug(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
})

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should be failed to update user', async () => {
        const response = await supertest(app)
            .patch('/api/users/current')
            .set('X-API-TOKEN', "test")
            .send({
                password: "",
                rate: "",
                name: ""
            })

        logger.debug(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('should be failed to update user when token is invalid', async () => {
        const response = await supertest(app)
            .patch('/api/users/current')
            .set('X-API-TOKEN', "salah")
            .send({
                password: "test",
                rate: 12000,
                name: "test",
            })

        logger.debug(response.body);

        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('should be success to update name of user', async () => {
        const response = await supertest(app)
            .patch('/api/users/current')
            .set('X-API-TOKEN', "test")
            .send({
                name: "correct",
            })

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.name).toBe("correct");
    });

    it('should be success to update password of user', async () => {
        const response = await supertest(app)
            .patch('/api/users/current')
            .set('X-API-TOKEN', "test")
            .send({
                password: "12341234"
            })

        logger.debug(response.body);
        expect(response.status).toBe(200);

        const user = await UserTest.get();
        expect(await bcrypt.compare("12341234", user.password)).toBe(true);
    });
})

describe('DELETE /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    })

    afterEach(async () => {
        await UserTest.delete();
    })

    it('should be success to logout', async () => {
        const response = await supertest(app)
            .delete('/api/users/current')
            .set('X-API-TOKEN', "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK");

        const user = await UserTest.get();
        expect(user.token).toBeNull();
    });

    it('should be failed to logout', async () => {
        const response = await supertest(app)
            .delete('/api/users/current')
            .set('X-API-TOKEN', "salah");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
})