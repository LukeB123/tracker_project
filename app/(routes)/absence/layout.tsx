import NextBreadcrumb from "@/app/_components/ui/breadcrumbs";

export default function AbsenceLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NextBreadcrumb />

      {children}
    </>
  );
}
