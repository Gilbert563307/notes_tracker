import React, { useCallback, useEffect, useState } from "react";
import Quill, { Delta } from "quill";
import "quill/dist/quill.snow.css";
import "../css/style.css";

// Register 'Poppins' font with Quill
const Font = Quill.import("formats/font");

(Font as { whitelist: string[] }).whitelist = ["sans-serif", "serif", "monospace", "Poppins"];

Quill.register(Font, true);

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: ["sans-serif", "serif", "monospace", "Poppins"] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline", "strike"],
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ direction: "rtl" }], // text direction
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ align: [] }],
  ["image", "blockquote", "code-block", "link", "video"],
  ["clean"], // remove formatting button
];

interface QuilTextEditorProps {
  content?: string;
  saveText?: (content: string) => void;
  readOnly?: boolean;
}

/**
 * Rich text editor component using Quill, with custom font options,
 * dynamic content updates, and a read-only option.
 */
const QuilTextEditor: React.FC<QuilTextEditorProps> = ({ content = "", saveText = () => {}, readOnly = false }) => {
  const [quill, setQuill] = useState<Quill | null>(null);

  // Detect Quill content changes
  useEffect(() => {
    if (!quill) return;

    const handler = (delta: Delta, oldDelta: Delta, source: Object) => {
      if (source !== "user") return;

      saveText(quill.root.innerHTML);
    };

    quill.on("text-change", handler);

    return () => {
      quill.off("text-change", handler);
    };
  }, [quill]);

  /**
   * Update editor content when `content` prop changes
   */
  useEffect(() => {
    if (quill && content !== quill.root.innerHTML) {
      quill.root.innerHTML = content;
    }
  }, [content, quill]);

  const wrapperRef = useCallback((wrapper: HTMLDivElement | null) => {
    if (!wrapper) return;

    wrapper.innerHTML = "";

    const editor = document.createElement("div");
    wrapper.append(editor);

    const quillEditor = new Quill(editor, {
      theme: "snow",
      modules: {
        toolbar: TOOLBAR_OPTIONS,
      },
      readOnly,
    });

    quillEditor.root.innerHTML = content;

    setQuill(quillEditor);
  }, []);

  return (
    <article className="quil-text-editor">
      <div className="container" ref={wrapperRef}></div>
    </article>
  );
};

export default QuilTextEditor;
