import Icon from "@/app/_components/ui/icons";

interface ExpandCollapseButtonProps {
  expanded: boolean;
  handleExpandClick: (prompt: boolean) => void;
  size?: string;
}

export default function ExpandCollapseButton({
  expanded,
  handleExpandClick,
  size = "10px",
}: ExpandCollapseButtonProps) {
  return (
    <button
      onClick={() => handleExpandClick(expanded)}
      className="absolute bottom-1 right-1 text-xs text-grey-500 flex justify-between gap-1 items-center "
    >
      {expanded ? "Collapse" : "Expand"}

      {!expanded && (
        <div className={"animate-dropDownClosed"}>
          <Icon
            iconName="downArrow"
            width="10px"
            height="10px"
            color="#5f249f"
          />
        </div>
      )}

      {expanded && (
        <div className={"animate-dropDownOpened"}>
          <Icon iconName="upArrow" width={size} height={size} color="#5f249f" />
        </div>
      )}
    </button>
  );
}
