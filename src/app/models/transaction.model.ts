import { IconProp } from "@fortawesome/fontawesome-svg-core";
export interface TransactionModel {
  id?: number;
  transactionName: string;
  transactionType?: string;
  transactionAmount: number;
  transactionDate: string;
  transactionCategory: string;
  transactionMethod: string;
  icon?: IconProp;
}
