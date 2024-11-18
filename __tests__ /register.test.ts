import request from 'supertest';
import {app, prisma} from '../src/server';
import {testUserName, testUserPassword} from "./testData";



describe('Register API', () => {
    beforeEach(async () => {
        await prisma.admin.deleteMany();
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    test('POST /auth/register - успешная регистрация', async () => {
        const response = await request(app)
            .post('/auth/register')
            .send({
                login: testUserName,
                password: testUserPassword,
            });

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
        expect(response.body).toHaveProperty('userId');
    });

    test('POST /auth/register - логин уже занят', async () => {
        await request(app).post('/auth/register').send({
            login: testUserName,
            password: testUserPassword,
        });

        const response = await request(app)
            .post('/auth/register')
            .send({
                login: testUserName,
                password: testUserPassword,
            });

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('message', 'Login already in use');
    });
});
