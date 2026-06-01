import React, { useState } from "react";
import "../css/style.css";
import SimpleTextEditor from "../../../../shared/features/texteditor/presentation/components/SimpleTextEditor";
import { useForm } from "react-hook-form";
import { kanBoardController } from "../KanBoardController";
import { CreateKanBoardTaskRequest } from "../request/CreateKanBoardTaskRequest";
import { useNavigate } from "react-router";

export default function CreateKanBoardTaskForm({ onClose, kanBoardId }: { onClose: () => void; kanBoardId: string }) {
  const [description, setDescription] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    // setError,
    formState: { errors },
  } = useForm({});

  const navigate = useNavigate();

  async function onSubmit(data: { title: string }) {
    const response = await kanBoardController.createNewTaskInKanBoard(
      new CreateKanBoardTaskRequest({ title: data.title, description: description }, kanBoardId),
    );
    if (response.length === 0) return;
    navigate("/kanboards/read/" + kanBoardId);
    // reset();
    // setDescription("");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="modal show d-block" tabIndex={-1} style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
        <div className="modal-dialog modal-lg modal-dialog-centered" style={{ maxWidth: "800px" }}>
          <div className="modal-content border-0 shadow-sm" style={{ borderRadius: "8px" }}>
            {/* Header - Matching image_e80de3.png */}
            <div className="modal-header border-bottom-0 pt-3 pb-0 px-3 d-flex align-items-center">
              <div className="d-flex align-items-center gap-3">
                <i className="fa-solid fa-arrow-left text-muted" style={{ cursor: "pointer", fontSize: "0.9rem" }}></i>
                <span className="text-dark" style={{ fontSize: "0.9rem", fontWeight: "500" }}>
                  Create new issue
                </span>
              </div>
              <button
                type="button"
                className="btn-close ms-auto"
                style={{ fontSize: "0.7rem" }}
                onClick={onClose}
              ></button>
            </div>

            <div className="modal-body px-4 pt-3">
              {/* Title Input - Simple light border */}
              <div className="mb-3">
                <label className="form-label fw-bold mb-1" style={{ fontSize: "0.85rem" }}>
                  Add a title <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control shadow-none"
                  style={{ borderRadius: "6px", borderColor: "#d0d7de", fontSize: "0.9rem" }}
                  placeholder="Title"
                  autoFocus
                  maxLength={255}
                  {...register("title", {
                    required: "The title cannot be empty",
                    minLength: {
                      value: 4,
                      message: "The title must longer than 4 characters",
                    },
                    maxLength: {
                      value: 255,
                      message: "The title cannot be longer than 255 characters",
                    },
                  })}
                />
                {errors.title && <div className="invalid-feedback d-block">{errors.title.message}</div>}
              </div>

              {/* Description Area */}
              <div className="mb-3 create-task-kanboard-text-editor">
                <label className="form-label fw-bold mb-1" style={{ fontSize: "0.85rem" }} htmlFor="description">
                  Add a description
                </label>
                <input type="hidden" name="description"></input>
                <SimpleTextEditor content={description} saveContent={setDescription} />
              </div>

              {/* Action Buttons - These are NOT rounded-pill in screenshot */}
              <div className="d-flex flex-wrap gap-2 mb-4">
                <button
                  className="btn btn-sm bg-white border-dashed text-muted px-2 py-1"
                  style={{ border: "1px dashed #d0d7de", borderRadius: "6px", fontSize: "0.8rem" }}
                >
                  <i className="fa-solid fa-user-group me-1"></i> Assignee
                </button>
                <button
                  className="btn btn-sm bg-white border-dashed text-muted px-2 py-1"
                  style={{ border: "1px dashed #d0d7de", borderRadius: "6px", fontSize: "0.8rem" }}
                >
                  <i className="fa-solid fa-tag me-1"></i> Label
                </button>
              </div>
            </div>

            {/* Footer - Precise button colors from  */}
            <div className="modal-footer border-0 pb-3 px-4 d-flex justify-content-end align-items-center gap-3">
              <button
                className="btn btn-outline-secondary border-0 px-3"
                style={{
                  fontSize: "0.85rem",
                  backgroundColor: "#f6f8fa",
                  color: "#1f2328",
                  borderRadius: "6px",
                  border: "1px solid #d0d7de",
                }}
                onClick={onClose}
              >
                Cancel
              </button>

              <div className="btn-group shadow-sm">
                <button
                  className="btn btn-success px-3  border-0"
                  style={{ backgroundColor: "#1f883d", fontSize: "0.85rem", borderRadius: "6px 0 0 6px" }}
                >
                  Create
                </button>
                <button
                  className="btn btn-success px-2 border-0"
                  style={{ backgroundColor: "#1a7f37", borderLeft: "1px solid #ffffff33", borderRadius: "0 6px 6px 0" }}
                >
                  <i className="fa-solid fa-caret-down" style={{ fontSize: "0.7rem" }}></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
