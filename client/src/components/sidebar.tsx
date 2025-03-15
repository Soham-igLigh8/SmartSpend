import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", label: "Dashboard", icon: "fas fa-home" },
    { href: "/assistant", label: "Assistant", icon: "fas fa-comments" },
    { href: "/accounts", label: "Accounts", icon: "fas fa-wallet" },
    { href: "/investments", label: "Investments", icon: "fas fa-chart-pie" },
    { href: "/reports", label: "Reports", icon: "fas fa-file-invoice-dollar" },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-[#EBECF0]">
      <div className="p-6 border-b border-[#EBECF0]">
        <h1 className="text-xl font-semibold flex items-center">
          <span className="bg-[#0052CC] text-white p-1 rounded mr-2">
            <i className="fas fa-chart-line"></i>
          </span>
          FinAssist
        </h1>
      </div>
      
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <a
                  className={cn(
                    "flex items-center px-6 py-3 hover:bg-[#F4F5F7] transition-colors",
                    location === item.href
                      ? "text-[#0052CC] bg-[#F4F5F7] border-l-4 border-[#0052CC] font-medium"
                      : "text-[#172B4D]"
                  )}
                >
                  <i className={cn(item.icon, "w-5 mr-3")}></i>
                  {item.label}
                </a>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-[#EBECF0]">
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
    </aside>
  );
}
