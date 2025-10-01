import { Router, Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import Home from "@/pages/Home";
import Management from "@/pages/Management";
import NotFound from "@/pages/not-found";

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '') || '/';
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router base={base}>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/verwaltung" component={Management} />
              <Route component={NotFound} />
            </Switch>
          </Router>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
