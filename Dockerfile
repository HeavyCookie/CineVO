FROM node:13 AS build

RUN mkdir /backend /frontend

# Building backend
COPY ./backend/package.json ./backend/yarn.lock /backend/
RUN cd /backend && yarn install
COPY ./backend /backend/
RUN cd /backend && yarn graphql:schema

# Building frontend

COPY ./frontend/package.json ./frontend/yarn.lock /frontend/
RUN cd /frontend && yarn install
COPY ./frontend /frontend/

RUN cp /backend/schema.gql /frontend/schema.gql && cd /frontend && yarn graphql && yarn build

FROM node:13 AS backend

RUN mkdir /backend
WORKDIR /backend
COPY --from=build /backend /backend
CMD yarn start:prod

FROM node:13 AS frontend

RUN mkdir /frontend
WORKDIR /frontend
COPY --from=build /frontend /frontend
CMD yarn start:prod
