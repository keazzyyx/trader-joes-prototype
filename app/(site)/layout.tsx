import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

/** The marketing site: header and footer around every page. /tag and /present live outside this group. */
export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
