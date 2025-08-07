import request from 'supertest';
import app from '../server'; // Adjust the import based on your server setup

describe('Server API Tests', () => {
  it('should respond with a 200 status for the root endpoint', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
  });

  it('should handle NFC requests', async () => {
    const response = await request(app).post('/api/nfc').send({ data: 'test' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });

  it('should handle NFT requests', async () => {
    const response = await request(app).post('/api/nft').send({ tokenId: '123' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success', true);
  });

  it('should handle GPS requests', async () => {
    const response = await request(app).get('/api/gps');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('location');
  });
});