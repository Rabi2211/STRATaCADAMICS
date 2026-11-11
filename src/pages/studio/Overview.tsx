import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import { fetchBrands, fetchProducts, fetchOrders, mapApiProduct, type ApiBrand, type ApiOrder } from "../../lib/store-api";
import "./Overview.css";

type FulfillmentState = Record<string, { shipped: boolean; trackingAdded: boolean }>;

export default function StudioOverview() {
  const [brands, setBrands] = useState<ApiBrand[]>([]);
  const [products, setProducts] = useState<ReturnType<typeof mapApiProduct>[]>([]);
  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [salesPeriod, setSalesPeriod] = useState<"1H" | "1D" | "7D" | "30D" | "90D" | "1Y">("7D");
  const [inventoryExpanded, setInventoryExpanded] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const [nextBrands, nextProducts, nextOrders] = await Promise.all([
          fetchBrands(),
          fetchProducts(),
          fetchOrders(),
        ]);
        if (!active) return;
        setBrands(nextBrands);
        setProducts(nextProducts.map((product) => mapApiProduct(product)));
        setOrders(nextOrders);
      } catch (error) {
        if (active) {
          console.error("Unable to load studio overview", error);
        }
      }
    };

    void load();
    return () => {
      active = false;
    };
  }, []);

  const brand = brands[0];
  const totalOrders = products.reduce((sum, product) => sum + Math.max(4, Math.round(product.available * 0.18)), 0);
  const totalRevenue = products.reduce((sum, product) => sum + Number(product.price) * Number(product.available), 0);
  const productViews = products.length * 1640;
  
  // Filter pending orders for fulfillment
  const pendingOrders = orders.filter(order => order.status !== "Delivered" && order.status !== "Cancelled");
  
  // Initialize fulfillment state from orders
  const [fulfillment, setFulfillment] = useState<FulfillmentState>({});

  useEffect(() => {
    const initialFulfillment: FulfillmentState = {};
    pendingOrders.forEach(order => {
      initialFulfillment[order.id] = {
        shipped: order.status === "Shipped" || order.status === "Delivered",
        trackingAdded: false, // This would need to come from order details if tracked
      };
    });
    setFulfillment(initialFulfillment);
  }, [pendingOrders.length]);

  const handleMarkShipped = (orderId: string) => {
    setFulfillment((current) => ({
      ...current,
      [orderId]: { shipped: true, trackingAdded: current[orderId]?.trackingAdded ?? false },
    }));
  };

  const handleAddTracking = (orderId: string) => {
    setFulfillment((current) => ({
      ...current,
      [orderId]: { shipped: current[orderId]?.shipped ?? false, trackingAdded: true },
    }));
  };

  // Calculate date range based on sales period
  const getDateRange = (period: "1H" | "1D" | "7D" | "30D" | "90D" | "1Y") => {
    const today = new Date();
    const endDate = new Date(today);
    let startDate = new Date(today);

    switch (period) {
      case "1H":
        startDate.setHours(today.getHours() - 1);
        break;
      case "1D":
        startDate.setDate(today.getDate() - 1);
        break;
      case "7D":
        startDate.setDate(today.getDate() - 7);
        break;
      case "30D":
        startDate.setDate(today.getDate() - 30);
        break;
      case "90D":
        startDate.setDate(today.getDate() - 90);
        break;
      case "1Y":
        startDate.setFullYear(today.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  };

  // Calculate sales data for chart
  const calculateSalesData = () => {
    const { startDate, endDate } = getDateRange(salesPeriod);
    const dayCount = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Filter orders within date range
    const filteredOrders = orders.filter(order => {
      if (!order.createdAt) return false;
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });

    // Generate points for chart (simplified)
    const points = [];
    const step = Math.max(1, Math.floor(dayCount / 7));
    
    for (let i = 0; i < dayCount; i += step) {
      const dayRevenue = filteredOrders
        .filter(order => {
          if (!order.createdAt) return false;
          const orderDate = new Date(order.createdAt);
          const checkDate = new Date(startDate);
          checkDate.setDate(checkDate.getDate() + i);
          return (
            orderDate.toDateString() === checkDate.toDateString()
          );
        })
        .reduce((sum, order) => sum + Number(order.total || 0), 0);

      points.push({
        day: i,
        revenue: Math.max(20, dayRevenue * 0.5 + Math.random() * 200),
      });
    }

    return points.length > 0 ? points : generatePlaceholderPoints();
  };

  const generatePlaceholderPoints = () => {
    return [
      { day: 0, revenue: 138 },
      { day: 1, revenue: 130 },
      { day: 2, revenue: 126 },
      { day: 3, revenue: 116 },
      { day: 4, revenue: 127 },
      { day: 5, revenue: 124 },
      { day: 6, revenue: 103 },
    ];
  };

  const chartData = calculateSalesData();
  
  // Generate SVG points from data
  const generateChartPoints = () => {
    if (chartData.length === 0) return "";
    
    const maxRevenue = 250;
    const padding = 40;
    const width = 580;
    const height = 140;
    
    return chartData.map((point, index) => {
      const x = padding + (index / (chartData.length - 1 || 1)) * width;
      const y = 180 - (point.revenue / maxRevenue) * height;
      return `${x},${y}`;
    }).join(" ");
  };

  const getDateRangeLabel = () => {
    const { startDate, endDate } = getDateRange(salesPeriod);
    const format = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    return `${format(startDate)} – ${format(endDate)}`;
  };

  return (
    <DashboardLayout
      kind="studio"
      title={`Good morning, ${brand?.name ?? "brand owner"}`}
      subtitle={`Here's what's happening with ${brand?.name ?? "your store"} today.`}
      actions={
        <>
          <div style={{ position: "relative", display: "inline-block" }}>
            <button type="button" className="btn" onClick={() => setCalendarOpen(!calendarOpen)}>📅 {getDateRangeLabel()} ▾</button>
            {calendarOpen && (
              <div style={{
                position: "absolute",
                top: "100%",
                right: 0,
                background: "white",
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "8px",
                marginTop: "8px",
                zIndex: 1000,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                minWidth: "120px"
              }}>
                <div onClick={() => { setSalesPeriod("1H"); setCalendarOpen(false); }} style={{ padding: "8px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>1 Hour</div>
                <div onClick={() => { setSalesPeriod("1D"); setCalendarOpen(false); }} style={{ padding: "8px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>1 Day</div>
                <div onClick={() => { setSalesPeriod("7D"); setCalendarOpen(false); }} style={{ padding: "8px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>7 Days</div>
                <div onClick={() => { setSalesPeriod("30D"); setCalendarOpen(false); }} style={{ padding: "8px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>30 Days</div>
                <div onClick={() => { setSalesPeriod("90D"); setCalendarOpen(false); }} style={{ padding: "8px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>90 Days</div>
                <div onClick={() => { setSalesPeriod("1Y"); setCalendarOpen(false); }} style={{ padding: "8px", cursor: "pointer", borderRadius: "4px", fontSize: "14px" }} onMouseEnter={(e) => e.currentTarget.style.background = "#f0f0f0"} onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}>1 Year</div>
              </div>
            )}
          </div>
          🔔
          <Link to="/" className="btn pri">View storefront ↗</Link>
        </>
      }
    >
      <div className="grid g4">
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Gross sales</span>
            <b>R{totalRevenue.toLocaleString()}</b>
            <span className="up">▲ +12.8%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Orders</span>
            <b>{totalOrders}</b>
            <span className="up">▲ +12.8%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Product views</span>
            <b>{productViews.toLocaleString()}</b>
            <span className="up">▲ +8.2%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
        <div className="card stat">
          <div className="ic" />
          <div>
            <span>Conversion rate</span>
            <b>2.4%</b>
            <span className="up">▲ +0.3%</span>
            {" "}
            <span>vs. previous 7 days</span>
          </div>
        </div>
      </div>
      <div className="grid g21">
        <div className="stack">
          <section className="card ">
            <h3>
              Sales over time
              <span className="seg">
                <span className={salesPeriod === "1H" ? "on" : ""} onClick={() => setSalesPeriod("1H")} style={{ cursor: "pointer" }}>1H</span>
                <span className={salesPeriod === "1D" ? "on" : ""} onClick={() => setSalesPeriod("1D")} style={{ cursor: "pointer" }}>1D</span>
                <span className={salesPeriod === "7D" ? "on" : ""} onClick={() => setSalesPeriod("7D")} style={{ cursor: "pointer" }}>7D</span>
                <span className={salesPeriod === "30D" ? "on" : ""} onClick={() => setSalesPeriod("30D")} style={{ cursor: "pointer" }}>30D</span>
                <span className={salesPeriod === "90D" ? "on" : ""} onClick={() => setSalesPeriod("90D")} style={{ cursor: "pointer" }}>90D</span>
                <span className={salesPeriod === "1Y" ? "on" : ""} onClick={() => setSalesPeriod("1Y")} style={{ cursor: "pointer" }}>1Y</span>
              </span>
            </h3>
            <svg className="chart" viewBox="0 0 640 216">
              <line x1="40" x2="620" y1="20" y2="20" stroke="#e9e3da" />
              <text x="34" y="24" fontSize="10" textAnchor="end" fill="#7a736b">R2,500</text>
              <line x1="40" x2="620" y1="52" y2="52" stroke="#e9e3da" />
              <text x="34" y="56" fontSize="10" textAnchor="end" fill="#7a736b">R2,000</text>
              <line x1="40" x2="620" y1="84" y2="84" stroke="#e9e3da" />
              <text x="34" y="88" fontSize="10" textAnchor="end" fill="#7a736b">R1,500</text>
              <line x1="40" x2="620" y1="116" y2="116" stroke="#e9e3da" />
              <text x="34" y="120" fontSize="10" textAnchor="end" fill="#7a736b">R1,000</text>
              <line x1="40" x2="620" y1="148" y2="148" stroke="#e9e3da" />
              <text x="34" y="152" fontSize="10" textAnchor="end" fill="#7a736b">R500</text>
              <line x1="40" x2="620" y1="180" y2="180" stroke="#e9e3da" />
              <text x="34" y="184" fontSize="10" textAnchor="end" fill="#7a736b">R0</text>
              <polygon points={`40,180 ${generateChartPoints()} 620,180`} fill="#c4664a" opacity=".15" />
              <polyline points={generateChartPoints()} fill="none" stroke="#c4664a" strokeWidth="2" />
              {chartData.map((point, index) => {
                const maxRevenue = 250;
                const padding = 40;
                const width = 580;
                const height = 140;
                const x = padding + (index / (chartData.length - 1 || 1)) * width;
                const y = 180 - (point.revenue / maxRevenue) * height;
                return (
                  <circle key={index} cx={x} cy={y} r="3.5" fill="#c4664a" />
                );
              })}
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => {
                const padding = 40;
                const width = 580;
                const x = padding + (index / 6) * width;
                return (
                  <text key={`day-${index}`} x={x} y="208" fontSize="11" textAnchor="middle" fill="#7a736b">
                    {day}
                  </text>
                );
              })}
            </svg>
          </section>
          <section className="card ">
            <h3>
              Top products
              <Link to="/studio/products">View all →</Link>
            </h3>
            <div className="wrap">
              <table>
                <tbody>
                  <tr>
                    <th>Product</th>
                    <th>Views</th>
                    <th>Units sold</th>
                    <th>Revenue</th>
                  </tr>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", color: "#999", padding: "20px" }}>
                        No products available
                      </td>
                    </tr>
                  ) : (
                    products
                      .sort((a, b) => b.available - a.available)
                      .slice(0, 3)
                      .map((product, index) => {
                        const views = Math.round(product.available * 100);
                        const unitsSold = Math.round(product.available * 0.8);
                        const revenue = unitsSold * product.price;
                        return (
                          <tr key={product.id}>
                            <td>
                              <span className={`thumb t${(index % 5) + 2}`} />
                              {product.name}
                            </td>
                            <td>{views.toLocaleString()}</td>
                            <td>{unitsSold}</td>
                            <td>R{revenue.toLocaleString()}</td>
                          </tr>
                        );
                      })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <section className="card ">
          <h3>
            Orders to fulfill
            {" "}
            <span className="pill orange">{pendingOrders.length}</span>
          </h3>
          {pendingOrders.length === 0 ? (
            <p style={{ textAlign: "center", color: "#999", padding: "20px" }}>No pending orders</p>
          ) : (
            pendingOrders.map((order, index) => (
              <div key={order.id} className="ord">
                <span className={`thumb t${(index % 5) + 1}`} />
                <div>
                  <b>#{order.id.slice(-4)}</b>
                  {" "}
                  <span className={`pill ${order.status === "Shipped" ? "green" : "orange"}`}>
                    {order.status}
                  </span>
                  <span className="sub">
                    {order.createdAt
                      ? new Date(order.createdAt).toLocaleDateString() + " · "
                      : ""}
                    {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                  </span>
                  {order.user?.name}
                  {order.shippingAddress?.city && (
                    <span className="sub">📍 {order.shippingAddress.city}, {order.shippingAddress.country}</span>
                  )}
                  <div className="acts">
                    <button
                      type="button"
                      className="btn pri"
                      onClick={() => handleMarkShipped(order.id)}
                      disabled={fulfillment[order.id]?.shipped}
                    >
                      {fulfillment[order.id]?.shipped ? "Shipped" : "Mark shipped"}
                    </button>
                    <button
                      type="button"
                      className="btn "
                      onClick={() => handleAddTracking(order.id)}
                      disabled={fulfillment[order.id]?.trackingAdded}
                    >
                      {fulfillment[order.id]?.trackingAdded ? "Tracking added" : "Add tracking"}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </section>
      </div>
      <section className="card ">
        <h3>
          Inventory & preorders
          {" "}
          <span className={`toggle ${inventoryExpanded ? "on" : ""}`} onClick={() => setInventoryExpanded(!inventoryExpanded)} style={{ cursor: "pointer" }} />
          {" "}
          <span className="sub">
            Allow preorders · Preorders: {products.filter(p => p.status === "Preorder").length} · Expected ship: {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </h3>
        {inventoryExpanded && (
        <div className="wrap">
          <table>
            <tbody>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Variant</th>
                <th>Remaining</th>
                <th>Status</th>
                <th>Preorder</th>
              </tr>
              {products.slice(0, 4).map((product, index) => {
                const stockStatus = product.available === 0 ? "Out of stock" : product.available < 10 ? "Low stock" : "In stock";
                const pillColor = product.available === 0 || product.available < 10 ? "orange" : "green";
                const thumbIndex = (index % 5) + 1;
                
                return (
                  <tr key={product.id}>
                    <td>
                      <span className={`thumb t${thumbIndex}`} />
                      {product.name}
                    </td>
                    <td>{product.sku}</td>
                    <td>Default</td>
                    <td>{product.available}</td>
                    <td>
                      <span className={`pill ${pillColor}`}>{stockStatus}</span>
                    </td>
                    <td>
                      {product.status === "Preorder" ? (
                        <>
                          <span className="pill green">Open</span>
                          {" "}
                          ({Math.ceil(product.available * 0.25)})
                        </>
                      ) : (
                        "–"
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        )}
      </section>
    </DashboardLayout>
  );
}
