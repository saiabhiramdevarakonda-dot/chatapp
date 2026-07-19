import type { Request, Response } from "express";
import { OrderService } from "../services/order.service.ts";

export class OrderController {
    static async getAllOrders(req: Request, res: Response) {
        try{
            const { limit } = req.query;
            const orders = await OrderService.getLatestOrders(limit ? Number(limit) : undefined);
            res.json(orders);
        }
        catch (error) {
            console.error('Error fetching orders:', error);
            res.status(500).json({ message: 'Error fetching orders' });
        }
    }   
    static async getOrderById(req: Request, res: Response) {
     try{
        const { id } = req.params;
        const orders = await OrderService.getOrdersById(Number(id));
        if(!orders || orders.length === 0) {
            return res.status(404).json({ message: 'No orders found for the given customer ID' });
   }
    res.json(orders);
     }catch (error) {    
        console.error('Error fetching order:', error);
        res.status(500).json({ message: 'Error fetching order' });
    }
}
}