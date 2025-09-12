import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  Wallet as WalletIcon,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Coins,
  TrendingUp,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Wallet = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const { toast } = useToast();

  // Mock wallet data
  const walletData = {
    balance: 1250.75,
    pendingBalance: 125.50,
    totalEarnings: 5847.25,
    monthlyChange: 15.8,
    walletAddress: "GDR4...X7H9",
    fullAddress: "GDR4WXYZ1234ABCD5678EFGH9012IJKL3456MNOP7890QRST1234UVWX7H9",
  };

  const transactions = [
    {
      id: 1,
      type: "received",
      description: "Job Payment - React Dashboard",
      amount: 125.50,
      date: "2024-01-12 14:30",
      status: "completed",
      from: "TechCorp Inc.",
      txHash: "0x1234...abcd",
    },
    {
      id: 2,
      type: "withdraw",
      description: "Withdrawal to External Wallet",
      amount: -200.00,
      date: "2024-01-10 09:15",
      status: "completed",
      to: "External Wallet",
      txHash: "0x5678...efgh",
    },
    {
      id: 3,
      type: "deposit",
      description: "Pi Wallet Deposit",
      amount: 500.00,
      date: "2024-01-08 16:45",
      status: "completed",
      from: "Pi Network",
      txHash: "0x9012...ijkl",
    },
    {
      id: 4,
      type: "escrow",
      description: "Escrow Hold - Mobile App Design",
      amount: -89.99,
      date: "2024-01-07 11:20",
      status: "pending",
      to: "Escrow",
      txHash: "0x3456...mnop",
    },
  ];

  const handleDeposit = () => {
    if (!depositAmount || parseFloat(depositAmount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid deposit amount",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Deposit Initiated",
      description: `Depositing ${depositAmount} π to your wallet`,
    });
    setDepositAmount("");
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: "Invalid Amount", 
        description: "Please enter a valid withdrawal amount",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(withdrawAmount) > walletData.balance) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough π to withdraw this amount",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Withdrawal Initiated",
      description: `Withdrawing ${withdrawAmount} π from your wallet`,
    });
    setWithdrawAmount("");
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(walletData.fullAddress);
    toast({
      title: "Address Copied",
      description: "Wallet address copied to clipboard",
    });
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "received":
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-success" />;
      case "withdraw":
        return <ArrowUpRight className="h-4 w-4 text-warning" />;
      case "escrow":
        return <Shield className="h-4 w-4 text-primary" />;
      default:
        return <Coins className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-success";
      case "pending": return "bg-warning";
      case "failed": return "bg-destructive";
      default: return "bg-muted";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Wallet</h1>
          <p className="text-muted-foreground">
            Manage your Pi cryptocurrency balance and transactions
          </p>
        </div>

        {/* Balance Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-3">
          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setShowBalance(!showBalance)}
              >
                {showBalance ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent">
                {showBalance ? `${walletData.balance.toFixed(2)} π` : "•••• π"}
              </div>
              <p className="text-xs text-muted-foreground">
                <span className="inline-flex items-center text-success">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  +{walletData.monthlyChange}%
                </span>{" "}
                this month
              </p>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Balance</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-warning">
                {showBalance ? `${walletData.pendingBalance.toFixed(2)} π` : "••• π"}
              </div>
              <p className="text-xs text-muted-foreground">
                Awaiting completion
              </p>
            </CardContent>
          </Card>

          <Card className="card-glow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <WalletIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? `${walletData.totalEarnings.toFixed(2)} π` : "•••• π"}
              </div>
              <p className="text-xs text-muted-foreground">
                All-time earnings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Wallet Address */}
        <Card className="card-glow mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Wallet Address
            </CardTitle>
            <CardDescription>
              Your unique Pi Network wallet address for receiving payments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 rounded-lg bg-secondary p-3">
              <code className="flex-1 text-sm font-mono">{walletData.fullAddress}</code>
              <Button variant="ghost" size="icon" onClick={copyAddress}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="btn-hero h-16">
                <ArrowDownRight className="mr-2 h-5 w-5" />
                Deposit Pi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Deposit Pi Cryptocurrency</DialogTitle>
                <DialogDescription>
                  Add Pi to your WorkChain wallet from your Pi Network account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="deposit-amount">Amount (π)</Label>
                  <Input
                    id="deposit-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={depositAmount}
                    onChange={(e) => setDepositAmount(e.target.value)}
                  />
                </div>
                <div className="rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Coins className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Pi Network Integration</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Connect your Pi Network wallet to transfer Pi directly to WorkChain
                  </p>
                </div>
                <Button onClick={handleDeposit} className="w-full">
                  Connect Pi Wallet & Deposit
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-16">
                <ArrowUpRight className="mr-2 h-5 w-5" />
                Withdraw Pi
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Withdraw Pi Cryptocurrency</DialogTitle>
                <DialogDescription>
                  Transfer Pi from your WorkChain wallet to external wallet
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="withdraw-amount">Amount (π)</Label>
                  <Input
                    id="withdraw-amount"
                    type="number"
                    placeholder="Enter amount"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available: {walletData.balance.toFixed(2)} π
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="withdraw-address">Destination Address</Label>
                  <Input
                    id="withdraw-address"
                    placeholder="Enter Pi wallet address"
                  />
                </div>
                <div className="rounded-lg bg-warning/10 border border-warning/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-warning" />
                    <span className="text-sm font-medium text-warning">Security Notice</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Withdrawals are processed within 24 hours. Double-check the address before confirming.
                  </p>
                </div>
                <Button onClick={handleWithdraw} className="w-full">
                  Confirm Withdrawal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Transaction History */}
        <Card className="card-glow">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>
              View all your Pi transactions and transfers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="space-y-4">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="received">Received</TabsTrigger>
                <TabsTrigger value="sent">Sent</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center space-x-4">
                      <div className={`rounded-full p-2 ${
                        transaction.type === "received" || transaction.type === "deposit" 
                          ? "bg-success/20" 
                          : transaction.type === "withdraw"
                          ? "bg-warning/20"
                          : "bg-primary/20"
                      }`}>
                        {getTransactionIcon(transaction.type)}
                      </div>
                      <div>
                        <p className="font-medium">{transaction.description}</p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <span>{transaction.date}</span>
                          <Badge className={getStatusColor(transaction.status)}>
                            {transaction.status}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {transaction.from && `From: ${transaction.from}`}
                          {transaction.to && `To: ${transaction.to}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        transaction.amount > 0 ? "text-success" : "text-warning"
                      }`}>
                        {transaction.amount > 0 ? "+" : ""}{transaction.amount.toFixed(2)} π
                      </p>
                      <Button variant="ghost" size="sm" className="mt-1">
                        <ExternalLink className="mr-1 h-3 w-3" />
                        View on Explorer
                      </Button>
                    </div>
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="received">
                {transactions.filter(t => t.type === "received" || t.type === "deposit").map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                    {/* Same structure as above */}
                  </div>
                ))}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Wallet;