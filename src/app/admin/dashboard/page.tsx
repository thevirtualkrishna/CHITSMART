import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { HandCoins, Users, Wallet, Hourglass, ArrowUp } from "lucide-react";

const metrics = [
  { title: "Total Collection", value: "45.6L-IN", change: "+12% this month", icon: Wallet },
  { title: "Active Members", value: "248", change: "+5 new members", icon: Users },
  { title: "Total Distributed", value: "32.1L-IN", change: "2 distributions pending", icon: HandCoins },
  { title: "Total Pending", value: "1.2L-IN", change: "From 15 members", icon: Hourglass },
];

const recentPayments = [
    { name: "Suresh Patel", scheme: "1,00,000-IN", amount: "5,000-IN", status: "Paid" },
    { name: "Deepika Singh", scheme: "2,00,000-IN", amount: "10,000-IN", status: "Pending" },
    { name: "Ravi Kumar", scheme: "50,000-IN", amount: "2,500-IN", status: "Paid" },
    { name: "Anjali Mehta", scheme: "1,00,000-IN", amount: "5,000-IN", status: "Paid" },
    { name: "Vikram Rathod", scheme: "5,00,000-IN", amount: "25,000-IN", status: "Overdue" },
]

const activeSchemes = [
    { name: "50,000-IN Scheme", groups: 4, members: 60 },
    { name: "1,00,000-IN Scheme", groups: 8, members: 120 },
    { name: "2,00,000-IN Scheme", groups: 5, members: 75 },
    { name: "5,00,000-IN Scheme", groups: 2, members: 30 },
]

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, Admin! Here's your chit fund overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
              <metric.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                {metric.change.startsWith("+") && <ArrowUp className="h-3 w-3 text-green-500"/>}
                {metric.change}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Recent Customer Payments</CardTitle>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Customer</TableHead>
                            <TableHead>Scheme</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead className="text-center">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {recentPayments.map(payment => (
                             <TableRow key={payment.name}>
                                <TableCell className="font-medium">{payment.name}</TableCell>
                                <TableCell>{payment.scheme}</TableCell>
                                <TableCell className="text-right">{payment.amount}</TableCell>
                                <TableCell className="text-center">
                                    <Badge variant={payment.status === 'Paid' ? 'default' : payment.status === 'Pending' ? 'secondary' : 'destructive'} 
                                    className={`${payment.status === 'Paid' ? 'bg-green-100 text-green-800' : payment.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {payment.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle>Active Schemes Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {activeSchemes.map(scheme => (
                    <div key={scheme.name} className="flex justify-between items-center p-3 bg-muted rounded-lg">
                        <div>
                            <p className="font-semibold">{scheme.name}</p>
                            <p className="text-sm text-muted-foreground">{scheme.members} members</p>
                        </div>
                        <div className="text-right">
                           <p className="font-bold text-lg">{scheme.groups}</p>
                           <p className="text-sm text-muted-foreground">Groups</p>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
