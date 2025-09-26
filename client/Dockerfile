# Stage-1 & specify a name 'builder'
FROM  node:latest AS builder

# Set working directory
WORKDIR /app
# Copy package.json first (for caching)
COPY package.json ./

# Install dependencies
RUN npm install

# Copy rest of the code
COPY . .


# Build and optimize static file
RUN npm run build

# Expose port
EXPOSE 3000


# Stage-2
FROM nginx:1.25.2-alpine-slim

# Copy the static file to my Nginx folder to serve static contain
COPY --from=builder /app/build /usr/share/nginx/html

# Open the port to react
EXPOSE 80

# Run nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]