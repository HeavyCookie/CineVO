require('dotenv').config({ path: '../.env' })

import { Stream } from 'stream'

import Axios from 'axios'
import * as Minio from 'minio'

const {
  MINIO_ENDPOINT = 'localhost',
  MINIO_PORT = '9000',
  MINIO_REGION = 'us-east-1',
  MINIO_SSL = 'true',
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME = 'default',
  MINIO_PUBLIC_URL = (() => {
    const url: string[] = []
    url.push(MINIO_SSL == 'true' ? 'https' : 'http')
    url.push('://')
    url.push(MINIO_ENDPOINT)
    if (MINIO_PORT) url.push(`:${MINIO_PORT}`)
    url.push('/')
    url.push(MINIO_BUCKET_NAME)
    return url.join('')
  })(),
} = process.env

export const config = {
  MINIO_ENDPOINT,
  MINIO_PORT,
  MINIO_REGION,
  MINIO_SSL,
  MINIO_ACCESS_KEY,
  MINIO_SECRET_KEY,
  MINIO_BUCKET_NAME,
  MINIO_PUBLIC_URL,
}

if (!MINIO_ACCESS_KEY) throw new Error('`MINIO_ACCESS_KEY` not declared')
if (!MINIO_SECRET_KEY) throw new Error('`MINIO_SECRET_KEY` not declared')

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
) =>
  await client.putObject(MINIO_BUCKET_NAME, filepath, file, undefined, metadata)

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

export const listFiles = (path: string, recursive = true) =>
  client.listObjects(MINIO_BUCKET_NAME, path, recursive)

export const getFileURL = (filepath: string) =>
  [MINIO_PUBLIC_URL, filepath].join('/')

export default client
