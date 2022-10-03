import joi from 'joi';

const nameValid = joi.object({
  name: joi.string().required().min(1)
});

const gamesAuth = function (req, res, next) {
  
  const { name } = req.body;
  console.log({name})
  const valiCadastro = nameValid.validate({name}, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
    return res.status(422).send(erro)
  }
  next()

}
export { gamesAuth } 