import  express  from "express";
import cors from "cors";
import categoriesRouter from '../src/routers/categories.router.js'
import gamesRouter from './routers/games.router.js'
import customersRouter from '../src/routers/customers.router.js'
import rentalsRouter from '../src/routers/rentals.router.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use(categoriesRouter)
app.use( gamesRouter )
app.use(customersRouter)
app.use(rentalsRouter)


app.listen(4000, ()=>{ 
  console.log("listening on port 4000" );
});