FROM public.ecr.aws/docker/library/node:16-alpine3.14

WORKDIR /app

COPY . .

RUN apk update

RUN npm install
RUN npm run build

EXPOSE 3000