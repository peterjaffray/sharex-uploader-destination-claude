const express = require("express");
const multer = require("multer");
const AWS = require("aws-sdk");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const path = require("path");
const { generateFilePath, validateConfig } = require("./utils/fileUtils");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: "Too many upload requests, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/upload", limiter);

// AWS Configuration
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || "ca-central-1",
});

const s3 = new AWS.S3();

// Configuration
const config = {
  bucket: process.env.S3_BUCKET || "ghost.choice.marketing",
  cloudfrontDomain:
    process.env.CLOUDFRONT_DOMAIN || "cloudfront.choice.marketing",
  uploadSecret: process.env.UPLOAD_SECRET,
  maxFileSize: (parseInt(process.env.MAX_FILE_SIZE_MB) || 10) * 1024 * 1024,
  allowedExtensions: (
    process.env.ALLOWED_EXTENSIONS || "png,jpg,jpeg,gif,webp,bmp,svg"
  ).split(","),
};

// Multer configuration for memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1);
    if (config.allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `File type .${ext} not allowed. Allowed types: ${config.allowedExtensions.join(
            ", "
          )}`
        )
      );
    }
  },
});

// Middleware to check upload secret
const authenticateUpload = (req, res, next) => {
  if (config.uploadSecret) {
    const providedSecret =
      req.body.secret || req.query.secret || req.headers["x-upload-secret"];
    if (providedSecret !== config.uploadSecret) {
      return res.status(401).json({
        success: false,
        error: "Invalid upload secret",
      });
    }
  }
  next();
};

// Validate configuration on startup
const configErrors = validateConfig(config);
if (configErrors.length > 0) {
  console.error("Configuration errors:", configErrors);
  if (process.env.NODE_ENV !== "test") {
    process.exit(1);
  }
}

// Upload endpoint
app.post(
  "/upload",
  upload.single("file"),
  authenticateUpload,
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: "No file provided",
        });
      }

      const filePath = generateFilePath(req.file.originalname);

      const uploadParams = {
        Bucket: config.bucket,
        Key: filePath,
        Body: req.file.buffer,
        ContentType: req.file.mimetype,
        CacheControl: "max-age=31536000", // 1 year cache
        ServerSideEncryption: "AES256",
      };

      console.log(`[${new Date().toISOString()}] Uploading file: ${filePath}`);

      await s3.upload(uploadParams).promise();

      const cloudFrontUrl = `https://${config.cloudfrontDomain}/${filePath}`;

      console.log(
        `[${new Date().toISOString()}] Upload successful: ${cloudFrontUrl}`
      );

      res.json({
        success: true,
        url: cloudFrontUrl,
        filename: path.basename(filePath),
        size: req.file.size,
        uploadedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Upload error:`, error);

      res.status(500).json({
        success: false,
        error: "Upload failed",
        details: error.message,
      });
    }
  }
);

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Basic info endpoint
app.get("/", (req, res) => {
  res.json({
    name: "ShareX Uploader For Claude (w/ AWS)",
    version: "1.0.0",
    description:
      "Get around blockers and share your images with AI more effectively. Perfect for Claude Code, forums, and bypassing hosting restrictions.",
    endpoints: {
      upload: "POST /upload",
      health: "GET /health",
    },
    useCases: [
      "Share screenshots with Claude Code and AI tools",
      "Host images for forums without restrictions",
      "Bypass image hosting blockers",
      "Fast global delivery via CloudFront",
    ],
    configuration: {
      maxFileSize: `${Math.round(config.maxFileSize / 1024 / 1024)}MB`,
      allowedExtensions: config.allowedExtensions,
      bucket: config.bucket,
      domain: config.cloudfrontDomain,
    },
  });
});

// Error handler
app.use((error, req, res, _next) => {
  console.error(`[${new Date().toISOString()}] Error:`, error);

  if (error instanceof multer.MulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: `File too large. Maximum size: ${Math.round(
          config.maxFileSize / 1024 / 1024
        )}MB`,
      });
    }
  }

  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

// Start server (unless in test mode)
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(
      `[${new Date().toISOString()}] ShareX Uploader For Claude (w/ AWS) started on port ${PORT}`
    );
    console.log(`[${new Date().toISOString()}] Configuration:`);
    console.log(`  - S3 Bucket: ${config.bucket}`);
    console.log(`  - CloudFront Domain: ${config.cloudfrontDomain}`);
    console.log(
      `  - Max File Size: ${Math.round(config.maxFileSize / 1024 / 1024)}MB`
    );
    console.log(
      `  - Allowed Extensions: ${config.allowedExtensions.join(", ")}`
    );
    console.log(
      `  - Upload Secret: ${
        config.uploadSecret ? "Configured" : "Not configured (open access)"
      }`
    );
  });
}

// Export app for testing
module.exports = app;
