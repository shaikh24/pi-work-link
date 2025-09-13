// Mock API functions for wallet operations
// In a real application, these would make actual HTTP requests to your backend

export interface WalletData {
  balance: number;
  pendingBalance: number;
  totalEarnings: number;
  monthlyChange: number;
  walletAddress: string;
  fullAddress: string;
}

export interface Transaction {
  id: string;
  type: "received" | "withdraw" | "deposit" | "escrow";
  description: string;
  amount: number;
  date: string;
  status: "completed" | "pending" | "failed";
  from?: string;
  to?: string;
  txHash: string;
}

// Mock wallet data
const mockWalletData: WalletData = {
  balance: 1250.75,
  pendingBalance: 125.50,
  totalEarnings: 5847.25,
  monthlyChange: 15.8,
  walletAddress: "GDR4...X7H9",
  fullAddress: "GDR4WXYZ1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234UVWX7H9",
};

// Mock transactions
const mockTransactions: Transaction[] = [
  {
    id: "1",
    type: "received",
    description: "Job Payment - React Dashboard",
    amount: 125.50,
    date: "2024-01-12 14:30",
    status: "completed",
    from: "TechCorp Inc.",
    txHash: "0x1234...abcd",
  },
  {
    id: "2",
    type: "withdraw",
    description: "Withdrawal to External Wallet",
    amount: -200.00,
    date: "2024-01-10 09:15",
    status: "completed",
    to: "External Wallet",
    txHash: "0x5678...efgh",
  },
  {
    id: "3",
    type: "deposit",
    description: "Pi Wallet Deposit",
    amount: 500.00,
    date: "2024-01-08 16:45",
    status: "completed",
    from: "Pi Network",
    txHash: "0x9012...ijkl",
  },
  {
    id: "4",
    type: "escrow",
    description: "Escrow Hold - Mobile App Design",
    amount: -89.99,
    date: "2024-01-07 11:20",
    status: "pending",
    to: "Escrow",
    txHash: "0x3456...mnop",
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const walletAPI = {
  // Get wallet data
  getWalletData: async (): Promise<WalletData> => {
    await delay(500);
    return mockWalletData;
  },

  // Get transactions
  getTransactions: async (page = 1, limit = 10): Promise<Transaction[]> => {
    await delay(300);
    const start = (page - 1) * limit;
    return mockTransactions.slice(start, start + limit);
  },

  // Deposit Pi
  depositPi: async (amount: number): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    await delay(1000);
    
    if (amount <= 0) {
      return { success: false, error: "Invalid amount" };
    }

    // Simulate success/failure
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      // Update mock data (in real app, this would be handled by backend)
      mockWalletData.balance += amount;
      mockWalletData.totalEarnings += amount;
      
      // Add transaction
      mockTransactions.unshift({
        id: Date.now().toString(),
        type: "deposit",
        description: `Pi Wallet Deposit`,
        amount: amount,
        date: new Date().toLocaleString(),
        status: "completed",
        from: "Pi Network",
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      });

      return { 
        success: true, 
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
      };
    } else {
      return { success: false, error: "Transaction failed. Please try again." };
    }
  },

  // Withdraw Pi
  withdrawPi: async (amount: number, address: string): Promise<{ success: boolean; txHash?: string; error?: string }> => {
    await delay(1500);
    
    if (amount <= 0) {
      return { success: false, error: "Invalid amount" };
    }

    if (amount > mockWalletData.balance) {
      return { success: false, error: "Insufficient balance" };
    }

    if (!address || address.length < 10) {
      return { success: false, error: "Invalid wallet address" };
    }

    // Simulate success/failure
    const success = Math.random() > 0.05; // 95% success rate
    
    if (success) {
      // Update mock data
      mockWalletData.balance -= amount;
      
      // Add transaction
      mockTransactions.unshift({
        id: Date.now().toString(),
        type: "withdraw",
        description: `Withdrawal to External Wallet`,
        amount: -amount,
        date: new Date().toLocaleString(),
        status: "pending", // Withdrawals usually start as pending
        to: address.substring(0, 6) + "..." + address.substring(address.length - 4),
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`,
      });

      return { 
        success: true, 
        txHash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)}`
      };
    } else {
      return { success: false, error: "Transaction failed. Please try again." };
    }
  },

  // Connect Pi Wallet (Pi SDK integration)
  connectPiWallet: async (): Promise<{ success: boolean; address?: string; error?: string }> => {
    await delay(2000);
    
    // Simulate Pi SDK connection
    const success = Math.random() > 0.2; // 80% success rate
    
    if (success) {
      const address = `GDR4${Math.random().toString(16).substring(2, 10).toUpperCase()}...${Math.random().toString(16).substring(2, 4).toUpperCase()}`;
      return { success: true, address };
    } else {
      return { success: false, error: "Failed to connect Pi Wallet. Please ensure Pi Browser is installed." };
    }
  },

  // Get Pi Network balance (from Pi SDK)
  getPiNetworkBalance: async (): Promise<{ success: boolean; balance?: number; error?: string }> => {
    await delay(1000);
    
    // Simulate getting balance from Pi Network
    const success = Math.random() > 0.1; // 90% success rate
    
    if (success) {
      const balance = Math.random() * 1000 + 100; // Random balance between 100-1100
      return { success: true, balance: Math.round(balance * 100) / 100 };
    } else {
      return { success: false, error: "Unable to fetch Pi Network balance" };
    }
  },

  // Refresh wallet data
  refreshWalletData: async (): Promise<WalletData> => {
    await delay(1000);
    
    // Simulate small balance changes
    mockWalletData.balance += (Math.random() - 0.5) * 10;
    mockWalletData.pendingBalance += (Math.random() - 0.5) * 5;
    
    return mockWalletData;
  }
};