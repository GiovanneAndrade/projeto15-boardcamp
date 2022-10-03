import { Router } from "express"
import { deleteRentals, getAllRentals, postRentalsPriceDay, postUpdateRentals } from "../controllers/rentals.controller.js"
import { rentalsAuth } from "../middlewares/rentals.middlewares.js"

const router = Router()

router.post('/rentals', rentalsAuth, postRentalsPriceDay)
router.get('/rentals', getAllRentals)
router.post('/rentals/:id/return',  postUpdateRentals )
router.delete('/rentals/:id', deleteRentals)

export default router