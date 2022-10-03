import dayjs from 'dayjs'
import connection from '../database/db.js'

async function postRentalsPriceDay (req, res) {
  const rentInfo = req.body
    try {
        const verifyCustomerId = await connection.query(`SELECT * FROM customers WHERE id =$1 `, [rentInfo.customerId])
        if(verifyCustomerId.rows.length==0){
            return res.status(400).send("custumer Id not found")
        }
        const verifyGameId = await connection.query(`SELECT * FROM games WHERE id =$1 `, [rentInfo.gameId])
       
        if(verifyGameId.rows.length==0){
            return res.status(400).send("game Id not found")
        }
        const verifyStock = await connection.query(`SELECT "stockTotal" FROM games WHERE id=$1`, [rentInfo.gameId])
        if(verifyStock.rows[0].stockTotal == 0 ){
            return res.status(400).send("not availble")
        } else {
            const updatedStock = (verifyStock.rows[0].stockTotal)-1
            await connection.query(`UPDATE games SET "stockTotal" = $1 WHERE id = $2`, [updatedStock,rentInfo.gameId] )
        }
    
    const pricePerDay = await connection.query(`SELECT "pricePerDay" FROM games WHERE id = $1`, [rentInfo.gameId])
    const originalPrice = (pricePerDay.rows[0].pricePerDay)*rentInfo.daysRented  
    console.log("price ", typeof pricePerDay.rows[0].pricePerDay) 
    const rentDate = new Date().toLocaleDateString() 
    await connection.query(`INSERT INTO rentals 
    ("customerId","gameId","rentDate","daysRented","returnDate","originalPrice","delayFee") 
    VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [rentInfo.customerId, rentInfo.gameId, rentDate,rentInfo.daysRented, null ,originalPrice, null ])
    res.sendStatus(201)

} catch (error) {
    return res.sendStatus(500)
}

}




async function getAllRentals (req, res){
  const { customerId, gameId } = req.query;

  if(customerId){
      const costumerRentals = await connection.query(`SELECT * FROM rentals WHERE id=$1`,[customerId]) 
      if(costumerRentals.rows.length===0){
      return res.status(404).send("client not found")
      }
  }
  else if(gameId){
      const games = await connection.query(`SELECT * FROM rentals WHERE "gameId"=$1`,[gameId])
      if(games.rows.length===0){
      return res.status(404).send("game not found")
      }
} else {
  const allRentals = await connection.query(`SELECT rentals.*, games.id as "gameId", games.name as "gameName", games."categoryId" as "gameCategoryId", customers.name as "customerName", customers.id as "customerId", categories.id as "categoryId", categories.name as "categoryName" FROM rentals
  JOIN games
  ON rentals."gameId" = games.id
  JOIN customers
  ON rentals."customerId" = customers.id
  JOIN categories
  ON games."categoryId" = categories.id`)
  if(allRentals.rows.length==0){
      res.status(404).send("no rentals information")
      return
  }
  const response = allRentals.rows.map((rentals)=>{
    return(
    {
      ...rentals,
      game: {
      id: rentals.gameId,
      name: rentals.gameName,
      categoryId: rentals.categoryId,
      categoryName: rentals.categoryName,
      },
      customer: {
        id: rentals.customerId,
        name: rentals.customerName,
      }
    }
    ) 
  })
    res.status(200).send(response)
 }       
}




async function postUpdateRentals (req, res) {
  
  const { id } = req.params
  let delayFee;

   const rentalsList = await connection.query("SELECT * FROM rentals WHERE Id = $1;",[id]);
   console.log(rentalsList.rows[0].returnDate)
   if(rentalsList.rows.length === 0 ){
   return res.status(404)
   }
   if(rentalsList.rows[0].returnDate !== null){
    return res.status(400)
    }
   const teste = rentalsList.rows[0]
   const { rentDate, daysRented, originalPrice} = teste
   const isDelay = dayjs().diff(rentDate, 'day')
   if(isDelay > daysRented) delayFee = isDelay - daysRented
   else delayFee = 0
   delayFee =  delayFee * originalPrice
    
  try {
    connection.query(` UPDATE rentals 
    SET "returnDate" = $1, "delayFee" = $2
    WHERE id = $3;`,[dayjs().format('YYYY-MM-DD'), delayFee, id])
   return res.sendStatus(200)
  } catch (error) {
  return  res.status(500).send(error)
  }
}

async function deleteRentals (req, res) { 
  const { id } = req.params
  const delRentals =  await connection.query('SELECT * FROM rentals WHERE id = $1', [id])
  console.log(delRentals.rows)
  if(delRentals.rows.length === 0) {
   return res.sendStatus(404)
  }
 if(delRentals.rows[0].returnDate === null){
  return res.sendStatus(400)
  } 
   try {
      await connection.query('DELETE FROM rentals WHERE id = $1', [id])

    return  res.sendStatus(200)
  } catch (err) {
     return res.sendStatus(500).send(err)
  } 
}

export { postRentalsPriceDay, getAllRentals, postUpdateRentals, deleteRentals  }