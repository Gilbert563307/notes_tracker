import { useEffect } from "react";
import type { KanBoard } from "../../domain/KanBoard";
import { useForm } from "react-hook-form";

type KanBoardFormType = {
  onSubmit: (data: { name: string; color: string }) => void;
  board: KanBoard;
  submitButtonValue: string;
};

export default function KanBoardForm({ onSubmit, board, submitButtonValue }: KanBoardFormType) {
  const values: { name: string; color: string } = { name: "", color: "" };
  const DEFAULT_BLACK_HEXCODE: string = "#000000";
  const {
    register,
    handleSubmit,
    reset,
    // setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      color: DEFAULT_BLACK_HEXCODE, //back default colour
    },
    values,
  });

  //https://react-hook-form.com/docs/useform/reset
  //https://react-hook-form.com/docs/useform#defaultValues
  useEffect(() => {
    reset({
      name: board.getName(),
      color: board.getColor() || DEFAULT_BLACK_HEXCODE,
    });
  }, [board, reset]);

  return (
    <article className="container py-3 mt-1">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="fs-4 mb-4">Project settings</h2>

          <form className="d-flex flex-column" onSubmit={handleSubmit(onSubmit)}>
            {/* Project Name */}
            <div className="mb-4">
              <label htmlFor="name" className="form-label fw-semibold">
                Project name
              </label>

              <input
                type="text"
                id="name"
                className={`form-control ${errors.name ? "is-invalid" : ""}`}
                placeholder="Enter project name"
                maxLength={255}
                {...register("name", {
                  required: "Project name is required",
                  minLength: {
                    value: 1,
                    message: "Project name is too short",
                  },
                  maxLength: {
                    value: 255,
                    message: "Project name cannot exceed 255 characters",
                  },
                })}
              />

              {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
            </div>

            {/* Colour Picker */}
            <div className="mb-4">
              <label htmlFor="color" className="form-label fw-semibold">
                Colour
              </label>

              <input
                type="color"
                id="color"
                className="form-control form-control-color"
                title="Choose project colour"
                {...register("color")}
              />
            </div>

            {/* Submit */}
            <div>
              <button type="submit" className="btn btn-success px-4">
                {submitButtonValue}
              </button>
            </div>
          </form>
        </div>
      </div>
    </article>
  );
}
