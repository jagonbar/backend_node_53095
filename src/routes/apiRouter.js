import { Router }     from "express";
import productsRouter from "./productsRouter";
import cartsRouter from "./cartRouter";

const apiRouter = Router();

apiRouter.use('/products',productsRouter)
apiRouter.use('/carts',cartsRouter)

export default apiRouter