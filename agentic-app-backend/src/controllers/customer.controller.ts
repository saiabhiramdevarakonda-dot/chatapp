
import type { Request, Response } from "express";
import { customerService } from "../services/customer.service.ts";

export class CustomerController {
    static async getAllCustomers(req: Request, res: Response) {
        try {
            const { limit } = req.query;
            const parsedLimit = limit ? Number(limit) : undefined;

            if (
                parsedLimit !== undefined &&
                (!Number.isInteger(parsedLimit) || parsedLimit < 1)
            ) {
                return res.status(400).json({
                    message: "Limit must be a positive integer",
                });
            }

            const customers =
                await customerService.getLatestCustomers(parsedLimit);

            return res.json(customers);
        } catch (error) {
            console.error("Error fetching customers:", error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }

    
static async getCustomerById(req: Request, res: Response) {
    try {
        const id = req.params.id;

        if (typeof id !== "string" || !id.trim()) {
            return res.status(400).json({
                message: "A valid customer ID is required",
            });
        }

        const customer = await customerService.getCustomerById(id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found",
            });
        }

        return res.json(customer);
    } catch (error) {
        console.error("Error fetching customer:", error);
        return res.status(500).json({
            message: "Internal server error",
        });
    }
}

}
