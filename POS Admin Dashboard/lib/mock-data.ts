export type Product = {
  id: string;
  sku: string;
  name: string;
  category: string;
  stock: number;
  regularPrice: number;
  premiumPrice: number;
  type: "purchase" | "sale"; // New field to distinguish purchase vs sale products
  reorderPoint?: number; // Minimum stock level before reordering
  reorderQuantity?: number; // Suggested quantity to reorder
};

export const productCategories = [
  "Chargers",
  "Cases",
  "Cables",
  "Power Banks",
  "Headphones",
  "Screen Protectors",
];

export const productTypes: Product["type"][] = ["purchase", "sale"];

export const initialProducts: Product[] = Array.from({ length: 27 }).map(
  (_, i) => {
    const basePrice = Number((10 + Math.random() * 90).toFixed(2));
    const stock = Math.floor(Math.random() * 120);
    const reorderPoint = Math.floor(stock * 0.2) + 5; // 20% of current stock + 5
    const reorderQuantity = Math.floor(stock * 0.5) + 10; // 50% of current stock + 10
    return {
      id: crypto.randomUUID(),
      sku: `SKU-${1000 + i}`,
      name: `Product ${i + 1}`,
      category: productCategories[i % productCategories.length],
      stock: stock,
      regularPrice: basePrice,
      premiumPrice: Number((basePrice * 0.85).toFixed(2)), // Premium customers get 15% discount
      type: i % 3 === 0 ? "purchase" : "sale", // Mix of purchase and sale products
      reorderPoint: reorderPoint,
      reorderQuantity: reorderQuantity,
    };
  }
);

export type Order = {
  id: string;
  customer: string;
  items: number;
  total: number;
  status: "pending" | "completed" | "cancelled";
};

export const orderStatuses: Order["status"][] = [
  "pending",
  "completed",
  "cancelled",
];

export const initialOrders: Order[] = Array.from({ length: 24 }).map(
  (_, i) => ({
    id: `ORD-${(1000 + i).toString()}`,
    customer: ["Alice", "Bob", "Charlie", "Diana", "Evan", "Fatima"][i % 6],
    items: 1 + (i % 5),
    total: Number((20 + Math.random() * 180).toFixed(2)),
    status: orderStatuses[i % orderStatuses.length],
  })
);

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  type: "Premium" | "Regular";
};

export const customerTypes: Customer["type"][] = ["Premium", "Regular"];

export const initialCustomers: Customer[] = Array.from({ length: 18 }).map(
  (_, i) => ({
    id: crypto.randomUUID(),
    name: [
      "Alice Johnson",
      "Bob Smith",
      "Charlie Park",
      "Diana Lee",
      "Evan Chen",
      "Fatima Khan",
    ][i % 6],
    email: `user${i + 1}@example.com`,
    phone: `+1-555-01${(i + 10).toString().slice(-2)}`,
    type: i % 3 === 0 ? "Premium" : "Regular",
  })
);

export type Transaction = {
  id: string;
  date: string; // yyyy-mm-dd
  customer: string;
  method: "Cash" | "Card" | "Transfer" | "Credit";
  amount: number;
  type: "sale" | "payment"; // sale = customer owes money, payment = customer paid
  description?: string;
  reference?: string; // For linking related transactions
};

export const paymentMethods: Transaction["method"][] = [
  "Cash",
  "Card",
  "Transfer",
  "Credit",
];

export const transactionTypes: Transaction["type"][] = ["sale", "payment"];

// Credit balance tracking
export type CustomerCredit = {
  customerId: string;
  customerName: string;
  totalCredit: number; // Total amount customer owes
  totalPaid: number; // Total amount customer has paid
  balance: number; // Remaining balance (totalCredit - totalPaid)
  lastTransactionDate: string;
};

// Calculate credit balances from transactions
export function calculateCustomerCredits(
  transactions: Transaction[]
): CustomerCredit[] {
  const customerMap = new Map<string, CustomerCredit>();

  transactions.forEach((transaction) => {
    const existing = customerMap.get(transaction.customer) || {
      customerId: transaction.customer.toLowerCase().replace(/\s+/g, "-"),
      customerName: transaction.customer,
      totalCredit: 0,
      totalPaid: 0,
      balance: 0,
      lastTransactionDate: transaction.date,
    };

    if (transaction.type === "sale") {
      existing.totalCredit += transaction.amount;
    } else if (transaction.type === "payment") {
      existing.totalPaid += transaction.amount;
    }

    existing.balance = existing.totalCredit - existing.totalPaid;
    existing.lastTransactionDate =
      transaction.date > existing.lastTransactionDate
        ? transaction.date
        : existing.lastTransactionDate;

    customerMap.set(transaction.customer, existing);
  });

  return Array.from(customerMap.values()).filter((c) => c.balance !== 0);
}

// Convert transactions to ledger entries
export function transactionsToLedgerEntries(
  transactions: Transaction[]
): LedgerEntry[] {
  return transactions
    .map((transaction) => {
      if (transaction.type === "sale") {
        // Credit sales create a ledger entry (money owed to us)
        return {
          id: transaction.id,
          date: transaction.date,
          description: `Credit Sale - ${transaction.customer}: ${
            transaction.description || "Product sale"
          }`,
          type: "in" as const, // Money coming in (even though it's credit)
          amount: transaction.amount,
          category: transaction.method === "Credit" ? "Credit Sales" : "Sales",
          reference: `TXN-${transaction.id.slice(-6)}`,
          paymentMethod:
            transaction.method === "Credit"
              ? "Other"
              : (transaction.method as LedgerEntry["paymentMethod"]),
        };
      } else if (transaction.type === "payment") {
        // Payments create a ledger entry (actual money received)
        return {
          id: transaction.id,
          date: transaction.date,
          description: `Payment Received - ${transaction.customer}: ${
            transaction.description || "Credit payment"
          }`,
          type: "in" as const, // Money coming in
          amount: transaction.amount,
          category: "Credit Payments",
          reference: `TXN-${transaction.id.slice(-6)}`,
          paymentMethod: transaction.method as LedgerEntry["paymentMethod"],
        };
      }
      return null;
    })
    .filter((entry): entry is LedgerEntry => entry !== null);
}

export const initialTransactions: Transaction[] = [
  // Sample credit sales
  {
    id: crypto.randomUUID(),
    date: "2024-01-15",
    customer: "Bob",
    method: "Credit",
    amount: 412.24,
    type: "sale",
    description: "Mobile accessories purchase on credit",
  },
  {
    id: crypto.randomUUID(),
    date: "2024-01-20",
    customer: "Diana",
    method: "Credit",
    amount: 331.3,
    type: "sale",
    description: "Phone case and charger on credit",
  },
  {
    id: crypto.randomUUID(),
    date: "2024-01-18",
    customer: "Alice",
    method: "Credit",
    amount: 244.51,
    type: "sale",
    description: "Headphones purchase on credit",
  },
  {
    id: crypto.randomUUID(),
    date: "2024-01-22",
    customer: "Alice",
    method: "Cash",
    amount: 116.71,
    type: "payment",
    description: "Partial payment received",
  },
  {
    id: crypto.randomUUID(),
    date: "2024-01-19",
    customer: "Charlie",
    method: "Credit",
    amount: 101.71,
    type: "sale",
    description: "Screen protector on credit",
  },
  {
    id: crypto.randomUUID(),
    date: "2024-01-21",
    customer: "Charlie",
    method: "Transfer",
    amount: 73.44,
    type: "payment",
    description: "Bank transfer payment",
  },
  {
    id: crypto.randomUUID(),
    date: "2024-01-17",
    customer: "Fatima",
    method: "Credit",
    amount: 325.93,
    type: "sale",
    description: "Power bank purchase on credit",
  },
  // Add some regular transactions
  ...Array.from({ length: 13 }).map((_, i) => ({
    id: crypto.randomUUID(),
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    customer: ["Alice", "Bob", "Charlie", "Diana", "Evan", "Fatima"][i % 6],
    method: paymentMethods[i % paymentMethods.length],
    amount: Number((15 + Math.random() * 200).toFixed(2)),
    type: i % 4 === 0 ? "payment" : "sale",
    description: i % 4 === 0 ? "Payment received" : "Product sale",
  })),
];

export const kpis = [
  {
    key: "sales",
    label: "Sales (Today)",
    value: "$1,240",
    delta: "+8% vs. yesterday",
  },
  {
    key: "products",
    label: "Products",
    value: initialProducts.length.toString(),
    delta: "Inventory healthy",
  },
  {
    key: "customers",
    label: "Customers",
    value: initialCustomers.length.toString(),
    delta: "3 new this week",
  },
  {
    key: "transactions",
    label: "Transactions",
    value: initialTransactions.length.toString(),
    delta: "Daily flow steady",
  },
] as const;

export const salesSeries = Array.from({ length: 12 }).map((_, i) => ({
  label: `W${i + 1}`,
  sales: 1000 + Math.round(Math.random() * 1000),
}));

export const purchaseSeries = Array.from({ length: 12 }).map((_, i) => ({
  label: `W${i + 1}`,
  purchases: 400 + Math.round(Math.random() * 600),
}));

export type LedgerEntry = {
  id: string;
  date: string;
  description: string;
  type: "in" | "out";
  amount: number;
  category: string;
  reference?: string;
  paymentMethod: "Cash" | "Card" | "Transfer" | "Other";
};

export const ledgerCategories = [
  "Sales",
  "Purchase",
  "Salary",
  "Rent",
  "Utilities",
  "Marketing",
  "Equipment",
  "Maintenance",
  "Other Income",
  "Other Expense",
  "Credit Sales", // New category for credit sales
  "Credit Payments", // New category for credit payments received
];

export const ledgerPaymentMethods: LedgerEntry["paymentMethod"][] = [
  "Cash",
  "Card",
  "Transfer",
  "Other",
];

export const initialLedger: LedgerEntry[] = [
  {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    description: "Opening Balance",
    type: "in",
    amount: 500,
    category: "Other Income",
    paymentMethod: "Cash",
  },
  {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    description: "Stock Purchase",
    type: "out",
    amount: 200,
    category: "Purchase",
    paymentMethod: "Transfer",
    reference: "PO-001",
  },
  {
    id: crypto.randomUUID(),
    date: new Date().toISOString().slice(0, 10),
    description: "Cash Sale",
    type: "in",
    amount: 150,
    category: "Sales",
    paymentMethod: "Cash",
    reference: "ORD-1000",
  },
];

export type Invoice = {
  id: string;
  invoiceNumber: string;
  customer: string;
  date: string; // yyyy-mm-dd
  dueDate: string; // yyyy-mm-dd
  total: number;
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled";
  description?: string;
};

export const invoiceStatuses: Invoice["status"][] = [
  "draft",
  "sent",
  "paid",
  "overdue",
  "cancelled",
];

// Stock Management Types
export type StockMovement = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  date: string;
  type: "in" | "out" | "adjustment";
  quantity: number;
  reason: string;
  reference?: string; // Order ID, Purchase Order, etc.
  user: string; // Who made the change
};

export type StockAlert = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  status: "active" | "resolved";
  createdAt: string;
  resolvedAt?: string;
};

export type StockHistory = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  date: string;
  openingStock: number;
  stockIn: number;
  stockOut: number;
  closingStock: number;
  adjustments: number;
};

export type ReorderSuggestion = {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  currentStock: number;
  reorderPoint: number;
  suggestedQuantity: number;
  urgency: "low" | "medium" | "high" | "critical";
  lastOrderDate?: string;
  avgMonthlySales: number;
};

export const initialInvoices: Invoice[] = [
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-001",
    customer: "Alice Johnson",
    date: "2024-01-15",
    dueDate: "2024-02-15",
    total: 412.24,
    status: "paid",
    description: "Mobile accessories purchase",
  },
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-002",
    customer: "Bob Smith",
    date: "2024-01-20",
    dueDate: "2024-02-20",
    total: 331.3,
    status: "sent",
    description: "Phone case and charger",
  },
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-003",
    customer: "Charlie Park",
    date: "2024-01-18",
    dueDate: "2024-02-18",
    total: 244.51,
    status: "overdue",
    description: "Headphones purchase",
  },
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-004",
    customer: "Diana Lee",
    date: "2024-01-22",
    dueDate: "2024-02-22",
    total: 116.71,
    status: "paid",
    description: "Screen protector",
  },
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-005",
    customer: "Evan Chen",
    date: "2024-01-19",
    dueDate: "2024-02-19",
    total: 101.71,
    status: "draft",
    description: "Power bank purchase",
  },
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-006",
    customer: "Fatima Khan",
    date: "2024-01-21",
    dueDate: "2024-02-21",
    total: 325.93,
    status: "sent",
    description: "Cable accessories",
  },
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-007",
    customer: "Alice Johnson",
    date: "2024-01-25",
    dueDate: "2024-02-25",
    total: 89.5,
    status: "paid",
    description: "Additional accessories",
  },
  {
    id: crypto.randomUUID(),
    invoiceNumber: "INV-2024-008",
    customer: "Bob Smith",
    date: "2024-01-28",
    dueDate: "2024-02-28",
    total: 156.75,
    status: "overdue",
    description: "Bulk order discount",
  },
  // Add more sample invoices
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: crypto.randomUUID(),
    invoiceNumber: `INV-2024-${(9 + i).toString().padStart(3, "0")}`,
    customer: [
      "Alice Johnson",
      "Bob Smith",
      "Charlie Park",
      "Diana Lee",
      "Evan Chen",
      "Fatima Khan",
    ][i % 6],
    date: new Date(Date.now() - (i + 1) * 86400000).toISOString().slice(0, 10),
    dueDate: new Date(Date.now() + (30 - i) * 86400000)
      .toISOString()
      .slice(0, 10),
    total: Number((50 + Math.random() * 300).toFixed(2)),
    status: invoiceStatuses[i % invoiceStatuses.length],
    description: `Invoice for order #${1000 + i}`,
  })),
];

// Stock Management Sample Data
export const initialStockMovements: StockMovement[] = [
  {
    id: crypto.randomUUID(),
    productId: "prod-1",
    productName: "Product 1",
    sku: "SKU-1000",
    date: "2024-01-15",
    type: "in",
    quantity: 50,
    reason: "Purchase Order",
    reference: "PO-001",
    user: "Admin",
  },
  {
    id: crypto.randomUUID(),
    productId: "prod-1",
    productName: "Product 1",
    sku: "SKU-1000",
    date: "2024-01-16",
    type: "out",
    quantity: 5,
    reason: "Sale",
    reference: "ORD-1001",
    user: "Cashier",
  },
  {
    id: crypto.randomUUID(),
    productId: "prod-2",
    productName: "Product 2",
    sku: "SKU-1001",
    date: "2024-01-17",
    type: "adjustment",
    quantity: -2,
    reason: "Damaged goods",
    user: "Manager",
  },
  // Add more sample movements
  ...Array.from({ length: 20 }).map((_, i) => ({
    id: crypto.randomUUID(),
    productId: `prod-${(i % 10) + 1}`,
    productName: `Product ${(i % 10) + 1}`,
    sku: `SKU-${1000 + (i % 10)}`,
    date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
    type: ["in", "out", "adjustment"][i % 3] as StockMovement["type"],
    quantity: Math.floor(Math.random() * 20) + 1,
    reason: [
      "Purchase Order",
      "Sale",
      "Return",
      "Damaged",
      "Theft",
      "Transfer",
    ][i % 6],
    reference: i % 2 === 0 ? `REF-${1000 + i}` : undefined,
    user: ["Admin", "Manager", "Cashier"][i % 3],
  })),
];

export const initialStockAlerts: StockAlert[] = [
  {
    id: crypto.randomUUID(),
    productId: "prod-1",
    productName: "Product 1",
    sku: "SKU-1000",
    currentStock: 3,
    reorderPoint: 10,
    status: "active",
    createdAt: "2024-01-15",
  },
  {
    id: crypto.randomUUID(),
    productId: "prod-3",
    productName: "Product 3",
    sku: "SKU-1002",
    currentStock: 0,
    reorderPoint: 15,
    status: "active",
    createdAt: "2024-01-16",
  },
  {
    id: crypto.randomUUID(),
    productId: "prod-5",
    productName: "Product 5",
    sku: "SKU-1004",
    currentStock: 7,
    reorderPoint: 20,
    status: "resolved",
    createdAt: "2024-01-10",
    resolvedAt: "2024-01-12",
  },
];

export const initialStockHistory: StockHistory[] = Array.from({
  length: 30,
}).map((_, i) => ({
  id: crypto.randomUUID(),
  productId: `prod-${(i % 10) + 1}`,
  productName: `Product ${(i % 10) + 1}`,
  sku: `SKU-${1000 + (i % 10)}`,
  date: new Date(Date.now() - i * 86400000).toISOString().slice(0, 10),
  openingStock: Math.floor(Math.random() * 100),
  stockIn: Math.floor(Math.random() * 20),
  stockOut: Math.floor(Math.random() * 15),
  closingStock: Math.floor(Math.random() * 100),
  adjustments: Math.floor(Math.random() * 5) - 2,
}));

export const initialReorderSuggestions: ReorderSuggestion[] = [
  {
    id: crypto.randomUUID(),
    productId: "prod-1",
    productName: "Product 1",
    sku: "SKU-1000",
    currentStock: 3,
    reorderPoint: 10,
    suggestedQuantity: 50,
    urgency: "critical",
    avgMonthlySales: 25,
  },
  {
    id: crypto.randomUUID(),
    productId: "prod-3",
    productName: "Product 3",
    sku: "SKU-1002",
    currentStock: 0,
    reorderPoint: 15,
    suggestedQuantity: 75,
    urgency: "critical",
    avgMonthlySales: 30,
  },
  {
    id: crypto.randomUUID(),
    productId: "prod-7",
    productName: "Product 7",
    sku: "SKU-1006",
    currentStock: 8,
    reorderPoint: 20,
    suggestedQuantity: 40,
    urgency: "high",
    avgMonthlySales: 15,
  },
  {
    id: crypto.randomUUID(),
    productId: "prod-9",
    productName: "Product 9",
    sku: "SKU-1008",
    currentStock: 12,
    reorderPoint: 25,
    suggestedQuantity: 30,
    urgency: "medium",
    avgMonthlySales: 10,
  },
];

// Helper functions for stock calculations
export function calculateInventoryValue(products: Product[]): number {
  return products.reduce((total, product) => {
    return total + product.stock * product.regularPrice;
  }, 0);
}

export function getLowStockProducts(
  products: Product[],
  threshold: number = 10
): Product[] {
  return products.filter((product) => product.stock <= threshold);
}

export function getOutOfStockProducts(products: Product[]): Product[] {
  return products.filter((product) => product.stock === 0);
}

export function generateStockAlerts(
  products: Product[],
  reorderPoints: Record<string, number>
): StockAlert[] {
  return products
    .filter((product) => {
      const reorderPoint = reorderPoints[product.id] || 10;
      return product.stock <= reorderPoint;
    })
    .map((product) => ({
      id: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      sku: product.sku,
      currentStock: product.stock,
      reorderPoint: reorderPoints[product.id] || 10,
      status: "active" as const,
      createdAt: new Date().toISOString().slice(0, 10),
    }));
}
