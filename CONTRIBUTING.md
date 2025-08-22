# Contributing to ShareX Uploader For Claude (w/ AWS)

Thank you for your interest in contributing! We welcome all contributions - from bug fixes to new features, documentation improvements, and even Docker improvements (hint: someone who helps get this properly dockerized might earn a bubblegum 🍬).

## 🚀 Quick Start for Contributors

1. **Fork the repository** on GitHub
2. **Clone your fork**:
   ```bash
   git clone https://github.com/your-username/sharex-cloudfront-uploader.git
   cd sharex-cloudfront-uploader
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Copy environment template**:
   ```bash
   cp .env.example .env
   # Edit .env with your test credentials (or use defaults for unit tests)
   ```
5. **Run tests to make sure everything works**:
   ```bash
   npm test
   ```

## 🧪 Testing - THE MOST IMPORTANT PART

**All Pull Requests MUST pass tests before being merged. No exceptions.**

### Running Tests

```bash
# Run ALL tests (this is what CI runs)
npm test

# Run individual test suites
npm run test:unit        # Unit tests - test individual functions
npm run test:integration # Integration tests - test component interactions
npm run test:e2e         # End-to-end tests - test full workflows

# Run tests in watch mode while developing
npm run test:watch

# Generate coverage report
npm run coverage

# Check code quality
npm run lint
```

### Test Requirements for Contributors

**Before submitting ANY Pull Request:**

1. ✅ **All existing tests must pass**

   ```bash
   npm test
   ```

2. ✅ **Code must pass linting**

   ```bash
   npm run lint:check
   ```

3. ✅ **If you add new features, you MUST add tests**

   - New functions → Add unit tests
   - New endpoints → Add integration tests
   - New workflows → Add e2e tests

4. ✅ **Test coverage should not decrease**
   ```bash
   npm run coverage
   ```

### Writing Tests

**Example test structure:**

```javascript
describe("Your New Feature", () => {
  it("should do something specific", () => {
    // Arrange
    const input = "test input";

    // Act
    const result = yourNewFunction(input);

    // Assert
    expect(result).to.equal("expected output");
  });
});
```

**Test file locations:**

- `tests/unit.test.js` - Unit tests for individual functions
- `tests/integration.test.js` - Integration tests for component interactions
- `test.js` - End-to-end tests for full workflows

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run specific test types
npm run test:unit      # Unit tests only
npm run test:integration  # Integration tests only
npm run test:e2e       # End-to-end tests only

# Watch mode for development
npm run test:watch

# Generate coverage report
npm run coverage
```

### Writing Tests

- **Unit tests**: Test individual functions and components in isolation
- **Integration tests**: Test interactions between components
- **E2E tests**: Test complete user workflows

Place tests in the `tests/` directory with descriptive names.

### Test Structure

```javascript
const { describe, it, before, after } = require("mocha");
const { expect } = require("chai");

describe("Feature Name", () => {
  before(() => {
    // Setup
  });

  it("should do something specific", () => {
    // Test implementation
    expect(result).to.equal(expected);
  });

  after(() => {
    // Cleanup
  });
});
```

## 🔍 Code Quality

### Linting

```bash
# Check code style
npm run lint:check

# Fix code style issues
npm run lint
```

### Code Style Guidelines

- Use 2 spaces for indentation
- Use single quotes for strings
- Add semicolons at the end of statements
- Use descriptive variable names
- Comment complex logic

### Security Guidelines

- Never commit secrets or API keys
- Validate all user inputs
- Use parameterized queries/prepared statements
- Follow principle of least privilege
- Keep dependencies up to date

## 📝 Documentation

When contributing:

- Update relevant documentation
- Add JSDoc comments for new functions
- Update README if adding new features
- Include examples in documentation

## 🔄 Development Workflow

### Branch Naming

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation updates
- `test/description` - Test improvements

### Commit Messages

Use clear, descriptive commit messages:

```
type(scope): description

feat(upload): add support for WebP images
fix(auth): resolve token validation issue
docs(readme): update installation instructions
test(unit): add tests for file validation
```

### Pull Request Process

1. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:

   - Write code
   - Add tests
   - Update documentation

3. **Test thoroughly**:

   ```bash
   npm test
   npm run lint:check
   ```

4. **Commit your changes**:

   ```bash
   git add .
   git commit -m "feat: add your feature"
   ```

5. **Push and create PR**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Fill out the PR template completely**

### Code Review Guidelines

**For Authors:**

- Self-review your code before submitting
- Ensure all tests pass
- Update documentation
- Respond promptly to review feedback

**For Reviewers:**

- Be constructive and specific
- Test the changes locally
- Check for security issues
- Verify documentation updates

## 🐛 Reporting Issues

When reporting bugs:

1. Use the bug report template
2. Include reproduction steps
3. Provide environment details
4. Include error messages/logs
5. Test with latest version

## 🚀 Feature Requests

When requesting features:

1. Use the feature request template
2. Describe the use case
3. Explain the benefit
4. Consider implementation complexity
5. Check for existing similar requests

## 📋 Development Setup

### Prerequisites

- Node.js 16+
- npm 7+
- Git
- AWS account (for testing uploads)

### Environment Variables for Development

```bash
# Copy and customize
cp .env.example .env

# Required for local development
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=us-east-1
S3_BUCKET=your-test-bucket
CLOUDFRONT_DOMAIN=your-domain.cloudfront.net
UPLOAD_SECRET=test-secret-123
```

### Docker Development

```bash
# Build and run with Docker
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

## 🔒 Security

### Reporting Security Issues

- **DO NOT** create public issues for security vulnerabilities
- Email security issues to [security-email]
- Include detailed reproduction steps
- We'll respond within 48 hours

### Security Best Practices

- Keep dependencies updated
- Validate all inputs
- Use environment variables for secrets
- Follow OWASP guidelines
- Review code for security issues

## 📊 Performance

### Performance Guidelines

- Keep upload endpoint fast (< 2s for typical files)
- Minimize memory usage during uploads
- Use streaming for large files
- Monitor AWS costs
- Optimize CloudFront caching

### Performance Testing

```bash
# Basic load testing (if implemented)
npm run test:performance

# Monitor memory usage
node --inspect server.js
```

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help newcomers
- Share knowledge
- Follow the code of conduct
- Contribute positively to discussions

## 📚 Resources

- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/)
- [CloudFront Documentation](https://docs.aws.amazon.com/cloudfront/)
- [ShareX Documentation](https://getsharex.com/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## ❓ Questions?

- Check existing issues and discussions
- Review documentation thoroughly
- Ask in GitHub discussions
- Be specific about your problem

## 🍬 Special Opportunities

Looking for ways to make a meaningful contribution? Here are some areas where we'd especially appreciate help:

### Docker Containerization 🐳

Someone who takes the time to properly dockerize this application (beyond our basic Dockerfile) could earn a bubblegum! We're looking for:

- Multi-stage Docker builds
- Production-ready Docker Compose setup
- Kubernetes manifests
- Docker security hardening
- ARM64 support

### Other High-Impact Contributions

- AWS SDK v3 migration (we're still on v2)
- Performance optimizations
- Additional image format support
- Batch upload functionality
- Custom domain setup automation

## 🎯 Contribution Ideas

**Easy (Good first issues):**

- Documentation improvements
- Error message clarity
- Code comments and JSDoc
- Example configurations

**Medium:**

- New image format support
- Configuration validation improvements
- Better error handling
- Performance optimizations

**Advanced:**

- Docker/Kubernetes deployment
- AWS SDK v3 migration
- Batch upload features
- Custom domain automation

## 📞 Getting Help

- Check existing issues and discussions
- Review documentation thoroughly
- Ask questions in GitHub discussions
- Follow our code style and testing requirements

Thank you for contributing! 🎉

_P.S. - Yes, we really do have bubblegum for exceptional Docker contributions_ 🍬
