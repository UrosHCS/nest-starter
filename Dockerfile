FROM node:14.15.4

RUN apt-get update \
    && apt-get install sqlite3 -y \