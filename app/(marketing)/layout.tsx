import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

/**
 * Marketing-site chrome lives here, NOT in the root layout. This keeps
 * the Footer/Navbar physically scoped to the public site so portal and
 * admin layouts (which use `fixed inset-0`) never have to fight a
 * stale Footer in document flow.
 */
export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
