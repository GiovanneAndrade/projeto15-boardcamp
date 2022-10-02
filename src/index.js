import  express  from "express";
import cors from "cors";
import dotenv from 'dotenv';
import pkg  from 'pg';
import dayjs from 'dayjs'
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
  const customersList = await connection.query('SELECT * FROM customers;');
  res.send(customersList.rows)
})

app.put('/customers/:id',  (req, res)=>{
    try {
      const  {id}  = req.params
      console.log(id) 
      const {cpf, name} = req.body
      console.log(cpf) 
    connection.query(`UPDATE customers SET cpf=${cpf} WHERE id=${id};`
      )
      res.send(201) 

    } catch (error) {
      console.log(error)
      return res.sendStatus(500)
  }
})

app.post('/rentals/:priceDay', (req, res) => {
  const { customerId, gameId, daysRented } = req.body
  const  priceDay  = req.params.priceDay
  console.log(priceDay)
  connection.query(
`INSERT INTO rentals 
    (
      "customerId", 
      "gameId", 
      "rentDate", 
      "daysRented", 
      "returnDate", 
      "originalPrice", 
      "delayFee"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7);`,
    [
      customerId,
      gameId,
      dayjs().format('YYYY-MM-DD'),
      daysRented,
      null,
      priceDay * daysRented,
      null
    ]
  );
  res.send("ok")
})

app.get('/rentals', async (req, res)=>{
  const rentalsList = await connection.query('SELECT * FROM rentals;');
  res.send(rentalsList.rows)
})

app.post('/rentals/:id/return', async (req, res) => {
  const  priceDay  = req.headers.priceDay
  const { id } = req.params
  let delayFee;

  const customersList = await connection.query("SELECT * FROM rentals WHERE Id = $1;",[id]);
   const teste = customersList.rows[0]
   const { rentDate, daysRented, originalPrice} = teste
   const isDelay = dayjs().diff(rentDate, 'day')
   if(isDelay > daysRented) delayFee = isDelay - daysRented
   else delayFee = 0
   delayFee =  delayFee * originalPrice
    
   connection.query(` UPDATE rentals 
   SET "returnDate" = $1, "delayFee" = $2
   WHERE id = $3;`,[dayjs().format('YYYY-MM-DD'), delayFee, id])
    
   
  res.send(customersList.rows[0])
 
  
})


app.listen(4000, ()=>{ 
  console.log("listening on port 4000" );
});