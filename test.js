const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const http = require("http");
require("dotenv").config();

const SERVER_URL = `http://localhost:${process.env.PORT || 3456}`;
const UPLOAD_SECRET =
  process.env.UPLOAD_SECRET || "test-secret-for-local-testing";

// Create a test image file
const createTestImage = () => {
  const testImagePath = path.join(__dirname, "test-image.png");

  // Create a simple 1x1 PNG image in base64 and write to file
  const pngData = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU8FQQAAAABJRU5ErkJggg==",
    "base64"
  );
  fs.writeFileSync(testImagePath, pngData);

  return testImagePath;
};

// Test health endpoint
const testHealth = () => {
  return new Promise((resolve, reject) => {
    const req = http.get(`${SERVER_URL}/health`, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        try {
          const result = JSON.parse(data);
          console.log("✅ Health check passed:", result.status);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error("Health check timeout"));
    });
  });
};

// Test upload endpoint
const testUpload = (imagePath) => {
  return new Promise((resolve, reject) => {
    const form = new FormData();
    form.append("file", fs.createReadStream(imagePath));
    form.append("secret", UPLOAD_SECRET);

    const req = http.request(
      {
        hostname: "localhost",
        port: process.env.PORT || 3000,
        path: "/upload",
        method: "POST",
        headers: form.getHeaders(),
      },
      (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          try {
            const result = JSON.parse(data);
            if (result.success) {
              console.log("✅ Upload test passed");
              console.log("   URL:", result.url);
              console.log("   Filename:", result.filename);
              console.log("   Size:", result.size, "bytes");
            } else {
              console.log("❌ Upload test failed:", result.error);
            }
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      }
    );

    req.on("error", reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error("Upload test timeout"));
    });

    form.pipe(req);
  });
};

// Test CloudFront URL accessibility
const testCloudFrontAccess = (url) => {
  return new Promise((resolve, _reject) => {
    const https = require("https");
    const urlObj = new URL(url);

    const req = https.get(
      {
        hostname: urlObj.hostname,
        path: urlObj.pathname,
        method: "HEAD",
      },
      (res) => {
        if (res.statusCode === 200) {
          console.log("✅ CloudFront URL accessible:", url);
          resolve(true);
        } else {
          console.log("❌ CloudFront URL not accessible:", res.statusCode, url);
          resolve(false);
        }
      }
    );

    req.on("error", (error) => {
      console.log("❌ CloudFront URL test failed:", error.message);
      resolve(false);
    });

    req.setTimeout(10000, () => {
      req.destroy();
      console.log("❌ CloudFront URL test timeout");
      resolve(false);
    });
  });
};

// Main test function
const runTests = async () => {
  console.log("🧪 Starting ShareX Uploader For Claude (w/ AWS) Tests\n");

  try {
    // Test 1: Health check
    console.log("1. Testing health endpoint...");
    await testHealth();
    console.log("");

    // Test 2: Upload test
    console.log("2. Testing upload endpoint...");
    const testImagePath = createTestImage();
    const uploadResult = await testUpload(testImagePath);

    // Clean up test image
    fs.unlinkSync(testImagePath);
    console.log("");

    // Test 3: CloudFront access (if upload was successful)
    if (uploadResult.success && uploadResult.url) {
      console.log("3. Testing CloudFront URL accessibility...");
      // Wait a moment for S3/CloudFront propagation
      setTimeout(async () => {
        await testCloudFrontAccess(uploadResult.url);
        console.log("");
        console.log("🎉 All tests completed!");
      }, 2000);
    } else {
      console.log("3. Skipping CloudFront test due to upload failure\n");
      console.log("❌ Tests completed with errors");
    }
  } catch (error) {
    console.error("❌ Test error:", error.message);
    process.exit(1);
  }
};

// Check if server is running first
const checkServer = () => {
  return new Promise((resolve) => {
    const req = http.get(`${SERVER_URL}/health`, (_res) => {
      resolve(true);
    });

    req.on("error", () => {
      resolve(false);
    });

    req.setTimeout(2000, () => {
      req.destroy();
      resolve(false);
    });
  });
};

// Main execution
const main = async () => {
  const serverRunning = await checkServer();

  if (!serverRunning) {
    console.log("❌ Server is not running on", SERVER_URL);
    console.log("   Please start the server first: npm start");
    process.exit(1);
  }

  runTests();
};

// Handle FormData dependency
try {
  require.resolve("form-data");
} catch (error) {
  console.log("Installing form-data dependency...");
  require("child_process").execSync("npm install form-data", {
    stdio: "inherit",
  });
}

main();
