import cx from "../utils/utils";
import React from "react";


export const Badge = ({ children, className = "" }) => (
    <span className={cx("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", className)}>
      {children}
    </span>
  );
  