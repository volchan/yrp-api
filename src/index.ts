import config from 'config';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

const app = express();

app.get('/', (req, res) => {
  res.json({ status: 'ok', code: 200, data: { message: 'Hello from express!' } });
});

const port = config.get<number>('port');

app.listen(port, () => {  
  console.log(`Listening at http://localhost:${port}`);
});
