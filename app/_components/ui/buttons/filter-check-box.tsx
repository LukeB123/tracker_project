import Icon from "@/app/_components/ui/icons";

interface FilterCheckBoxProps {
  filterShow: boolean;
  handleClick: (prompt: "show" | "hide") => void;
  children: React.ReactNode;
}

export default function FilterCheckBox({
  filterShow,
  handleClick,
  children,
}: FilterCheckBoxProps) {
  return (
    <div className="flex justify-start items-center">
      {!filterShow && (
        <button className="h-6" onClick={() => handleClick("show")}>
          <Icon
            iconName="checkBoxNotTicked"
            color="#5F249F"
            height="100%"
            width="100%"
          />
        </button>
      )}
      {filterShow && (
        <button className="h-6" onClick={() => handleClick("hide")}>
          <Icon
            iconName="checkBoxTicked"
            color="#5F249F"
            height="100%"
            width="100%"
          />
        </button>
      )}
      {children}
    </div>
  );
}
