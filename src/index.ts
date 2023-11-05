import bodyParser from 'body-parser';
import config from 'config';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';

dotenv.config();

const app = express();

app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

app.get('/', (req, res) => {
  res.json({ status: 'ok', code: 200, data: { message: 'Hello from express!' } });
});

const port = config.get<number>('port');

app.listen(port, () => {  
  console.log(`Listening at http://localhost:${port}`);
});
