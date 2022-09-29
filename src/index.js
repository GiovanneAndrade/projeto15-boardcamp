import  express  from "express";
import cors from "cors";
import dotenv from 'dotenv';
import pkg from 'pg';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
const { Pool } = pkg;

const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
})

app.get('/categories/:idCategories', async (req, res) => {
  const { idCategories } = req.params
  const categories = await connection.query(
    'SELECT * FROM categories WHERE Id = $1;', 
    [idCategories]
  );
  res.send(categories.rows[0]);
})

app.post('/categories', (req, res) => {
  const { name } = req.body
  connection.query('INSERT INTO categories (name) VALUES ($1);',
  [name])
  res.send('ok')
})


app.listen(4000, ()=>{ 
  console.log("listening on port 4000" );
});