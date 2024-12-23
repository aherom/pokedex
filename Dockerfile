# Use Ubuntu as the base image
FROM ubuntu:20.04

# Set working directory
WORKDIR /app

# Install necessary tools
RUN apt-get update && apt-get install -y \
    curl \
    gnupg \
    build-essential \
    redis-server \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (replace with your version if needed)
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copy application files (excluding node_modules)
COPY . .

# Install dependencies
RUN npm install

# Create a configuration file for supervisord
RUN apt-get update && apt-get install -y supervisor
RUN mkdir -p /etc/supervisor/conf.d

COPY supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Expose ports (Node.js and Redis)
EXPOSE 3000 6379

# Start both Redis and the Node.js server using supervisord
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]
