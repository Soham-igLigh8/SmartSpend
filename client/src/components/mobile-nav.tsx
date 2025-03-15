import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface MobileNavProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function MobileNav({ isOpen, setIsOpen }: MobileNavProps) {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", label: "Dashboard", icon: "fas fa-home" },
    { href: "/assistant", label: "Assistant", icon: "fas fa-comments" },
    { href: "/accounts", label: "Accounts", icon: "fas fa-wallet" },
    { href: "/investments", label: "Investments", icon: "fas fa-chart-pie" },
    { href: "/reports", label: "Reports", icon: "fas fa-file-invoice-dollar" },
    { href: "/profile", label: "Profile", icon: "fas fa-user-cog" },
  ];

  return (
    <>
      <nav className="md:hidden bg-white dark:bg-gray-800 border-b border-[#EBECF0] dark:border-gray-700 p-4 flex items-center justify-between transition-colors duration-200">
        <h1 className="text-xl font-semibold flex items-center">
          <span className="bg-[#0052CC] text-white p-1 rounded mr-2">
            <i className="fas fa-chart-line"></i>
          </span>
          FinAssist
        </h1>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[250px] sm:w-[300px] dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700">
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold flex items-center">
                  <span className="bg-[#0052CC] text-white p-1 rounded mr-2">
                    <i className="fas fa-chart-line"></i>
                  </span>
                  FinAssist
                </h1>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <nav className="flex-1">
                <ul className="space-y-1">
                  {navItems.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <a
                          className={cn(
                            "flex items-center px-4 py-3 rounded-md hover:bg-[#F4F5F7] dark:hover:bg-gray-700 transition-colors",
                            location === item.href
                              ? "text-[#0052CC] bg-[#F4F5F7] dark:bg-gray-700 font-medium"
                              : "text-[#172B4D] dark:text-gray-200"
                          )}
                          onClick={() => setIsOpen(false)}
                        >
                          <i className={cn(item.icon, "w-5 mr-3")}></i>
                          {item.label}
                        </a>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              <div className="pt-4 border-t border-[#EBECF0] mt-auto">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-[#EBECF0] flex items-center justify-center text-[#172B4D]">
                    <i className="fas fa-user"></i>
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">Alex Morgan</p>
                    <p className="text-sm text-gray-500">alex@example.com</p>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      
      <nav className="md:hidden bg-white dark:bg-gray-800 border-t border-[#EBECF0] dark:border-gray-700 fixed bottom-0 left-0 right-0 flex justify-around z-10 transition-colors duration-200">
        {navItems.slice(0, 4).map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={cn(
              "p-3 flex flex-col items-center",
              location === item.href ? "text-[#0052CC]" : "text-gray-500 dark:text-gray-400"
            )}>
              <i className={item.icon}></i>
              <span className="text-xs mt-1">{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
    </>
  );
}
