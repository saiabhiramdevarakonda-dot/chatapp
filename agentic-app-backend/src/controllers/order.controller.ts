import { MOCK_ORDERS } from "../data/orders.data.ts";
import type { Request, Response } from "express";

export class OrderController {
    static getAllOrders(req: Request, res: Response) {
        res.json(MOCK_ORDERS);
    }   
    static getOrderById(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid order ID. ID must be a number.' });
            return;
        }

        const order = MOCK_ORDERS.find((o) => o.id === id);
        if (order) {
            res.json(order);
        }
        else {
            res.status(404).json({ message: 'Order not found' });
        }
    }
}