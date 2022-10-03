import dayjs from 'dayjs'
import connection from '../database/db.js'

function postRentalsPriceDay (req, res) {
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
}

async function getAllRentals (req, res){
  const rentalsList = await connection.query('SELECT * FROM rentals;');
  res.send(rentalsList.rows)
}

async function postUpdateRentals (req, res) {
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
}

async function deleteRentals (req, res) { 
  const { id } = req.params
  try {
      await connection.query('DELETE FROM rentals WHERE id = $1', [id])

      res.sendStatus(200)
  } catch (err) {
      console.log(err)
      res.status(500).send(err)
  }
}

export { postRentalsPriceDay, getAllRentals, postUpdateRentals, deleteRentals  }