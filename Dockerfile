FROM node:13 AS build

RUN mkdir -p /project/backend /project/frontend /project/components

# Install dependencies
## Root
WORKDIR /project
COPY ./package.json ./yarn.lock ./tsconfig-default.json ./.eslintrc ./
RUN yarn install

## backend
WORKDIR /project/backend
COPY ./backend/package.json ./backend/yarn.lock ./
RUN yarn install

## frontend
WORKDIR /project/frontend
COPY ./components/ /project/components/
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install

# Building
## Generate schema in frontend directory
WORKDIR /project/backend
COPY ./backend/ ./
RUN yarn graphql:schema

## Building frontend
WORKDIR /project/frontend
COPY ./frontend/ ./
RUN yarn graphql && yarn build

FROM node:13 AS backend

RUN mkdir /backend
WORKDIR /backend
COPY --from=build /project/backend ./
COPY --from=build /project/tsconfig-default.json ../
CMD yarn start:prod

FROM node:13 AS frontend

RUN mkdir /frontend
WORKDIR /frontend
COPY --from=build /project/frontend ./
CMD yarn start:prod
