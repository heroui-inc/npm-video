"use client";

import type {SwitchProps} from "@heroui/switch";
import type {FC} from "react";

import {useSwitch} from "@heroui/switch";
import {cn} from "@heroui/theme";
import {useIsSSR} from "@react-aria/ssr";
import {VisuallyHidden} from "@react-aria/visually-hidden";
import {useTheme} from "next-themes";
import {useCallback} from "react";

import {Iconify} from "./iconify";

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps["classNames"];
}

export const ThemeToggle: FC<ThemeSwitchProps> = ({className, classNames}) => {
  const {setTheme, theme} = useTheme();
  const isSSR = useIsSSR();

  const currentTheme = isSSR ? "light" : theme;

  const onChange = useCallback(() => {
    setTheme(currentTheme === "light" ? "dark" : "light");
  }, [setTheme, currentTheme]);

  const {Component, getBaseProps, getInputProps, getWrapperProps, isSelected, slots} = useSwitch({
    "aria-label": `Switch to ${currentTheme === "light" ? "dark" : "light"} mode`,
    isSelected: currentTheme === "light",
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: cn(
          "h-8 w-8 cursor-pointer p-1 transition-opacity hover:opacity-80",
          className,
          classNames?.base,
        ),
      })}
    >
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: cn(
            [
              "h-auto w-auto",
              "bg-transparent",
              "rounded-lg",
              "flex items-center justify-center",
              "group-data-[selected=true]:bg-transparent",
              "text-default-500! dark:text-default-400!",
              "pt-px",
              "px-0",
              "mx-0",
            ],
            classNames?.wrapper,
          ),
        })}
      >
        {!isSelected || isSSR ? (
          <Iconify icon="moon" width={16} />
        ) : (
          <Iconify icon="sun" width={16} />
        )}
      </div>
    </Component>
  );
};
