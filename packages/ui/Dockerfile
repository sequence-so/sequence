# Based off of https://nextjs.org/docs/deployment#docker-image

# Install dependencies for common library
FROM node:alpine AS common
RUN apk add --no-cache libc6-compat
RUN mkdir -p /app/common
WORKDIR /app/common
COPY build/common/package.json build/common/yarn.lock ./
RUN yarn install --frozen-lockfile

# Build common library
FROM node:alpine AS common-builder
WORKDIR /app/common
COPY build/common .
COPY --from=common /app/common/node_modules ./node_modules

# Install dependencies for ui project
FROM node:alpine AS ui-deps
RUN apk add --no-cache libc6-compat
RUN mkdir -p /app/ui
WORKDIR /app/ui
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# Rebuild the source code only when needed
FROM node:alpine AS ui-builder
WORKDIR /app/ui
RUN mkdir -p /app/common
COPY . .
COPY --from=ui-deps /app/ui/node_modules ./node_modules
COPY --from=common-builder /app/common /app/common
RUN yarn build && yarn install --production --ignore-scripts --prefer-offline

# Production image, copy all the files and run next
FROM node:alpine AS runner
WORKDIR /app/ui

ENV NODE_ENV production

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# You only need to copy next.config.js if you are NOT using the default configuration
COPY --from=ui-builder /app/ui/next.config.js ./
COPY --from=ui-builder /app/ui/public ./public
COPY --from=ui-builder --chown=nextjs:nodejs /app/ui/.next ./.next
COPY --from=ui-builder /app/ui/node_modules ./node_modules
COPY --from=ui-builder /app/ui/package.json ./package.json

USER nextjs

EXPOSE 3000

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry.
# ENV NEXT_TELEMETRY_DISABLED 1
ENV PORT 3000

CMD ["yarn", "start"]
