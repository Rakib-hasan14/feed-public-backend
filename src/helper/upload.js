const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const dotenv = require("dotenv");

dotenv.config();

const s3 = new S3Client({
  region: (process.env.S3_REGION || "").trim() || "us-east-1",
  credentials: {
    accessKeyId: (process.env.S3_ACCESS_KEY || "").trim(),
    secretAccessKey: (process.env.S3_SECRET_KEY || "").trim(),
  },
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME.trim(),
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `posts/${Date.now().toString()}-${file.originalname}`);
    },
  }),
});

module.exports = upload;
