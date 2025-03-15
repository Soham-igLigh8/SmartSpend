import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export interface AccountCardProps {
  name: string;
  number: string;
  balance: number;
  lastTransaction: Date;
  type: "checking" | "savings" | "credit";
}

export default function AccountCard({ name, number, balance, lastTransaction, type }: AccountCardProps) {
  const typeIcons = {
    checking: "fas fa-university",
    savings: "fas fa-piggy-bank",
    credit: "fas fa-credit-card"
  };
  
  const typeColors = {
    checking: "bg-[#0052CC] bg-opacity-10 text-[#0052CC]",
    savings: "bg-[#00875A] bg-opacity-10 text-[#00875A]",
    credit: "bg-[#FF5630] bg-opacity-10 text-[#FF5630]"
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const formatLastTransaction = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 border-b border-[#EBECF0] flex flex-row justify-between items-center space-y-0">
        <div className="flex items-center">
          <div className={cn("w-10 h-10 rounded flex items-center justify-center mr-3", typeColors[type])}>
            <i className={typeIcons[type]}></i>
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-gray-500">{number}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon">
          <MoreVertical className="h-5 w-5 text-gray-400" />
        </Button>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2">
          <span className="text-sm text-gray-500">
            {type === "credit" ? "Current Balance" : "Available Balance"}
          </span>
          <div className="text-2xl font-semibold">{formatCurrency(balance)}</div>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Last Transaction</span>
          <span>{formatLastTransaction(lastTransaction)}</span>
        </div>
      </CardContent>
    </Card>
  );
}
