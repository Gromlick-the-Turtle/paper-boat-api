import dotenv from 'dotenv';
import express from 'express';

import routes from '#routes/routes';

dotenv.config({ path: '.env' });

const app = express();

app.use(express.json());

// FOR DEV ONLY!!
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(routes);

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
});

export default app;