import useSetPageTitleHook from "../../shared/hooks/useSetPageTitleHook";
import { taskController } from "../../features/kanboard/presentation/TaskController";
import "../../features/kanboard/presentation/css/listtaskspage.css";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Table } from "antd";
import { Link } from "react-router";
import type { TaskProps } from "../../features/kanboard/domain/Task";
import ArchiveTaskButton from "../../features/kanboard/presentation/components/task/ArchiveTaskButton";
export default function ListTasksPage() {
  const queryClient = useQueryClient();
  useSetPageTitleHook({ title: "Tasks" });

  const query = useQuery({ queryKey: ["tasks"], queryFn: getTasks });

  async function getTasks() {
    const results = await taskController.getTasksByCurrentUserAsJsonObjects();
    return results?.tasks;
  }

  async function archiveTask(task: TaskProps) {
    await taskController.archiveTask(task);
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Priority",
      dataIndex: "priority",
      key: "priority",
    },

    {
      title: "Reporter",
      dataIndex: "reporter",
      key: "reporter",
    },
    {
      title: "created At",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (_, task: TaskProps) => {
        const readTaskUrl = `/tasks/read/${task.id}`;
        return (
          <td className="main-table-actions">
            <button>
              <Link to={readTaskUrl} state={{ task: task }}>
                <i className="fa-solid fa-magnifying-glass"></i>
              </Link>
            </button>
            <button>
              <Link to={`/tasks/update/${task.id}`}>
                <i className="fa-solid fa-pencil"></i>
              </Link>
            </button>
            <ArchiveTaskButton task={task} archiveTask={archiveTask} />
          </td>
        );
      },
    },
  ];

  return (
    <section className="list-tasks-page-section">
      <article>
        <Table dataSource={query.data} columns={columns} />
      </article>
    </section>
  );
}
