import express from 'express';;
import { ChatController } from '../controllers/chat.controller.ts';
export const router = express.Router();
router.post('/',ChatController.generateResponse);
export default router;