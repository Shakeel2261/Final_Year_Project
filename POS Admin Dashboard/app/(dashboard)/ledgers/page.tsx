"use client";

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
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Plus, Pencil, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LedgersPage() {
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
  );

  // Calculate running balance for each entry
  const itemsWithBalance = useMemo(() => {
    let runningBalance = 0;
    return entries.map((item) => {
      runningBalance += (item.debitAmount || 0) - (item.creditAmount || 0);
      return { ...item, runningBalance };
    });
  }, [entries]);

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return itemsWithBalance.filter((item) => {
      const matchesSearch =
        searchQuery.trim() === "" ||
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

      return matchesSearch && matchesCategory && matchesType;
    });
  }, [itemsWithBalance, searchQuery, categoryFilter, typeFilter]);

  const totalReceivables = accountBalance?.receivables || 0;

  if (loading && entries.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <header className="flex items-center justify-between p-6 pb-4">
        <div>
          <h1 className="text-2xl font-semibold">Ledgers ({entries.length})</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Complete financial tracking including credit sales and payments
          </p>
        </div>
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
                  <SelectValue placeholder="Account Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="ASSET">Asset</SelectItem>
                  <SelectItem value="LIABILITY">Liability</SelectItem>
                  <SelectItem value="EQUITY">Equity</SelectItem>
                  <SelectItem value="REVENUE">Revenue</SelectItem>
                  <SelectItem value="EXPENSE">Expense</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48 bg-background">
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
            </div>
          </div>

          <div className="rounded-md border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Entry Type</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((e) => {
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
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
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
