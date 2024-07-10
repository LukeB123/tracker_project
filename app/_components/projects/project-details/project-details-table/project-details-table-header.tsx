interface ProjectDetailsTableHeaderParams {
  title: string;
}

export default function ProjectDetailsFormHeader({
  title,
}: ProjectDetailsTableHeaderParams) {
  return (
    <>
      <header className="text-2xl text-center bg-white w-full">
        <h1 className="py-4">
          <span className="text-purple-700 font-semibold">{title}</span> Details
          Page
        </h1>
      </header>
    </>
  );
}
