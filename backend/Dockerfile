FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* yarn.lock* package-lock.json* ./
RUN npm i -g pnpm && pnpm i --frozen-lockfile

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm prisma:generate && pnpm build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/server.js"]
