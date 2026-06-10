import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import router from "./routes/index.js"
import {errorHandler} from "./middlewares/errorHandler.js"

const app=express()

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use("/api", router)

app.use(errorHandler)

export default app
