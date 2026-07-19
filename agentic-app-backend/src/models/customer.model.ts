import {Document, model, Schema } from "mongoose";
import { string } from "zod";
import { globalSchemaOptions } from "./schemaOptions.ts";


export interface ICustomer extends Document {
  name: string;
  email: string;
  joinedDate: Date | string;

}

const CustomerSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique: true},
    joinedDate: {
  type: String,
      default: Date.now,
      get: (date: Date) => (date instanceof Date ? date.toISOString() : date),
},
},
 globalSchemaOptions
);

export const Customer = model<ICustomer>('Customer', CustomerSchema);