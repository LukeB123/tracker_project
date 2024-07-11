import Link from "next/link";

interface PrimaryButtonParams {
  buttonStyle?: "primary" | "secondary";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  href?: string;
  height?:
    | "h-10"
    | "h-11"
    | "h-12"
    | "h-14"
    | "h-16"
    | "h-20"
    | "h-24"
    | "h-28"
    | "h-30"
    | "h-32"
    | "h-36"
    | "h-40";
  width?:
    | "w-10"
    | "w-11"
    | "w-12"
    | "w-14"
    | "w-16"
    | "w-20"
    | "w-24"
    | "w-28"
    | "w-30"
    | "w-32"
    | "w-36"
    | "w-40";
  children: React.ReactNode;
}

export default function Button({
  buttonStyle = "primary",
  disabled = false,
  type = "button",
  onClick,
  href,
  height,
  width,
  children,
}: PrimaryButtonParams) {
  let className = "text-center py-1 px-2 rounded-md ";

  if (height) className += height;

  if (width) className += width;

  if (buttonStyle === "primary")
    className +=
      " bg-blue-400 hover:bg-blue-500 disabled:bg-grey-200 text-grey-50";

  if (buttonStyle === "secondary")
    className +=
      " border-2 border-blue-400 hover:border-blue-500 hover:bg-grey-100 disabled:bg-white disabled:border-blue-200 disabled:text-grey-500";

  if (!onClick) {
    let content = children;

    if (href && !disabled) content = <Link href={href}>{children}</Link>;

    return (
      <button type={type} className={className} disabled={disabled}>
        {content}
      </button>
    );
  }

  return (
    <button
      type={type}
      className={className}
      onClick={(event) => {}}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
