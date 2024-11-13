import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";

export const Editor = ({ placeholder, readonly, onChange, onBlur, value }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: readonly ?? false,
    }),
    [placeholder, readonly]
  );

  return (
    <JoditEditor
      className="rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      ref={editor}
      value={value}
      config={config}
      placeholder=""
      tabIndex={1}
      onBlur={onBlur} // preferred to use only this option to update the content for performance reasons
      // onChange={onChange}
    />
  );
};
