import { useAuth } from "../context";
import { Layers, Mail, Zap, Lock } from "lucide-react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";

export default function WelcomeScreen() {
  const { login, status } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-linear-to-br from-violet-500 to-purple-700">
      <Card className="max-w-md w-full text-center shadow-2xl rounded-3xl border-0">
        <CardHeader className="pb-4">
          <div className="w-20 h-20 bg-linear-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Layers className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl">Daily Task Manager</CardTitle>
          <CardDescription className="text-base leading-relaxed">
            Streamline your daily workflows with automated reports and task
            management
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl text-sm text-secondary-foreground">
              <Mail className="w-5 h-5 text-violet-500" />
              <span>Daily Status Reports</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl text-sm text-secondary-foreground">
              <Zap className="w-5 h-5 text-violet-500" />
              <span>One-Click Email</span>
            </div>
            <div className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-xl text-sm text-secondary-foreground">
              <Lock className="w-5 h-5 text-violet-500" />
              <span>Secure Google Auth</span>
            </div>
          </div>

          <Button
            onClick={login}
            variant="outline"
            size="xl"
            className="w-full border-2"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Sign in with Google
          </Button>

          {status && (
            <Badge
              variant={status.includes("failed") ? "destructive" : "success"}
              className="mx-auto"
            >
              {status}
            </Badge>
          )}

          <p className="text-xs text-muted-foreground leading-relaxed">
            We only request permission to send emails on your behalf.
            <br />
            Your data stays private and secure.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
