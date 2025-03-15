import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

interface SavingsGoalProps {
  name: string;
  current: number;
  target: number;
}

export default function SavingsGoal({ name, current, target }: SavingsGoalProps) {
  const progress = Math.round((current / target) * 100);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Determine color based on progress
  const getColorClass = (progress: number) => {
    if (progress >= 75) return "bg-[#00875A]";
    if (progress >= 40) return "bg-[#0052CC]";
    return "bg-[#0052CC]";
  };

  return (
    <div className="mb-4">
      <div className="flex justify-between mb-1">
        <span className="font-medium">{name}</span>
        <span>{progress}%</span>
      </div>
      <Progress value={progress} className="h-2" indicatorClassName={getColorClass(progress)} />
      <div className="flex justify-between text-sm mt-1">
        <span className="text-gray-500">{formatCurrency(current)}</span>
        <span className="text-gray-500">{formatCurrency(target)}</span>
      </div>
    </div>
  );
}
