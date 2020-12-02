FROM node:alpine
WORKDIR /opt/project/app
COPY package*.json ./

RUN yarn

COPY . .
EXPOSE 3000

CMD ["yarn", "dev"]
