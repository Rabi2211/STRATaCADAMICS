import { describe, expect, it } from "vitest";
import { getVisibleOrders } from "./studio-utils";

describe("studio utility filters", () => {
  const orders = [
    {
      id: "ord-1001",
      status: "PENDING",
      user: { name: "Jordan Mitchell", email: "jordan@example.com" },
      items: [{ quantity: 2, product: { name: "New Punk Tee" } }],
      total: 240,
    },
    {
      id: "ord-1002",
      status: "SHIPPED",
      user: { name: "Taylor Brooks", email: "taylor@example.com" },
      items: [{ quantity: 1, product: { name: "Tag Hoodie" } }],
      total: 180,
    },
    {
      id: "ord-1003",
      status: "PAID",
      user: { name: "Casey Rivera", email: "casey@example.com" },
      items: [{ quantity: 3, product: { name: "Cowboy Tee" } }],
      total: 320,
    },
  ];

  it("filters orders by selected tab and search query", () => {
    const visible = getVisibleOrders(orders, "PENDING", "punk");

    expect(visible).toHaveLength(1);
    expect(visible[0].id).toBe("ord-1001");
  });

  it("returns all orders when tab is all and query is empty", () => {
    const visible = getVisibleOrders(orders, "ALL", "");

    expect(visible).toHaveLength(3);
  });
});
