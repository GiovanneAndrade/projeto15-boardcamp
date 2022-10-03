import connection from "../database/db.js";
import joi from 'joi';

const nameValid = joi.object({
  name: joi.string().required().min(1),
  phone: joi.string().required().min(10).max(11),
  cpf: joi.string().required().min(11).max(11),
  birthday: joi.string().required()
});

async function postCustomers (req, res){
  const { name, phone, cpf, birthday } = req.body
  const valiCadastro = nameValid.validate(req.body, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
    return res.status(422).send(erro)
  }
  const Consult = await connection.query('SELECT * FROM customers WHERE cpf = $1;',
  [cpf])
  if(Consult.rows.length) {
    return res.send(409)
  }
  connection.query(
    "INSERT INTO customers (name, phone, cpf, birthday) VALUES ($1,$2,$3,$4);",
    [name, phone, cpf, birthday]
  );
  res.send('ok')
}

async function getHumCustomers (req, res){
  const { id } = req.params
  const customers = await connection.query('SELECT * FROM customers WHERE Id = $1;',
  [id]
  );
  if(!customers.length){
    return res.send(404)
  }
  res.send(customers.rows[0])
}

async function getAllCustomers (req, res){
  const {cpf} = req.query
  const customersList = await connection.query('SELECT * FROM customers;');
  res.send(customersList.rows)
}

 async function putCustomers (req, res){
  const {name, phone, cpf, birthday} = req.body
  const valiCadastro = nameValid.validate(req.body, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
    return res.status(422).send(erro)
  }
  const Consult = await connection.query('SELECT * FROM customers WHERE cpf = $1;',
  [cpf])
  if(Consult.rows.length) {
    return res.send(409)
  }
  
  try {
    const  {id}  = req.params
    connection.query(` UPDATE customers 
    SET name = $1, phone = $2, cpf = $3, birthday = $4
    WHERE id = $5;`,[name, phone, cpf, birthday, id])
    res.send(201) 

  } catch (error) {
    console.log(error)
    return res.sendStatus(500)
}
}

export { postCustomers, getHumCustomers, getAllCustomers, putCustomers }