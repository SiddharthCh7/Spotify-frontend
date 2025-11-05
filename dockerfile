# Frontend Dockerfile (2-stage: build with node, serve with nginx)

# 1. Build Stage
FROM node:18-alpine AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# 2. Serve Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# (optional) Replace nginx config for history routing:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]