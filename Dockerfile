# Multi-stage Production Dockerfile for Dentist Workflow Automation Platform
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install production dependencies only
RUN npm ci --only=production

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5055

# Install curl for container health check
RUN apk add --no-cache curl dumb-init

# Create non-root application user
RUN addgroup -g 1001 -S dentist && \
    adduser -u 1001 -S dentist -G dentist

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
COPY src/ ./src/
COPY public/ ./public/

# Switch to unprivileged user
USER dentist

EXPOSE 5055

HEALTHCHECK --interval=20s --timeout=5s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5055/health || exit 1

ENTRYPOINT ["/usr/bin/dumb-init", "--"]
CMD ["node", "src/server.js"]
