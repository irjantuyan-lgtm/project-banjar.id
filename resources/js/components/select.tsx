// resources/js/components/ui/select.tsx
import React from "react";

export const Select = ({ children, onValueChange, value, disabled }: any) => (
  <div className="relative">
    {React.Children.map(children, (child) => 
      // Tambahkan "as any" di akhir kurung kurawal
      React.cloneElement(child as React.ReactElement, { onValueChange, value, disabled } as any)
    )}
  </div>
);

export const SelectTrigger = ({ children, disabled, className }: any) => (
  <select 
    disabled={disabled} 
    className={className}
    onChange={(e) => {
        // Ini untuk menangkap perubahan dan meneruskannya ke fungsi onValueChange
        if (children.props.onValueChange) children.props.onValueChange(e.target.value);
    }}
  >
    {children}
  </select>
);

export const SelectValue = ({ placeholder }: any) => <option value="">{placeholder}</option>;
export const SelectContent = ({ children }: any) => <>{children}</>;
export const SelectItem = ({ value, children }: any) => <option value={value}>{children}</option>;