import dotenv from 'dotenv';
import express from 'express';

import db from '#config/db.dev.config';
import routes from '#routes/routes';

dotenv.config({ path: '.env' });

const app = express();

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
});

export default app;