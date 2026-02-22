import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileCheck, DollarSign, Globe, TrendingUp, TrendingDown, Minus, Loader2 } from "lucide-react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
} from "firebase/firestore";

interface StatCard {
  title: string;
  value: string;
  icon: React.ElementType;
  change: string;
  trend: "up" | "down" | "flat";
}

interface Activity {
  user: string;
  action: string;
  time: string;
  raw: Date;
}

function timeAgo(date: Date): string {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return n.toLocaleString();
  return String(n);
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [activity, setActivity] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      console.log("[Dashboard] ▶ Starting isolated fetch per collection...");

      // ── 1. Total Users ──────────────────────────────────────────
      let totalUsers = 0;
      try {
        const snap = await getDocs(collection(db, "users"));
        totalUsers = snap.size;
        console.log("[Dashboard] ✅ users:", totalUsers);
      } catch (e: any) {
        console.error("[Dashboard] ❌ users FAILED:", e.code, e.message);
      }

      // ── 2. Pending KYC ─────────────────────────────────────────
      let pendingKyc = 0;
      try {
        const snap = await getDocs(
          query(collection(db, "users"), where("kycStatus", "==", "pending"))
        );
        pendingKyc = snap.size;
        console.log("[Dashboard] ✅ pendingKyc:", pendingKyc);
      } catch (e: any) {
        console.error("[Dashboard] ❌ pendingKyc FAILED:", e.code, e.message);
      }

      // ── 3. Transactions ─────────────────────────────────────────
      let totalTx = 0;
      try {
        const snap = await getDocs(collection(db, "transactions"));
        totalTx = snap.size;
        console.log("[Dashboard] ✅ transactions:", totalTx);
      } catch (e: any) {
        console.error("[Dashboard] ❌ transactions FAILED:", e.code, e.message);
        console.warn("[Dashboard] ℹ️  Fix: Add 'transactions' rule to Firestore — allow read: if request.auth != null");
      }

      // ── 4. Active Countries ─────────────────────────────────────
      let activeCountries = 0;
      try {
        const snap = await getDocs(
          query(collection(db, "countries"), where("active", "==", true))
        );
        activeCountries = snap.size;
        console.log("[Dashboard] ✅ activeCountries:", activeCountries);
      } catch (e: any) {
        console.error("[Dashboard] ❌ countries FAILED:", e.code, e.message);
      }

      setStats([
        {
          title: "Total Users",
          value: formatNumber(totalUsers),
          icon: Users,
          change: totalUsers > 0 ? `${totalUsers} registered` : "No users yet",
          trend: totalUsers > 0 ? "up" : "flat",
        },
        {
          title: "Pending KYC",
          value: formatNumber(pendingKyc),
          icon: FileCheck,
          change: pendingKyc > 0 ? `${pendingKyc} awaiting review` : "All clear",
          trend: pendingKyc > 10 ? "down" : pendingKyc > 0 ? "flat" : "up",
        },
        {
          title: "Total Transactions",
          value: formatNumber(totalTx),
          icon: DollarSign,
          change: totalTx > 0 ? `${totalTx} processed` : "No transactions yet",
          trend: totalTx > 0 ? "up" : "flat",
        },
        {
          title: "Active Countries",
          value: formatNumber(activeCountries),
          icon: Globe,
          change: activeCountries > 0 ? `${activeCountries} corridors open` : "None active",
          trend: activeCountries > 0 ? "up" : "flat",
        },
      ]);

      // ── 5. Recent Users activity ────────────────────────────────
      let userActivities: Activity[] = [];
      try {
        const snap = await getDocs(
          query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5))
        );
        userActivities = snap.docs.map((d) => {
          const data = d.data();
          const createdAt: Date =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(data.createdAt || Date.now());
          const name =
            data.fullName || data.displayName || data.name ||
            data.email?.split("@")[0] || "Unknown User";
          const action =
            data.kycStatus === "pending" ? "submitted KYC for review"
            : data.kycStatus === "approved" ? "KYC approved"
            : "registered account";
          return { user: name, action, time: timeAgo(createdAt), raw: createdAt };
        });
        console.log("[Dashboard] ✅ recentUsers:", userActivities.length);
      } catch (e: any) {
        console.error("[Dashboard] ❌ recentUsers FAILED:", e.code, e.message);
        if (e.code === "failed-precondition") {
          console.warn("[Dashboard] ℹ️  Missing Firestore index for users.createdAt DESC");
          console.warn("[Dashboard] ℹ️  Go to Firebase Console → Firestore → Indexes → Add index:");
          console.warn("[Dashboard] ℹ️  Collection: users | Field: createdAt | Order: Descending");
        }
      }

      // ── 6. Recent Transactions activity ────────────────────────
      let txActivities: Activity[] = [];
      try {
        const snap = await getDocs(
          query(collection(db, "transactions"), orderBy("createdAt", "desc"), limit(5))
        );
        txActivities = snap.docs.map((d) => {
          const data = d.data();
          const createdAt: Date =
            data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(data.createdAt || Date.now());
          const name =
            data.senderName || data.userName ||
            data.userId?.slice(0, 8) || "A user";
          const amount = data.amount
            ? `${data.currency || "KES"} ${Number(data.amount).toLocaleString()}`
            : "";
          return {
            user: name,
            action: `sent ${amount} transfer`.trim(),
            time: timeAgo(createdAt),
            raw: createdAt,
          };
        });
        console.log("[Dashboard] ✅ recentTransactions:", txActivities.length);
      } catch (e: any) {
        console.error("[Dashboard] ❌ recentTransactions FAILED:", e.code, e.message);
      }

      const merged = [...userActivities, ...txActivities]
        .sort((a, b) => b.raw.getTime() - a.raw.getTime())
        .slice(0, 8);

      console.log("[Dashboard] ✅ All done. Total activity items:", merged.length);
      setActivity(merged);
      setLoading(false);
    };

    fetchStats();
  }, []);

  const TrendIcon = ({ trend }: { trend: "up" | "down" | "flat" }) => {
    if (trend === "up") return <TrendingUp className="h-3 w-3 text-green-500" />;
    if (trend === "down") return <TrendingDown className="h-3 w-3 text-red-500" />;
    return <Minus className="h-3 w-3 text-muted-foreground" />;
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Live overview of your platform's performance</p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-muted rounded w-24" />
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-16 mb-2" />
                <div className="h-3 bg-muted rounded w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title} className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-primary" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendIcon trend={stat.trend} />
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Recent Activity
            {loading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0 animate-pulse"
                >
                  <div className="space-y-1.5">
                    <div className="h-4 bg-muted rounded w-32" />
                    <div className="h-3 bg-muted rounded w-48" />
                  </div>
                  <div className="h-3 bg-muted rounded w-16" />
                </div>
              ))}
            </div>
          ) : activity.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No recent activity found. Activity will appear here as users register and transact.
            </p>
          ) : (
            <div className="space-y-1">
              {activity.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                      {item.user.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{item.user}</p>
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}