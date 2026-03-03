import { useState } from "react";
import { DsrForm } from "../features/dsr";
import { useAuth } from "../context";
import {
  LogOut,
  ArrowLeft,
  Zap,
  ClipboardList,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "./ui/card";

type ServiceType = "dsr" | null;

interface Service {
  id: ServiceType;
  title: string;
  description: string;
  icon: React.ReactNode;
}

const services: Service[] = [
  {
    id: "dsr",
    title: "Daily Status Report",
    description: "Send your daily status report with tasks and activities",
    icon: <ClipboardList className="w-8 h-8" />,
  },
];

export default function ServicesDashboard() {
  const { logout } = useAuth();
  const [activeService, setActiveService] = useState<ServiceType>(null);

  const renderService = () => {
    switch (activeService) {
      case "dsr":
        return <DsrForm />;
      default:
        return null;
    }
  };

  if (activeService) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setActiveService(null)}>
            <ArrowLeft className="w-4 h-4" />
            Back to Services
          </Button>
          <Button variant="ghost" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
        {renderService()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 bg-card border-b border-border px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-violet-500" />
            <span className="text-lg font-bold text-foreground">
              Daily Task Manager
            </span>
          </div>
          <Button variant="secondary" onClick={logout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Choose a service to get started with your daily tasks
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <Card
              key={service.id}
              onClick={() => setActiveService(service.id)}
              className="group relative border-2 hover:border-violet-500 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-violet-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
              <CardHeader>
                <div className="text-violet-500 mb-2">{service.icon}</div>
                <CardTitle>{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <ArrowRight className="absolute bottom-6 right-6 w-5 h-5 text-muted-foreground/40 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" />
            </Card>
          ))}

          {/* Placeholder for future services */}
          <Card className="bg-secondary/50 border-2 border-dashed border-muted-foreground/20">
            <CardHeader>
              <Sparkles className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <CardTitle className="text-muted-foreground">
                More Coming Soon
              </CardTitle>
              <CardDescription className="text-muted-foreground/60">
                New services and features are on the way
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </main>
    </div>
  );
}
