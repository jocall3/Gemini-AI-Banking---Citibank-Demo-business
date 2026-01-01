
export enum GeminiCurrencyEnum {
  Usd = 'USD',
  Eur = 'EUR',
  Gbp = 'GBP'
}

export interface BankAccount {
  id: string;
  accountNumber: string;
  balance: number;
  currency: GeminiCurrencyEnum;
  accountType: string;
  accountHolderName: string;
  openedDate: string;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: GeminiCurrencyEnum;
  description: string;
  transactionDate: string;
  transactionType: string;
  status: string;
  fromAccount?: { id: string; accountNumber: string };
  toAccount?: { id: string; accountNumber: string };
}

export interface AIChatMessage {
  id: string;
  content: string;
  sender: 'USER' | 'AI';
  timestamp: string;
  metadata?: any;
}

export interface BankingInsight {
  id: string;
  type: string;
  title: string;
  description: string;
  suggestedActions?: Array<{
    id: string;
    label: string;
    actionType: string;
  }>;
}

export interface InvestmentOpportunity {
  id: string;
  name: string;
  type: string;
  projectedReturn: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  confidenceScore: number;
}

export interface NeuromorphicStatus {
  processorId: string;
  status: 'ONLINE' | 'OFFLINE' | 'DEGRADED';
  loadPercentage: number;
  activeModels: number;
}

export interface QuantumStatus {
  status: 'ENABLED' | 'PENDING' | 'NOT_SUPPORTED';
  complianceRating: string;
}
