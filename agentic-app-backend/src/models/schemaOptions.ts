import type { SchemaOptions } from "mongoose";

export const globalSchemaOptions: SchemaOptions ={
  versionKey: false,
  //timestamps: true,
  toJSON: {
    virtuals: true,
    getters: true,
    transform: (doc,ret: Record<string, any> ) => {
        delete ret._id;
      delete ret.__v;

      return ret;
    },
  },
  toObject:{
    virtuals: true,
    getters: true,
    transform: (doc,ret: Record<string, any> ) => {
      delete ret._id;
      delete ret.__v;

      return ret;
    },
  
    
  }
};