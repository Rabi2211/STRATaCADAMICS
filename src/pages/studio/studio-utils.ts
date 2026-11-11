export type StudioOrderFilter = "ALL" | "PENDING" | "PAID" | "SHIPPED" | "CANCELLED";

export type StudioOrderLike = {
  id: string;
  status?: string;
  user?: {
    name?: string;
    email?: string;
  };
  items?: Array<{
    quantity?: number;
    product?: {
      name?: string;
    };
  }>;
  total?: number | string;
};

export function getVisibleOrders(
  orders: StudioOrderLike[],
  activeTab: StudioOrderFilter | string,
  query: string,
) {
  const normalizedTab = String(activeTab ?? "ALL").toUpperCase();
  const normalizedQuery = query.trim().toLowerCase();

  return orders.filter((order) => {
    const matchesTab = normalizedTab === "ALL" || String(order.status ?? "").toUpperCase() === normalizedTab;

    if (!matchesTab) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    const searchableText = [
      order.id,
      order.user?.name ?? "",
      order.user?.email ?? "",
      order.items?.map((item) => item.product?.name ?? "").join(" ") ?? "",
      String(order.total ?? ""),
    ]
      .join(" ")
      .toLowerCase();

    return searchableText.includes(normalizedQuery);
  });
}

export function buildInventoryCsv(rows: Array<Record<string, string | number>>) {
  if (!rows.length) {
    return "Product,SKU,Available\n";
  }

  const headers = Object.keys(rows[0]);
  const escaped = rows.map((row) => headers.map((key) => {
    const value = String(row[key] ?? "");
    return `"${value.replace(/"/g, '""')}"`;
  }).join(","));

  return [headers.join(","), ...escaped].join("\n") + "\n";
}
