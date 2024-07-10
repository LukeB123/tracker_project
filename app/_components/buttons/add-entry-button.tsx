import Icon from "@/app/_components/icons/icons";

interface AddEntryButtonProps {
  isDisabled?: boolean;
}

export default function AddEntryButton({
  isDisabled = false,
}: AddEntryButtonProps) {
  let className =
    "rounded-md w-full h-full flex justify-center items-center disabled:bg-grey-200";

  if (isDisabled) {
    className += " bg-grey-200";
  } else {
    className += " bg-blue-400 hover:bg-blue-500";
  }
  return (
    <div className={className}>
      <div className="h-3/4">
        <Icon iconName="add" color="#fafafa" height="" width="" />
      </div>
    </div>
  );
}
