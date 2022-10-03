import { Router } from "express"
import { getGames, postGames } from "../controllers/games.controller.js"
import { gamesAuth } from "../middlewares/games.middlewares.js"


const router = Router()

router.get('/games', getGames)
router.post('/games', gamesAuth, postGames)

export default router