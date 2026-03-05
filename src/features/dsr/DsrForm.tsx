import { useState } from "react";
import { useTasks, useDsrPreferences } from "./hooks";
import { EMAIL_CONFIG } from "./config";
import {
  generateSubject,
  generateEmailBody,
  createMimeMessage,
  encodeToBase64Url,
  sendGmailMessage,
  formatDateForSubject,
} from "./utils";
import { useAuth } from "../../context";
import {
  ClipboardList,
  Send,
  Plus,
  X,
  Settings,
  RotateCcw,
} from "lucide-react";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
} from "../../components/ui";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function DsrForm() {
  const { token, userEmail } = useAuth();
  const [status, setStatus] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { tasks, updateTask, addTask, removeTask } = useTasks();
  const {
    preferences,
    updatePreference,
    updateCc,
    addCc,
    removeCc,
    resetToDefaults,
  } = useDsrPreferences();

  const reportDate = new Date(preferences.reportDate + "T00:00:00");
  const emailBody = generateEmailBody(tasks, preferences);
  const emailSubject = generateSubject(reportDate);
  const ccList = preferences.cc.filter((email) => email.trim() !== "");

  const handlePreviewEmail = () => {
    if (!token) {
      setStatus("Please login first");
      return;
    }
    setStatus("");
    setShowPreview(true);
  };

  const handleSendEmail = async () => {
    if (!token) {
      setStatus("Please login first");
      return;
    }

    setIsSending(true);
    try {
      const emailConfig = {
        ...EMAIL_CONFIG,
        from: userEmail || EMAIL_CONFIG.from,
        cc: ccList,
      };
      const message = createMimeMessage(emailConfig, emailSubject, emailBody);
      const encodedMessage = encodeToBase64Url(message);

      const data = await sendGmailMessage(token, encodedMessage);
      setShowPreview(false);
      setStatus(`Email sent successfully! Message ID: ${data.id}`);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setStatus("Error: " + (err.message || "Unknown"));
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  const renderTaskSection = (title: string, category: keyof typeof tasks) => (
    <AccordionItem value={category}>
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent className="space-y-3">
        {/* <CardContent > */}
        {tasks[category].map((task, index) => (
          <div key={index} className="flex items-center gap-3">
            <span className="w-7 h-7 bg-secondary rounded-lg flex items-center justify-center text-sm font-semibold text-muted-foreground shrink-0">
              {index + 1}
            </span>
            <Input
              value={task}
              onChange={(e) => updateTask(category, index, e.target.value)}
              placeholder="Enter task..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => removeTask(category, index)}
              disabled={tasks[category].length <= 1}
              className="hover:bg-red-50 hover:border-red-200 hover:text-red-500"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => addTask(category)}
          className="border-dashed"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </Button>
        {/* </CardContent> */}
      </AccordionContent>
    </AccordionItem>
    // <Card className="mb-4">
    //   <CardHeader className="pb-3">
    //     <CardTitle className="text-sm uppercase tracking-wide border-b-2 border-secondary pb-3">
    //       {title}
    //     </CardTitle>
    //   </CardHeader>
    // </Card>
  );

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-3 mb-1">
            <ClipboardList className="w-6 h-6 text-violet-500" />
            Daily Status Report
          </h2>
          <p className="text-muted-foreground">
            {formatDateForSubject(reportDate)}
          </p>
        </div>
        <Button
          variant={showSettings ? "secondary" : "outline"}
          size="sm"
          onClick={() => setShowSettings(!showSettings)}
        >
          <Settings className="w-4 h-4" />
          {showSettings ? "Hide Settings" : "Settings"}
        </Button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="mb-6 border-violet-200 bg-violet-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm uppercase tracking-wide">
                Report Settings
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={resetToDefaults}>
                <RotateCcw className="w-4 h-4" />
                Reset to Defaults
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Report Date */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Report Date
              </label>
              <Input
                type="date"
                value={preferences.reportDate}
                onChange={(e) => updatePreference("reportDate", e.target.value)}
                className="max-w-xs"
              />
            </div>

            {/* CC Recipients */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                CC Recipients
              </label>
              {preferences.cc.map((email, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => updateCc(index, e.target.value)}
                    placeholder="email@example.com"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => removeCc(index)}
                    disabled={preferences.cc.length <= 1}
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-500"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addCc}
                className="border-dashed w-fit"
              >
                <Plus className="w-4 h-4" />
                Add CC
              </Button>
            </div>

            {/* Personal Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Name
                </label>
                <Input
                  value={preferences.name}
                  onChange={(e) => updatePreference("name", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Designation
                </label>
                <Input
                  value={preferences.designation}
                  onChange={(e) =>
                    updatePreference("designation", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Emp Code
                </label>
                <Input
                  value={preferences.empCode}
                  onChange={(e) => updatePreference("empCode", e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Project
                </label>
                <Input
                  value={preferences.projectName}
                  onChange={(e) =>
                    updatePreference("projectName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  CRM/PM/RM
                </label>
                <Input
                  value={preferences.crmPmRmName}
                  onChange={(e) =>
                    updatePreference("crmPmRmName", e.target.value)
                  }
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Work Time
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    value={preferences.startTime}
                    onChange={(e) =>
                      updatePreference("startTime", e.target.value)
                    }
                    placeholder="10:00 AM"
                    className="flex-1"
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    value={preferences.leavingTime}
                    onChange={(e) =>
                      updatePreference("leavingTime", e.target.value)
                    }
                    placeholder="7:00 PM"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Email Preview Card */}
      <Card className="bg-linear-to-br from-violet-500 to-purple-700 text-white mb-6 border-0">
        <CardContent className="p-5 space-y-2">
          <div className="flex">
            <span className="font-semibold min-w-20 opacity-90">From:</span>
            <span className="flex-1">{userEmail || EMAIL_CONFIG.from}</span>
          </div>
          <div className="flex">
            <span className="font-semibold min-w-20 opacity-90">To:</span>
            <span className="flex-1">{EMAIL_CONFIG.to}</span>
          </div>
          <div className="flex">
            <span className="font-semibold min-w-20 opacity-90">CC:</span>
            <span className="flex-1">
              {preferences.cc.filter((e) => e.trim()).join(", ") || "None"}
            </span>
          </div>
          <div className="flex">
            <span className="font-semibold min-w-20 opacity-90">Subject:</span>
            <span className="flex-1">{generateSubject(reportDate)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Static Info Card */}
      <Card className="mb-6">
        <CardContent className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Name
              </span>
              <span className="text-sm font-medium text-foreground">
                {preferences.name}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Designation
              </span>
              <span className="text-sm font-medium text-foreground">
                {preferences.designation}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Emp Code
              </span>
              <span className="text-sm font-medium text-foreground">
                {preferences.empCode}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Project
              </span>
              <span className="text-sm font-medium text-foreground">
                {preferences.projectName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                CRM/PM/RM
              </span>
              <span className="text-sm font-medium text-foreground">
                {preferences.crmPmRmName}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Time
              </span>
              <span className="text-sm font-medium text-foreground">
                {preferences.startTime} - {preferences.leavingTime}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
      <Accordion
        type="single"
        collapsible
        defaultValue="activitiesPerformed"
        // className="max-w-lg"
      >
        {/* Task Sections */}
        {renderTaskSection(
          "Incomplete Tasks of Previous Day",
          "incompletePrevious",
        )}
        {renderTaskSection("New Tasks for the Day", "newTasks")}
        {renderTaskSection("Activities Performed", "activitiesPerformed")}
        {renderTaskSection(
          "Incomplete Tasks at End of Day",
          "incompleteEndOfDay",
        )}
      </Accordion>

      {/* Submit Button */}
      <Button
        onClick={handlePreviewEmail}
        variant="gradient"
        size="lg"
        className="w-full mt-4"
      >
        <Send className="w-5 h-5" />
        Preview & Send DSR Email
      </Button>

      {/* Email Preview Modal */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent
          onClose={() => setShowPreview(false)}
          className="max-w-3xl"
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5 text-violet-500" />
              Email Preview
            </DialogTitle>
          </DialogHeader>
          <DialogBody className="space-y-4">
            {/* Email Headers */}
            <div className="bg-secondary/50 rounded-xl p-4 space-y-2">
              <div className="flex">
                <span className="font-semibold min-w-20 text-muted-foreground">
                  From:
                </span>
                <span className="text-foreground">
                  {userEmail || EMAIL_CONFIG.from}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-20 text-muted-foreground">
                  To:
                </span>
                <span className="text-foreground">{EMAIL_CONFIG.to}</span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-20 text-muted-foreground">
                  CC:
                </span>
                <span className="text-foreground">
                  {ccList.join(", ") || "None"}
                </span>
              </div>
              <div className="flex">
                <span className="font-semibold min-w-20 text-muted-foreground">
                  Subject:
                </span>
                <span className="text-foreground font-medium">
                  {emailSubject}
                </span>
              </div>
            </div>

            {/* Email Body */}
            <div className="border border-border rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Email Body
              </p>
              <pre className="text-sm text-foreground whitespace-pre-wrap font-mono bg-muted/30 rounded-lg p-4 max-h-80 overflow-auto">
                {emailBody}
              </pre>
            </div>
          </DialogBody>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPreview(false)}
              disabled={isSending}
            >
              Cancel
            </Button>
            <Button
              variant="gradient"
              onClick={handleSendEmail}
              disabled={isSending}
            >
              <Send className="w-4 h-4" />
              {isSending ? "Sending..." : "Send Email"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Status Message */}
      {status && (
        <Card
          className={`mt-4 text-center ${
            status.includes("Error")
              ? "bg-red-50 text-red-600 border-red-200"
              : "bg-green-50 text-green-600 border-green-200"
          }`}
        >
          <CardContent className="p-4 font-medium">{status}</CardContent>
        </Card>
      )}
    </div>
  );
}
