import { ComponentRef, forwardRef } from "react";

export type MultiSelectProps = {
  options: string[];
};
export type MultiSelectRef = ComponentRef<"input">;

export const MultiSelect = forwardRef<MultiSelectRef, MultiSelectProps>(
  (props, ref) => {
    return (
      <div>
        <input type="text" ref={ref} {...props} />
      </div>
    );
  }
);
