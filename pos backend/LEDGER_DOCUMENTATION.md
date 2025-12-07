# POS Ledger System Documentation

## Overview

یہ POS project میں complete accounting ledger system ہے جو تمام financial transactions کو track کرتا ہے۔

## Ledger System Components

### 1. **Ledger Model** (`models/ledger.js`)

- **Debit/Credit Entries**: Double-entry bookkeeping system
- **Account Types**: Assets, Liabilities, Equity, Revenue, Expenses
- **Account Names**: Predefined account names for consistency
- **Transaction Tracking**: Links to orders and transactions
- **Reference Numbers**: Unique identifiers for each entry

### 2. **Ledger Controller** (`controllers/ledgerController.js`)

- **CRUD Operations**: Create, Read, Update, Delete ledger entries
- **Financial Reports**: Trial Balance, P&L, Balance Sheet
- **Account Balances**: Individual account balance tracking
- **Auto-Integration**: Automatic ledger creation from sales/payments

### 3. **API Endpoints** (`routes/ledger.js`)

#### Basic Operations:

- `POST /api/ledger` - Create ledger entry
- `GET /api/ledger` - Get all ledger entries (with filters)
- `GET /api/ledger/:id` - Get single ledger entry
- `PUT /api/ledger/:id` - Update ledger entry
- `DELETE /api/ledger/:id` - Delete ledger entry (soft delete)

#### Reports:

- `GET /api/ledger/account/balance` - Get account balance
- `GET /api/ledger/reports/trial-balance` - Trial Balance report
- `GET /api/ledger/reports/profit-loss` - Profit & Loss statement
- `GET /api/ledger/reports/balance-sheet` - Balance Sheet

## Account Structure

### Assets (Assets)

- **CASH**: نقد رقم
- **BANK**: بینک اکاؤنٹ
- **INVENTORY**: انوینٹری/سٹاک
- **ACCOUNTS_RECEIVABLE**: قرضے (ادھار)
- **EQUIPMENT**: سامان/آلات

### Liabilities (Liabilities)

- **ACCOUNTS_PAYABLE**: دینے والے قرضے
- **LOANS_PAYABLE**: بینک قرضے
- **SALARIES_PAYABLE**: تنخواہوں کے قرضے

### Equity (Equity)

- **OWNER_EQUITY**: مالک کا سرمایہ
- **RETAINED_EARNINGS**: محفوظ منافع

### Revenue (Revenue)

- **SALES_REVENUE**: فروخت کی آمدنی
- **OTHER_INCOME**: دیگر آمدنی

### Expenses (Expenses)

- **COST_OF_GOODS_SOLD**: فروخت شدہ سامان کی قیمت
- **RENT_EXPENSE**: کرایہ
- **UTILITIES_EXPENSE**: بجلی/گیس/پانی
- **SALARIES_EXPENSE**: تنخواہیں
- **ADVERTISING_EXPENSE**: اشتہارات
- **OTHER_EXPENSES**: دیگر اخراجات

## Entry Types

### 1. **SALE** - فروخت

- **Debit**: CASH یا ACCOUNTS_RECEIVABLE
- **Credit**: SALES_REVENUE

### 2. **PURCHASE** - خرید

- **Debit**: INVENTORY
- **Credit**: CASH یا ACCOUNTS_PAYABLE

### 3. **PAYMENT_RECEIVED** - ادائیگی موصول

- **Debit**: CASH
- **Credit**: ACCOUNTS_RECEIVABLE

### 4. **PAYMENT_MADE** - ادائیگی کی گئی

- **Debit**: ACCOUNTS_PAYABLE
- **Credit**: CASH

### 5. **EXPENSE** - خرچہ

- **Debit**: Expense Account
- **Credit**: CASH

### 6. **INCOME** - آمدنی

- **Debit**: CASH
- **Credit**: Income Account

### 7. **ADJUSTMENT** - ایڈجسٹمنٹ

- Manual adjustments for corrections

## Automatic Integration

### Sales Integration

جب order complete ہوتا ہے تو automatically:

1. **Cash Sale**: CASH (Debit) + SALES_REVENUE (Credit)
2. **Credit Sale**: ACCOUNTS_RECEIVABLE (Debit) + SALES_REVENUE (Credit)

### Payment Integration

جب receivable pay ہوتا ہے تو automatically:

1. **Payment Received**: CASH (Debit) + ACCOUNTS_RECEIVABLE (Credit)

## Usage Examples

### 1. Manual Ledger Entry

```javascript
POST /api/ledger
{
  "entryType": "EXPENSE",
  "debitAmount": 5000,
  "creditAmount": 0,
  "accountType": "EXPENSES",
  "accountName": "RENT_EXPENSE",
  "description": "Monthly rent payment",
  "notes": "Office rent for January"
}
```

### 2. Get Account Balance

```javascript
GET /api/ledger/account/balance?accountName=CASH&fromDate=2024-01-01&toDate=2024-01-31
```

### 3. Trial Balance Report

```javascript
GET /api/ledger/reports/trial-balance?fromDate=2024-01-01&toDate=2024-01-31
```

### 4. Profit & Loss Statement

```javascript
GET /api/ledger/reports/profit-loss?fromDate=2024-01-01&toDate=2024-01-31
```

### 5. Balance Sheet

```javascript
GET /api/ledger/reports/balance-sheet?fromDate=2024-01-01&toDate=2024-01-31
```

## Key Features

### 1. **Double-Entry Bookkeeping**

- ہر transaction میں debit اور credit برابر ہوتے ہیں
- Accounting equation: Assets = Liabilities + Equity

### 2. **Automatic Integration**

- Sales اور payments سے automatic ledger entries
- Manual entries بھی ممکن

### 3. **Comprehensive Reporting**

- Trial Balance
- Profit & Loss Statement
- Balance Sheet
- Account-wise balances

### 4. **Flexible Filtering**

- Date range filtering
- Account-wise filtering
- Entry type filtering

### 5. **Audit Trail**

- Reference numbers
- Created by tracking
- Timestamps
- Status tracking

## Business Logic

### Sales Process:

1. Order created → Stock reserved
2. Order completed → Stock deducted + Ledger entries created
3. Payment received → Additional ledger entries

### Payment Process:

1. Receivable created → Ledger entry (ACCOUNTS_RECEIVABLE)
2. Payment received → Ledger entry (CASH + ACCOUNTS_RECEIVABLE)

## Error Handling

- Validation for required fields
- Debit/Credit amount validation
- Account name validation
- Reference number uniqueness
- Graceful error handling for integration failures

## Security Considerations

- User authentication (if implemented)
- Input validation
- Soft delete for audit trail
- Error logging

## Future Enhancements

- Multi-currency support
- Tax calculations
- Advanced reporting
- Export functionality
- Dashboard integration


