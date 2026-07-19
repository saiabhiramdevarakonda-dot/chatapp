import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import z from "zod";
import { OrderService } from "../../../services/order.service.ts";

export function registerOrderTools(mcpServer: McpServer) {
  console.log("Registering order tools...");

  mcpServer.registerTool(
    "get_all_orders",
    {
      title: "Get All Orders",
      description:
        "Returns order records from the application's order database. Use this whenever the user asks about orders, latest orders, recent orders, order list, or order information.",

      inputSchema: {
        limit: z.number().optional(),
      },

      outputSchema: {
        orders: z.array(
          z.object({
            id: z.string(),
            customerId: z.string(),
            product: z.string(),
            price: z.number(),
            orderDate: z.string(),
          })
        ),
      },
    },

    async ({ limit }) => {
      const orders = await OrderService.getLatestOrders(limit);
      console.log("Orders returned from service:");
console.log(JSON.stringify(orders, null, 2));

      const formattedOrders = orders.map((order: any) => ({
        id: order._id.toString(),

        customerId:
          typeof order.customer === "object" && order.customer !== null
            ? order.customer._id.toString()
            : order.customer.toString(),

        product: order.product,

        price: order.price,

        orderDate:
          order.orderDate instanceof Date
            ? order.orderDate.toISOString()
            : order.orderDate,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formattedOrders, null, 2),
          },
        ],
        structuredContent: {
          orders: formattedOrders,
        },
      };
    }
  );

  mcpServer.registerTool(
    "getordersbycustomerdetails",
    {
      title: "Get Order By Customer Details",
      description:
        "Returns order records from the application's order database based on the provided customer details.",

      inputSchema: {
        customerId: z.string(),
        limit: z.number().optional(),
      },

      outputSchema: {
        orders: z.array(
          z.object({
            id: z.string(),
            customerId: z.string(),
            product: z.string(),
            price: z.number(),
            orderDate: z.string(),
            customer: z.string().optional(),
          })
        ),
      },
    },

    async ({ customerId, limit }) => {
      const orders =
        await OrderService.getLatestOrdersByCustomerDetails(
          customerId,
          limit
        );

      const formattedOrders = orders.map((order: any) => ({
        id: order._id.toString(),

        customerId:
          typeof order.customer === "object"
            ? order.customer._id.toString()
            : order.customer.toString(),

        customer:
          typeof order.customer === "object"
            ? order.customer.name
            : undefined,

        product: order.product,

        price: order.price,

        orderDate:
          order.orderDate instanceof Date
            ? order.orderDate.toISOString()
            : order.orderDate,
      }));

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formattedOrders, null, 2),
          },
        ],
        structuredContent: {
          orders: formattedOrders,
        },
      };
    }
  );

  mcpServer.registerTool(
    "getordersbyId",
    {
      title: "Get Order By ID",

      description:
        "Returns an order record from the application's order database based on the provided order ID.",

      inputSchema: {
        id: z.string(),
      },

      outputSchema: {
        order: z.object({
          id: z.string(),
          customerId: z.string(),
          product: z.string(),
          price: z.number(),
          orderDate: z.string(),
        }),
      },
    },

    async ({ id }) => {
      const order = await OrderService.getOrdersById(id);

      if (!order) {
        throw new Error("Order not found");
      }

      const formattedOrder = {
        id: order._id.toString(),

        customerId:
          typeof order.customer === "object"
            ? order.customer._id.toString()
            : order.customer.toString(),

        product: order.product,

        price: order.price,

        orderDate:
          order.orderDate instanceof Date
            ? order.orderDate.toISOString()
            : order.orderDate,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formattedOrder, null, 2),
          },
        ],
        structuredContent: {
          order: formattedOrder,
        },
      };
    }
  );

  mcpServer.registerTool(
    "create_order",
    {
      title: "Create Order",

      description:
        "Creates a new order record in the application's order database.",

      inputSchema: {
        customerId: z.string(),
        product: z.string(),
        price: z.number(),
      },

      outputSchema: {
        success: z.boolean(),
        message: z.string(),
      },
    },

    async ({ customerId, product, price }) => {
      console.log("Creating order...", customerId, product, price);

      try {
        const result = await OrderService.createOrder(
          customerId,
          price,
          product
        );

        return {
          content: [
            {
              type: "text",
              text: `Order created with ID: ${result._id}`,
            },
          ],
          structuredContent: {
            success: true,
            message: `Order created with ID: ${result._id}`,
          },
        };
      } catch (error) {
        console.error("Error creating order:", error);

        const message =
          error instanceof Error ? error.message : "Unknown error";

        return {
          content: [
            {
              type: "text",
              text: `Error creating order: ${message}`,
            },
          ],
          structuredContent: {
            success: false,
            message: `Error creating order: ${message}`,
          },
        };
      }
    }
  );
}