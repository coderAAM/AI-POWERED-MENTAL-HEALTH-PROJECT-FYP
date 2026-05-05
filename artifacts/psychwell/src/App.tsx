import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LangProvider } from "@/lib/lang-context";
import { ThemeProvider } from "@/lib/theme-context";
import { RequireAuth } from "@/components/AppShell";
import { store } from "@/lib/storage";

import Welcome from "@/pages/Welcome";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Chat from "@/pages/Chat";
import CallDoctor from "@/pages/CallDoctor";
import Mood from "@/pages/Mood";
import Assess from "@/pages/Assess";
import Doctors from "@/pages/Doctors";
import DoctorDetail from "@/pages/DoctorDetail";
import Appointments from "@/pages/Appointments";
import Settings from "@/pages/Settings";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});

function Index() {
  return store.getUser() ? <Redirect to="/dashboard" /> : <Redirect to="/welcome" />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Index} />
      <Route path="/welcome" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/dashboard">
        <RequireAuth><Dashboard /></RequireAuth>
      </Route>
      <Route path="/chat">
        <RequireAuth><Chat persona="therapist" /></RequireAuth>
      </Route>
      <Route path="/call-doctor">
        <RequireAuth><CallDoctor /></RequireAuth>
      </Route>
      <Route path="/mood">
        <RequireAuth><Mood /></RequireAuth>
      </Route>
      <Route path="/assess">
        <RequireAuth><Assess /></RequireAuth>
      </Route>
      <Route path="/doctors">
        <RequireAuth><Doctors /></RequireAuth>
      </Route>
      <Route path="/doctors/:id">
        <RequireAuth><DoctorDetail /></RequireAuth>
      </Route>
      <Route path="/appointments">
        <RequireAuth><Appointments /></RequireAuth>
      </Route>
      <Route path="/settings">
        <RequireAuth><Settings /></RequireAuth>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

const baseRaw = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
const base = baseRaw === "" ? undefined : baseRaw;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LangProvider>
          <TooltipProvider>
            <WouterRouter base={base}>
              <Router />
              <Toaster />
            </WouterRouter>
          </TooltipProvider>
        </LangProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
