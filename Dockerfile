FROM node:18-alpine

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 3000


CMD ["yarn", "dev"]

# docker build -t app .
# docker run -p 3000:3000 app
# docker run -d -p 3000:3000 app

