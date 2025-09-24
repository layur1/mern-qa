const request = require("supertest");
const { app, _state } = require("../../server");

beforeEach(() => _state.resetTasks());

test("GET /api/tasks → 200 and array", async () => {
  const res = await request(app).get("/api/tasks");
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});

test("POST /api/tasks with valid name → 200 and task object", async () => {
  const res = await request(app)
    .post("/api/tasks")
    .send({ name: "Do homework" });
  expect(res.statusCode).toBe(200);
  expect(res.body.name).toBe("Do homework");
});

test("POST /api/tasks with blank name → 400", async () => {
  const res = await request(app)
    .post("/api/tasks")
    .send({ name: "   " });
  expect(res.statusCode).toBe(400);
  expect(res.body.error).toMatch(/blank/i);
});
