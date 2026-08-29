import { UiSiteFooter } from "@/components/UiSiteFooter";
import { UiSiteNavbar } from "@/components/UiSiteNavbar";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <UiSiteNavbar />
      <div className="flex-1">{children}</div>
      <UiSiteFooter />
    </>
  );
}
