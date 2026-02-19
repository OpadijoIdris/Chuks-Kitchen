import request from 'supertest';
import app from '../src/app.js';
import sequelize from '../src/config/database.js';
import { User, Otp, Food, Order } from '../src/models/index.js';

beforeAll(async () => {
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  await sequelize.close();
});

describe('API integration tests', () => {
  test('GET / returns status 200', async () => {
    const res = await request(app).get('/');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('message');
  });

  test('User register and verify OTP flow', async () => {
    const registerRes = await request(app)
      .post('/api/user/register')
      .send({ email: 'test@example.com', password: 'pass1234', name: 'Tester' });

    expect(registerRes.status).toBe(201);

    // find OTP for the created user
    const user = await User.findOne({ where: { email: 'test@example.com' } });
    expect(user).toBeTruthy();

    const otpRecord = await Otp.findOne({ where: { userId: user.id } });
    expect(otpRecord).toBeTruthy();

    const verifyRes = await request(app)
      .post('/api/user/verify-otp')
      .send({ email: 'test@example.com', code: otpRecord.code });

    expect(verifyRes.status).toBe(200);
    expect(verifyRes.body).toHaveProperty('isVerified', true);
  });

  test('Food CRUD and list', async () => {
    const createRes = await request(app)
      .post('/api/food/create')
      .send({ name: 'Jollof', price: 1200, category: 'Main', isAvailable: true, role: 'admin' });

    expect(createRes.status).toBe(201);
    expect(createRes.body).toHaveProperty('food');

    const listRes = await request(app).get('/api/food');
    expect(listRes.status).toBe(200);
    expect(listRes.body).toHaveProperty('food');
    expect(Array.isArray(listRes.body.food)).toBe(true);

    const foodId = createRes.body.food.id;

    const singleRes = await request(app).get(`/api/food/${foodId}`);
    expect(singleRes.status).toBe(200);
    expect(singleRes.body.food.id).toBe(foodId);
  });

  test('Create order and cancel (admin)', async () => {
    // create a fresh user to place an order
    const u = await User.create({ name: 'Buyer', email: 'buyer@example.com', password: 'x', isVerified: true });

    const food = await Food.findOne();

    const orderRes = await request(app)
      .post('/api/order/create')
      .send({ userId: u.id, items: [{ foodId: food.id, quantity: 2 }] });

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.order.id;

    const cancelRes = await request(app)
      .put(`/api/order/cancel/${orderId}`)
      .send({ role: 'admin' });

    expect(cancelRes.status).toBe(200);
    expect(cancelRes.body).toHaveProperty('order');
    expect(cancelRes.body.order.status).toBe('cancelled');
  });

  test('Process payment endpoint (returns 200)', async () => {
    // create user, food, order
    const user = await User.create({ name: 'Payer', email: 'payer@example.com', password: 'x', isVerified: true });
    const food = await Food.findOne();

    const orderRes = await request(app)
      .post('/api/order/create')
      .send({ userId: user.id, items: [{ foodId: food.id, quantity: 1 }] });

    expect(orderRes.status).toBe(201);
    const orderId = orderRes.body.order.id;

    const payRes = await request(app)
      .put('/api/payment')
      .send({ orderId, userId: user.id });

    expect(payRes.status).toBe(200);
    expect(payRes.body).toHaveProperty('success', true);
    expect(payRes.body).toHaveProperty('paymentResult');
  });
});
