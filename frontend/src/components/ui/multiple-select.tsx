"use client";

import {
  HTMLAttributes,
  PropsWithChildren,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import * as React from "react";

export type TTag = {
  key: string;
  name: string;
};

type MultipleSelectProps = {
  tags: TTag[];
  customTag?: (item: TTag) => ReactNode | string;
  onChange?: (value: TTag[]) => void;
  defaultValue?: TTag[];
  width?: string;
};

export const MultipleSelect = ({
  tags,
  customTag,
  onChange,
  defaultValue,
  width,
}: MultipleSelectProps) => {
  // Initialize with defaultValue or an empty array
  const [selected, setSelected] = useState<TTag[]>(defaultValue ?? []);
  const [focused, setFocused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // **NEW EFFECT**: Update the selected state whenever defaultValue changes.
  useEffect(() => {
    setSelected(defaultValue ?? []);
  }, [defaultValue]);

  // Whenever selected changes, scroll the container and inform the parent.
  useEffect(() => {
    if (containerRef?.current) {
      containerRef.current.scrollBy({
        left: containerRef.current.scrollWidth,
        behavior: "smooth",
      });
    }
    onValueChange(selected);
  }, [selected]);

  const onValueChange = (value: TTag[]) => {
    onChange?.(value);
  };

  const onSelect = (item: TTag) => {
    setSelected((prev) => [...prev, item]);
  };

  const onDeselect = (item: TTag) => {
    setSelected((prev) => prev.filter((i) => i.key !== item.key));
  };

  return (
    <AnimatePresence mode={"popLayout"}>
      <div
        className={`flex  flex-col gap-2 min-h-[50px]`}
        tabIndex={0}
        style={{ width }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {/* Selected Tags Section */}
        <motion.div
          layout
          ref={containerRef}
          className="selected no-scrollbar flex h-12 w-full items-center overflow-y-hidden overflow-x-scroll scroll-smooth rounded-md border border-solid border-gray-200 bg-gray-50 p-2"
        >
          <motion.div layout className="flex items-center gap-2">
            {console.log("selected", selected)}
            {selected?.map((item) => (
              <Tag name={item.key} key={item.key} className={"bg-white shadow"}>
                <div className="flex items-center gap-2">
                  <motion.span layout className={"text-nowrap"}>
                    {item.name}
                  </motion.span>
                  <button
                    type="button"
                    onClick={() => onDeselect(item)}
                    className="cursor-pointer"
                  >
                    <X size={14} />
                  </button>
                </div>
              </Tag>
            ))}
            <input
              type="text"
              className="ml-2 outline-none bg-transparent flex-none w-20"
              onFocus={() => setFocused(true)}
            />
          </motion.div>
        </motion.div>

        {/* Dropdown: only show if the container is focused and there are tags left to select */}
        {focused && tags.length > selected.length && (
          <div className="flex w-full flex-wrap gap-2 rounded-md border border-solid border-gray-200 p-2">
            {tags
              .filter((item) => !selected.some((i) => i.key === item.key))
              .map((item) => (
                <Tag
                  name={item.key}
                  onClick={() => onSelect(item)}
                  key={item.key}
                >
                  {customTag ? (
                    customTag(item)
                  ) : (
                    <motion.span layout className={"text-nowrap"}>
                      {item.name}
                    </motion.span>
                  )}
                </Tag>
              ))}
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};

type TagProps = PropsWithChildren &
  Pick<HTMLAttributes<HTMLDivElement>, "onClick"> & {
    name?: string;
    className?: string;
  };

export const Tag = ({ children, className, name, onClick }: TagProps) => {
  return (
    <motion.div
      layout
      layoutId={name}
      onClick={onClick}
      className={`cursor-pointer rounded-md bg-gray-200 px-2 py-1 text-sm ${className}`}
    >
      {children}
    </motion.div>
  );
};
