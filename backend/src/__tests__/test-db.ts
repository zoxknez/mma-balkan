import { execSync } from 'child_process';
import { resolve } from 'path';
import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { refreshEnv } from '../lib/env';

let container: StartedPostgreSqlContainer | null = null;

const PRISMA_SCHEMA_PATH = resolve(__dirname, '../../prisma/schema.prisma');

const runMigrations = (connectionUri: string) => {
  execSync(`npx prisma migrate deploy --schema="${PRISMA_SCHEMA_PATH}"`, {
    stdio: 'inherit',
    env: {
      ...process.env,
      DATABASE_URL: connectionUri,
    },
  });
};

export const setupTestDatabase = async () => {
  if (container) {
    return container;
  }

  container = await new PostgreSqlContainer('postgres:16-alpine')
    .withDatabase('mma_backend_test')
    .withUsername('tester')
    .withPassword('tester')
    .start();

  const connectionUri = container.getConnectionUri();
  process.env.DATABASE_URL = connectionUri;
  refreshEnv();
  runMigrations(connectionUri);

  return container;
};

export const teardownTestDatabase = async () => {
  if (container) {
    await container.stop();
    container = null;
  }
};
