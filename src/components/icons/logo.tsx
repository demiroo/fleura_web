import Image from "next/image";

export default function LogoIcon(props: React.ComponentProps<"div">) {
  return (
    <div {...props}>
      <Image
        src="/logo.png"
        alt="Fleura Logo"
        width={120}
        height={32}
        className="h-8 w-auto"
        priority
      />
    </div>
  );
}
