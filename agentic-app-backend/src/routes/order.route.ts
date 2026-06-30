import  express  from "express";
import { OrderController } from "../controllers/order.controller.ts";
export const router = express.Router();
router.get('/', OrderController.getAllOrders);
router.get('/:id', OrderController.getOrderById);
export default router;