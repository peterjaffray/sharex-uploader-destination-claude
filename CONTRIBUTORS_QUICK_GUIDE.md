# Quick Guide for Contributors

## ⚡ TL;DR - Essential Steps

1. **Fork & Clone**
   ```bash
   git clone https://github.com/your-username/sharex-cloudfront-uploader.git
   cd sharex-cloudfront-uploader
   npm install
   ```

2. **RUN TESTS** (Most Important!)
   ```bash
   npm test  # This MUST pass before any PR
   ```

3. **Make Changes & Test Again**
   ```bash
   # After making your changes:
   npm test          # Run all tests
   npm run lint      # Fix code style
   npm run coverage  # Check test coverage
   ```

4. **Submit PR** (only if tests pass!)

## 🧪 Testing Requirements - READ THIS

**Every Pull Request MUST:**

- ✅ Pass all existing tests: `npm test`
- ✅ Pass code linting: `npm run lint:check`
- ✅ Include tests for new features
- ✅ Not decrease test coverage

**If you add a new feature without tests, your PR will be rejected.**

## 🚀 Quick Test Commands

```bash
npm test                 # Run everything (what CI runs)
npm run test:unit        # Unit tests only
npm run test:integration # Integration tests only
npm run test:e2e         # End-to-end tests only
npm run test:watch       # Watch mode for development
npm run coverage         # Generate coverage report
npm run lint             # Fix code style issues
npm run lint:check       # Check code style
```

## 📝 Adding Tests for New Features

**If you add a new function:**
```javascript
// Add to tests/unit.test.js
describe('Your New Function', () => {
  it('should do what it says', () => {
    const result = yourNewFunction('input');
    expect(result).to.equal('expected');
  });
});
```

**If you add a new endpoint:**
```javascript
// Add to tests/unit.test.js or tests/integration.test.js
it('should handle new endpoint', (done) => {
  request(app)
    .get('/your-new-endpoint')
    .expect(200)
    .end(done);
});
```

## 🍬 Special Opportunities

- **Docker/Kubernetes**: Advanced Docker setup gets bubblegum! 🍬
- **AWS SDK v3**: Help us migrate from v2
- **Performance**: Make uploads faster
- **Features**: Batch uploads, new formats, etc.

## ❓ Questions?

1. Read [CONTRIBUTING.md](CONTRIBUTING.md) first
2. Check [existing issues](../../issues)
3. Ask in [GitHub discussions](../../discussions)

## 🚨 Before You Submit

- [ ] `npm test` passes
- [ ] `npm run lint:check` passes  
- [ ] Added tests for new features
- [ ] Updated documentation if needed
- [ ] Tested manually

**If any of these fail, fix them before submitting your PR!**

---

Thanks for contributing! 🎉