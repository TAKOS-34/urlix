const request = require("supertest");
const express = require("express");
const urlRouter = require("../../routes/url");
const db = require("../../config/db");
const app = express();
app.use(express.json());
app.use("/url", urlRouter);

jest.mock("../../middleware/jwtAuth", () => (req, res, next) => {
    req.user = { userId: 1, userEmail: "test@example.com" };
    next();
});

jest.mock("../../config/db", () => ({
    query: jest.fn(),
}));

jest.mock("../../config/winston", () => ({
    urlLogger: { error: jest.fn(), warn: jest.fn(), info: jest.fn() },
    buildLogData: jest.fn((email, req, route) => ({ email, route })),
}));

describe("GET /url/get/all", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all user URLs (expected status 200)", async () => {
        const mockUrls = [
            {
                id: 1,
                url: "short.ly/abc123",
                redirectUrl: "https://example.com",
                urlName: "Example",
                expirationDate: "2025-12-31",
                creationDate: "2025-03-17",
                redirectionCount: 10,
            },
            {
                id: 2,
                url: "short.ly/xyz789",
                redirectUrl: "https://another.com",
                urlName: "Another",
                expirationDate: null,
                creationDate: "2025-03-18",
                redirectionCount: 5,
            },
        ];
        db.query.mockImplementation((query, values, callback) => {
            callback(null, mockUrls);
        });
        const response = await request(app).get("/url/get/all");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            data: mockUrls,
        });
    });

    it("should return an empty list when no URLs are found (expected status 200)", async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(null, []);
        });
        const response = await request(app).get("/url/get/all");
        expect(response.status).toBe(200);
        expect(response.body).toEqual({
            status: true,
            data: [],
        });
    });

    it("should return an error when a database error occurs (expected status 500)", async () => {
        db.query.mockImplementation((query, values, callback) => {
            callback(new Error("Database error"), null);
        });
        const response = await request(app).get("/url/get/all");
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ status: false });
    });
});
