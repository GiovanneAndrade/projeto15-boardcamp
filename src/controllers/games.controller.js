import connection from "../database/db.js";


async function getGames  (req, res) {
  const {name} = req.query
  try {
    if(!name){
        const gameList = await connection.query(`SELECT games.*, categories.name as "categoryName" FROM games
        JOIN categories ON games."categoryId" = categories.id`)
        if(gameList.rows.length==0){
            return res.sendStatus(404)
        }
        res.status(200).send(gameList.rows)
     } else{
        const gameListQuery = await connection.query(`SELECT * FROM games WHERE name ILIKE '${name}%'`)
        if(gameListQuery.rows.length==0){
            return res.sendStatus(404)
        }
        res.status(200).send(gameListQuery.rows)

     }
       
     } catch (error) {
        console.log(error)
        return res.sendStatus(500)
     }
}

async function postGames (req, res)  {
  const game = req.body
    
  try {
      const existentGame = await connection.query(`SELECT FROM games WHERE name ILIKE '${game.name}'`)
      if(existentGame.rows.length>0){
          return res.status(409).send("game name already exist")
      }
      const existentId = await connection.query(`SELECT FROM categories WHERE id = $1`, [game.categoryId] )
      if(existentId.rows.length==0){
          return res.status(400).send("invalid category id")
      }
      await connection.query(`INSERT INTO games (name,image,"stockTotal","categoryId","pricePerDay") VALUES ($1,$2,$3,$4,$5)`,
       [game.name, game.image, game.stockTotal, game.categoryId, game.pricePerDay])
       res.sendStatus(201)
      
  } catch (error) {
      console.log(error)
      return res.sendStatus(500)
  }
}

export { postGames, getGames }