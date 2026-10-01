import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { taskController } from "../../features/kanboard/presentation/TaskController";
import "../../features/kanboard/presentation/css/listtaskspage.css";
import { useQuery } from "@tanstack/react-query";

export default function ListTasksPage() {
  useSetPageTitleHook({ title: "Tasks" });

  async function getTasks() {
    const results = await taskController.getTasksByCurrentUser();
    return results?.tasks;
  }

  const query = useQuery({ queryKey: ["tasks"], queryFn: getTasks });
  return (
    <section className="list-tasks-page-section">
      <article>
          <table className="table table-striped" id="tasks-list-table">
            <thead>
              <tr>
                {/* <th scope="col">#</th> */}
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Reporter</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {query.data?.map((task) => (
                <tr>
                  <td>{task.getTitle()}</td>
                  <td>{task.getStatus()}</td>
                  <td>{task.getPriority()}</td>
                  <td>{task.getCreatedAt()}</td>
                  <td>{task.getUpdatedAt()}</td>
                  <td>{task.getReporterName()}</td>
                  <td>..</td>
                </tr>
              ))}
            </tbody>
          </table>
      </article>
    </section>
  );
}
