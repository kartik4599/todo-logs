import { useState, useCallback, useEffect } from "react";
import type { DsrPreferences } from "../types";
import { STATIC_INFO, EMAIL_CONFIG } from "../config";

const STORAGE_KEY = "dsr_preferences";

const getDefaultPreferences = (): DsrPreferences => ({
  cc: EMAIL_CONFIG.cc,
  reportDate: new Date().toISOString().split("T")[0],
  name: STATIC_INFO.name,
  designation: STATIC_INFO.designation,
  empCode: STATIC_INFO.empCode,
  projectName: STATIC_INFO.projectName,
  crmPmRmName: STATIC_INFO.crmPmRmName,
  startTime: STATIC_INFO.startTime,
  leavingTime: STATIC_INFO.leavingTime,
});

const loadPreferences = (): DsrPreferences => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Update reportDate to today if it's a new day
      return {
        ...getDefaultPreferences(),
        ...parsed,
        reportDate: new Date().toISOString().split("T")[0],
      };
    }
  } catch (e) {
    console.error("Failed to load DSR preferences:", e);
  }
  return getDefaultPreferences();
};

const savePreferences = (prefs: DsrPreferences): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch (e) {
    console.error("Failed to save DSR preferences:", e);
  }
};

export const useDsrPreferences = () => {
  const [preferences, setPreferences] =
    useState<DsrPreferences>(loadPreferences);

  // Save to localStorage whenever preferences change (except reportDate)
  useEffect(() => {
    savePreferences(preferences);
  }, [preferences]);

  const updatePreference = useCallback(
    <K extends keyof DsrPreferences>(key: K, value: DsrPreferences[K]) => {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const updateCc = useCallback((index: number, value: string) => {
    setPreferences((prev) => {
      const newCc = [...prev.cc];
      newCc[index] = value;
      return { ...prev, cc: newCc };
    });
  }, []);

  const addCc = useCallback(() => {
    setPreferences((prev) => ({
      ...prev,
      cc: [...prev.cc, ""],
    }));
  }, []);

  const removeCc = useCallback((index: number) => {
    setPreferences((prev) => ({
      ...prev,
      cc: prev.cc.filter((_, i) => i !== index),
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setPreferences(getDefaultPreferences());
  }, []);

  return {
    preferences,
    updatePreference,
    updateCc,
    addCc,
    removeCc,
    resetToDefaults,
  };
};
