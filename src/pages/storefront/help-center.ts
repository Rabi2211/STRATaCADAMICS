export type HelpCenterFaq = {
  question: string;
  answer: string;
};

export type HelpCenterCategory = {
  id: "orders" | "shipping" | "returns" | "payments";
  label: string;
  description: string;
  faqs: HelpCenterFaq[];
};

export type HelpCenterArticle = {
  id: string;
  title: string;
  categoryId: HelpCenterCategory["id"];
  summary: string;
  keywords: string[];
};

export const HELP_CENTER_CATEGORIES: HelpCenterCategory[] = [
  {
    id: "orders",
    label: "Orders",
    description: "Track your order, confirm delivery, and understand the steps after checkout.",
    faqs: [
      {
        question: "How do I check my order status?",
        answer: "Open your order record from the account area and review the status timeline. You’ll see the current stage, dispatch status, and expected next movement.",
      },
      {
        question: "Can I update my delivery address after checkout?",
        answer: "If the order has not yet moved into fulfillment, there is usually time to update your address. If dispatch has already started, changes may be limited.",
      },
    ],
  },
  {
    id: "shipping",
    label: "Shipping",
    description: "Understand dispatch times, delivery windows, and how tracking works.",
    faqs: [
      {
        question: "When will my order be dispatched?",
        answer: "Orders are usually dispatched within 24 hours for in-stock items. You’ll receive a confirmation and tracking reference as soon as the parcel is processed.",
      },
      {
        question: "Do you offer free shipping?",
        answer: "Yes, free shipping is available on qualifying orders above R2,000. Standard and express delivery options are shown during checkout based on your basket.",
      },
    ],
  },
  {
    id: "returns",
    label: "Returns",
    description: "Learn, exchange, or request a refund for eligible items.",
    faqs: [
      {
        question: "What is your return window?",
        answer: "Returns are accepted within 14 days of delivery for unworn items in original condition. Items should be packed securely and returned with the original packaging where possible.",
      },
      {
        question: "Can I exchange an item instead of getting a refund?",
        answer: "Yes. Exchanges are prioritized when the requested size, fit, or colour is available in stock. Contact support with your order number to arrange this process.",
      },
    ],
  },
  {
    id: "payments",
    label: "Payments",
    description: "Confirm payment methods, security, and checkout status updates.",
    faqs: [
      {
        question: "Which payment methods are supported?",
        answer: "We support secure checkout through trusted gateways, including merchant options configured for local and regional payments. The exact options available at checkout depend on your order and region.",
      },
      {
        question: "Why does my payment status show as pending?",
        answer: "A pending payment usually means the payment provider is still confirming the transaction. You will receive an updated order status once the payment is approved or the session is cleared.",
      },
    ],
  },
];

export const HELP_CENTER_ARTICLES: HelpCenterArticle[] = [
  {
    id: "track-order",
    title: "Track your order status",
    categoryId: "orders",
    summary: "Find out how a payment confirmation turns into dispatch, delivery, and completed fulfilment.",
    keywords: ["tracking", "status", "delivery", "order"],
  },
  {
    id: "shipping-times",
    title: "Shipping and delivery times",
    categoryId: "shipping",
    summary: "Learn what to expect from standard, express, and free-shipping delivery windows.",
    keywords: ["shipping", "delivery", "dispatch", "courier"],
  },
  {
    id: "return-policy",
    title: "Returns and exchanges",
    categoryId: "returns",
    summary: "Understand how to request a return, exchange item sizes, or arrange a refund.",
    keywords: ["returns", "exchange", "refund", "policy"],
  },
  {
    id: "payment-pending",
    title: "Payment pending or failed",
    categoryId: "payments",
    summary: "Review how payment confirmations are updated and what to do when a gateway is pending.",
    keywords: ["payment", "pending", "gateway", "failed"],
  },
  {
    id: "change-address",
    title: "Update your delivery address",
    categoryId: "orders",
    summary: "See how to correct shipping details before your parcel leaves our processing team.",
    keywords: ["address", "delivery", "shipping", "update"],
  },
  {
    id: "free-shipping",
    title: "Free shipping threshold",
    categoryId: "shipping",
    summary: "Check when your basket qualifies for free shipping and how the checkout cart responds.",
    keywords: ["free shipping", "threshold", "shipping", "checkout"],
  },
];

export function searchHelpCenterArticles(query: string): HelpCenterArticle[] {
  const normalized = query.trim().toLowerCase();

  if (!normalized) {
    return HELP_CENTER_ARTICLES;
  }

  return HELP_CENTER_ARTICLES.filter((article) => {
    const haystack = [
      article.title,
      article.summary,
      article.categoryId,
      ...article.keywords,
    ].join(" ").toLowerCase();

    return haystack.includes(normalized);
  });
}
