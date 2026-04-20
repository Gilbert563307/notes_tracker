import { afterEach, expect, test, vi } from "vitest";
import { RequestHandler } from "../../shared/utils/RequestHandler";

test("should build request  correct", () => {
  const request = new RequestHandler.RequestBuilder()
    .post()
    .url("http://localhost:8080/api/" + "resource")
    .content({ id: "1" })
    .build();

  expect(request).toBeDefined();
  expect(request.url).toBe("http://localhost:8080/api/" + "resource");
  expect(request.method).toBe("POST");
  expect(request.headers.get("Content-Type")).toBe("application/json");
});

//https://stevekinney.com/courses/testing/mocking-fetch-and-network-requests
test("should perform  request", async () => {
  // Mock the fetch function.
  const mockResponse = {
    id: 1,
    title: "mock title",
  };

  const request = new RequestHandler.RequestBuilder()
    .post()
    .url("http://localhost:8080/api/" + "resource")
    .content({ id: 1, title: "mock title" })
    .build();

  const requestHandler = new RequestHandler("http://localhost:8080/api/");

  global.fetch = vi.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(mockResponse),
    }),
  );

  // Call the function and assert the result
  const response = await requestHandler.perform(request);
  const data = await response.json();
  expect(data).toStrictEqual(mockResponse);
});

afterEach(() => {
  vi.clearAllMocks(); // Reset all mocked calls between tests
});
