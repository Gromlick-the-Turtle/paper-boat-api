import dotenv from 'dotenv';
import express from 'express';

import db from './src/config/db.dev.config.js';
import routes from './src/routes/routes.js';

dotenv.config({ path: '.env' });

const app = express();

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
});

export default app;