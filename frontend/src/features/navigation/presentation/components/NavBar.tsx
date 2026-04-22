import React, { useState } from "react";
import { Link } from "react-router";
import { useAuthProvider } from "../../../../shared/context/AuthProviderConfig";
import "./navbar.css";

//TODO FIX THIS SO WHEN A PERSON USES THE NAVIATION THAT IT ALSO UPDATED THIS SIDE BAR
export default function NavBar() {
  const { logout } = useAuthProvider();

  const cacheUrl: string | null = sessionStorage.getItem("ACTIVE_URL");
  const [activeItem, setActiveItem] = useState<number>(cacheUrl ? parseInt(cacheUrl) : 0);

  function saveActiveUrl(key: number) {
    setActiveItem(key);
    sessionStorage.setItem("ACTIVE_URL", String(key));
  }

  const items: Array<{ name: string; url: string; icon: string }> = [
    {
      name: "Kanban",
      url: "kanboards",
      icon: "fa-brands fa-trello",
    },
    // {
    //   name: "Board",
    //   url: "/board",
    //   icon: "fa-duotone fa-solid fa-clapperboard",
    // },
    { name: "Tasks", url: "/tasks", icon: "fa-solid fa-list-check" },
    { name: "Folders", url: "/folders", icon: "fa-solid fa-folder-tree" },
    {
      name: "Drive",
      url: "/drive",
      icon: "fa-solid fa-hard-drive",
    },
    { name: "Settings", url: "/settings", icon: "fa-solid fa-gear" },
  ];

  return (
    <nav className="main-navigation">
      <ul className="navbar">
        {items.map((item, key) => {
          const isActiveUrl = key === activeItem;
          return (
            <li key={key} className={isActiveUrl ? "active-url" : ""}>
              <Link onClick={() => saveActiveUrl(key)} to={item.url}>
                <div className="nav-item-group">
                  <div>
                    <i className={` ${item.icon} ${!isActiveUrl ? "text-dark" : ""}`} />
                  </div>
                  <div>{item.name}</div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
      <ul className="sign-out">
        <li>
          <a href="#" role="button" onClick={logout}>
            Logout
          </a>
        </li>
      </ul>
    </nav>
  );
}
