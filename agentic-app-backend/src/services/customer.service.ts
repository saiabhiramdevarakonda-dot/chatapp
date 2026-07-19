// import { MOCK_CUSTOMERS } from "../data/customers.data.ts";
import { Customer } from "../models/customer.model.ts";

export class customerService {

  static async getLatestCustomers(limit?: number) {

    // const sortedCustomers = MOCK_CUSTOMERS.sort(
    //   (a, b) =>
    //     new Date(b.joinedDate).getTime() -
    //     new Date(a.joinedDate).getTime()
    // );

    // if (limit && limit > 0) {
    //   return sortedCustomers.slice(0, limit);
    // }

    // return sortedCustomers;

    const customers = await Customer.find().sort({ joinedDate: -1 }).limit(limit || 0);
    console.log("fetched customers:",customers);
    return customers;
  }
  static async getCustomerById(id: string) {
    // return (
    //   MOCK_CUSTOMERS.find((customer) => customer.id === id) || null
    // );
     const customer = await Customer.findById(id);
    return customer;
  }

  // Create customer in MongoDB
  static async createCustomer(name: string, email: string) {
    const customer = await Customer.create({
      name,
      email,
      joinedDate: new Date().toISOString(),
    });

    return customer;
  }
}