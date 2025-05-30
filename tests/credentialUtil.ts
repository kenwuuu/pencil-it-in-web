import dotenv from 'dotenv';

export function getCredentials() {
  dotenv.config();

  const isCI = process.env.CI?.toUpperCase() === 'TRUE' || process.env.CI === '1';

  console.log('Running with CI credentials: ', isCI);

  const EMAIL = isCI ? process.env.PLAYWRIGHT_KEN_EMAIL : process.env.PENCIL_IT_IN_EMAIL;
  const PASSWORD = isCI ? process.env.PLAYWRIGHT_KEN_PASSWORD : process.env.PENCIL_IT_IN_PASSWORD;

  if (!EMAIL || !PASSWORD) {
    throw new Error('Missing login credentials: EMAIL or PASSWORD env vars are not set.');
  }

  return { EMAIL, PASSWORD };
}