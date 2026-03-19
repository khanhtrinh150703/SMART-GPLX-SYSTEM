import request from 'supertest';
import app from '../../src/app'; 
import { describe, it, expect } from '@jest/globals';

describe('Auth API', () => {
    describe('POST /auth/register', () => {
        
        it('should successfully register a new user with valid data', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'trinh.v1@test.com',
                    username: 'trinh_v1',
                    password: 'Password123',
                    confirmPassword: 'Password123',
                    fullname: 'Trinh'
                });

            // Log for debugging (optional)
            // console.log(response.body);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe('trinh.v1@test.com');
            
            // Security check: Sensitive data must not be returned
            expect(response.body.data.password).toBeUndefined();
            expect(response.body.data.passwordHash).toBeUndefined();
        });

        it('should return 409 Conflict when the email is already registered', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'trinh.v1@test.com', // Already registered in the test case above
                    username: 'trinh_duplicate',
                    password: 'Password123',
                    confirmPassword: 'Password123',
                    fullname: 'Trinh'
                });

            expect(response.status).toBe(409);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('USER_001'); // ALREADY_EXISTS
        });

        it('should return 400 Bad Request for an invalid email format', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'invalid-email-format',
                    username: 'user_invalid_email',
                    password: 'Password123',
                    confirmPassword: 'Password123',
                    fullname: 'Test User'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('VAL_001'); // INVALID_EMAIL
        });

        it('should return 400 Bad Request for a weak password', async () => {
            const response = await request(app)
                .post('/api/v1/auth/register')
                .send({
                    email: 'user_weak_pass@test.com',
                    username: 'user_weak_pass',
                    password: '123', // Too short and no letters
                    confirmPassword: '123',
                    fullname: 'Test User'
                });

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.code).toBe('VAL_002'); // INVALID_PASSWORD
        });
    });
});