import  { useRef } from "react";
import { TASKS_PRIORITY } from "../../../../../config/config";
import "../../css/prioritybutton.css";

export default function PriorityButtonComponent({
  priorityStatus,
  callBackFn,
}: {
  priorityStatus: number;
  callBackFn: (v: number) => void;
}) {
  function toggleSelectedPriorityDropDownItem(p: number) {
    callBackFn(p);
    //click the button because otherwise bs5 doest close the button dropdown
    priorityDropDownRef.current.click();
  }

  const priorityDropDownRef = useRef<HTMLButtonElement>();

  function getPriorityAsText(priority: number) {
    const priorityBadgeMap = {
      [TASKS_PRIORITY.LOW]: <span>Low</span>,
      [TASKS_PRIORITY.MEDIUM]: <span>Medium</span>,
      [TASKS_PRIORITY.HIGH]: <span>High</span>,
    };
    return priorityBadgeMap[priority];
  }

  const priorityDropDownItems = [
    { content: TASKS_PRIORITY.LOW, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.LOW) },
    { content: TASKS_PRIORITY.MEDIUM, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.MEDIUM) },
    { content: TASKS_PRIORITY.HIGH, onclick: () => toggleSelectedPriorityDropDownItem(TASKS_PRIORITY.HIGH) },
  ];

  const priorityParentBtnStatus = `selected-priority-item-${priorityStatus}`;
  return (
    <div className="dropdown">
      <button
        className={`notes-tracker-btn notes-tracker-badge ${priorityParentBtnStatus} dropdown-toggle`}
        type="button"
        data-bs-toggle="dropdown"
        aria-expanded="false"
        ref={priorityDropDownRef}
      >
        {getPriorityAsText(priorityStatus)}
      </button>
      <ul className="dropdown-menu">
        {priorityDropDownItems.map((priorityItem, index) => {
          return (
            <li key={index}>
              <button className="dropdown-item" type="button" onClick={priorityItem.onclick}>
              
                {getPriorityAsText(priorityItem.content)}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
