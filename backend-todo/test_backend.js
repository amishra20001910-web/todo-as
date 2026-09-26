const http = require('http');
const app = require('./src/app');
const { generateToken, verifyToken } = require('./src/utils/token');
const bcrypt = require('bcryptjs');

let server;
const PORT = 5055;

function makeRequest(options, postData) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', (err) => reject(err));

    if (postData) {
      req.write(typeof postData === 'string' ? postData : JSON.stringify(postData));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING BACKEND INTEGRATION TESTS ---');

  // Test 1: JWT generation & verification
  console.log('Test 1: Testing JWT token utility...');
  const testPayload = { id: '11111111-2222-3333-4444-555555555555', email: 'test@example.com', name: 'Tester' };
  const token = generateToken(testPayload);
  const decoded = verifyToken(token);
  if (decoded.id !== testPayload.id || decoded.email !== testPayload.email) {
    throw new Error('JWT token test failed!');
  }
  console.log('✅ JWT generation & verification PASSED');

  // Test 2: Bcrypt password hashing
  console.log('Test 2: Testing bcrypt hashing...');
  const rawPw = 'SuperSecret123!';
  const hashed = await bcrypt.hash(rawPw, 10);
  const valid = await bcrypt.compare(rawPw, hashed);
  const invalid = await bcrypt.compare('WrongPassword', hashed);
  if (!valid || invalid) {
    throw new Error('Bcrypt hashing test failed!');
  }
  console.log('✅ Bcrypt hashing PASSED');

  // Start HTTP server for route testing
  server = app.listen(PORT);
  console.log(`Server started on port ${PORT} for tests`);

  // Test 3: Health check endpoint
  console.log('Test 3: Testing GET /api/health...');
  const healthRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/health',
    method: 'GET',
  });
  if (healthRes.status !== 200 || !healthRes.body.success || healthRes.body.data.status !== 'healthy') {
    throw new Error(`Health check failed: ${JSON.stringify(healthRes)}`);
  }
  console.log('✅ GET /api/health returned 200 OK & healthy');

  // Test 4: 404 Handler
  console.log('Test 4: Testing 404 for unknown route...');
  const unknownRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/nonexistent',
    method: 'GET',
  });
  if (unknownRes.status !== 404 || unknownRes.body.success !== false) {
    throw new Error(`404 handler failed: ${JSON.stringify(unknownRes)}`);
  }
  console.log('✅ 404 Not Found handler PASSED');

  // Test 5: Validation - Register with missing fields
  console.log('Test 5: Testing POST /api/auth/register validation...');
  const regInvalid = await makeRequest(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/register',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'bad-email', password: '123' }
  );
  if (regInvalid.status !== 400 || regInvalid.body.success !== false) {
    throw new Error(`Validation check failed: ${JSON.stringify(regInvalid)}`);
  }
  console.log('✅ Registration input validation PASSED (returned 400)');

  // Test 6: Validation - Login with missing password
  console.log('Test 6: Testing POST /api/auth/login validation...');
  const loginInvalid = await makeRequest(
    {
      hostname: 'localhost',
      port: PORT,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'valid@example.com' }
  );
  if (loginInvalid.status !== 400 || loginInvalid.body.success !== false) {
    throw new Error(`Login validation failed: ${JSON.stringify(loginInvalid)}`);
  }
  console.log('✅ Login input validation PASSED (returned 400)');

  // Test 7: Protected route without token
  console.log('Test 7: Testing GET /api/todos unauthorized access...');
  const unauthTodos = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/todos',
    method: 'GET',
  });
  if (unauthTodos.status !== 401 || unauthTodos.body.success !== false) {
    throw new Error(`Auth protection failed: ${JSON.stringify(unauthTodos)}`);
  }
  console.log('✅ Unauthorized access blocked with 401 PASSED');

  // Test 8: Protected route with invalid token
  console.log('Test 8: Testing GET /api/todos with invalid token...');
  const fakeTokenRes = await makeRequest({
    hostname: 'localhost',
    port: PORT,
    path: '/api/todos',
    method: 'GET',
    headers: { Authorization: 'Bearer fake.invalid.jwt' },
  });
  if (fakeTokenRes.status !== 401 || fakeTokenRes.body.success !== false) {
    throw new Error(`Fake token check failed: ${JSON.stringify(fakeTokenRes)}`);
  }
  console.log('✅ Invalid token blocked with 401 PASSED');

  console.log('🎉 ALL BACKEND UNIT & ROUTE TESTS PASSED SUCCESSFULLY!');
  server.close();
  process.exit(0);
}

runTests().catch((err) => {
  console.error('❌ Test failed with error:', err);
  if (server) server.close();
  process.exit(1);
});
