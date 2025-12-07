import Invoice from "../models/invoice.js";
import Transaction from "../models/transaction.js";
import Order from "../models/order.js";
import Customer from "../models/customer.js";
import Product from "../models/product.js";
import { generateInvoicePDF } from "../utils/pdfGenerator.js";
import fs from "fs";
import path from "path";

// Generate invoice for a transaction
export const generateInvoice = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const { notes, dueDate } = req.body;

    // Get transaction details
    const transaction = await Transaction.findById(transactionId)
      .populate("customer")
      .populate("order");

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found",
      });
    }

    // Check if invoice already exists for this transaction
    const existingInvoice = await Invoice.findOne({ transactionId });
    if (existingInvoice) {
      return res.status(400).json({
        success: false,
        message: "Invoice already exists for this transaction",
        invoice: existingInvoice,
      });
    }

    // Get order details if available
    let orderItems = [];
    if (transaction.order) {
      const order = await Order.findById(transaction.order._id).populate(
        "items.productId",
        "productName productCode price"
      );

      orderItems = order.items.map((item) => ({
        productId: item.productId._id,
        productName: item.productId.productName,
        quantity: item.quantity,
        unitPrice: item.finalPrice,
        totalPrice: item.finalPrice * item.quantity,
      }));
    }

    // Create new invoice
    const newInvoice = new Invoice({
      transactionId,
      customerId: transaction.customer._id,
      orderId: transaction.order?._id,
      originalAmount: transaction.amount,
      remainingAmount: transaction.amount,
      paymentMethod: transaction.type,
      dueDate:
        dueDate ||
        (transaction.type === "Credit"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          : null),
      notes,
      items: orderItems,
      createdBy: req.user?.id,
    });

    await newInvoice.save();

    // Generate PDF for the invoice
    // try {
    //   const populatedInvoice = await Invoice.findById(newInvoice._id)
    //     .populate("customerId", "name phone email address")
    //     .populate("transactionId")
    //     .populate("orderId")
    //     .populate("createdBy", "name email");

    //   const pdfBuffer = await generateInvoicePDF(populatedInvoice);

    //   // Save PDF to uploads directory
    //   const pdfFileName = `invoice-${
    //     newInvoice.invoiceNumber
    //   }-${Date.now()}.pdf`;
    //   const pdfPath = path.join(process.cwd(), "uploads", pdfFileName);

    //   // Ensure uploads directory exists
    //   if (!fs.existsSync(path.join(process.cwd(), "uploads"))) {
    //     fs.mkdirSync(path.join(process.cwd(), "uploads"), { recursive: true });
    //   }

    //   fs.writeFileSync(pdfPath, pdfBuffer);

    //   // Update invoice with PDF path
    //   newInvoice.pdfPath = pdfPath;
    //   await newInvoice.save();

    //   populatedInvoice.pdfPath = pdfPath;

    //   res.status(201).json({
    //     success: true,
    //     message: "Invoice generated successfully with PDF",
    //     invoice: populatedInvoice,
    //     pdfPath: pdfPath,
    //   });
    // } catch (pdfError) {
    //   console.error("PDF generation error:", pdfError);

    //   // Return invoice without PDF if generation fails
    //   const populatedInvoice = await Invoice.findById(newInvoice._id)
    //     .populate("customerId", "name phone email address")
    //     .populate("transactionId")
    //     .populate("orderId")
    //     .populate("createdBy", "name email");

    //   res.status(201).json({
    //     success: true,
    //     message: "Invoice generated successfully (PDF generation failed)",
    //     invoice: populatedInvoice,
    //   });
    // }

    // Return invoice without PDF generation for testing
    const populatedInvoice = await Invoice.findById(newInvoice._id)
      .populate("customerId", "name phone email address")
      .populate("transactionId")
      .populate("orderId")
      .populate("createdBy", "name email");

    res.status(201).json({
      success: true,
      message: "Invoice generated successfully (PDF generation disabled)",
      invoice: populatedInvoice,
    });
  } catch (error) {
    console.error("Generate invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get all invoices
export const getInvoices = async (req, res) => {
  try {
    const { status, type, customerId, page = 1, limit = 10 } = req.query;

    const filter = { isActive: true };

    if (status) filter.status = status;
    if (type) filter.type = type;
    if (customerId) filter.customerId = customerId;

    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(filter)
      .populate("customerId", "name phone email")
      .populate("transactionId", "type status amount")
      .populate("orderId", "totalAmount status")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(filter);

    res.json({
      success: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      invoices,
    });
  } catch (error) {
    console.error("Get invoices error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get single invoice
export const getInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customerId", "name phone email address")
      .populate("transactionId")
      .populate("orderId")
      .populate("items.productId", "productName productCode")
      .populate("createdBy", "name email");

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    res.json({
      success: true,
      invoice,
    });
  } catch (error) {
    console.error("Get invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get invoices by transaction
export const getInvoicesByTransaction = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const invoices = await Invoice.find({
      transactionId,
      isActive: true,
    })
      .populate("customerId", "name phone email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: invoices.length,
      invoices,
    });
  } catch (error) {
    console.error("Get invoices by transaction error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get invoices by customer
export const getInvoicesByCustomer = async (req, res) => {
  try {
    const { customerId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

    const filter = {
      customerId,
      isActive: true,
    };

    if (status) filter.status = status;

    const skip = (page - 1) * limit;

    const invoices = await Invoice.find(filter)
      .populate("transactionId", "type status amount")
      .populate("orderId", "totalAmount status")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Invoice.countDocuments(filter);

    // Calculate customer summary
    const totalOutstanding = await Invoice.aggregate([
      {
        $match: {
          customerId: mongoose.Types.ObjectId(customerId),
          status: { $in: ["Outstanding", "Partial"] },
        },
      },
      { $group: { _id: null, total: { $sum: "$remainingAmount" } } },
    ]);

    res.json({
      success: true,
      count: invoices.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      totalOutstanding: totalOutstanding[0]?.total || 0,
      invoices,
    });
  } catch (error) {
    console.error("Get invoices by customer error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Update payment on invoice
export const updateInvoicePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentAmount, paymentMethod, notes } = req.body;

    if (!paymentAmount || paymentAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payment amount must be greater than 0",
      });
    }

    const invoice = await Invoice.findById(id);
    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (invoice.status === "Paid") {
      return res.status(400).json({
        success: false,
        message: "Invoice is already fully paid",
      });
    }

    // Check if payment amount exceeds remaining amount
    if (paymentAmount > invoice.remainingAmount) {
      return res.status(400).json({
        success: false,
        message: `Payment amount cannot exceed remaining amount of ${invoice.remainingAmount}`,
      });
    }

    // Update invoice payment
    invoice.paidAmount += paymentAmount;
    invoice.notes = notes || invoice.notes;

    await invoice.save();

    // If invoice is fully paid, create a receipt invoice
    if (invoice.status === "Paid") {
      const receiptInvoice = new Invoice({
        transactionId: invoice.transactionId,
        customerId: invoice.customerId,
        orderId: invoice.orderId,
        originalAmount: paymentAmount,
        paidAmount: paymentAmount,
        remainingAmount: 0,
        status: "Paid",
        type: "Receipt",
        paymentMethod: paymentMethod || "Cash",
        notes: `Payment received for Invoice ${invoice.invoiceNumber}`,
        createdBy: req.user?.id,
      });

      await receiptInvoice.save();
    }

    // Populate the updated invoice
    const updatedInvoice = await Invoice.findById(id)
      .populate("customerId", "name phone email")
      .populate("transactionId")
      .populate("orderId")
      .populate("createdBy", "name email");

    res.json({
      success: true,
      message: "Payment updated successfully",
      invoice: updatedInvoice,
    });
  } catch (error) {
    console.error("Update invoice payment error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Delete invoice (soft delete)
export const deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    // Soft delete
    invoice.isActive = false;
    await invoice.save();

    res.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Delete invoice error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get invoice summary/statistics
export const getInvoiceSummary = async (req, res) => {
  try {
    const { fromDate, toDate } = req.query;

    const filter = { isActive: true };

    if (fromDate || toDate) {
      filter.createdAt = {};
      if (fromDate) filter.createdAt.$gte = new Date(fromDate);
      if (toDate) filter.createdAt.$lte = new Date(toDate);
    }

    const summary = await Invoice.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$originalAmount" },
          totalPaid: { $sum: "$paidAmount" },
          totalOutstanding: { $sum: "$remainingAmount" },
          paidInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "Paid"] }, 1, 0] },
          },
          partialInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "Partial"] }, 1, 0] },
          },
          outstandingInvoices: {
            $sum: { $cond: [{ $eq: ["$status", "Outstanding"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = summary[0] || {
      totalInvoices: 0,
      totalAmount: 0,
      totalPaid: 0,
      totalOutstanding: 0,
      paidInvoices: 0,
      partialInvoices: 0,
      outstandingInvoices: 0,
    };

    res.json({
      success: true,
      summary: result,
    });
  } catch (error) {
    console.error("Get invoice summary error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Download invoice PDF
export const downloadInvoicePDF = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found",
      });
    }

    if (!invoice.pdfPath || !fs.existsSync(invoice.pdfPath)) {
      return res.status(404).json({
        success: false,
        message: "PDF file not found",
      });
    }

    res.download(
      invoice.pdfPath,
      `invoice-${invoice.invoiceNumber}.pdf`,
      (err) => {
        if (err) {
          console.error("PDF download error:", err);
          res.status(500).json({
            success: false,
            message: "Error downloading PDF",
          });
        }
      }
    );
  } catch (error) {
    console.error("Download invoice PDF error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
