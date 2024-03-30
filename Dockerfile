FROM node:21-alpine3.17 as development

WORKDIR /dev/src/app

COPY package.json ./

RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
