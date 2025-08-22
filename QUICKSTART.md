# ShareX Uploader For Claude (w/ AWS) - Quick Start Guide

**Get around blockers and share your images with AI more effectively!**

Perfect for:

- 🤖 Sharing screenshots with Claude Code and other AI tools
- 🌐 Hosting images for forums without restrictions
- 🚫 Bypassing image hosting blockers
- ⚡ Fast global delivery via CloudFront

> 💡 **Need help with AWS setup?** Check out [AI-SETUP-GUIDE.md](AI-SETUP-GUIDE.md) - you can even give that guide to your AI agent and they'll help you set everything up!

## ⚡ Quick Setup (5 minutes)

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Server

```bash
npm start
```

Server will start on port 3456.

### 3. Configure ShareX

1. Copy `sharex-config.sxcu.example` to `sharex-config.sxcu`
2. Edit `sharex-config.sxcu` and replace `YOUR_UPLOAD_SECRET_HERE` with your secret from `.env`
3. Open ShareX
4. Go to **Destinations** → **Custom uploader settings**
5. Click **Import** → **From file**
6. Select `sharex-config.sxcu`
7. Go to **Destinations** → **Image uploader**
8. Select **"CloudFront AI Image Uploader"**

### 4. Test Upload

Take a screenshot with ShareX (default: Print Screen key)
The URL will automatically be copied to your clipboard!

## 🔗 Example URL Format

```
https://cloudfront.choice.marketing/peter/screenshots/2025/08/uuid.png
```

Perfect for pasting into:

- 🤖 Claude Code conversations
- 🌐 Forum posts and discussions
- 📧 Emails and messages
- 📋 Any application that accepts image URLs

## 🔒 Security

- Upload secret: Configure in `.env` file
- Rate limited: 100 uploads per 15 minutes
- Max file size: 10MB
- Allowed formats: PNG, JPG, JPEG, GIF, WEBP, BMP, SVG

## 🧪 Test Everything Works

```bash
npm test
```

## 🚀 That's it!

Your ShareX screenshots will now automatically upload to CloudFront and copy the URL to your clipboard.

**Now you can:**

- 🤖 Paste image URLs directly into Claude Code
- 🌐 Share on forums without hosting restrictions
- 🚫 Bypass image blockers and limitations
- ⚡ Benefit from CloudFront's global speed

## 🤝 Want to Help Make This Better?

This tool is open source and we welcome contributors! Whether you're a developer or just someone who found a bug, you can help:

- 🐛 **Found a bug?** [Report it](../../issues/new?template=bug_report.md)
- 💡 **Have an idea?** [Suggest a feature](../../issues/new?template=feature_request.md)
- 👨‍💻 **Want to code?** Check out [CONTRIBUTING.md](CONTRIBUTING.md) for how to get started
- 🐳 **Good with Docker?** We have bubblegum for solid Docker contributions! 🍬

**Quick contributor setup:**

```bash
git clone https://github.com/your-username/sharex-cloudfront-uploader.git
cd sharex-cloudfront-uploader
npm install && npm test
```

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed contribution guidelines!
