"use client";

<<<<<<< HEAD
import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchLedgerEntries,
  fetchTrialBalance,
  fetchAccountBalance,
  fetchProfitLoss,
  fetchBalanceSheet,
  type LedgerEntry,
} from "@/lib/store/slices/ledgerSlice";
=======
import { useMemo, useState } from "react";
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
<<<<<<< HEAD
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
=======
import {
  initialLedger,
  type LedgerEntry,
  ledgerCategories,
  ledgerPaymentMethods,
  initialTransactions,
  transactionsToLedgerEntries,
  calculateCustomerCredits,
} from "@/lib/mock-data";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2 } from "lucide-react";
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LedgersPage() {
<<<<<<< HEAD
  const dispatch = useAppDispatch();
  const {
    entries,
    accountBalance,
    trialBalance,
    profitLoss,
    balanceSheet,
    loading,
    error,
  } = useAppSelector((state) => state.ledger);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchLedgerEntries());
    dispatch(fetchTrialBalance());
    dispatch(fetchAccountBalance());
    dispatch(fetchProfitLoss());
    dispatch(fetchBalanceSheet());
  }, [dispatch]);

  // Calculate balance from entries
  const balance = useMemo(
    () =>
      entries.reduce(
        (acc, cur) => acc + (cur.debitAmount || 0) - (cur.creditAmount || 0),
        0
      ),
    [entries]
=======
  const [manualEntries, setManualEntries] =
    useState<LedgerEntry[]>(initialLedger);
  const [transactions] = useState(initialTransactions);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [showTransactionEntries, setShowTransactionEntries] = useState(true);

  // Convert transactions to ledger entries
  const transactionEntries = transactionsToLedgerEntries(transactions);

  // Calculate receivables (outstanding credit)
  const customerCredits = calculateCustomerCredits(transactions);
  const totalReceivables = customerCredits.reduce(
    (sum, credit) => sum + credit.balance,
    0
  );

  // Combine manual entries and transaction entries
  const allEntries = showTransactionEntries
    ? [...transactionEntries, ...manualEntries]
    : manualEntries;

  const balance = useMemo(
    () =>
      allEntries.reduce(
        (acc, cur) => acc + (cur.type === "in" ? cur.amount : -cur.amount),
        0
      ),
    [allEntries]
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  );

  // Calculate running balance for each entry
  const itemsWithBalance = useMemo(() => {
    let runningBalance = 0;
<<<<<<< HEAD
    return entries.map((item) => {
      runningBalance += (item.debitAmount || 0) - (item.creditAmount || 0);
      return { ...item, runningBalance };
    });
  }, [entries]);
=======
    return allEntries.map((item) => {
      runningBalance += item.type === "in" ? item.amount : -item.amount;
      return { ...item, runningBalance };
    });
  }, [allEntries]);
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return itemsWithBalance.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
<<<<<<< HEAD
        (item.description || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.accountName || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (item.referenceNumber &&
          item.referenceNumber
            .toLowerCase()
            .includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "all" || item.accountType === categoryFilter;
      const matchesType = typeFilter === "all" || item.entryType === typeFilter;
=======
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.reference &&
          item.reference.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCategory =
        categoryFilter === "all" || item.category === categoryFilter;
      const matchesType = typeFilter === "all" || item.type === typeFilter;
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [itemsWithBalance, searchQuery, categoryFilter, typeFilter]);

<<<<<<< HEAD
  const totalReceivables = accountBalance?.receivables || 0;

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
=======
  function onAdd(entry: LedgerEntry) {
    setManualEntries((prev) => [entry, ...prev]);
  }

  function onSave(entry: LedgerEntry) {
    setManualEntries((prev) => {
      const exists = prev.some((p) => p.id === entry.id);
      return exists
        ? prev.map((p) => (p.id === entry.id ? entry : p))
        : [entry, ...prev];
    });
  }

  function onDelete(id: string) {
    setManualEntries((prev) => prev.filter((p) => p.id !== id));
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between p-6 pb-4">
        <div>
<<<<<<< HEAD
          <h1 className="text-2xl font-semibold">Ledgers ({entries.length})</h1>
=======
          <h1 className="text-2xl font-semibold">Ledgers</h1>
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
          <p className="text-sm text-muted-foreground mt-1">
            Complete financial tracking including credit sales and payments
          </p>
        </div>
<<<<<<< HEAD
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(fetchLedgerEntries());
              dispatch(fetchTrialBalance());
              dispatch(fetchAccountBalance());
              dispatch(fetchProfitLoss());
              dispatch(fetchBalanceSheet());
            }}
            disabled={loading}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
      </header>

      {error && (
        <Alert variant="destructive" className="mx-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

=======
        <LedgerDialog onAdd={onAdd} />
      </header>

>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full px-6 pb-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cash Balance</CardTitle>
            <span className="text-green-600">💰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${balance.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Current cash position
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Outstanding Receivables
            </CardTitle>
            <span className="text-orange-600">📋</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              ${totalReceivables.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Credit sales not yet paid
            </p>
          </CardContent>
        </Card>

        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            <span className="text-blue-600">📊</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              ${(balance + totalReceivables).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">Cash + Receivables</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card text-card-foreground flex-1 flex flex-col mx-6 mb-6">
        <CardHeader className="flex items-center justify-between flex-shrink-0">
          <CardTitle>Cash In/Out</CardTitle>
          <div className="text-sm">
            Balance:{" "}
            <span className="font-semibold">${balance.toFixed(2)}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <Input
                placeholder="Search by description, category, or reference"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 bg-background"
              />
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-48 bg-background">
<<<<<<< HEAD
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ASSET">Asset</SelectItem>
                  <SelectItem value="LIABILITY">Liability</SelectItem>
                  <SelectItem value="EQUITY">Equity</SelectItem>
                  <SelectItem value="REVENUE">Revenue</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
=======
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {ledgerCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 bg-background">
<<<<<<< HEAD
                  <SelectValue placeholder="Entry Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="DEBIT">Debit</SelectItem>
                  <SelectItem value="CREDIT">Credit</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredItems.length} results
=======
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="in">Cash In</SelectItem>
                  <SelectItem value="out">Cash Out</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="show-transactions"
                  checked={showTransactionEntries}
                  onChange={(e) => setShowTransactionEntries(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="show-transactions" className="text-sm">
                  Include Transaction Entries
                </label>
              </div>
              <div className="text-sm text-muted-foreground">
                {filteredItems.length} results
              </div>
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
            </div>
          </div>

          <div className="rounded-md border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
<<<<<<< HEAD
                  <TableHead>Account</TableHead>
                  <TableHead>Entry Type</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
=======
                  <TableHead>Category</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Actions</TableHead>
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((e) => {
<<<<<<< HEAD
                  return (
                    <TableRow key={e._id}>
                      <TableCell>
                        {e.transactionDate
                          ? new Date(e.transactionDate).toLocaleDateString()
                          : e.createdAt
                          ? new Date(e.createdAt).toLocaleDateString()
                          : "N/A"}
                      </TableCell>
                      <TableCell className="font-medium">
                        {e.description || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {e.accountName || e.accountType || "N/A"}
                        </Badge>
=======
                  const isTransactionEntry = e.reference?.startsWith("TXN-");
                  return (
                    <TableRow
                      key={e.id}
                      className={isTransactionEntry ? "bg-blue-50/50" : ""}
                    >
                      <TableCell>{e.date}</TableCell>
                      <TableCell className="font-medium">
                        {e.description}
                        {isTransactionEntry && (
                          <Badge variant="outline" className="ml-2 text-xs">
                            Auto
                          </Badge>
                        )}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
<<<<<<< HEAD
                            e.entryType === "DEBIT" ? "default" : "destructive"
                          }
                        >
                          {e.entryType}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        ${(e.debitAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        ${(e.creditAmount || 0).toFixed(2)}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {e.referenceNumber || "-"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${(e.runningBalance || 0).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            e.status === "ACTIVE"
                              ? "default"
                              : e.status === "CANCELLED"
                              ? "destructive"
                              : "secondary"
                          }
                        >
                          {e.status || "ACTIVE"}
                        </Badge>
                      </TableCell>
=======
                            e.category === "Credit Sales" ||
                            e.category === "Credit Payments"
                              ? "default"
                              : "secondary"
                          }
                          className={
                            e.category === "Credit Sales"
                              ? "bg-orange-600"
                              : e.category === "Credit Payments"
                              ? "bg-green-600"
                              : ""
                          }
                        >
                          {e.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={e.type === "in" ? "default" : "destructive"}
                        >
                          {e.type === "in" ? "Cash In" : "Cash Out"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{e.paymentMethod}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {e.reference || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        ${e.amount.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ${e.runningBalance.toFixed(2)}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        {!isTransactionEntry && (
                          <>
                            <LedgerDialog existing={e} onSave={onSave}>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-8 w-8 bg-transparent"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </LedgerDialog>
                            <Button
                              size="icon"
                              variant="destructive"
                              className="h-8 w-8 bg-transparent hover:bg-transparent"
                              onClick={() => onDelete(e.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </>
                        )}
                        {isTransactionEntry && (
                          <span className="text-xs text-muted-foreground">
                            Auto-generated
                          </span>
                        )}
                      </TableCell>
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                    </TableRow>
                  );
                })}
                {filteredItems.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-muted-foreground"
                    >
                      No ledger entries found
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
<<<<<<< HEAD
=======

function LedgerDialog({
  existing,
  onSave,
  onAdd,
  children,
}: {
  existing?: LedgerEntry;
  onSave?: (e: LedgerEntry) => void;
  onAdd?: (e: LedgerEntry) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<LedgerEntry>(
    existing ?? {
      id: crypto.randomUUID(),
      date: new Date().toISOString().slice(0, 10),
      description: "",
      type: "in",
      amount: 0,
      category: ledgerCategories[0],
      paymentMethod: "Cash",
    }
  );

  function submit() {
    if (!form.description || form.amount <= 0) return;
    if (existing && onSave) {
      onSave(form);
    } else if (onAdd) {
      onAdd(form);
    }
    setOpen(false);
    if (!existing) {
      // reset id for next entry
      setForm({ ...form, id: crypto.randomUUID(), description: "", amount: 0 });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Entry
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>
            {existing ? "Edit Ledger Entry" : "Add Ledger Entry"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2 md:grid-cols-3">
            <div className="grid gap-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, date: e.target.value }))
                }
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ledgerCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select
                value={form.paymentMethod}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    paymentMethod: v as LedgerEntry["paymentMethod"],
                  }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ledgerPaymentMethods.map((method) => (
                    <SelectItem key={method} value={method}>
                      {method}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label>Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label>Reference (Optional)</Label>
            <Input
              value={form.reference || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, reference: e.target.value }))
              }
              placeholder="e.g., ORD-1000, PO-001"
              className="bg-background"
            />
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Type</Label>
              <select
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as "in" | "out",
                  }))
                }
                className="h-10 rounded-md border border-input bg-background px-3 text-sm"
              >
                <option value="in">Cash In</option>
                <option value="out">Cash Out</option>
              </select>
            </div>
            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) =>
                  setForm((f) => ({ ...f, amount: Number(e.target.value) }))
                }
                className="bg-background"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {existing ? "Save Changes" : "Create"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
