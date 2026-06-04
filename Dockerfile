# syntax=docker/dockerfile:1

# ---------- Build stage ----------
FROM node:20-alpine AS build

WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the source and build
COPY . .
RUN npm run build

# ---------- Runtime stage ----------
FROM nginx:alpine AS runtime

# Copy custom nginx config (SPA fallback to index.html)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
