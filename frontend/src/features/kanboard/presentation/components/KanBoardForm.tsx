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
    <article className="container py-4">
      <div style={{ maxWidth: "910px" }}>
        <h1 className="fs-5 mb-4 fw-normal">Project settings</h1>

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Project name */}
          <div className="mb-3">
            <label htmlFor="name" className="form-label mb-1" style={{ fontSize: "13px", fontWeight: 600 }}>
              Project name
            </label>

            <input
              id="name"
              type="text"
              className={`form-control form-control-sm ${errors.name ? "is-invalid" : ""}`}
              style={{ maxWidth: "540px" }}
              {...register("name", {
                required: "Project name is required",
                maxLength: {
                  value: 255,
                  message: "Maximum 255 characters",
                },
              })}
            />

            {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
          </div>

          {/* Colour */}
          <div className="mb-4">
            <label htmlFor="color" className="form-label mb-1" style={{ fontSize: "13px", fontWeight: 600 }}>
              Colour
            </label>

            <input
              id="color"
              type="color"
              className="form-control form-control-color form-control-sm"
              
              {...register("color")}
            />
          </div>

          <button type="submit" className="btn btn-success btn-sm px-3">
            {submitButtonValue}
          </button>
        </form>
      </div>
    </article>
  );
}
