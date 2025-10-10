import type {SVGProps} from "react";

import {cn} from "@heroui/theme";

import {Isotipo} from "./isotipo";

const Logotipo = ({className, height, ...props}: SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden
    className={cn("text-foreground", className)}
    fill="none"
    focusable={false}
    height={height ?? 19}
    viewBox="0 0 140 44"
    {...props}
  >
    <path
      d="M0.678223 11.3847V24.0405C0.678223 24.6387 0.985697 25.1946 1.49156 25.5109L10.1199 30.9067C11.2698 31.6257 12.7591 30.796 12.7591 29.4363V18.7981C12.7591 18.186 13.0808 17.6194 13.6055 17.3074L18.8688 14.1785V41.4437C18.8688 42.7988 20.3491 43.6293 21.4993 42.9195L30.4049 37.4229C30.9157 37.1076 31.2269 36.549 31.2269 35.9471V9.76484C31.2269 8.41634 29.7595 7.58483 28.609 8.28139L18.8688 14.1785V2.55643C18.8688 1.21158 17.4085 0.379537 16.2579 1.06878L1.51975 9.89703C0.997853 10.2097 0.678223 10.7747 0.678223 11.3847Z"
      fill="currentColor"
    />
    <path
      d="M63.8768 24.0707C63.8768 20.4817 62.4083 18.8253 59.4714 18.8253C56.1081 18.8253 53.7395 21.0799 53.7395 26.1412V37.7363H47.6761V5.52769H53.7395V17.3069C55.208 14.9142 57.6239 13.7179 60.9399 13.7179C66.5769 13.7179 69.8929 17.1688 69.8929 22.9664V37.7363H63.8768V24.0707Z"
      fill="currentColor"
    />
    <path
      d="M84.9001 38.4725C77.3682 38.4725 72.5837 33.5952 72.5837 26.0952C72.5837 18.6872 77.3208 13.7179 84.9001 13.7179C93.0951 13.7179 97.548 19.5154 96.3163 27.6596H78.6472C78.9787 31.5247 81.2525 33.7333 84.9001 33.7333C87.8844 33.7333 89.6845 32.2149 90.1582 30.6964H96.1742C95.2268 35.2057 91.0582 38.4725 84.9001 38.4725ZM78.7893 23.6566H90.4424C90.395 20.4817 88.3107 18.3191 84.7579 18.3191C81.5841 18.3191 79.3577 20.1596 78.7893 23.6566Z"
      fill="currentColor"
    />
    <path
      d="M99.623 20.3437C99.623 16.5246 101.755 14.4541 105.829 14.4541H113.597V19.4234H105.686V37.7363H99.623V20.3437Z"
      fill="currentColor"
    />
    <path
      d="M126.864 38.4725C119.19 38.4725 114.31 33.5492 114.31 26.0952C114.31 18.6412 119.19 13.7179 126.864 13.7179C134.443 13.7179 139.322 18.6412 139.322 26.0952C139.322 33.5492 134.443 38.4725 126.864 38.4725ZM126.864 33.4572C130.653 33.4572 133.164 30.5584 133.164 26.0952C133.164 21.632 130.653 18.6872 126.864 18.6872C123.027 18.6872 120.516 21.632 120.516 26.0952C120.516 30.5584 123.027 33.4572 126.864 33.4572Z"
      fill="currentColor"
    />
  </svg>
);

export const Logo = ({
  autoResize = true,
  className,
  height = 28,
  isCompact = false,
  isWhite = false,
  isotipoHeight = 28,
}: SVGProps<SVGSVGElement> & {
  autoResize?: boolean;
  isCompact?: boolean;
  isWhite?: boolean;
  isotipoHeight?: number;
  height?: number;
  className?: string;
}) => {
  if (isCompact) {
    return (
      <Isotipo
        className={cn("text-black dark:text-white", className)}
        height={isotipoHeight + 4}
        white={isWhite}
      />
    );
  }

  return (
    <>
      <Isotipo
        height={isotipoHeight}
        className={cn(
          "border-1 border-default-200 rounded-small hidden text-black dark:text-white",
          {
            "block sm:hidden": autoResize,
          },
        )}
      />
      <Logotipo
        height={height}
        className={cn(
          {
            "hidden sm:block": autoResize,
          },
          className,
        )}
      />
    </>
  );
};

export {Logotipo};
