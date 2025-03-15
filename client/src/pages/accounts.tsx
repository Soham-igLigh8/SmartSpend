import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import AccountCard from "@/components/account-card";
import { Button } from "@/components/ui/button";
import { BarChart, Line, Activity, CreditCard, PlusCircle } from "lucide-react";

export default function Accounts() {
  // Using a fixed user ID for demo purposes - in a real app this would come from authentication
  const userId = 1;
  
  // Fetch accounts
  const { data: accounts, isLoading } = useQuery({
    queryKey: [`/api/accounts/${userId}`],
  });

  // Helper function to format account dates from strings to Date objects
  const formatAccounts = (accounts: any[]) => {
    return accounts?.map(account => ({
      ...account,
      lastTransaction: new Date(account.lastTransaction)
    }));
  };

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto pb-20 md:pb-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-2">Your Accounts</h1>
          <p className="text-gray-500">
            Manage and track all your financial accounts in one place.
          </p>
        </div>
        <Button className="bg-[#0052CC] text-white">
          <PlusCircle className="mr-2 h-4 w-4" /> Add New Account
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="mb-8">
        <TabsList>
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="checking">Checking</TabsTrigger>
          <TabsTrigger value="savings">Savings</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-4">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-[#EBECF0] shadow-sm overflow-hidden">
                  <div className="p-4 border-b border-[#EBECF0]">
                    <Skeleton className="h-10 w-full mb-2" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                  <div className="p-4">
                    <Skeleton className="h-8 w-40 mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formatAccounts(accounts || []).map((account: any) => (
                <AccountCard
                  key={account.id}
                  name={account.name}
                  number={account.number}
                  balance={account.balance}
                  lastTransaction={account.lastTransaction}
                  type={account.type as any}
                />
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="checking" className="mt-4">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formatAccounts(accounts || [])
                .filter((account: any) => account.type === "checking")
                .map((account: any) => (
                  <AccountCard
                    key={account.id}
                    name={account.name}
                    number={account.number}
                    balance={account.balance}
                    lastTransaction={account.lastTransaction}
                    type={account.type as any}
                  />
                ))
              }
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="savings" className="mt-4">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formatAccounts(accounts || [])
                .filter((account: any) => account.type === "savings")
                .map((account: any) => (
                  <AccountCard
                    key={account.id}
                    name={account.name}
                    number={account.number}
                    balance={account.balance}
                    lastTransaction={account.lastTransaction}
                    type={account.type as any}
                  />
                ))
              }
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="credit" className="mt-4">
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {formatAccounts(accounts || [])
                .filter((account: any) => account.type === "credit")
                .map((account: any) => (
                  <AccountCard
                    key={account.id}
                    name={account.name}
                    number={account.number}
                    balance={account.balance}
                    lastTransaction={account.lastTransaction}
                    type={account.type as any}
                  />
                ))
              }
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <h2 className="text-xl font-semibold mb-4">Account Analytics</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <BarChart className="mr-2 h-4 w-4 text-[#0052CC]" /> Transaction History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">View all your recent transactions across accounts.</p>
            <Button variant="outline" className="w-full mt-4">View History</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <Activity className="mr-2 h-4 w-4 text-[#00875A]" /> Spending Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Analyze your spending patterns and trends over time.</p>
            <Button variant="outline" className="w-full mt-4">See Insights</Button>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center">
              <CreditCard className="mr-2 h-4 w-4 text-[#FF5630]" /> Payment Reminders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500">Set up alerts for upcoming bills and payments.</p>
            <Button variant="outline" className="w-full mt-4">Manage Reminders</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
