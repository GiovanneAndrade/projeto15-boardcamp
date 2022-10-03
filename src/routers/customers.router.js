import { Router } from "express"
import { getAllCustomers, getHumCustomers, postCustomers, putCustomers } from "../controllers/customers.controller.js"

const router = Router()

router.post('/customers', postCustomers)
router.get('/customers/:id', getHumCustomers)
router.get('/customers', getAllCustomers)
router.put('/customers/:id', putCustomers)

export default router