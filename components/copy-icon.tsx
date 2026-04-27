import { CheckIcon, CopyIcon } from "@phosphor-icons/react";

const iconTransition =
  "transition-[opacity,transform,filter] duration-150 [transition-timing-function:cubic-bezier(0.2,0,0,1)] absolute inset-0";

export function Copy({ copied }: { copied: boolean }) {
  return (
    <span className="relative size-3.5">
      <CopyIcon
        className={`${iconTransition}`}
        style={{
          opacity: copied ? 0 : 1,
          transform: copied ? "scale(0.25)" : "scale(1)",
          filter: copied ? "blur(4px)" : "blur(0px)",
        }}
      />
      <CheckIcon
        className={`${iconTransition}`}
        style={{
          opacity: copied ? 1 : 0,
          transform: copied ? "scale(1)" : "scale(0.25)",
          filter: copied ? "blur(0px)" : "blur(4px)",
        }}
      />
    </span>
  );
}

export default Copy;
