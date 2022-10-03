import joi from 'joi';

const nameValid = joi.object({
  name: joi.string().required().min(1),
  phone: joi.string().required().min(10).max(11),
  cpf: joi.string().required().min(11).max(11),
  birthday: joi.string().required()
});

const customersPostAuth = function (req, res, next) {

  const valiCadastro = nameValid.validate(req.body, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
   return res.status(422).send(erro)
  }
  next()
}

const customersPutAuth = function (req, res, next) {

  const valiCadastro = nameValid.validate(req.body, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
   return res.status(422).send(erro)
  }
  next()

}
export { customersPostAuth, customersPutAuth } 

