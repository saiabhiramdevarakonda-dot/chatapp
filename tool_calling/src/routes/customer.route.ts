import express from 'express';;
import { ChatController } from '../controllers/chat.controller.ts';
import { CustomerController } from '../controllers/customer.controller.ts';
export const router = express.Router();
router.get('/', CustomerController.getAllCustomers);
router.get('/:id', CustomerController.getCustomerById);
export default router;