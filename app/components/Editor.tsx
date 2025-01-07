import React, { useState, useEffect } from "react";
import "./Editor.css";
import { ControllerRenderProps } from "react-hook-form";

interface RichTextEditorProps {
  field: ControllerRenderProps<any, string>;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ field }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [ReactQuill, setReactQuill] = useState<any>(null);
  const quillRef = React.useRef<any>();

  useEffect(() => {
    setIsMounted(true);
    import("react-quill").then((mod) => setReactQuill(() => mod.default));
  }, []);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike"],
      ["link", "image"],
      [{ color: [] }, { background: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "bold",
    "italic",
    "underline",
    "strike",
    "color",
    "background",
    "list",
    "bullet",
    "align",
    "link",
    "image",
  ];

  if (!isMounted) {
    return <div>Loading editor...</div>;
  }

  if (!ReactQuill) {
    return <div>Loading editor...</div>;
  }
  // onBlur on div is required (Quill issue). Ohterwise, visuall error will not ocur when clicking file upload / select. But it works fine when clicking outside the editor / any input field.
  return (
    <div onBlur={field?.onBlur}>
      <ReactQuill
        theme="snow"
        modules={modules}
        formats={formats}
        value={field.value}
        onChange={(content: string) => {
          field.onChange(content);
        }}
        onBlur={field.onBlur}
        ref={quillRef}
      />
    </div>
  );
};

export default RichTextEditor;
