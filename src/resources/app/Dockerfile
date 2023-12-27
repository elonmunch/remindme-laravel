FROM node:18.18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
ENTRYPOINT npm run dev