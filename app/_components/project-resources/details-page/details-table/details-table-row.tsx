interface DetailsTableRowParams {
  label: string;
  value: number | string;
}

export default function DetailsRow({ label, value }: DetailsTableRowParams) {
  let valueClass =
    "basis-1/2 text-right rounded-md bg-grey-100 border-2 text-purple-700 font-medium py-1 px-2";

  return (
    <div className="flex justify-between items-center">
      <p className="basis-1/2 py-1 pl-2">{label}:</p>
      <p className={valueClass}>{value}</p>
    </div>
  );
}
