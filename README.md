# CineVO

## Deployment

Configure the `.env` file :
```
POSTGRES_DB=cinevo
POSTGRES_HOST=postgres
TMDB_API_KEY=
MINIO_ACCESS_KEY=
MINIO_SECRET_KEY=
MINIO_SSL=false
SMTP_HOST=
SMTP_PORT=
SESSION_KEY=
ELASTICSEARCH_URL=http://elasticsearch:9200
BACKEND_URL=http://backend:4000
MINIO_ENDPOINT=minio
MINIO_PUBLIC_URL=http://my.public.instance/default
```

Put overrides in a of docker configuration in a `docker-compose.override.yml`

Generate all docker services from compose files :

```
docker-compose -f compose.base.yml -f compose.build.yml -f compose.override.yml up -d
```
