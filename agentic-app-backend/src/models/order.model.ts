import { Document, model, Schema, Types } from "mongoose";
import type { ICustomer } from "./customer.model.ts";

export interface IOrder extends Document {
  product: string;
  price: number;
  customer: Types.ObjectId | ICustomer | string;
  orderDate: Date | string;
}

const OrderSchema = new Schema<IOrder>({
  product: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  customer: {
    type: Schema.Types.ObjectId,
    ref: "Customer",
    required: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
});

export const Order = model<IOrder>("Order", OrderSchema);