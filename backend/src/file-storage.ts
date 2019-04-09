import { Stream } from 'stream'
import * as Minio from 'minio'
import Axios from 'axios'

const {
  MINIO_ENDPOINT = 'localhost',
  MINIO_PORT = '9000',
  MINIO_REGION = 'us-east-1',
  MINIO_SSL = 'true',
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME = 'default',
} = process.env

const client = new Minio.Client({
  endPoint: MINIO_ENDPOINT,
  port: parseInt(MINIO_PORT),
  useSSL: MINIO_SSL == 'true',
  accessKey: MINIO_ACCESS_KEY,
  secretKey: MINIO_SECRET_KEY,
})

client.bucketExists(MINIO_BUCKET_NAME).then(async exists => {
  if (exists) return
  await client.makeBucket(MINIO_BUCKET_NAME, MINIO_REGION)
  await client.setBucketPolicy(
    MINIO_BUCKET_NAME,
    JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Action: ['s3:GetBucketLocation', 's3:ListBucket'],
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Resource: [`arn:aws:s3:::${MINIO_BUCKET_NAME}`],
          Sid: '',
        },
        {
          Action: ['s3:GetObject'],
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Resource: [`arn:aws:s3:::${MINIO_BUCKET_NAME}/*`],
          Sid: '',
        },
      ],
    })
  )
})

export const uploadFile = async (
  file: string | Stream | Buffer,
  filepath: string,
  metadata?: Minio.ItemBucketMetadata
) => await client.putObject(MINIO_BUCKET_NAME, filepath, file, null, metadata)

export const uploadFileFromUrl = async (
  url: string,
  filepath: string,
  metadata?: Minio.ItemBucketMetadata
) => {
  const { data } = await Axios.get<Stream>(url, { responseType: 'stream' })
  return await uploadFile(data, filepath, metadata)
}

export const removeFile = async (filepath: string) =>
  await client.removeObject(MINIO_BUCKET_NAME, filepath)

export const listFiles = (path: string, recursive: boolean = true) =>
  client.listObjects(MINIO_BUCKET_NAME, path, recursive)

export default client
