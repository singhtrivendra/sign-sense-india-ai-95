
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Index from "./pages/Index";
import Learn from "./pages/Learn";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import HowItWorks from "./pages/HowItWorks";
import About from "./pages/About";
import Documentation from "./pages/Documentation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Index />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/about" element={<About />} />
        <Route path="/docs" element={<Documentation />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
    <Toaster />
  </QueryClientProvider>
);

export default App;
