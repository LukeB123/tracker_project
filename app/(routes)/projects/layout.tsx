import NextBreadcrumb from "@/app/_components/bread-crumbs.tsx/breadcrumbs";

export default function ProjectsLayout({
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
