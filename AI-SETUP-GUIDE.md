# AI Setup Guide - ShareX Uploader For Claude (w/ AWS)

**Perfect for Claude Code, ChatGPT, and other AI tools that need image URLs!**

This guide provides step-by-step AI-friendly instructions to set up your own image hosting solution that bypasses blockers and works seamlessly with AI tools.

## 🤖 **AI Agent Setup**

**You can provide this entire guide to your AI agent (Claude, ChatGPT, etc.) and they can help you set everything up step-by-step!** Just paste this guide into your conversation and ask them to walk you through the setup process. AI agents are excellent at helping with AWS configuration, troubleshooting issues, and explaining any steps you don't understand.

## Why This Setup?

- 🤖 **AI Compatible**: Generate public URLs that work with Claude Code, ChatGPT, and other AI tools
- 🚫 **Bypass Blockers**: No more "image blocked" or "access denied" errors
- 🌐 **Forum Ready**: Host images yourself for Reddit, Discord, forums
- ⚡ **CloudFront Speed**: Lightning-fast global image delivery
- 🎯 **You Control It**: Your images, your hosting, your rules

## Part 1: AWS Setup (15 minutes)

### Step 1: Create AWS Account

1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow signup process (requires credit card, but this setup costs ~$0.01/month)

### Step 2: Create IAM User for This App

1. Go to AWS Console → IAM → Users
2. Click "Create User"
3. Username: `sharex-uploader`
4. Select "Attach policies directly"
5. Add these policies:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`

### Step 3: Get Access Keys

1. Click on the user you just created
2. Go to "Security credentials" tab
3. Click "Create access key"
4. Choose "Application running on AWS CLI"
5. **Save these keys somewhere secure:**
   - Access Key ID
   - Secret Access Key

### Step 4: Create S3 Bucket

```bash
# Replace 'your-unique-bucket-name' with something unique
aws s3 mb s3://your-unique-bucket-name --region us-east-1
```

Or via AWS Console:

1. Go to S3 → Create bucket
2. Name: `your-unique-bucket-name` (must be globally unique)
3. Region: `US East (N. Virginia) us-east-1`
4. Uncheck "Block all public access"
5. Check "I acknowledge that the current settings might result in this bucket and the objects within it becoming public"
6. Create bucket

### Step 5: Create CloudFront Distribution

1. Go to CloudFront → Create distribution
2. Origin domain: Select your S3 bucket
3. Origin access: "Origin access control settings"
4. Create new OAC, accept defaults
5. Viewer protocol policy: "Redirect HTTP to HTTPS"
6. Allowed HTTP methods: "GET, HEAD, OPTIONS, PUT, POST, PATCH, DELETE"
7. Create distribution
8. **Copy the Distribution Domain Name** (like `d123456789.cloudfront.net`)

### Step 6: Update S3 Bucket Policy

1. Go back to S3 → Your bucket → Permissions
2. Bucket policy → Edit
3. Paste this policy (replace `YOUR-BUCKET-NAME` and `YOUR-DISTRIBUTION-ID`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowCloudFrontServicePrincipalReadOnly",
      "Effect": "Allow",
      "Principal": {
        "Service": "cloudfront.amazonaws.com"
      },
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*",
      "Condition": {
        "StringEquals": {
          "AWS:SourceArn": "arn:aws:cloudfront::YOUR-ACCOUNT-ID:distribution/YOUR-DISTRIBUTION-ID"
        }
      }
    },
    {
      "Sid": "AllowDirectUpload",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::YOUR-ACCOUNT-ID:user/sharex-uploader"
      },
      "Action": ["s3:PutObject", "s3:PutObjectAcl"],
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

## Part 2: Application Setup (10 minutes)

### Step 1: Install Prerequisites

```bash
# Install Node.js (if not installed)
# Windows: Download from nodejs.org
# Mac: brew install node
# Linux:
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Step 2: Download and Setup Application

```bash
# Clone or download the application
git clone [your-repo-url] sharex-cloudfront-uploader
cd sharex-cloudfront-uploader

# Install dependencies
npm install
```

### Step 3: Configure Environment

```bash
# Copy example configuration
cp .env.example .env
```

Edit `.env` file with your AWS details:

```env
# AWS Configuration
AWS_ACCESS_KEY_ID=your_access_key_from_step_3
AWS_SECRET_ACCESS_KEY=your_secret_key_from_step_3
AWS_REGION=us-east-1
S3_BUCKET=your-unique-bucket-name
CLOUDFRONT_DOMAIN=d123456789.cloudfront.net

# Server Configuration
PORT=3456
UPLOAD_SECRET=make-this-a-strong-random-password

# Security Configuration
MAX_FILE_SIZE_MB=10
ALLOWED_EXTENSIONS=png,jpg,jpeg,gif,webp,bmp,svg
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Step 4: Configure ShareX

```bash
# Copy ShareX config template
cp sharex-config.sxcu.example sharex-config.sxcu
```

Edit `sharex-config.sxcu` and replace:

- `YOUR_UPLOAD_SECRET_HERE` → with your `UPLOAD_SECRET` from `.env`
- `localhost:3456` → with your server address if running remotely

### Step 5: Test Everything

```bash
# Start the server
npm start

# In another terminal, test it
npm test
```

## Part 3: ShareX Setup (5 minutes)

### Step 1: Import Configuration

1. Open ShareX
2. Go to **Destinations** → **Custom uploader settings**
3. Click **Import** → **From file**
4. Select your `sharex-config.sxcu` file
5. You should see "CloudFront AI Image Uploader" appear in the list

### Step 2: Set as Default

1. Go to **Destinations** → **Image uploader**
2. Select **"CloudFront AI Image Uploader"**
3. Take a test screenshot (Print Screen key)
4. The URL should be copied to your clipboard automatically!

## Part 4: AI Integration Examples

### Claude Code Usage

```
Here's a screenshot of the error I'm getting:
https://your-cloudfront-domain.net/peter/screenshots/2025/08/uuid.png

Can you help me debug this?
```

### Forum/Reddit Usage

```markdown
![Screenshot](https://your-cloudfront-domain.net/peter/screenshots/2025/08/uuid.png)
```

### ChatGPT Usage

Just paste the URL directly - ChatGPT will automatically load and analyze the image.

## Troubleshooting

### "Access Denied" on Upload

- Check S3 bucket policy includes your IAM user
- Verify AWS credentials in `.env` are correct
- Make sure IAM user has S3 permissions

### "Invalid Upload Secret"

- Check `sharex-config.sxcu` has correct secret
- Verify `.env` `UPLOAD_SECRET` matches ShareX config

### Images Not Loading in AI Tools

- Wait 5-10 minutes for CloudFront propagation
- Test URL directly in browser first
- Check CloudFront distribution is deployed

### ShareX Upload Fails

- Make sure server is running (`npm start`)
- Check port 3456 isn't blocked
- Try testing with `npm test` first

## Cost Estimate

- S3: ~$0.001/month (1000 images)
- CloudFront: ~$0.01/month (1GB transfer)
- **Total: Less than $0.02/month**

## Security Notes

- Keep your `.env` file secure (never commit to git)
- The upload secret prevents unauthorized uploads
- Rate limiting prevents abuse
- Files are organized by date for easy management

## Advanced Configuration

### Custom Domain (Optional)

1. In CloudFront → Your distribution → General
2. Alternate domain names → Add your domain
3. Request SSL certificate via Certificate Manager
4. Update DNS CNAME to point to CloudFront domain

### Auto-Cleanup Old Images

Add this script to cron for monthly cleanup:

```bash
# Delete images older than 90 days
aws s3 ls s3://your-bucket-name/peter/screenshots/ --recursive | \
grep $(date -d '90 days ago' '+%Y-%m-%d') | \
awk '{print $4}' | \
xargs -I {} aws s3 rm s3://your-bucket-name/{}
```

## Ready to Go!

You now have a professional image hosting solution that:

- ✅ Works perfectly with AI tools like Claude Code
- ✅ Bypasses image hosting blockers
- ✅ Provides lightning-fast global delivery
- ✅ Costs almost nothing to run
- ✅ You control completely

Take a screenshot and start sharing with AI tools immediately!
