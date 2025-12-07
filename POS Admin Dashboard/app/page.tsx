import Link from "next/link"

export default function Home() {
  return (
    <main className="min-h-dvh grid place-items-center bg-background text-foreground">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-semibold text-balance">POS Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Go to the dashboard to manage products, orders, customers, transactions, reports, and ledgers.
        </p>
        <Link
          href="/overview"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Open Dashboard
        </Link>
      </div>
    </main>
  )
}
