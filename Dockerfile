# Build stage
FROM node:18-alpine AS build-stage

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the app with API URL (optional build argument)
ARG VITE_API_URL
ENV VITE_API_URL="https://api-treclamation.epal.dz"

RUN npm run build



# Production stage with Nginx
FROM nginx:stable-alpine AS production-stage

# Install curl for health checks (optional)
RUN apk add --no-cache curl

# Copy built files from build stage
COPY --from=build-stage /app/dist/spa /usr/share/nginx/html

# Copy custom Nginx configuration with API proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80



# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
