import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { customerService } from "../../../services/customer.service.ts";

export function registerCustomerTools(mcpServer: McpServer) {
  console.log("Registering customer tools...");

  // ============================
  // Get All Customers
  // ============================
  mcpServer.registerTool(
    "get_all_customers",
    {
      title: "Get All Customers",
      description:
        "Returns customer records from the application's customer database. Use this whenever the user asks about customers, latest customers, recent customers, customer list, or customer information.",

      inputSchema: {
        limit: z.number().optional(),
      },

      outputSchema: {
        customers: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
            email: z.string(),
            joinedDate: z.string(),
          })
        ),
      },
    },

    async ({ limit }) => {
      const customers = await customerService.getLatestCustomers(limit);

      const formattedCustomers = customers.map((customer) => ({
  id: customer.id,
  name: customer.name,
  email: customer.email,
  joinedDate: customer.joinedDate,
}));

console.log("structuredContent:", {
  customers: formattedCustomers,
});

return {
  content: [
    {
      type: "text",
      text: JSON.stringify(formattedCustomers, null, 2),
    },
  ],
  structuredContent: {
    customers: formattedCustomers,
  },
};
    }
  );

  // ============================
  // Get Customer By ID
  // ============================
  mcpServer.registerTool(
    "get_customer_by_id",
    {
      title: "Get Customer By ID",

      description:
        "Returns a customer record from the application's customer database based on the provided customer ID.",

      inputSchema: {
        id: z.string(),
      },

      outputSchema: {
        customer: z.object({
          id: z.string(),
          name: z.string(),
          email: z.string(),
          joinedDate: z.string(),
        }),
      },
    },

    async ({ id }) => {
      const customer = await customerService.getCustomerById(id);

      if (!customer) {
        throw new Error("Customer not found");
      }

      const formattedCustomer = {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        joinedDate: customer.joinedDate,
      };

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(formattedCustomer, null, 2),
          },
        ],
        structuredContent: {
          customer: formattedCustomer,
        },
      };
    }
  );

  // ============================
  // Create Customer
  // ============================
  mcpServer.registerTool(
    "create_customer",
    {
      title: "Create Customer",

      description:
        "Creates a new customer record in the application's customer database.",

      inputSchema: {
        name: z.string(),
        email: z.string(),
      },

      outputSchema: {
        success: z.boolean(),
        message: z.string(),
      },
    },

    async ({ name, email }) => {
      console.log("Creating customer...", name, email);

      try {
        const result = await customerService.createCustomer(name, email);

        return {
          content: [
            {
              type: "text",
              text: `Customer created with ID: ${result._id}`,
            },
          ],
          structuredContent: {
            success: true,
            message: `Customer created with ID: ${result._id}`,
          },
        };
      } catch (error:any) {
        console.error("Error creating customer:", error);

        const message =
          error instanceof Error ? error.message : "Unknown error";

        return {
          content: [
            {
              type: "text",
              text: `Error creating customer: ${message}`,
            },
          ],
          structuredContent: {
            success: false,
            message: `Error creating customer: ${message}`,
          },
        };
      }
    }
  );
}