const path = require('path');
const { v4: uuidv4 } = require('uuid');

/**
 * Generate file path based on current date and UUID
 * @param {string} originalName - Original filename
 * @returns {string} Generated file path
 */
function generateFilePath(originalName) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uuid = uuidv4();
  const ext = path.extname(originalName);

  return `peter/screenshots/${year}/${month}/${uuid}${ext}`;
}

/**
 * Validate file extension against allowed list
 * @param {string} filename - Filename to validate
 * @param {Array<string>} allowedExtensions - Array of allowed extensions
 * @returns {boolean} True if extension is allowed
 */
function isAllowedExtension(filename, allowedExtensions) {
  const ext = path.extname(filename).toLowerCase().slice(1);
  return allowedExtensions.includes(ext);
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size string
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration object
 * @returns {Array<string>} Array of validation errors
 */
function validateConfig(config) {
  const errors = [];

  if (!config.bucket) {
    errors.push('S3_BUCKET is required');
  }

  if (!config.cloudfrontDomain) {
    errors.push('CLOUDFRONT_DOMAIN is required');
  }

  if (!config.allowedExtensions || config.allowedExtensions.length === 0) {
    errors.push('ALLOWED_EXTENSIONS must be specified');
  }

  if (config.maxFileSize <= 0) {
    errors.push('MAX_FILE_SIZE_MB must be greater than 0');
  }

  return errors;
}

module.exports = {
  generateFilePath,
  isAllowedExtension,
  formatFileSize,
  validateConfig
};
