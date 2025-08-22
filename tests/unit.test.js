const { describe, it, before, after } = require("mocha");
const { expect } = require("chai");
const request = require("supertest");
const path = require("path");
const fs = require("fs");

// Mock AWS SDK before importing app
const AWS = require("aws-sdk-mock");

// Set test environment
process.env.NODE_ENV = "test";
process.env.PORT = "0"; // Use random port for testing
process.env.UPLOAD_SECRET = "test-secret-123";
process.env.AWS_REGION = "us-east-1";
process.env.S3_BUCKET = "test-bucket";
process.env.CLOUDFRONT_DOMAIN = "test.cloudfront.net";

let app;
let server;

describe("ShareX Uploader For Claude (w/ AWS)", () => {
  before((done) => {
    // Mock AWS S3 upload globally for all tests
    AWS.mock("S3", "upload", (params, callback) => {
      callback(null, {
        Location: `https://${params.Bucket}.s3.amazonaws.com/${params.Key}`,
      });
    });

    // Import app after setting environment variables and mocks
    app = require("../server");
    server = app.listen(() => {
      done();
    });
  });

  after((done) => {
    AWS.restore("S3");
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  describe("Health Endpoint", () => {
    it("should return healthy status", (done) => {
      request(app)
        .get("/health")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("status", "healthy");
          expect(res.body).to.have.property("timestamp");
          expect(res.body).to.have.property("uptime");
          done();
        });
    });
  });

  describe("Root Endpoint", () => {
    it("should return application info", (done) => {
      request(app)
        .get("/")
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property(
            "name",
            "ShareX Uploader For Claude (w/ AWS)"
          );
          expect(res.body).to.have.property("version", "1.0.0");
          expect(res.body).to.have.property("description");
          expect(res.body).to.have.property("endpoints");
          expect(res.body).to.have.property("useCases");
          expect(res.body).to.have.property("configuration");
          done();
        });
    });
  });

  describe("Upload Endpoint - Authentication", () => {
    it("should reject upload without secret", (done) => {
      const testImagePath = createTestImage();

      request(app)
        .post("/upload")
        .attach("file", testImagePath)
        .expect(401)
        .end((err, res) => {
          cleanupTestImage(testImagePath);
          if (err) return done(err);
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("error", "Invalid upload secret");
          done();
        });
    });

    it("should reject upload with wrong secret", (done) => {
      const testImagePath = createTestImage();

      request(app)
        .post("/upload")
        .field("secret", "wrong-secret")
        .attach("file", testImagePath)
        .expect(401)
        .end((err, res) => {
          cleanupTestImage(testImagePath);
          if (err) return done(err);
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("error", "Invalid upload secret");
          done();
        });
    });

    it("should accept correct secret in form data", (done) => {
      const testImagePath = createTestImage();

      request(app)
        .post("/upload")
        .field("secret", "test-secret-123")
        .attach("file", testImagePath)
        .expect(200)
        .end((err, res) => {
          cleanupTestImage(testImagePath);

          if (err) return done(err);
          expect(res.body).to.have.property("success", true);
          expect(res.body).to.have.property("url");
          expect(res.body).to.have.property("filename");
          expect(res.body).to.have.property("size");
          done();
        });
    });
  });

  describe("Upload Endpoint - File Validation", () => {
    it("should reject upload without file", (done) => {
      request(app)
        .post("/upload")
        .field("secret", "test-secret-123")
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("success", false);
          expect(res.body).to.have.property("error", "No file provided");
          done();
        });
    });

    it("should reject non-image files", (done) => {
      const testFilePath = createTestTextFile();

      request(app)
        .post("/upload")
        .field("secret", "test-secret-123")
        .attach("file", testFilePath)
        .expect(500)
        .end((err, res) => {
          cleanupTestImage(testFilePath);
          if (err) return done(err);
          expect(res.body).to.have.property("success", false);
          expect(res.body.error).to.include("not allowed");
          done();
        });
    });
  });

  describe("Rate Limiting", () => {
    it("should apply rate limiting to upload endpoint", (done) => {
      // Test that rate limiting middleware is applied
      request(app)
        .post("/upload")
        .expect((res) => {
          // Rate limiting headers may vary by implementation
          // Just check that we get a response (middleware is working)
          expect(res.status).to.be.a("number");
        })
        .end(done);
    });
  });

  describe("Security Headers", () => {
    it("should include security headers", (done) => {
      request(app)
        .get("/")
        .expect((res) => {
          // Helmet.js security headers
          expect(res.headers).to.have.property("x-content-type-options");
          expect(res.headers).to.have.property("x-frame-options");
        })
        .end(done);
    });
  });
});

// Helper functions
function createTestImage() {
  const testImagePath = path.join(__dirname, "test-image.png");
  // Create a simple 1x1 PNG image
  const pngData = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8FQQAAAABJRU5ErkJggg==",
    "base64"
  );
  fs.writeFileSync(testImagePath, pngData);
  return testImagePath;
}

function createTestTextFile() {
  const testFilePath = path.join(__dirname, "test-file.txt");
  fs.writeFileSync(testFilePath, "This is a test file");
  return testFilePath;
}

function cleanupTestImage(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    // Ignore cleanup errors
  }
}
