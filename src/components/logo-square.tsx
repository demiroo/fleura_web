import clsx from "clsx";
import LogoIcon from "./icons/logo";

export default function LogoSquare({ size }: { size?: "sm" | undefined }) {
  return (
    <div
      className={clsx(
        "flex flex-none items-center justify-center border border-border bg-card rounded-xl",
        {
          "h-[40px] w-[40px]": !size,
          "h-[30px] w-[30px] rounded-lg": size === "sm",
        }
      )}
    >
      <LogoIcon
        className={clsx({
          "h-[20px] w-auto": !size,
          "h-[16px] w-auto": size === "sm",
        })}
      />
    </div>
  );
}
