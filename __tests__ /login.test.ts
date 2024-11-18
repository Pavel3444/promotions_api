import request from "supertest";
import {app, prisma} from "../src/server";
import {testUserName, testUserPassword, testWrongName, testWrongPassword} from "./testData";



describe('Login API',()=>{
    beforeEach(async () => {
        await prisma.admin.deleteMany();
        await request(app)
            .post('/auth/register')
            .send({
                login: testUserName,
                password: testUserPassword,
            });
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    test('POST /auth/login - успешная авторизация', async ()=>{
        const response = await request(app)
            .post('/auth/login')
            .send({
                login: testUserName,
                password: testUserPassword,
            });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message', 'User login successfully');
        expect(response.body).toHaveProperty('refreshToken');
        expect(response.body).toHaveProperty('accessToken');

    })
    test('POST /auth/login - неверный пользователь', async ()=>{
        const response = await request(app)
            .post('/auth/login')
            .send({
                login: testWrongName,
                password: testWrongPassword,
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'User not found');
    })
    test('POST /auth/login - неверный пароль', async ()=>{
        const response = await request(app)
            .post('/auth/login')
            .send({
                login: testUserName,
                password: testWrongPassword,
            });
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Password incorrect');
    })
})