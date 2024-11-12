import { create } from 'zustand';
import { mockFinanceData, mockSalesData, mockProductData } from '../data/mockData';

interface DataState {
  financeData: typeof mockFinanceData;
  salesData: typeof mockSalesData;
  productData: typeof mockProductData;
  updateFinanceData: (data: Partial<typeof mockFinanceData>) => void;
  updateSalesData: (data: Partial<typeof mockSalesData>) => void;
  updateProductData: (data: Partial<typeof mockProductData>) => void;
  addTransaction: (type: 'in' | 'out', transaction: { name: string; amount: number; date: string }) => void;
}

export const useDataStore = create<DataState>((set, get) => ({
  financeData: mockFinanceData,
  salesData: mockSalesData,
  productData: mockProductData,

  updateFinanceData: (data) =>
    set((state) => ({
      financeData: { ...state.financeData, ...data }
    })),

  updateSalesData: (data) =>
    set((state) => ({
      salesData: { ...state.salesData, ...data }
    })),

  updateProductData: (data) =>
    set((state) => ({
      productData: { ...state.productData, ...data }
    })),

  addTransaction: (type, transaction) =>
    set((state) => {
      const key = type === 'in' ? 'moneyIn' : 'moneyOut';
      const newTransactions = [
        transaction,
        ...state.financeData[key].recentTransactions
      ].slice(0, 10);

      const newTotal = state.financeData[key].total + transaction.amount;
      const oldTotal = state.financeData[key].total;
      const trend = ((newTotal - oldTotal) / oldTotal) || 0;

      const newBalance = type === 'in'
        ? state.financeData.balance + transaction.amount
        : state.financeData.balance - transaction.amount;

      return {
        financeData: {
          ...state.financeData,
          balance: newBalance,
          [key]: {
            ...state.financeData[key],
            total: newTotal,
            trend: trend,
            recentTransactions: newTransactions
          }
        }
      };
    })
}));