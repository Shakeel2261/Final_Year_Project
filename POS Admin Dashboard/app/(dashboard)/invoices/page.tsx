"use client";

import type React from "react";
<<<<<<< HEAD
import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchInvoices,
  fetchInvoiceSummary,
  type Invoice,
} from "@/lib/store/slices/invoicesSlice";
=======
import { useMemo, useState } from "react";
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
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
<<<<<<< HEAD
import { Alert, AlertDescription } from "@/components/ui/alert";
=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
import { Badge } from "@/components/ui/badge";
import {
  Pencil,
  Plus,
  Trash2,
  Eye,
  Download,
  Send,
  FileText,
  DollarSign,
  Check,
  AlertTriangle,
<<<<<<< HEAD
  Loader2,
  RefreshCw,
} from "lucide-react";

const invoiceStatuses: Invoice["status"][] = ["Paid", "Partial", "Outstanding"];

export default function InvoicesPage() {
  const dispatch = useAppDispatch();
  const { items, summary, loading, error, count, total } = useAppSelector(
    (state) => state.invoices
  );

=======
} from "lucide-react";
import {
  initialInvoices,
  type Invoice,
  invoiceStatuses,
} from "@/lib/mock-data";

export default function InvoicesPage() {
  const [items, setItems] = useState<Invoice[]>(initialInvoices);
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [page, setPage] = useState(1);
  const pageSize = 10;

<<<<<<< HEAD
  useEffect(() => {
    dispatch(fetchInvoices());
    dispatch(fetchInvoiceSummary());
  }, [dispatch]);

=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchQ =
        q.trim().length === 0 ||
<<<<<<< HEAD
        (i.invoiceNumber || "").toLowerCase().includes(q.toLowerCase());
=======
        i.invoiceNumber.toLowerCase().includes(q.toLowerCase()) ||
        i.customer.toLowerCase().includes(q.toLowerCase());
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
      const matchS = status === "all" || i.status === status;
      return matchQ && matchS;
    });
  }, [items, q, status]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

<<<<<<< HEAD
  if (loading && items.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
=======
  function onDelete(id: string) {
    setItems((prev) => prev.filter((p) => p.id !== id));
  }

  function onSave(invoice: Invoice) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === invoice.id);
      return exists
        ? prev.map((p) => (p.id === invoice.id ? invoice : p))
        : [{ ...invoice }, ...prev];
    });
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  }

  const getStatusColor = (status: Invoice["status"]) => {
    switch (status) {
<<<<<<< HEAD
      case "Paid":
        return "bg-green-100 text-green-700";
      case "Partial":
        return "bg-yellow-100 text-yellow-700";
      case "Outstanding":
        return "bg-red-100 text-red-700";
=======
      case "draft":
        return "bg-gray-100 text-gray-700";
      case "sent":
        return "bg-blue-100 text-blue-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "overdue":
        return "bg-red-100 text-red-700";
      case "cancelled":
        return "bg-orange-100 text-orange-700";
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

<<<<<<< HEAD
  const totalAmount = items.reduce((sum, invoice) => sum + (invoice.originalAmount || 0), 0);
  const paidAmount = items
    .filter((invoice) => invoice.status === "Paid")
    .reduce((sum, invoice) => sum + (invoice.paidAmount || 0), 0);
  const outstandingAmount = items
    .filter((invoice) => invoice.status === "Outstanding")
    .reduce((sum, invoice) => sum + (invoice.remainingAmount || 0), 0);
=======
  const totalAmount = items.reduce((sum, invoice) => sum + invoice.total, 0);
  const paidAmount = items
    .filter((invoice) => invoice.status === "paid")
    .reduce((sum, invoice) => sum + invoice.total, 0);
  const overdueAmount = items
    .filter((invoice) => invoice.status === "overdue")
    .reduce((sum, invoice) => sum + invoice.total, 0);
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
<<<<<<< HEAD
        <h1 className="text-2xl font-semibold">Invoices ({count || items.length})</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              dispatch(fetchInvoices());
              dispatch(fetchInvoiceSummary());
            }}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

=======
        <h1 className="text-2xl font-semibold">Invoices</h1>
        <InvoiceDialog onSave={onSave} />
      </header>

>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Invoices
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{items.length}</div>
            <p className="text-xs text-muted-foreground">All invoice records</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalAmount.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              All invoices combined
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Amount</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ${paidAmount.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Successfully collected
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
<<<<<<< HEAD
              Outstanding Amount
=======
              Overdue Amount
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
<<<<<<< HEAD
              ${outstandingAmount.toFixed(2)}
=======
              ${overdueAmount.toFixed(2)}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
            </div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>Invoice List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <Input
                placeholder="Search by Invoice # or Customer"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="w-64 bg-background"
              />
              <Select
                value={status}
                onValueChange={(v) => {
                  setStatus(v);
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-48 bg-background">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {invoiceStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-sm text-muted-foreground">
              {filtered.length} results • Page {page} of {totalPages}
            </div>
          </div>

          <div className="rounded-md border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((invoice) => (
<<<<<<< HEAD
                  <TableRow key={invoice._id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber || invoice._id.slice(-8)}
                    </TableCell>
                    <TableCell>
                      {typeof invoice.customerId === "object"
                        ? invoice.customerId.name
                        : invoice.customerId || "N/A"}
                    </TableCell>
                    <TableCell>
                      {invoice.createdAt
                        ? new Date(invoice.createdAt).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      {invoice.dueDate
                        ? new Date(invoice.dueDate).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      ${(invoice.originalAmount || 0).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status}
=======
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber}
                    </TableCell>
                    <TableCell>{invoice.customer}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.dueDate}</TableCell>
                    <TableCell className="text-right">
                      ${invoice.total.toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(invoice.status)}>
                        {invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                      </Badge>
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        title="View Invoice"
<<<<<<< HEAD
                        onClick={() => {
                          window.open(
                            `/api/invoices/${invoice._id}/download`,
                            "_blank"
                          );
                        }}
=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        title="Download PDF"
<<<<<<< HEAD
                        onClick={() => {
                          window.open(
                            `/api/invoices/${invoice._id}/download`,
                            "_blank"
                          );
                        }}
=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        title="Send Invoice"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
<<<<<<< HEAD
=======
                      <InvoiceDialog existing={invoice} onSave={onSave}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </InvoiceDialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 bg-transparent hover:bg-transparent"
                        onClick={() => onDelete(invoice.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
<<<<<<< HEAD
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No invoices found
                    </TableCell>
                  </TableRow>
                )}
=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end gap-2">
            <Button
              variant="outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (num) => (
                  <Button
                    key={num}
                    variant={page === num ? "default" : "outline"}
                    onClick={() => setPage(num)}
                    className={page === num ? "bg-blue-600 text-white" : ""}
                  >
                    {num}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InvoiceDialog({
  existing,
  onSave,
  children,
}: {
  existing?: Invoice;
  onSave: (invoice: Invoice) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Invoice>(
    existing ?? {
      id: crypto.randomUUID(),
      invoiceNumber: `INV-${Math.random()
        .toString(36)
        .slice(2, 8)
        .toUpperCase()}`,
      customer: "",
      date: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10),
      total: 0,
      status: "draft",
      description: "",
    }
  );

  function submit() {
    if (!form.customer) return;
    onSave(form);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>
            {existing ? "Edit Invoice" : "Create Invoice"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Invoice Number</Label>
              <Input
                value={form.invoiceNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, invoiceNumber: e.target.value }))
                }
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label>Customer</Label>
              <Input
                value={form.customer}
                onChange={(e) =>
                  setForm((f) => ({ ...f, customer: e.target.value }))
                }
                className="bg-background"
              />
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Invoice Date</Label>
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
              <Label>Due Date</Label>
              <Input
                type="date"
                value={form.dueDate}
                onChange={(e) =>
                  setForm((f) => ({ ...f, dueDate: e.target.value }))
                }
                className="bg-background"
              />
            </div>
          </div>
          <div className="grid gap-2 md:grid-cols-2">
            <div className="grid gap-2">
              <Label>Total Amount</Label>
              <Input
                type="number"
                step="0.01"
                value={form.total}
                onChange={(e) =>
                  setForm((f) => ({ ...f, total: Number(e.target.value) }))
                }
                className="bg-background"
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm((f) => ({ ...f, status: v as Invoice["status"] }))
                }
              >
                <SelectTrigger className="bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {invoiceStatuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description || ""}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
              placeholder="Optional description..."
              className="bg-background"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={submit}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              {existing ? "Save Changes" : "Create Invoice"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
