import { useParams } from "react-router";
import useGetKanBoardTasksHook from "../../features/kanboard/presentation/hooks/useGetKanBoardTasksHook";
import { KanBoard } from "../../features/kanboard/domain/KanBoard";
import { Task } from "../../features/kanboard/domain/Task";
import "../../features/kanboard/presentation/css/readkanboardpage.css";
import KanBoardColumn from "../../features/kanboard/presentation/components/KanBoardColumn";

export default function ReadKanBoardPage() {
  const { kanBoardId } = useParams();
  const { tasks } = useGetKanBoardTasksHook({ kanBoardId });

  const HEADERS = KanBoard.getDefaultHeaders();
  console.log(HEADERS);
  console.log(tasks);

  function handleDragEnter() {}

  function handleDragStart() {}

  function getTasksByHeaderId(tasks: Array<Task>, headerId: string) {
    return tasks.filter((task) => task.getStatus() === headerId);
  }

  return (
    <section className="read-kanboard-page">
      <article className="main-board">
        <article className="main-columns">
          {HEADERS.map((header) => (
            <KanBoardColumn
              key={header.id}
              headerId={header.id}
              title={header.title}
              tasks={getTasksByHeaderId(tasks, header.id)}
              kanBoardId={kanBoardId}
              onDragEnter={() => handleDragEnter()}
              handleDragStart={handleDragStart}
            ></KanBoardColumn>
          ))}
        </article>
      </article>
    </section>
  );
}
