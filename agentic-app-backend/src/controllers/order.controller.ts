import type { Request, Response } from "express";
import { OrderService } from "../services/order.service.ts";

export class OrderController {
  // Get all orders
  static async getAllOrders(req: Request, res: Response) {
    try {
      const limit =
        typeof req.query.limit === "string"
          ? Number(req.query.limit)
          : undefined;

      const orders = await OrderService.getLatestOrders(limit);

      res.json(orders);
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({
        message: "Error fetching orders",
      });
    }
  }

  // Get order by ID
  static async getOrderById(req: Request, res: Response) {
    try {
      const id =
        typeof req.params.id === "string"
          ? req.params.id
          : "";

      const order = await OrderService.getOrdersById(id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }

      res.json(order);
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({
        message: "Error fetching order",
      });
    }
  }
}