/** Bare pages: no header, no footer. Shelf tags, the print sheet and the presenter screen. */
export default function BareLayout({ children }: { children: React.ReactNode }) {
  return <main id="main" className="flex-1">{children}</main>;
}
