import { MOCK_CUSTOMERS } from "../data/customers.ts";
import type { Request, Response } from "express";

export class CustomerController {
    static getAllCustomers(req: Request, res: Response) {
        res.json(MOCK_CUSTOMERS);
    }
    static getCustomerById(req: Request, res: Response) {
        const id = parseInt(req.params.id as string, 10);

        if (isNaN(id)) {
            res.status(400).json({ message: 'Invalid customer ID. ID must be a number.' });
            return;
        }

        const customer = MOCK_CUSTOMERS.find((c) => c.id === id);
        if (customer) {
            res.json(customer);
        }
        else {
            res.status(404).json({ message: 'Customer not found' });
        }
    }
}