import { MOCK_CUSTOMERS } from "../data/customers.data.ts";

export class customerService {

  static async getAllCustomers(limit?: number) {
    if (limit && limit > 0) {
      return MOCK_CUSTOMERS.slice(0, limit);
    }

    return MOCK_CUSTOMERS;
  }

  static async getLatestCustomers(limit?: number) {
    const customers = [...MOCK_CUSTOMERS].sort(
      (a, b) =>
        new Date(b.joinedDate).getTime() -
        new Date(a.joinedDate).getTime()
    );

    if (limit && limit > 0) {
      return customers.slice(0, limit);
    }

    return customers;
  }

  static async getCustomerById(id: number) {
    return MOCK_CUSTOMERS.find(customer => customer.id === id) || null;
  }
}