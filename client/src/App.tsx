import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Assistant from "@/pages/assistant";
import Accounts from "@/pages/accounts";
import Sidebar from "@/components/sidebar";
import MobileNav from "@/components/mobile-nav";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/assistant" component={Assistant} />
      <Route path="/accounts" component={Accounts} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const isMobile = useIsMobile();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col md:flex-row bg-neutral-100 text-[#172B4D]">
        {!isMobile && <Sidebar />}
        {isMobile && (
          <MobileNav 
            isOpen={mobileMenuOpen} 
            setIsOpen={setMobileMenuOpen} 
          />
        )}
        <main className="flex-1 flex flex-col">
          <Router />
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
