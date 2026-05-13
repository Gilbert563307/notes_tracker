import React, { MouseEventHandler, ReactNode } from "react";
import "../css/bs5modal.css";

export const MODAL_SIZES = {
  NONE: 0,
  SMALL: 1,
  LARGE: 2,
  EXTRA_LARGE: 3,
} as const;

type ModalSize = (typeof MODAL_SIZES)[keyof typeof MODAL_SIZES];

interface BS5ModalProps {
  modal_id: string;
  modal_label: string;
  modal_title: string;
  modal_content: ReactNode;
  modal_footer?: boolean;
  showSaveChanges?: boolean;
  saveChangesClass?: number;
  saveChangesTitle?: string;
  closeModal: MouseEventHandler<HTMLButtonElement>;
  headerCentre?: boolean;
  modalSize?: ModalSize;
  saveChangesFunction?: MouseEventHandler<HTMLButtonElement>;
}

/**
 * Bootstrap 5 Modal Component
 */
export default function BS5Modal({
  modal_id,
  modal_label,
  modal_title,
  modal_content,
  modal_footer = true,
  showSaveChanges = false,
  saveChangesClass = 0,
  saveChangesTitle = "Save changes",
  closeModal,
  headerCentre = false,
  modalSize = MODAL_SIZES.NONE,
  saveChangesFunction,
}: BS5ModalProps): JSX.Element {
  /**
   * Returns Bootstrap modal size class
   */
  const getModalSize = (size: ModalSize): string => {
    const availableModalSizes: Record<ModalSize, string> = {
      [MODAL_SIZES.NONE]: "",
      [MODAL_SIZES.SMALL]: "modal-sm",
      [MODAL_SIZES.LARGE]: "modal-lg",
      [MODAL_SIZES.EXTRA_LARGE]: "modal-xl",
    };

    return availableModalSizes[size] || "";
  };

  /**
   * Returns Bootstrap button class
   */
  const getSaveChangesClass = (btnClass: number): string => {
    const availableBtnClasses: Record<number, string> = {
      0: "btn-primary",
      1: "btn-default",
      2: "btn-secondary",
      3: "btn-success",
      4: "btn-danger",
      5: "btn-warning",
      6: "btn-info",
      7: "btn-light",
      8: "btn-dark",
    };

    return availableBtnClasses[btnClass] || availableBtnClasses[0];
  };

  return (
    <div>
      <div id="modal-overlay"></div>

      <div
        className="modal fade show"
        id={modal_id}
        tabIndex={-1}
        aria-labelledby={`${modal_label}Label`}
        aria-hidden="false"
        style={{ display: "block" }}
      >
        <div className={`modal-dialog ${getModalSize(modalSize)} dialogic-modal-margin`}>
          <div className="modal-content">
            <div className={`modal-header dialogic-modal-header ${headerCentre ? "dialogic-modal-header-centre" : ""}`}>
              <h1 className="modal-title fs-5" id={`${modal_label}Label`}>
                {modal_title}
              </h1>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={closeModal}
              />
            </div>

            <div className="modal-body">{modal_content}</div>

            {modal_footer && (
              <div className="dialogic-modal-footer">
                <button
                  type="button"
                  tabIndex={0}
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                  onClick={closeModal}
                >
                  Close
                </button>

                {showSaveChanges && saveChangesFunction && (
                  <button
                    type="button"
                    tabIndex={0}
                    className={`btn ${getSaveChangesClass(saveChangesClass)}`}
                    onClick={saveChangesFunction}
                  >
                    {saveChangesTitle}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
