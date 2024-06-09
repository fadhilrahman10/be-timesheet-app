import {ProjectTest, TimesheetTest, UserTest} from "./test-util";
import supertest from "supertest";
import {app} from "../src/application/web";
import {logger} from "../src/application/logging";
import {v4 as uuid} from "uuid";

describe("POST /api/timesheets", () => {
    beforeEach(async () => {
        await UserTest.create();
        await ProjectTest.create()
    })

    afterEach(async () => {
        await TimesheetTest.delete();
        await UserTest.delete();
        await ProjectTest.delete();
    })

    it('should be failed to create timesheet when project not found', async () => {
        const response = await supertest(app)
            .post('/api/timesheets')
            .set('X-API-TOKEN', 'test')
            .send({
                title: "test",
                start_date: "2019-02-01",
                end_date: "2019-02-01",
                start_time: "09:00:00",
                end_time: "17:00:00",
                project_id: "tsetse"
            })

        logger.debug(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined()
    });

    it('should be failed to create timesheet when request invalid', async () => {
        const response = await supertest(app)
            .post('/api/timesheets')
            .set('X-API-TOKEN', 'test')
            .send({
                title: "",
                start_date: "",
                end_date: "",
                start_time: "",
                end_time: "",
                project_id: "tsetse"
            })

        logger.debug(response.body);

        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined()
    });

    it('should be success to create timesheet', async () => {
        const project = await ProjectTest.get();
        const response = await supertest(app)
            .post('/api/timesheets')
            .set('X-API-TOKEN', 'test')
            .send({
                title: "test",
                start_date: "2019-02-01",
                end_date: "2019-02-01",
                start_time: "09:00:00",
                end_time: "17:00:00",
                project_id: project.id
            })

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBe("test");
        expect(response.body.data.start_date).toBe("2019-02-01");
        expect(response.body.data.end_date).toBe("2019-02-01");
        expect(response.body.data.start_time).toBe("09:00:00");
        expect(response.body.data.end_time).toBe("17:00:00");
        expect(response.body.data.end_time).toBe("17:00:00");
        expect(response.body.data.duration).toBeDefined();
    });
})

describe("GET /api/timesheets/:id", () => {
    beforeEach(async () => {
        await TimesheetTest.create();
    })

    afterEach(async () => {
        await TimesheetTest.delete();
        await UserTest.delete();
        await ProjectTest.delete();
    })

    it('should be success to get timesheet', async () => {
        const timesheet = await TimesheetTest.get();
        const response = await supertest(app)
            .get(`/api/timesheets/${timesheet.id}`)
            .set('X-API-TOKEN', 'test')

        logger.debug(response.body);

        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBe("test");
        expect(response.body.data.start_date).toBe("2019-02-01");
        expect(response.body.data.end_date).toBe("2019-02-01");
        expect(response.body.data.start_time).toBe("09:00:00");
        expect(response.body.data.end_time).toBe("17:00:00");
        expect(response.body.data.duration).toBeDefined();
    });

    it('should be failed to get timesheet when id is not found', async () => {
        const response = await supertest(app)
            .get(`/api/timesheets/1234`)
            .set('X-API-TOKEN', 'test')

        logger.debug(response.body);

        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
})

describe("PUT /api/timesheets/:id", () => {
    beforeEach(async () => {
        await TimesheetTest.create();
    })

    afterEach(async () => {
        await TimesheetTest.delete();
        await UserTest.delete();
        await ProjectTest.delete();
    })

    it('should be success to update timesheet', async () => {
        const timesheet = await TimesheetTest.get();
        const response = await supertest(app)
            .put(`/api/timesheets/${timesheet.id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                end_time: "16:00:00"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.title).toBe("test");
        expect(response.body.data.start_date).toBe("2019-02-01");
        expect(response.body.data.end_date).toBe("2019-02-01");
        expect(response.body.data.start_time).toBe("09:00:00");
        expect(response.body.data.end_time).toBe("16:00:00");
        expect(response.body.data.duration).toBe(420);
    })

    it('should be failed to update timesheet', async () => {
        const id = uuid();
        const response = await supertest(app)
            .put(`/api/timesheets/${id}`)
            .set('X-API-TOKEN', 'test')
            .send({
                end_time: "16:00:00"
            });


        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    })
})

describe("DELETE /api/timesheets/:id", () => {
    beforeEach(async () => {
        await TimesheetTest.create();
    })

    afterEach(async () => {
        await UserTest.delete();
        await ProjectTest.delete();
    })

    it('should be success to delete timesheet', async () => {
        const timesheet = await TimesheetTest.get();
        const response = await supertest(app)
            .delete(`/api/timesheets/${timesheet.id}`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe("OK")
    })

    it('should be failed to delete timesheet', async () => {
        const response = await supertest(app)
            .delete(`/api/timesheets/12341234`)
            .set('X-API-TOKEN', 'test');


        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    })
})

describe("GET /api/timesheets", () => {
    beforeEach(async () => {
        await TimesheetTest.create();
    })

    afterEach(async () => {
        await UserTest.delete();
        await ProjectTest.delete();
    })

    it('should be success to get all timesheets', async () => {
        const response = await supertest(app)
            .get(`/api/timesheets`)
            .set('X-API-TOKEN', 'test');

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBeDefined()
    })

    it('should be failed to delete timesheet', async () => {
        const response = await supertest(app)
            .get(`/api/timesheets`)
            .set('X-API-TOKEN', 'salah');


        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    })
})