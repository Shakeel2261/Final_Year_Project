"use client";

import type React from "react";
import { useState, useMemo } from "react";
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
} from "lucide-react";
import {
  initialTransactions,
  calculateCustomerCredits,
  type CustomerCredit,
  type Transaction,
  paymentMethods,
} from "@/lib/mock-data";

export default function ReceivablesPage() {
  const [transactions, setTransactions] =
    useState<Transaction[]>(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"balance" | "name" | "date">("balance");

  // Calculate credit balances
  const customerCredits = useMemo(() => {
    const credits = calculateCustomerCredits(transactions);
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
  }, [transactions, sortBy]);

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

  const addPayment = (customerName: string, amount: number) => {
    const newPayment: Transaction = {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      customer: customerName,
      method: "Cash",
      amount: amount,
      type: "payment",
      description: `Payment received from ${customerName}`,
    };

    setTransactions([...transactions, newPayment]);
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
                {filteredCredits.map((credit) => (
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
                        <PaymentDialog
                          customerName={credit.customerName}
                          currentBalance={credit.balance}
                          onPayment={addPayment}
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            // Navigate to transactions page with customer filter
                            window.location.href = `/transactions?customer=${encodeURIComponent(
                              credit.customerName
                            )}`;
                          }}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View History
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredCredits.length === 0 && (
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
  customerName,
  currentBalance,
  onPayment,
}: {
  customerName: string;
  currentBalance: number;
  onPayment: (customerName: string, amount: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<Transaction["method"]>("Cash");

  const handlePayment = () => {
    if (amount > 0 && amount <= currentBalance) {
      onPayment(customerName, amount);
      setAmount(0);
      setOpen(false);
    }
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
          </div>

          <div className="grid gap-2">
            <Label htmlFor="amount">Payment Amount</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              max={currentBalance}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder={`Max: $${currentBalance.toFixed(2)}`}
            />
          </div>

          <div className="grid gap-2">
            <Label>Payment Method</Label>
            <Select
              value={method}
              onValueChange={(v: Transaction["method"]) => setMethod(v)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((m) => (
                  <SelectItem key={m} value={m}>
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handlePayment}
              disabled={amount <= 0 || amount > currentBalance}
              className="bg-gradient-to-r from-green-600 to-blue-600"
            >
              Record Payment
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
