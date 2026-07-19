import { Order } from "../models/order.model.ts";

export class OrderService {
  // Get all orders
  static async getLatestOrders(limit?: number) {
    const query = Order.find()
      .sort({ orderDate: -1 })
      .populate("customer", "name email");

    if (limit && limit > 0) {
      query.limit(limit);
    }

    return await query;
  }

  // Get orders by customer
  static async getLatestOrdersByCustomerDetails(
    customerId: string,
    limit?: number
  ) {
    const query = Order.find({ customer: customerId })
      .sort({ orderDate: -1 })
      .populate("customer", "name email");

    if (limit && limit > 0) {
      query.limit(limit);
    }

    return await query;
  }

  // Get order by ID
  static async getOrdersById(id: string) {
    return await Order.findById(id).populate("customer", "name email");
  }

  // Create order
  static async createOrder(
    customerId: string,
    price: number,
    product: string
  ) {
    return await Order.create({
      customer: customerId,
      product,
      price,
      orderDate: new Date(),
    });
  }
}