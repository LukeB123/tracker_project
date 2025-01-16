import Icon from "@/app/_components/icons/icons";

export default function ArrowButton({
  label,
  isDisabled,
  onClick,
}: Readonly<{
  label: string;
  isDisabled: boolean;
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}>) {
  let iconName: "leftArrow" | "rightArrow" = "leftArrow";

  if (label === "right") {
    iconName = "rightArrow";
  }

  let buttonClass =
    "w-full h-full flex justify-center items-center bg-blue-400 hover:bg-blue-500";

  if (isDisabled) {
    buttonClass += " bg-grey-200 hover:bg-grey-200";
  }

  return (
    <button
      className={`${buttonClass} p-2 rounded-md`}
      onClick={onClick}
      disabled={isDisabled}
    >
      <div className="h-5/6 w-5/6">
        <Icon iconName={iconName} color="#fafafa" height="" width="" />
      </div>
    </button>
  );
}
