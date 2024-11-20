import {app, prisma} from "../src/server";
import request from "supertest";
import {testUserName, testUserPassword} from "./testData";

describe("Protected Content API", () => {
    beforeEach(async () => {
        await prisma.admin.deleteMany();
        await request(app).post("/auth/register").send({
            login: testUserName,
            password:testUserPassword,
        });
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    test('GET /content/protected - успешный доступ с валидным токеном', async ()=>{
        const loginResponse = await request(app).post("/auth/login").send({
            login: testUserName,
            password:testUserPassword,
        });
        const response = await request(app)
            .get("/content/protected")
            .set("Authorization", `Bearer ${loginResponse.body.accessToken}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("message", "This is protected content");
    })
    test("GET /content/protected - отсутствие токена", async () => {
        const response = await request(app).get("/content/protected");

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty("message", "Access denied. No token provided.");
    });

    test("GET /content/protected - невалидный токен", async () => {
        const response = await request(app)
            .get("/content/protected")
            .set("Authorization", "Bearer invalidtoken");

        expect(response.status).toBe(403);
        expect(response.body).toHaveProperty("message", "Invalid token");
    });
});
