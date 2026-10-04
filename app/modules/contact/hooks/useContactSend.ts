"use client";

import { useCallback } from "react";
import { toast } from "sonner";

import type { ContactValues } from "../schema";
import { serviceContactSend } from "../services";

export function useContactSend() {
  const send = useCallback(async (values: ContactValues) => {
    const { message } = await serviceContactSend(values);
    toast.success(message);
  }, []);

  return { send };
}
