import { useEffect } from "react";
import type { KanBoard } from "../../domain/KanBoard";
import { useForm } from "react-hook-form";

type KanBoardFormType = {
  onSubmit: (data: { name: string; color: string }) => void;
  board: KanBoard;
  submitButtonValue: string;
};

export default function KanBoardForm({ onSubmit, board, submitButtonValue }: KanBoardFormType) {
  const values = { name: "", color: "" };
  const {
    register,
    handleSubmit,
    reset,
    // setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      color: "#000000", //back default colour
    },
    values,
  });

  //https://react-hook-form.com/docs/useform/reset
  //https://react-hook-form.com/docs/useform#defaultValues
  useEffect(() => {
    reset({
      name: board.getName(),
      color: board.getColor() || "#000000",
    });
  }, [board]);

  return (
    <article className="create-kanban-article mx-2">
      <form className="d-flex flex-column g-3" onSubmit={handleSubmit(onSubmit)}>
        {/* start name  */}
        <div className="col-12 mb-2">
          <label htmlFor="name" className="form-label">
            Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.name && errors.name.type ? "is-invalid" : ""}`}
            id="name"
            aria-describedby="name"
            maxLength={255}
            {...register("name", {
              required: "The name cannot be empty",
              minLength: {
                value: 1,
                message: "The name must longer than 4 characters",
              },
              maxLength: {
                value: 255,
                message: "The name cannot be longer than 255 characters",
              },
            })}
          />
          {errors.name && <div className="invalid-feedback d-block">{errors.name.message}</div>}
        </div>
        {/* end name  */}
        {/* start color picker */}
        <div className="col-12 mb-2">
          <label htmlFor="ColorInput" className="form-label">
            Colour
          </label>
          <input
            type="color"
            className="form-control form-control-color"
            id="ColorInput"
            defaultValue="#563d7c"
            {...register("color")}
            title="Choose your color"
          ></input>
        </div>
        {/* end color picker */}
        <div className="col-12 mt-3">
          <input
            type="submit"
            name="submit"
            value={submitButtonValue}
            className="add-task-button task-btn-plain"
          ></input>
        </div>
        {board.getId() ? (
          <div className="kanboard-float-end">
            <DeleteKanBoardButton kanBoardId={board.getId()} />
          </div>
        ) : (
          ""
        )}
      </form>
    </article>
  );
}
