import connection from '../database/db.js'
import joi from 'joi';

const nameValid = joi.object({
  name: joi.string().required().min(1)
});

async function getCategories (req, res) {
 
  try {
    const categories = await connection.query(
      'SELECT * FROM categories;'
    );
    res.send(categories.rows);
} catch (err) {
    console.log(err)
    res.status(500).send(err)
}
}

async function postCategories (req, res) {
  const { name } = req.body
  const valiCadastro = nameValid.validate(req.body, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
    return res.status(422).send(erro)
  }
  const nameFounded = await connection.query(`SELECT * FROM categories WHERE name = '${req.body.name}'`)
console.log(nameFounded.rows)
  if((nameFounded.rows).length > 0) {
      return res.sendStatus(409)
  } 
  try {
    connection.query('INSERT INTO categories (name) VALUES ($1);',
    [name])
    res.send(201)
  } catch (error) {
    res.status(500).send(err)
  }
}

export { getCategories, postCategories }