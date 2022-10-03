import { Router } from "express"
import { getCategories, postCategories } from "../controllers/categories.controller.js"
import { categoriesAuth } from "../middlewares/categories.middlewares.js"


const router = Router()

router.get('/categories', getCategories)
router.post('/categories', categoriesAuth, postCategories)

export default router