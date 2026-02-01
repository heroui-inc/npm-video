"use client";

import type {FC} from "react";

import {useTheme} from "next-themes";
import {useCallback, useEffect, useState} from "react";

import {Iconify} from "./iconify";

export interface ThemeSwitchProps {
  className?: string;
}

export const ThemeToggle: FC<ThemeSwitchProps> = ({className}) => {
  const {setTheme, theme} = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = mounted ? theme : "light";
  const isLight = currentTheme === "light";

  const onChange = useCallback(
    (isSelected: boolean) => {
      setTheme(isSelected ? "light" : "dark");
    },
    [setTheme],
  );

  return (
    <button
      type="button"
      className={`h-8 w-8 cursor-pointer p-1 transition-opacity hover:opacity-80 flex items-center justify-center rounded-lg text-muted ${className || ""}`}
      onClick={() => onChange(!isLight)}
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
    >
      {!isLight || !mounted ? (
        <Iconify icon="moon" width={16} />
      ) : (
        <Iconify icon="sun" width={16} />
      )}
    </button>
  );
};
