import express from "express";
import { McpServerController } from "../controllers/mcp-server.controller.ts";

const router=express.Router();

router.post('/',McpServerController.handlePost);
router.get('/',McpServerController.handleGet);
router.delete('/',McpServerController.handleDelete);


export default router;