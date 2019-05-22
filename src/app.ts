import express from 'express';
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { PORT = 3000 } = process.env;
app.listen(
  PORT,
  (): void => {
    console.log(`Example app listening on port ${PORT}!`);
  },
);
export default app;
