import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionProps {
  icon: string;
  label: string;
  color: "primary" | "secondary" | "accent";
  onClick?: () => void;
}

export default function QuickAction({ icon, label, color, onClick }: QuickActionProps) {
  const colorMap = {
    primary: "bg-[#0052CC] bg-opacity-10 text-[#0052CC]",
    secondary: "bg-[#00875A] bg-opacity-10 text-[#00875A]",
    accent: "bg-[#FF5630] bg-opacity-10 text-[#FF5630]"
  };

  return (
    <Button
      variant="outline"
      className="bg-white p-4 rounded-lg border border-[#EBECF0] shadow-sm flex items-center hover:bg-[#F4F5F7] transition-colors justify-start h-auto"
      onClick={onClick}
    >
      <span className={cn("w-10 h-10 rounded-full flex items-center justify-center mr-4", colorMap[color])}>
        <i className={icon}></i>
      </span>
      <span>{label}</span>
    </Button>
  );
}
