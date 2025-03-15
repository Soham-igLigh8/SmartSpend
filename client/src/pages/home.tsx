import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import QuickAction from "@/components/quick-action";
import AccountCard from "@/components/account-card";
import SpendingChart from "@/components/spending-chart";
import SavingsGoal from "@/components/savings-goal";
import FinancialChat from "@/components/financial-chat";
import { useIsMobile } from "@/hooks/use-mobile";

export default function Home() {
  const isMobile = useIsMobile();
  
  // Using a fixed user ID for demo purposes - in a real app this would come from authentication
  const userId = 1;
  
  // Fetch user data
  const { data: user, isLoading: isLoadingUser } = useQuery<any>({
    queryKey: [`/api/users/${userId}`],
  });
  
  // Fetch accounts
  const { data: accounts, isLoading: isLoadingAccounts } = useQuery<any[]>({
    queryKey: [`/api/accounts/${userId}`],
  });
  
  // Fetch savings goals
  const { data: savingsGoals, isLoading: isLoadingSavingsGoals } = useQuery<any[]>({
    queryKey: [`/api/savings-goals/${userId}`],
  });

  // Helper function to format account dates from strings to Date objects
  const formatAccounts = (accounts: any[]) => {
    return accounts?.map(account => ({
      ...account,
      lastTransaction: new Date(account.lastTransaction)
    }));
  };

  // Helper function to load font awesome script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://kit.fontawesome.com/a1c4f1f7eb.js';
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
    
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="flex-1 p-4 md:p-8 overflow-auto pb-20 md:pb-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Financial Dashboard</h1>
        <p className="text-gray-500">
          {isLoadingUser 
            ? <Skeleton className="h-4 w-64" /> 
            : `Welcome back, ${user?.name || 'User'}! Here's your financial overview.`
          }
        </p>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <QuickAction 
          icon="fas fa-plus" 
          label="Add Account" 
          color="primary" 
        />
        <QuickAction 
          icon="fas fa-exchange-alt" 
          label="Transfer Money" 
          color="secondary" 
        />
        <QuickAction 
          icon="fas fa-file-export" 
          label="Export Reports" 
          color="accent" 
        />
      </div>
      
      {/* Accounts Summary */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Accounts</h2>
        {isLoadingAccounts ? (
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
            {Array.isArray(accounts) && formatAccounts(accounts).map((account: any) => (
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
      </div>
      
      {/* Financial Insights */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Financial Insights</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Spending Analysis */}
          <SpendingChart />
          
          {/* Savings Goals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-base font-medium">Savings Goals</CardTitle>
              <Button variant="ghost" size="sm" className="text-[#0052CC] text-sm">
                <i className="fas fa-plus mr-1"></i> New Goal
              </Button>
            </CardHeader>
            <CardContent>
              {isLoadingSavingsGoals ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="mb-4">
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-2 w-full mb-2" />
                      <div className="flex justify-between">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  {Array.isArray(savingsGoals) && savingsGoals.map((goal: any) => (
                    <SavingsGoal
                      key={goal.id}
                      name={goal.name}
                      current={goal.current}
                      target={goal.target}
                    />
                  ))}
                </>
              )}
              
              <div className="mt-6 border-t border-[#EBECF0] pt-4">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-sm text-gray-500">Monthly Savings</div>
                    <div className="font-semibold text-lg">$850</div>
                  </div>
                  <Button size="sm" className="bg-[#0052CC] text-white rounded text-sm">
                    Adjust
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Financial Assistant */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Financial Assistant</h2>
        <FinancialChat />
      </div>
    </div>
  );
}
