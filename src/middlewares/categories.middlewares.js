import joi from 'joi';

const nameValid = joi.object({
  name: joi.string().required().min(1)
});

const categoriesAuth = function (req, res, next) {
  console.log(req.body)
  
  const valiCadastro = nameValid.validate(req.body, {abortEarly: false})
  if(valiCadastro.error){
   const erro = valiCadastro.error.details.map((err) => err.message)
    return res.status(422).send(erro)
  }
  next()

}
export { categoriesAuth } 