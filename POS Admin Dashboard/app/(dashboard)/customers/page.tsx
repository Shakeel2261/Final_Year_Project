"use client";

import type React from "react";

<<<<<<< HEAD
import { useMemo, useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  type Customer,
} from "@/lib/store/slices/customersSlice";
=======
import { useMemo, useState } from "react";
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
<<<<<<< HEAD
=======
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
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
import { Pencil, Plus, Trash2, Loader2, RefreshCw } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CustomersPage() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.customers);
=======
import { Badge } from "@/components/ui/badge";
import { initialCustomers, type Customer } from "@/lib/mock-data";

// Updated Customer type with password
export type CustomerWithPassword = {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
};
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Label } from "@/components/ui/label";

export default function CustomersPage() {
  // Convert initial customers to include password field
  const initialCustomersWithPassword: CustomerWithPassword[] =
    initialCustomers.map((customer) => ({
      ...customer,
      password: "password123", // Default password, can be changed
    }));

  const [items, setItems] = useState<CustomerWithPassword[]>(
    initialCustomersWithPassword
  );
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

<<<<<<< HEAD
  useEffect(() => {
    dispatch(fetchCustomers());
  }, [dispatch]);

=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  const filtered = useMemo(() => {
    return items.filter((i) => {
      const matchQ =
        q.trim().length === 0 ||
<<<<<<< HEAD
        (i.name || "").toLowerCase().includes(q.toLowerCase()) ||
        (i.email || "").toLowerCase().includes(q.toLowerCase());
=======
        i.name.toLowerCase().includes(q.toLowerCase()) ||
        i.email.toLowerCase().includes(q.toLowerCase());
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
      return matchQ;
    });
  }, [items, q]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

<<<<<<< HEAD
  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this customer?")) {
      await dispatch(deleteCustomer(id));
  }
  };

  const handleSave = async (customerData: Partial<Customer>) => {
    if ((customerData as any)._id) {
      await dispatch(
        updateCustomer({ id: (customerData as any)._id, data: customerData })
      );
    } else {
      await dispatch(createCustomer(customerData));
    }
  };

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

  function onSave(cust: CustomerWithPassword) {
    setItems((prev) => {
      const exists = prev.some((p) => p.id === cust.id);
      return exists
        ? prev.map((p) => (p.id === cust.id ? cust : p))
        : [{ ...cust }, ...prev];
    });
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
<<<<<<< HEAD
        <h1 className="text-2xl font-semibold">Customers ({items.length})</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(fetchCustomers())}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <CustomerDialog onSave={handleSave} />
        </div>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

=======
        <h1 className="text-2xl font-semibold">Customers</h1>
        <CustomerDialog onSave={onSave} />
      </header>

>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
      <Card className="bg-card text-card-foreground">
        <CardHeader>
          <CardTitle>List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex gap-3">
              <Input
                placeholder="Search by name or email"
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setPage(1);
                }}
                className="w-64 bg-background"
              />
            </div>
            <div className="text-sm text-muted-foreground">
              {filtered.length} customers • Page {page} of {totalPages}
            </div>
          </div>

          <div className="rounded-md border border-border overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paged.map((c) => (
<<<<<<< HEAD
                  <TableRow key={c._id}>
                    <TableCell className="font-medium">{c.name || "N/A"}</TableCell>
                    <TableCell>{c.email || "N/A"}</TableCell>
                    <TableCell>{c.phone || "N/A"}</TableCell>
                    <TableCell className="flex gap-2">
                      <CustomerDialog existing={c} onSave={handleSave}>
=======
                  <TableRow key={c.id}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.phone}</TableCell>
                    <TableCell className="flex gap-2">
                      <CustomerDialog existing={c} onSave={onSave}>
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-8 w-8 bg-transparent"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </CustomerDialog>
                      <Button
                        size="icon"
                        variant="destructive"
                        className="h-8 w-8 bg-transparent hover:bg-transparent"
<<<<<<< HEAD
                        onClick={() => handleDelete(c._id)}
                        disabled={loading}
=======
                        onClick={() => onDelete(c.id)}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {paged.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No customers found
                    </TableCell>
                  </TableRow>
                )}
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

function CustomerDialog({
  existing,
  onSave,
  children,
}: {
<<<<<<< HEAD
  existing?: Customer;
  onSave: (c: Partial<Customer>) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<Partial<Customer>>(
    existing
      ? {
          name: existing.name,
          email: existing.email,
          phone: existing.phone,
        }
      : {
=======
  existing?: CustomerWithPassword;
  onSave: (c: CustomerWithPassword) => void;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CustomerWithPassword>(
    existing ?? {
      id: crypto.randomUUID(),
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
      name: "",
      email: "",
      phone: "",
      password: "",
    }
  );

<<<<<<< HEAD
  const handleSubmit = async () => {
    if (!form.name || !form.email) return;
    await onSave(form);
    setOpen(false);
  };
=======
  function submit() {
    if (!form.name || !form.email || !form.password) return;
    onSave(form);
    setOpen(false);
  }
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ?? (
          <Button className="inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600">
            <Plus className="mr-2 h-4 w-4" />
            Add Customer
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="bg-popover text-popover-foreground">
        <DialogHeader>
          <DialogTitle>
            {existing ? "Edit Customer" : "Add Customer"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) =>
                setForm((f) => ({ ...f, email: e.target.value }))
              }
              className="bg-background"
            />
          </div>
          <div className="grid gap-2">
            <Label>Phone</Label>
            <Input
              value={form.phone}
              onChange={(e) =>
                setForm((f) => ({ ...f, phone: e.target.value }))
              }
              className="bg-background"
            />
          </div>
<<<<<<< HEAD
          {!existing && (
=======
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
          <div className="grid gap-2">
            <Label>Password</Label>
            <Input
              type="password"
<<<<<<< HEAD
                value={(form as any).password || ""}
=======
              value={form.password}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
              onChange={(e) =>
                setForm((f) => ({ ...f, password: e.target.value }))
              }
              className="bg-background"
              placeholder="Set login password for customer"
<<<<<<< HEAD
                required={!existing}
            />
          </div>
          )}
=======
            />
          </div>
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
<<<<<<< HEAD
              onClick={handleSubmit}
=======
              onClick={submit}
>>>>>>> 5e646091a7dd403166d752bf1cab6d22bc306eab
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
