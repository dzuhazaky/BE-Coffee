import express from "express"
import path from "path"
import cors from "cors"
import Adminroute from "./router/Adminroute"
import Coffeeroute from "./router/Coffeerouter"
import Orderroute from "./router/Orderrouter"



const app = express()
const PORT: number = 8000

app.use(cors())

app.use(`/coffee`, Coffeeroute)
app.use(`/order`, Orderroute)
app.use(`/admin`, Adminroute)
// app.use(`/pack`, PackRoute)
app.use(`/public`, express.static(path.join(__dirname, `public`)))
app.listen(PORT, () => console.log(`Server Coffee run on port ${PORT}`))