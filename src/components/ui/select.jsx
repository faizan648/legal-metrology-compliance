import * as React from "react";
import { cn } from "@/lib/utils";

const Select = ({ value, onValueChange, children }) => {
  return (
    <div className="relative inline-block w-full">
      {React.Children.map(children, (child) => {
        if (child?.type === SelectTrigger) {
          return React.cloneElement(child, { value, onValueChange });
        }
        return child;
      })}
    </div>
  );
};

const SelectTrigger = React.forwardRef(({ className, children, value, onValueChange, ...props }, ref) => {
  // Extract options from SelectContent if nested
  const options = [];
  React.Children.forEach(children, (child) => {
    if (child?.type === SelectContent) {
      React.Children.forEach(child.props.children, (opt) => {
        if (opt?.props) {
          options.push({ value: opt.props.value, label: opt.props.children });
        }
      });
    }
  });

  return (
    <select
      ref={ref}
      value={value}
      onChange={(e) => onValueChange && onValueChange(e.target.value)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer",
        className
      )}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
});
SelectTrigger.displayName = "SelectTrigger";

const SelectValue = ({ placeholder }) => null;

const SelectContent = ({ children }) => <>{children}</>;

const SelectItem = ({ value, children }) => (
  <option value={value}>{children}</option>
);

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };
