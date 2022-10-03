import joi from "joi"

export const nameValid = joi.object({
    customerId: joi.number().required(),
    gameId: joi.number().required(),
    daysRented: joi.number().required().min(1)
}) 

const rentalsAuth = function (req, res, next) {

  const valiCadastro = nameValid.validate(req.body, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
   return res.status(422).send(erro)
  }
  next()
}
export { rentalsAuth }