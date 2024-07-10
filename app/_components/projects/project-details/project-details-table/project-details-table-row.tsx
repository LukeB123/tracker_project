interface ProjectDetailsTableRowParams {
  label: string;
  value: number | string;
}

export default function ProjectDetailsRow({
  label,
  value,
}: ProjectDetailsTableRowParams) {
  let valueClass =
    "basis-1/2 text-right rounded-md px-2 bg-grey-100 text-purple-700 font-medium py-1 px-2";

  return (
    <div className="flex justify-between items-center">
      <p className="basis-1/2 py-1 pl-2">{label}:</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}
