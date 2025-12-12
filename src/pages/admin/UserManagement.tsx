import { useState, useEffect } from "react"; 
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, CheckCircle, XCircle, Search } from "lucide-react";
import { toast } from "sonner";

import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { sendPasswordResetEmail } from "firebase/auth";
import { db, auth } from "@/lib/firebase";

interface User {
  id: string;
  name: string;
  email: string;
  status: string;
  kycStatus: "pending" | "verified" | "rejected";
  createdAt?: string;
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch users from Firestore
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "users"));
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().companyName || doc.data().displayName || "N/A",
        email: doc.data().email,
        status: doc.data().status || "active",
        kycStatus: doc.data().kycStatus || "pending",
        createdAt: doc.data().createdAt?.toDate?.()?.toLocaleDateString() || "N/A"
      }));
      setUsers(data);
      setSubmissions(data.filter(u => u.kycStatus === "pending"));
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApproveKyc = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { kycStatus: "verified" });
      toast.success("KYC approved successfully");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to approve KYC.");
    }
  };

  const handleRejectKyc = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { kycStatus: "rejected" });
      toast.success("KYC rejected");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to reject KYC.");
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      await updateDoc(doc(db, "users", userId), { status: "suspended" });
      toast.success("User suspended");
      fetchUsers();
    } catch (error) {
      console.error(error);
      toast.error("Failed to suspend user.");
    }
  };

  const handleResetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset email sent");
    } catch (error) {
      console.error(error);
      toast.error("Failed to send password reset email.");
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users and review KYC submissions
        </p>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">All Users</TabsTrigger>
          <TabsTrigger value="kyc">
            KYC Submissions
            {submissions.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {submissions.length}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* All Users */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>KYC</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "default" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.kycStatus === "verified"
                              ? "default"
                              : user.kycStatus === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                        >
                          {user.kycStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.createdAt}</TableCell>
                      <TableCell className="text-right flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedUser(user)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* KYC Submissions */}
        <TabsContent value="kyc" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending KYC Submissions</CardTitle>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No pending submissions</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {submissions.map((submission) => (
                    <Card key={submission.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="font-medium">{submission.name}</p>
                            <p className="text-sm text-muted-foreground">{submission.email}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                              <span>Status: {submission.kycStatus}</span>
                              <span>Joined: {submission.createdAt}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2"
                              onClick={() => setSelectedUser(submission)}
                            >
                              <Eye className="h-4 w-4" /> Review
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleApproveKyc(submission.id)}
                            >
                              <CheckCircle className="h-4 w-4" /> Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleRejectKyc(submission.id)}
                            >
                              <XCircle className="h-4 w-4" /> Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant={selectedUser.status === "active" ? "default" : "destructive"}>
                    {selectedUser.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">KYC Status</p>
                  <Badge
                    variant={
                      selectedUser.kycStatus === "verified"
                        ? "default"
                        : selectedUser.kycStatus === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                  >
                    {selectedUser.kycStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Joined</p>
                  <p className="font-medium">{selectedUser.createdAt}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => selectedUser.id && handleSuspendUser(selectedUser.id)}
                >
                  Suspend User
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => selectedUser.email && handleResetPassword(selectedUser.email)}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
