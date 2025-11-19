import dotenv from 'dotenv';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

import routes from '#routes/routes';

dotenv.config({ path: '.env' });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        'http://localhost:9000',
        // 'paper-boats'
    ],
    methods: ["GET","POST","PUT","DELETE"],
    credentials: true,
}));

app.use(routes);

app.use((err, req, res, next) => {
    res.status(err.status ?? 500).json({
        error: (err.prefix ?? '') + ': ' + err.message,
        message: err.message,
    });
    console.error('Error!!', err.message, err.stack)
})

app.listen(process.env.PORT, () => {
    console.log(`App running on port ${process.env.PORT}`);
});

export default app;