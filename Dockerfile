FROM node:13 AS build

RUN mkdir /backend /frontend

# Building backend
WORKDIR /backend
COPY ./backend/package.json ./backend/yarn.lock ./
RUN yarn install
COPY ./backend .
RUN yarn graphql:schema

# Building frontend
WORKDIR /frontend
COPY ./frontend/package.json ./frontend/yarn.lock ./
RUN yarn install
COPY ./frontend .

RUN yarn graphql && yarn build

FROM node:13 AS backend

RUN mkdir /backend
WORKDIR /backend
COPY --from=build /backend ./
CMD yarn start:prod

FROM node:13 AS frontend

RUN mkdir /frontend
WORKDIR /frontend
COPY --from=build /frontend ./
CMD yarn start:prod
