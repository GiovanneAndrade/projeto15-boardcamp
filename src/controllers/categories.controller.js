import connection from '../database/db.js'

async function getCategories (req, res) {
  try {
    const categories = await connection.query(
      'SELECT * FROM categories;'
    );
    res.send(categories.rows);
  } catch (err) {
    res.sendStatus(500).send(err)
  }
}


async function postCategories (req, res) {
  const { name } = req.body
  const nameFounded = await connection.query(`SELECT * FROM categories WHERE name = '${req.body.name}'`)
  if((nameFounded.rows).length > 0) {
      return res.sendStatus(409)
  } 
  try {
    connection.query('INSERT INTO categories (name) VALUES ($1);', [name]);
    res.send(201)
  } catch (error) {
    res.sendStatus(500).send(err)
  }
}

export { getCategories, postCategories }