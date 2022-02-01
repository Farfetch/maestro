import "react-quill/dist/quill.snow.css";

import React, { useState } from "react";
import ReactQuill from "react-quill";

const RunNotesEditor = ({}) => {
  const [value, setValue] = useState("");

  return (
    <div>
      <ReactQuill
        style={{ minHeight: "400px" }}
        theme="snow"
        value={value}
        onChange={setValue}
      />
    </div>
  );
};

export default RunNotesEditor;
