import  express  from "express";
import cors from "cors";
import dotenv from 'dotenv';
import pkg  from 'pg';

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
    
app.get('/games', async (req, res) => {
  const games = await connection.query('SELECT * FROM games;');
  res.send(games.rows)
})

app.post('/games', (req, res) => {
   console.log(req.body)
   const { name, image, stockTotal, categoryId, pricePerDay } = req.body
   connection.query(
    `INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5);`, 
     [name, image, stockTotal, categoryId, pricePerDay]
    );
   res.send('ok')
})

app.post('/customers', (req, res)=>{
  console.log(req.body)
  const { name, phone, cpf, birthday } = req.body
  connection.query(
    "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);",
    [name, phone, cpf, birthday]
  );
  res.send('ok')
})

app.get('/customers/:id', async (req, res)=>{
  const { id } = req.params
  const customers = await connection.query('SELECT * FROM customers WHERE Id = $1;',
  [id]
  );
  res.send(customers.rows[0])
})

app.get('/customers', async (req, res)=>{
  const customers = await connection.query('SELECT * FROM customers;');
  res.send(customers.rows)
})

app.put('/customers/:id',  (req, res)=>{
  try {
    //inserir cliente no db pelo id
    const  id  = req.body.id
    const {cpf, name} = req.body
console.log({name}) 

   connection.query(`UPDATE customers SET cpf=${cpf} WHERE id=${id};`
    )
     
    res.send(201) 

} catch (error) {
    console.log(error)
    return res.sendStatus(500)
}
  

})


app.listen(4000, ()=>{ 
  console.log("listening on port 4000" );
});