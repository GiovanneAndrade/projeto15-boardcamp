import { Router } from "express"
import { getAllCustomers, getHumCustomers, postCustomers, putCustomers } from "../controllers/customers.controller.js"
import { customersPostAuth, customersPutAuth } from "../middlewares/customers.middlewares.js"

const router = Router()

router.post('/customers', customersPostAuth, postCustomers)
router.get('/customers/:id', getHumCustomers)
router.get('/customers', getAllCustomers)
router.put('/customers/:id', customersPutAuth, putCustomers)

export default router