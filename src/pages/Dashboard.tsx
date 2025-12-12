import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Send,
  History,
  Settings,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { auth, db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

interface Transaction {
  id: number;
  type: "sent" | "received";
  recipient?: string;
  sender?: string;
  amount: string;
  date: string;
  status: "completed" | "pending";
}

const Dashboard = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;

      try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(userRef);
        if (snap.exists()) {
          const data = snap.data();
          setUserData({
            name: auth.currentUser.displayName || data.directors?.[0]?.firstName || "User",
            email: auth.currentUser.email,
            balance: data.balance || "KES 0.00",
            kycStatus: data.kyc?.status || "pending",
          });

          // Optional: set recent transactions if stored in Firestore
          if (data.transactions) setTransactions(data.transactions);
        }
      } catch (err) {
        console.error("Failed to fetch user data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const quickActions = [
    { icon: Send, label: "Send Money", color: "primary" },
    { icon: History, label: "Transactions", color: "secondary" },
    { icon: Settings, label: "Settings", color: "muted" },
  ];

  const getKYCStatusBadge = () => {
    if (!userData) return null;

    const statuses = {
      pending: {
        icon: Clock,
        text: "Pending Verification",
        className: "bg-accent/10 text-accent border-accent/20",
      },
      verified: {
        icon: CheckCircle2,
        text: "Verified",
        className: "bg-success/10 text-success border-success/20",
      },
      rejected: {
        icon: AlertCircle,
        text: "Verification Failed",
        className: "bg-destructive/10 text-destructive border-destructive/20",
      },
    };

    const status = statuses[userData.kycStatus as keyof typeof statuses];
    const Icon = status.icon;

    return (
      <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${status.className}`}>
        <Icon className="h-4 w-4" />
        <span className="text-sm font-medium">{status.text}</span>
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-muted/30">
      <Navbar />

      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {userData.name}!</p>
          </div>

          {/* Profile Card */}
          <Card className="p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarFallback className="gradient-primary text-primary-foreground text-xl">
                    {userData.name.split(" ").map((n: string) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-xl font-semibold">{userData.name}</h2>
                  <p className="text-sm text-muted-foreground">{userData.email}</p>
                  <div className="mt-2">{getKYCStatusBadge()}</div>
                </div>
              </div>

              <div className="text-left md:text-right">
                <p className="text-sm text-muted-foreground mb-1">Available Balance</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {userData.balance}
                </p>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {quickActions.map((action, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-smooth cursor-pointer hover:border-accent/50 group"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center group-hover:shadow-glow transition-smooth">
                    <action.icon className="h-7 w-7 text-primary-foreground" />
                  </div>
                  <p className="font-semibold">{action.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold">Recent Transactions</h3>
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </div>

            <div className="space-y-4">
              {(transactions.length ? transactions : []).map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-smooth"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        transaction.type === "sent" ? "bg-destructive/10" : "bg-success/10"
                      }`}
                    >
                      {transaction.type === "sent" ? (
                        <ArrowUpRight className="h-5 w-5 text-destructive" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5 text-success" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">
                        {transaction.type === "sent"
                          ? `To ${transaction.recipient}`
                          : `From ${transaction.sender}`}
                      </p>
                      <p className="text-sm text-muted-foreground">{transaction.date}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold ${
                        transaction.type === "sent" ? "text-destructive" : "text-success"
                      }`}
                    >
                      {transaction.type === "sent" ? "-" : "+"} {transaction.amount}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        transaction.status === "completed"
                          ? "bg-success/10 text-success"
                          : "bg-accent/10 text-accent"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
