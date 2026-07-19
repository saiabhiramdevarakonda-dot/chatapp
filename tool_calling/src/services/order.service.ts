import { MOCK_CUSTOMERS } from "../data/customers.data.ts";
import { MOCK_ORDERS } from "../data/orders.data.ts";

export class OrderService {
    static async getLatestOrders(limit?: number) {
        const sortedOrders = MOCK_ORDERS.sort(
            (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
        );
        if (limit && limit > 0) {
            return sortedOrders.slice(0, limit);
        }
        return sortedOrders;
    }
    static async getLatestOrdersByCustomerDetails(customerId: number, limit?: number) {
     const customers = MOCK_CUSTOMERS;
     const orders = MOCK_ORDERS.map((order) => {
        const customer = customers.find((c) => c.id === order.customerId);
        return { ...order, customer: customer?.name || "Unknown" };
    });
     const sortedOrders = orders.sort(
        (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
    if (limit && limit > 0) {
        return sortedOrders.slice(0, limit);
    }
    return sortedOrders;
}
 static async getOrdersById(customerId: number) {
    return MOCK_ORDERS.filter((order) => order.customerId === customerId);
}
}