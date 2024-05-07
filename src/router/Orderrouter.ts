import express from "express";
import { createOrder, dropOrder, getAllOrder } from "../controller/OrderController";
import { verifyAddOrder } from "../middleware/verifyOrder";

const app = express()

app.use(express.json())
app.get(`/`, getAllOrder)
app.post(`/`, verifyAddOrder, createOrder)
app.delete(`/`, dropOrder)

export default app