import type { Delta } from "quill";
import Quill from "quill";
import "quill/dist/quill.snow.css";

import React, { useCallback, useEffect, useState } from "react";

interface QuilTextEditorProps {
  content?: string;
  saveContent?: (content: string) => void;
  readOnly?: boolean;
}

//TODO FIX THIS DRY
export default function SimpleTextEditor<QuilTextEditorProps>({
  content = "",
  saveContent = (c: string) => {},
  readOnly = false,
}) {
  const [quill, setQuill] = useState<Quill | null>(null);

  // Detect Quill content changes
  useEffect(() => {
    if (!quill) return;

    const handler = (delta: Delta, oldDelta: Delta, source: Object) => {
      if (source !== "user") return;

      saveContent(quill.root.innerHTML);
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
        toolbar: [
          ["bold", "italic"],
          ["link", "blockquote", "code-block", "image"],
          [{ list: "ordered" }, { list: "bullet" }],
        ],
      },
      readOnly,
    });

    quillEditor.root.innerHTML = content;

    setQuill(quillEditor);
  }, []);

  return (
    <article className="simple-quil-text-editor">
      <div className="quitl-container" ref={wrapperRef}></div>
    </article>
  );
}
