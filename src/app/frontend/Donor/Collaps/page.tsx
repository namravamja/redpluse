"use client";
import React from "react";
import { SquareChevronRight } from "lucide-react";
import { useAppDispatch } from "../../../lib/hooks";
import { toggleCollapsed } from "../../../lib/features/collapsed/collapsedSlice";

const Page = () => {
  const dispatch = useAppDispatch();

  const handleCollapsed = () => {
    dispatch(toggleCollapsed());
  };

  return (
    <div>
      <div
        onClick={handleCollapsed}
        className="w-10 h-10 flex items-center justify-center cursor-pointer"
      >
        <SquareChevronRight className="w-8 h-8 text-white" />
      </div>
    </div>
  );
};

export default Page;
