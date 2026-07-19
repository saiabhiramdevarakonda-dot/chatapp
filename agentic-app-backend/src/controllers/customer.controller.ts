import type { Request, Response } from "express";
import { customerService } from "../services/customer.service.ts";
export class CustomerController {
    static async getAllCustomers(req: Request, res: Response) {
       try{
        const {limit} = req.query;

        const customers = await customerService.getAllCustomers(limit ? Number(limit) : undefined);
        res.json(customers);
       }
       catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
       }
    }
    static async getCustomerById(req: Request, res: Response) {
        try{
            const id =  req.params;
            const customer =  await customerService.getCustomerById(Number(id));
            if(!customer){;
        if(!customer){
          return res.status(404).json({ message: 'Customer not found' });
        }
        res.json(customer);
    }
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
       }
}
}
