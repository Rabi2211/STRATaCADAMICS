import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import "./Purchases.css";

const purchaseSeed: Array<{ supplier: string; location: string; product: string; qty: number; cost: number; expected: string; status: string }> = [];

export default function StudioPurchases() {
  const [purchaseOrders, setPurchaseOrders] = useState(purchaseSeed);

  const openPurchaseOrders = purchaseOrders.length;
  const incomingUnits = purchaseOrders.reduce((sum, order) => sum + order.qty, 0);
  const estimatedCost = purchaseOrders.reduce((sum, order) => sum + order.cost, 0);

  const handleCreatePurchaseOrder = () => {
    const nextIndex = purchaseOrders.length + 1;
    const nextOrder = {
      supplier: `New supplier ${nextIndex}`,
      location: "Portland, OR",
      product: "Seasonal replenishment",
      qty: 80 + nextIndex * 12,
      cost: 5200 + nextIndex * 900,
      expected: "May 02, 2025",
      status: "Draft",
    };

    setPurchaseOrders((current) => [nextOrder, ...current]);
  };

  return (
    <DashboardLayout
      kind="studio"
      title={"Purchases"}
      subtitle={"Create purchase orders and manage supplier replenishment."}
      actions={
        <>
          <button className="btn pri" type="button" onClick={handleCreatePurchaseOrder}>+ Create purchase order</button>
        </>
      }
    >
      <div className="split">
        <div>
          <div className="grid g3">
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Open purchase orders</span>
                <b>{openPurchaseOrders}</b>
                {" "}
                <span>Awaiting arrival or in transit</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Units incoming</span>
                <b>{incomingUnits.toLocaleString()}</b>
                {" "}
                <span>Across {openPurchaseOrders} purchase orders</span>
              </div>
            </div>
            <div className="card stat">
              <div className="ic" />
              <div>
                <span>Estimated cost</span>
                <b>R{estimatedCost.toLocaleString()}</b>
                {" "}
                <span>Total value of open orders</span>
              </div>
            </div>
          </div>
          <section className="card ">
            <h3>Supplier purchase orders</h3>
            <input className="search" placeholder="Search PO number, supplier, or product…" />
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>PO #</th>
                    <th>Supplier</th>
                    <th>Products</th>
                    <th>Quantity</th>
                    <th>Expected arrival</th>
                    <th>Cost</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                  {purchaseOrders.map((order, index) => (
                    <tr key={`${order.supplier}-${index}`}>
                      <td>
                        <b>PO-{1043 - index}</b>
                      </td>
                      <td>
                        {order.supplier}
                        <span className="sub">{order.location}</span>
                      </td>
                      <td>
                        <span className="thumb t1" />
                        {order.product}
                      </td>
                      <td>{order.qty} units</td>
                      <td>{order.expected}</td>
                      <td>R{order.cost.toLocaleString()}</td>
                      <td>
                        <span className={`pill ${order.status === "Draft" ? "orange" : "green"}`}>{order.status}</span>
                      </td>
                      <td>
                        <button type="button" className="btn" onClick={() => setPurchaseOrders((current) => current.map((entry, entryIndex) => entryIndex === index ? { ...entry, status: entry.status === "Draft" ? "Ordered" : "Draft" } : entry))}>
                          {order.status === "Draft" ? "Approve" : "Reopen"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
