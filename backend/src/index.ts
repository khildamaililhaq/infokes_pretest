import { Elysia } from 'elysia';

const app = new Elysia();

app.get('/', () => 'Hello from Backend!');

app.listen(3000, () => {
  console.log('Backend server listening on port 3000');
});
