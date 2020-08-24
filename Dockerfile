FROM node:12.18.1

RUN apt-get update \
    && apt-get install sqlite3 \