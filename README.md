# ShareX Uploader For Claude (w/ AWS)

Get around blockers and share your images with AI more effectively in a way you can control. Need to put your images on a forum? Host them yourself. Need to get screenshots into Claude Code? Use this to put your images on a public folder accessible to AI. Don't worry about speed as this is setup to take advantage of CloudFront.

This Node.js application provides a custom uploader for ShareX that automatically uploads screenshots to your CloudFront distribution, making them instantly accessible to AI tools and web services.

## Why Use This?

- 🤖 **AI Integration** - Share screenshots directly with Claude Code and other AI tools
- 🚫 **Bypass Blockers** - Get around image hosting restrictions and blockers
- 🌐 **Forum Ready** - Host images yourself for forums and communities
- ⚡ **CloudFront Speed** - Lightning-fast global delivery via AWS CloudFront
- 🎯 **You Control It** - Your images, your hosting, your rules

## Features

- 🚀 **Fast uploads** to S3 with CloudFront distribution for global speed
- 📁 **Organized storage** in `peter/screenshots/{year}/{month}/{uuid}.{extension}` format
- 🔒 **Security features** including authentication, rate limiting, and file restrictions
- 📝 **Comprehensive logging** for monitoring and debugging
- 🎯 **ShareX integration** with one-click screenshot sharing
- ⚡ **Lightweight** with minimal dependencies

## Prerequisites

- Node.js 16+ installed
- AWS account with S3 and CloudFront access
- ShareX (Windows screenshot tool)

> 🤖 **First time with AWS?** Check out our [AI-Setup-Guide.md](AI-SETUP-GUIDE.md) for complete step-by-step instructions including AWS setup! You can even provide that guide to your AI agent (Claude, ChatGPT, etc.) and they can help you set everything up!

## Quick Start

### 1. Installation

```bash
# Clone or download the project
cd sharex-cloudfront-uploader

# Install dependencies
npm install
```

### 2. Configuration

Copy the example environment file and configure it:

```bash
cp .env.example .env
```

Edit `.env` file with your settings:

```env
# AWS Configuration (will use AWS CLI credentials if not specified)
AWS_REGION=ca-central-1
S3_BUCKET=ghost.choice.marketing
CLOUDFRONT_DOMAIN=cloudfront.choice.marketing

# Server Configuration
PORT=3000
UPLOAD_SECRET=your_secret_upload_token_here

# Security Configuration
MAX_FILE_SIZE_MB=10
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp,bmp,svg
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 3. Start the Server

```bash
# Production mode
npm start

# Development mode (with auto-restart)
npm run dev
```

The server will start on `http://localhost:3000`

### 4. Configure ShareX

1. Copy the example ShareX configuration:

   ```bash
   cp sharex-config.sxcu.example sharex-config.sxcu
   ```

2. Update the `sharex-config.sxcu` file with your upload secret:

   ```json
   {
     "Arguments": {
       "secret": "your_actual_upload_secret_here"
     }
   }
   ```

3. Import the configuration into ShareX:

   - Open ShareX
   - Go to Destinations > Custom uploader settings
   - Click Import > From file
   - Select `sharex-config.sxcu`

4. Set as default uploader:
   - Go to Destinations > Image uploader
   - Select "CloudFront AI Image Uploader"

### 5. Test the Setup

```bash
npm test
```

This will run a comprehensive test to verify:

- Server health
- Upload functionality
- CloudFront accessibility

## File Structure

```
sharex-cloudfront-uploader/
├── server.js              # Main server application
├── package.json           # Node.js dependencies
├── .env                   # Environment configuration
├── .env.example          # Example configuration
├── sharex-config.sxcu    # ShareX uploader configuration
├── test.js               # Test script
└── README.md            # This file
```

## API Endpoints

### POST /upload

Upload an image file to S3/CloudFront.

**Headers:**

- `x-upload-secret`: Upload authentication token (optional, if configured)

**Form Data:**

- `file`: Image file (required)
- `secret`: Upload authentication token (alternative to header)

**Response:**

```json
{
  "success": true,
  "url": "https://cloudfront.choice.marketing/peter/screenshots/2024/08/uuid.png",
  "filename": "uuid.png",
  "size": 12345,
  "uploadedAt": "2024-08-22T15:30:00.000Z"
}
```

### GET /health

Check server health status.

**Response:**

```json
{
  "status": "healthy",
  "timestamp": "2024-08-22T15:30:00.000Z",
  "uptime": 123.45
}
```

### GET /

Get server information and configuration.

## Security Features

### Authentication

- Optional upload secret token
- Configurable via `UPLOAD_SECRET` environment variable
- Can be passed via form data or header

### Rate Limiting

- Configurable rate limiting per IP address
- Default: 100 requests per 15 minutes
- Applies only to upload endpoint

### File Restrictions

- Maximum file size limit (default: 10MB)
- Allowed file extensions whitelist
- File type validation

### Additional Security

- Helmet.js for security headers
- CORS configuration
- Input validation and sanitization

## Configuration Options

| Variable                  | Default                         | Description                    |
| ------------------------- | ------------------------------- | ------------------------------ |
| `AWS_REGION`              | `ca-central-1`                  | AWS region for S3 bucket       |
| `S3_BUCKET`               | `ghost.choice.marketing`        | S3 bucket name                 |
| `CLOUDFRONT_DOMAIN`       | `cloudfront.choice.marketing`   | CloudFront domain              |
| `PORT`                    | `3000`                          | Server port                    |
| `UPLOAD_SECRET`           | -                               | Upload authentication token    |
| `MAX_FILE_SIZE_MB`        | `10`                            | Maximum file size in MB        |
| `ALLOWED_EXTENSIONS`      | `png,jpg,jpeg,gif,webp,bmp,svg` | Allowed file extensions        |
| `RATE_LIMIT_WINDOW_MS`    | `900000`                        | Rate limit window (15 minutes) |
| `RATE_LIMIT_MAX_REQUESTS` | `100`                           | Max requests per window        |

## File Organization

Uploaded files are organized in S3 with the following structure:

```
s3://ghost.choice.marketing/
└── peter/
    └── screenshots/
        └── {year}/
            └── {month}/
                └── {uuid}.{extension}
```

Example: `peter/screenshots/2024/08/550e8400-e29b-41d4-a716-446655440000.png`

## Troubleshooting

### Common Issues

1. **"Invalid upload secret" error**

   - Check that the secret in `.env` matches the one in `sharex-config.sxcu`
   - Ensure the secret is being passed correctly

2. **"Upload failed" error**

   - Verify AWS credentials are configured correctly
   - Check S3 bucket permissions
   - Ensure the bucket exists and is accessible

3. **CloudFront URL not accessible**

   - Allow a few minutes for S3/CloudFront propagation
   - Verify CloudFront distribution is properly configured
   - Check if the domain is correctly pointing to the distribution

4. **ShareX upload fails**
   - Ensure the server is running on the correct port
   - Check that ShareX configuration matches server settings
   - Verify file size and type restrictions

### Debugging

Enable detailed logging by checking the server console output. All requests and errors are logged with timestamps.

To test individual components:

```bash
# Test server health
curl http://localhost:3000/health

# Test upload (replace with your secret)
curl -X POST -F "file=@test.png" -F "secret=your_secret" http://localhost:3000/upload
```

## Performance Considerations

- Files are uploaded directly to S3 from memory (no disk storage)
- CloudFront provides global CDN for fast image delivery
- Rate limiting prevents abuse and reduces server load
- Efficient UUID-based file naming prevents conflicts

## Production Deployment

For production use:

1. Use a process manager like PM2:

   ```bash
   npm install -g pm2
   pm2 start server.js --name sharex-uploader
   ```

2. Set up reverse proxy with nginx for HTTPS
3. Configure proper firewall rules
4. Use a more secure upload secret
5. Consider additional monitoring and logging

## 🧪 Testing

Run the comprehensive test suite:

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit      # Unit tests
npm run test:integration  # Integration tests
npm run test:e2e       # End-to-end tests

# Generate coverage report
npm run coverage

# Code quality checks
npm run lint
```

## 🤝 Contributing

**We actively encourage and welcome contributions!** Whether you're fixing bugs, adding features, improving documentation, or helping with Docker deployment - every contribution makes this tool better for the entire AI and developer community.

### 🌟 Ways You Can Help

- 🐛 **Fix bugs** - Check our [issues](../../issues) for bugs that need fixing
- ✨ **Add features** - Enhance the tool with new capabilities
- 📚 **Improve docs** - Help others understand and use the tool better
- 🐳 **Docker deployment** - Someone who properly dockerizes this gets bubblegum! 🍬
- 🧪 **Add tests** - Help us maintain quality with comprehensive testing
- 🚀 **Performance** - Make uploads faster and more efficient

### 🚀 Quick Contribution Setup

```bash
# Fork the repo, then:
git clone https://github.com/your-username/sharex-cloudfront-uploader.git
cd sharex-cloudfront-uploader
npm install
cp .env.example .env
npm test  # Make sure everything works!
```

### 📋 Contribution Requirements

**Before submitting any Pull Request:**

1. ✅ **All tests must pass**: `npm test`
2. ✅ **Code must be linted**: `npm run lint:check`
3. ✅ **New features need tests** - No exceptions!
4. ✅ **Follow our guidelines** in [CONTRIBUTING.md](CONTRIBUTING.md)

**Please read our contribution guides:**

- 📋 **[CONTRIBUTING.md](CONTRIBUTING.md)** - Complete contribution guide with detailed requirements
- ⚡ **[CONTRIBUTORS_QUICK_GUIDE.md](CONTRIBUTORS_QUICK_GUIDE.md)** - TL;DR version for experienced developers

These guides cover:

- Setting up your development environment
- Running tests properly (REQUIRED!)
- Writing good tests for new features
- Code style requirements
- Submission process

### 🎯 High-Impact Contribution Opportunities

Looking to make a big difference? We especially need help with:

- 🐳 **Docker/Kubernetes deployment** (bubblegum reward available! 🍬)
- ⚡ **AWS SDK v3 migration**
- 📈 **Performance optimizations**
- 🔄 **Batch upload functionality**
- 🌐 **Additional image format support**

See [CONTRIBUTING.md](CONTRIBUTING.md) for more ideas and detailed requirements.

## 🐳 Docker Deployment

Run with Docker for easy deployment:

```bash
# Using docker-compose (recommended)
docker-compose up -d

# Or build and run manually
docker build -t sharex-uploader .
docker run -p 3456:3456 --env-file .env sharex-uploader
```

> 🍬 **Docker Contribution Opportunity**: Our current Docker setup is basic. Someone who takes the time to create a production-ready Docker deployment (multi-stage builds, Kubernetes manifests, security hardening, etc.) could earn a bubblegum! See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT License - feel free to modify and distribute as needed.

## Support

For issues or questions:

1. Check the [troubleshooting section](#troubleshooting)
2. Review server logs for error details
3. Search [existing issues](https://github.com/your-repo/sharex-cloudfront-uploader/issues)
4. Create a new issue using our templates
5. See [CONTRIBUTING.md](CONTRIBUTING.md) for more help
