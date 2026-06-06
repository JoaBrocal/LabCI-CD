const path = require("path");
const request = require("supertest");
const jestOpenAPI = require("jest-openapi").default;
const app = require("../src/app");

jestOpenAPI(path.join(__dirname, "../openapi.yaml"));

describe("Contrato OpenAPI - GET /health", () => {
  test("la respuesta real debe cumplir con la especificación OpenAPI", async () => {
    const response = await request(app).get("/health");

    expect(response).toSatisfyApiSpec();
  });
});