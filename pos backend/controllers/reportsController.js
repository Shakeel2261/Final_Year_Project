import Order from "../models/order.js";
import Transaction from "../models/transaction.js";
import Product from "../models/product.js";

// Get Sales Report (Weekly data for 12 weeks)
export const getSalesReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Default to last 12 weeks if no dates provided
    const endDate = toDate ? new Date(toDate) : new Date();
    const startDate = fromDate
      ? new Date(fromDate)
      : new Date(endDate.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);

    // Get completed orders within date range
    const orders = await Order.find({
      status: "completed",
      createdAt: {
        $gte: startDate,
        $lte: endDate,
      },
    }).populate("customer", "name");

    // Group orders by week
    const weeklySales = {};
    const weekLabels = [];

    // Generate week labels (W1 to W12)
    for (let i = 0; i < 12; i++) {
      const weekDate = new Date(
        startDate.getTime() + i * 7 * 24 * 60 * 60 * 1000
      );
      const weekLabel = `W${i + 1}`;
      weekLabels.push(weekLabel);
      weeklySales[weekLabel] = 0;
    }

    // Calculate sales for each week
    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const weekNumber =
        Math.floor((orderDate - startDate) / (7 * 24 * 60 * 60 * 1000)) + 1;

      if (weekNumber >= 1 && weekNumber <= 12) {
        const weekLabel = `W${weekNumber}`;
        weeklySales[weekLabel] += order.totalAmount;
      }
    });

    // Convert to array format for frontend
    const salesData = weekLabels.map((week) => ({
      week: week,
      sales: weeklySales[week],
    }));

    // Calculate summary statistics
    const totalSales = salesData.reduce((sum, week) => sum + week.sales, 0);
    const averageSales = totalSales / salesData.length;
    const maxSales = Math.max(...salesData.map((week) => week.sales));
    const minSales = Math.min(...salesData.map((week) => week.sales));

    res.json({
      success: true,
      data: {
        chartData: salesData,
        summary: {
          totalSales,
          averageSales: Math.round(averageSales),
          maxSales,
          minSales,
          totalOrders: orders.length,
        },
        dateRange: {
          from: startDate.toISOString().split("T")[0],
          to: endDate.toISOString().split("T")[0],
        },
      },
    });
  } catch (error) {
    console.error("Sales report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating sales report",
      error: error.message,
    });
  }
};

// Get Purchase Report (Weekly data for 12 weeks)
export const getPurchaseReport = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    // Default to last 12 weeks if no dates provided
    const endDate = toDate ? new Date(toDate) : new Date();
    const startDate = fromDate
      ? new Date(fromDate)
      : new Date(endDate.getTime() - 12 * 7 * 24 * 60 * 60 * 1000);

    // Get purchase transactions (assuming purchases are tracked in transactions with type "Purchase")
    // For now, we'll simulate purchase data since we don't have a dedicated purchase model
    // In a real scenario, you'd have a Purchase model or track purchases differently

    // Generate sample purchase data for demonstration
    const weeklyPurchases = {};
    const weekLabels = [];

    // Generate week labels (W1 to W12)
    for (let i = 0; i < 12; i++) {
      const weekLabel = `W${i + 1}`;
      weekLabels.push(weekLabel);

      // Generate realistic purchase data (you can replace this with actual purchase queries)
      const baseAmount = 200 + Math.random() * 300; // Random amount between 200-500
      const variation = Math.sin(i * 0.5) * 100; // Add some variation
      weeklyPurchases[weekLabel] = Math.round(baseAmount + variation);
    }

    // Convert to array format for frontend
    const purchaseData = weekLabels.map((week) => ({
      week: week,
      purchases: weeklyPurchases[week],
    }));

    // Calculate summary statistics
    const totalPurchases = purchaseData.reduce(
      (sum, week) => sum + week.purchases,
      0
    );
    const averagePurchases = totalPurchases / purchaseData.length;
    const maxPurchases = Math.max(
      ...purchaseData.map((week) => week.purchases)
    );
    const minPurchases = Math.min(
      ...purchaseData.map((week) => week.purchases)
    );

    res.json({
      success: true,
      data: {
        chartData: purchaseData,
        summary: {
          totalPurchases,
          averagePurchases: Math.round(averagePurchases),
          maxPurchases,
          minPurchases,
        },
        dateRange: {
          from: startDate.toISOString().split("T")[0],
          to: endDate.toISOString().split("T")[0],
        },
      },
    });
  } catch (error) {
    console.error("Purchase report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating purchase report",
      error: error.message,
    });
  }
};

// Get Dashboard Summary (for overview page)
export const getDashboardSummary = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(startOfDay.getTime() + 24 * 60 * 60 * 1000);

    // Get today's stats
    const todayOrders = await Order.find({
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    const todaySales = todayOrders
      .filter((order) => order.status === "completed")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    // Get total stats
    const totalOrders = await Order.countDocuments();
    const totalCustomers = await (
      await import("../models/customer.js")
    ).default.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalTransactions = await Transaction.countDocuments();

    // Get pending receivables
    const pendingReceivables = await Transaction.find({
      type: "Credit",
      status: "Pending",
    });

    const totalReceivables = pendingReceivables.reduce(
      (sum, transaction) => sum + transaction.amount,
      0
    );

    // Get recent orders
    const recentOrders = await Order.find()
      .populate("customer", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    // Get low stock products
    const lowStockProducts = await Product.find({
      $expr: {
        $lte: [{ $subtract: ["$stockQuantity", "$reservedStock"] }, 10],
      },
    }).populate("category", "name");

    res.json({
      success: true,
      data: {
        todayStats: {
          orders: todayOrders.length,
          sales: todaySales,
          completedOrders: todayOrders.filter(
            (order) => order.status === "completed"
          ).length,
        },
        totalStats: {
          orders: totalOrders,
          customers: totalCustomers,
          products: totalProducts,
          transactions: totalTransactions,
          receivables: totalReceivables,
        },
        recentOrders: recentOrders.map((order) => ({
          id: order._id,
          customer: order.customer.name,
          totalAmount: order.totalAmount,
          status: order.status,
          createdAt: order.createdAt,
        })),
        lowStockProducts: lowStockProducts.map((product) => ({
          id: product._id,
          name: product.productName,
          availableStock: product.stockQuantity - product.reservedStock,
          category: product.category.name,
        })),
      },
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating dashboard summary",
      error: error.message,
    });
  }
};

// Get Revenue Report (Monthly data)
export const getRevenueReport = async (req, res) => {
  try {
    const { year = new Date().getFullYear() } = req.query;

    const startOfYear = new Date(year, 0, 1);
    const endOfYear = new Date(year, 11, 31, 23, 59, 59);

    const orders = await Order.find({
      status: "completed",
      createdAt: { $gte: startOfYear, $lte: endOfYear },
    });

    // Group by month
    const monthlyRevenue = {};
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Initialize all months
    for (let i = 0; i < 12; i++) {
      monthlyRevenue[monthNames[i]] = 0;
    }

    // Calculate revenue for each month
    orders.forEach((order) => {
      const month = order.createdAt.getMonth();
      monthlyRevenue[monthNames[month]] += order.totalAmount;
    });

    // Convert to array format
    const revenueData = monthNames.map((month) => ({
      month,
      revenue: monthlyRevenue[month],
    }));

    const totalRevenue = revenueData.reduce(
      (sum, month) => sum + month.revenue,
      0
    );

    res.json({
      success: true,
      data: {
        chartData: revenueData,
        summary: {
          totalRevenue,
          averageMonthlyRevenue: Math.round(totalRevenue / 12),
          bestMonth:
            monthNames[
              revenueData.findIndex(
                (month) =>
                  month.revenue ===
                  Math.max(...revenueData.map((m) => m.revenue))
              )
            ],
          worstMonth:
            monthNames[
              revenueData.findIndex(
                (month) =>
                  month.revenue ===
                  Math.min(...revenueData.map((m) => m.revenue))
              )
            ],
        },
        year: parseInt(year),
      },
    });
  } catch (error) {
    console.error("Revenue report error:", error);
    res.status(500).json({
      success: false,
      message: "Error generating revenue report",
      error: error.message,
    });
  }
};




