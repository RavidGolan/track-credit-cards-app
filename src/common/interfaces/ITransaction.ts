import {TransactionType} from "../enums/TransactionType";

export default interface ITransaction {
  creditCard?: string;
  transactionType?: TransactionType;
  date: string;         // ISO date string like "2025-08-04"
  vendor: string;       // Merchant or business name
  amount: number;       // Original transaction amount
  type?: string;         // Transaction type, e.g., "עסקה רגילה"
  details?: string;     // Optional details or description
  billedAmount: number; // Final charged amount
  category?: string;
}
