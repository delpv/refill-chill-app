import express from "express"
import expressLayouts from "express-ejs-layouts"
import path from "path"
import cors from "cors"
import homeRouter from "./routes/home.js"
import supportRouter from "./routes/support.js"
import ourStoryRouter from "./routes/ourStory.js"
import listRouter from "./routes/list.js"
import productRouter from "./routes/product.js"
import basketRouter from "./routes/basket.js"
import checkoutRouter from "./routes/checkout.js"
import sqlite3 from 'sqlite3'

const app = express()

const __dirname = path.dirname(decodeURIComponent(new URL(
    import.meta.url).pathname))

app.set("view engine", "ejs")
app.set("views", __dirname + "/views")
app.set("layout", "layouts/layout")
app.use(expressLayouts)
app.use(express.static("public"))
app.use(cors())

// Connect to SQLite database
const db = new sqlite3.Database('./mydb.db');

app.use("/", homeRouter)
app.use("/support", supportRouter)
app.use("/ourstory", ourStoryRouter)
app.use("/list", listRouter)
app.use("/product", productRouter)
app.use("/basket", basketRouter)
app.use("/checkout", checkoutRouter)


app.listen(3000, () => console.log('Example app listening on port 3000!'))