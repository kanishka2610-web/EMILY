import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const app = require('../server/index.cjs');

export default app;
