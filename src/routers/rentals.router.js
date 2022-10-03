import { Router } from "express"
import { deleteRentals, getAllRentals, postRentalsPriceDay, postUpdateRentals } from "../controllers/rentals.controller.js"

const router = Router()

router.post('/rentals/:priceDay', postRentalsPriceDay)
router.get('/rentals', getAllRentals)
router.post('/rentals/:id/return',  postUpdateRentals )
router.delete('/rentals/:id', deleteRentals)

export default router