
import { Customer } from "../models/customer.model.ts";

export class customerService {
    static async getLatestCustomers(limit?: number) {
        const customers = await Customer.find()
            .sort({ joinedDate: -1 })
            .limit(limit ?? 0);

        console.log("Fetched customers:", customers);
        return customers;
    }

    static async getCustomerById(id: string) {
        return await Customer.findById(id);
    }

    static async createCustomer(name: string, email: string) {
        const customer = await Customer.create({
            name,
            email,
            joinedDate: new Date().toISOString(),
        });

        return customer;
    }
}
