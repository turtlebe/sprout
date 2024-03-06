interface Dict {
  [key: string]: string;
}

interface S3PresignedPostUrl {
  filename: string;
  presignedPostData: { fields: Dict; url: string };
}

interface CreatePresignedPostUrls {
  s3PresignedPostUrls: S3PresignedPostUrl[];
}

interface CreatePresignedGetUrls {
  s3PresignedGetUrls: { filename: string; url: string }[];
}
