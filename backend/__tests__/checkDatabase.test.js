import request from 'supertest';
import app from '../server'; 
import { connectDB, disconnectDB } from '../db'; // DB connection helpers

describe('File Upload Integration Test', () => {
  let server;
  beforeAll(async () => {
    server = app.listen(3000);
    await connectDB(); // Connect to the database before tests
  });

  afterAll(async () => {
    await disconnectDB(); // Disconnect from DB after tests
    server.close();
  });

  test('uploads file and stores data in the database', async () => {
    const file = Buffer.from('dummy content');
    const response = await request(server)
      .post('/api/auth/file-upload') // API endpoint for file upload
      .attach('file', file, 'test.xlsx') // Attach file to the request
      .set('Content-Type', 'multipart/form-data')
      .expect(200);

    // Check that file was uploaded successfully
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('File uploaded successfully');

    // Check if the data was correctly parsed and stored in the database
    const storedData = await request(server).get('/api/tables/data'); // Endpoint to check DB
    expect(storedData.body).toContainEqual({
      filename: 'test.xlsx',
      status: 'Processed', // Adjust based on your processing logic
    });
  });
});
