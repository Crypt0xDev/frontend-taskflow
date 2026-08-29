import type { Metadata } from "next";

import UiCalendarPage from "@/app/modules/calendar/UiCalendarPage";

export const metadata: Metadata = {
  title: "Calendario",
};

export default function CalendarRoute() {
  return <UiCalendarPage />;
}
