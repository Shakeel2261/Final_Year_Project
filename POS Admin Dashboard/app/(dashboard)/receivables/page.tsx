"use client";

import type React from "react";
import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  DollarSign,
  Plus,
  CreditCard,
  AlertTriangle,
  TrendingUp,
  Users,
  Eye,
  Loader2,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { fetchReceivables, payReceivable } from "@/lib/store/slices/transactionsSlice";
import type { Transaction } from "@/lib/store/slices/transactionsSlice";

interface CustomerCredit {
  customerId: string;
  customerName: string;
  totalCredit: number;
  totalPaid: number;
  balance: number;
  lastTransactionDate: string;
}

const paymentMethods = ["Cash", "Credit", "Bank Transfer", "Cheque"];

export default function ReceivablesPage() {
  const dispatch = useAppDispatch();
  const { receivables, loading } = useAppSelector((state) => state.transactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"balance" | "name" | "date">("balance");

  useEffect(() => {
    dispatch(fetchReceivables());
  }, [dispatch]);

  // Calculate credit balances from receivables
  const customerCredits = useMemo(() => {
    const creditMap = new Map<string, CustomerCredit>();

    receivables.forEach((transaction) => {
      const customerId = typeof transaction.customer === "object" 
        ? transaction.customer._id 
        : transaction.customer || "";
      const customerName = typeof transaction.customer === "object"
        ? transaction.customer.name
        : "Unknown Customer";

      if (!creditMap.has(customerId)) {
        creditMap.set(customerId, {
          customerId,
          customerName,
          totalCredit: 0,
          totalPaid: 0,
          balance: 0,
          lastTransactionDate: transaction.createdAt || new Date().toISOString(),
        });
      }

      const credit = creditMap.get(customerId)!;
      if (transaction.type === "Credit") {
        credit.totalCredit += transaction.amount || 0;
      } else if (transaction.type === "Cash") {
        credit.totalPaid += transaction.amount || 0;
      }
      credit.balance = credit.totalCredit - credit.totalPaid;
      
      const transactionDate = transaction.createdAt || new Date().toISOString();
      if (new Date(transactionDate) > new Date(credit.lastTransactionDate)) {
        credit.lastTransactionDate = transactionDate;
      }
    });

    const credits = Array.from(creditMap.values()).filter(c => c.balance > 0);
    
    return credits.sort((a, b) => {
      switch (sortBy) {
        case "balance":
          return b.balance - a.balance;
        case "name":
          return a.customerName.localeCompare(b.customerName);
        case "date":
          return (
            new Date(b.lastTransactionDate).getTime() -
            new Date(a.lastTransactionDate).getTime()
          );
        default:
          return 0;
      }
    });
  }, [receivables, sortBy]);

  const filteredCredits = useMemo(() => {
    return customerCredits.filter(
      (credit) =>
        searchQuery.trim() === "" ||
        credit.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [customerCredits, searchQuery]);

  const totalReceivables = customerCredits.reduce(
    (sum, credit) => sum + credit.balance,
    0
  );
  const totalCustomers = customerCredits.length;

  const handlePayment = async (transactionId: string) => {
    try {
      await dispatch(payReceivable(transactionId)).unwrap();
      dispatch(fetchReceivables()); // Refresh receivables
    } catch (error: any) {
      alert(`Error recording payment: ${error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-balance flex items-center gap-2">
          <DollarSign className="h-6 w-6" />
          Receivables
        </h1>
      </header>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Receivables
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ${totalReceivables.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Outstanding credit amount
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Customers with Credit
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">
              Active credit accounts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Balance
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {totalCustomers > 0
                ? (totalReceivables / totalCustomers).toFixed(2)
                : "0.00"}
            </div>
            <p className="text-xs text-muted-foreground">Per customer</p>
          </CardContent>
        </Card>
      </div>

      {/* Receivables Table */}
      <Card>
        <CardHeader>
          <CardTitle>Outstanding Credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-background"
              />
              <Select
                value={sortBy}
                onValueChange={(v: "balance" | "name" | "date") => setSortBy(v)}
              >
                <SelectTrigger className="w-48 bg-background">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="balance">Balance (High to Low)</SelectItem>
                  <SelectItem value="name">Customer Name</SelectItem>
                  <SelectItem value="date">Last Transaction</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredCredits.length} customers with outstanding credit
            </div>
          </div>

          <div className="rounded-md border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Total Credit</TableHead>
                  <TableHead className="text-right">Total Paid</TableHead>
                  <TableHead className="text-right">
                    Outstanding Balance
                  </TableHead>
                  <TableHead>Last Transaction</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCredits.map((credit) => (
                    <TableRow key={credit.customerId}>
                    <TableCell className="font-medium">
                      {credit.customerName}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      ${credit.totalCredit.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right text-green-600">
                      ${credit.totalPaid.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          credit.balance > 1000 ? "destructive" : "secondary"
                        }
                        className={credit.balance > 1000 ? "bg-red-600" : ""}
                      >
                        ${credit.balance.toFixed(2)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {new Date(
                        credit.lastTransactionDate
                      ).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {(() => {
                          const pendingTransaction = receivables.find(t => {
                            const customerId = typeof t.customer === "object" ? t.customer._id : t.customer;
                            return customerId === credit.customerId && t.status === "Pending";
                          });
                          return pendingTransaction ? (
                            <PaymentDialog
                              transactionId={pendingTransaction._id}
                              customerName={credit.customerName}
                              currentBalance={credit.balance}
                              onPayment={handlePayment}
                            />
                          ) : null;
                        })()}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Navigate to transactions page with customer filter
                            window.location.href = `/transactions?customer=${encodeURIComponent(
                              credit.customerId
                            )}`;
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View History
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                  ))
                )}
                {!loading && filteredCredits.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground py-8"
                    >
                      {searchQuery
                        ? "No customers found matching your search"
                        : "No outstanding credits"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentDialog({
  transactionId,
  customerName,
  currentBalance,
  onPayment,
}: {
  transactionId: string;
  customerName: string;
  currentBalance: number;
  onPayment: (transactionId: string) => void;
}) {
  const [open, setOpen] = useState(false);

  const handlePayment = () => {
    onPayment(transactionId);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <CreditCard className="h-4 w-4 mr-1" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record Payment - {customerName}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Outstanding Balance:</strong> ${currentBalance.toFixed(2)}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              This will mark the receivable as paid.
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              Mark as Paid
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
