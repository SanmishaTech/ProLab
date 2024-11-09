import React, { useState, useRef, useMemo, useEffect } from "react";
import JoditEditor from "jodit-react";

export const Editor = ({ placeholder, readonly, onChange, onBlur, value }) => {
  const editor = useRef(null);
  const [content, setContent] = useState("");

  const config = useMemo(
    () => ({
      readonly: readonly ?? false,
      placeholder: placeholder || "Start typing...",
    }),
    [placeholder, readonly]
  );

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={config}
      tabIndex={1}
      onBlur={onBlur} // preferred to use only this option to update the content for performance reasons
      onChange={onChange}
    />
  );
};
