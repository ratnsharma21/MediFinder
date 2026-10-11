FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci || npm install

ARG VITE_API_BASE_URL=/api
ARG VITE_APP_TITLE="MediFinder - Medicine Discovery & Pharmacy Locator"
ARG VITE_GOOGLE_MAPS_API_KEY=""

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_APP_TITLE=$VITE_APP_TITLE
ENV VITE_GOOGLE_MAPS_API_KEY=$VITE_GOOGLE_MAPS_API_KEY

COPY . .
RUN npm run build

FROM nginx:alpine AS runner

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
