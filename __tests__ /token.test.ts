import {app, prisma} from "../src/server";
import request from "supertest";
import {testUserName, testUserPassword, testWrongToken} from "./testData";

describe("Token Refresh API", () => {
    beforeEach(async () => {
        await prisma.admin.deleteMany();
        await request(app).post("/auth/register").send({
            login: testUserName,
            password: testUserPassword,
        });
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    test('POST /auth/refresh - успешное обновление токена', async ()=>{
        const loginResponse = await request(app).post("/auth/login").send({
            login: testUserName,
            password: testUserPassword,
        });
        const response = await request(app)
            .post("/auth/refresh")
            .send({
                refreshToken: loginResponse.body.refreshToken,
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("accessToken");
    });
    test("POST /auth/refresh - отсутствие токена", async ()=>{
        const response = await request(app).post("/auth/refresh").send({});
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Refresh token is required");
    });
    test('POST /auth/refresh - невалидный токен', async ()=>{
        const response = await request(app)
            .post("/auth/refresh")
            .send({
                refreshToken: testWrongToken,
            });

        expect(response.status).toBe(403);
        expect(response.body.message).toMatch(/Invalid (or expired )?refresh token/);
    })
});