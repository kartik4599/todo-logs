import type { TasksState, EmailConfig, DsrPreferences } from "../types";

/**
 * Format tasks array into numbered list string
 */
export const formatTaskList = (tasks: string[]): string => {
  return tasks.map((task, index) => `${index + 1}. ${task}`).join("\n");
};

/**
 * Generate DSR email body from tasks data and preferences
 */
export const generateEmailBody = (
  data: TasksState,
  prefs: DsrPreferences,
): string => {
  return `NAME: ${prefs.name}
DESIGNATION: ${prefs.designation}

EMP CODE: ${prefs.empCode}

PROJECT NAME: ${prefs.projectName}

CRM/PM/RM NAME: ${prefs.crmPmRmName}

PARALLEL REPORTING TO: 

START TIME: ${prefs.startTime}

LEAVING TIME: ${prefs.leavingTime}

ACTIVITIES
INCOMPLETE TASKS OF THE PREVIOUS DAY
${formatTaskList(data.incompletePrevious)}

NEW TASKS FOR THE DAY
${formatTaskList(data.newTasks)}

ACTIVITIES PERFORMED
${formatTaskList(data.activitiesPerformed)}

INCOMPLETE TASKS AT THE END OF DAY
${formatTaskList(data.incompleteEndOfDay)}`;
};

/**
 * Create MIME message for Gmail API
 */
export const createMimeMessage = (
  config: EmailConfig,
  subject: string,
  body: string,
): string => {
  return [
    'Content-Type: text/plain; charset="UTF-8"',
    "MIME-Version: 1.0",
    "Content-Transfer-Encoding: 7bit",
    `to: ${config.to}`,
    `cc: ${config.cc.join(", ")}`,
    `from: ${config.from}`,
    `subject: ${subject}`,
    "",
    body,
  ].join("\n");
};

/**
 * Encode message to base64url format for Gmail API
 */
export const encodeToBase64Url = (message: string): string => {
  return btoa(unescape(encodeURIComponent(message)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

/**
 * Send email via Gmail API
 */
export const sendGmailMessage = async (
  token: string,
  encodedMessage: string,
): Promise<{ id: string }> => {
  const res = await fetch(
    "https://gmail.googleapis.com/gmail/v1/users/me/messages/send",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ raw: encodedMessage }),
    },
  );

  if (!res.ok) {
    throw new Error(await res.text());
  }

  return res.json();
};
