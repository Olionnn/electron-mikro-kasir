
import React from "react";
import cx from "../utils/utils";

export const Card = ({ title, action, children, className = "" }) => (
    <div className={cx("bg-white rounded-xl border border-gray-200 shadow-sm", className)}>
      {(title || action) && (
        <div className="flex items-center justify-between px-4 py-3 border-b">
          {typeof title === "string" ? (
            <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
          ) : (
            title
          )}
          {action}
        </div>
      )}
      <div className="p-4">{children}</div>
    </div>
  );
