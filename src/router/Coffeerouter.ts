import express from "express"
import { verifyToken } from "../middleware/authorization"
import { createCoffee, dropCoffee, getAllCoffee, updateCoffee } from "../controller/Coffeecontroller"
import uploadFile from "../middleware/uploadImageOfCoffee"
import { verifyAddCoffee, verifyEditCoffee } from "../middleware/verifyCoffee"
const app = express()

app.use(express.json())
/** add middleware process to verify token */
app.get(`/`, [verifyToken], getAllCoffee)

/** add middleware process to varify token, upload an image, and verify request data */
app.post(`/`, [verifyToken, uploadFile.single("image"), verifyAddCoffee], createCoffee)

/** add middleware process to varify token, upload an image, and verify request data */
app.put(`/:id`, [verifyToken, uploadFile.single("image"), verifyEditCoffee], updateCoffee)

/** add middleware process to verify token */
app.delete(`/:id`, [verifyToken], dropCoffee)
export default app