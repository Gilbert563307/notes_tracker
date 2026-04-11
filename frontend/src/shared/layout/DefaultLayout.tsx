import React from "react";
import { Outlet } from "react-router";
import { useAuthProvider } from "../context/AuthProviderConfig";
import { useApplicationContext } from "../context/ApplicationProviderConfig";

export default function DefaultLayout() {
  const { auth } = useAuthProvider();
  const { title } = useApplicationContext();
  return (
    <section className="default-layout">
      <aside className="aside-navigation">
        <article className="aside-article-header">
          <h1 className="stats-tracker-h1">Tasks - Tracker</h1>
          <p>
            <span className="text-body-secondary user-welcome">Welcome,</span>{" "}
            <b className="fw-medium user-name">{auth?.getUser().getDisplayName()}</b>{" "}
          </p>
          <NavBar />
        </article>
      </aside>
      <article className="layout-section">
        <article className="mx-1">
          <h2 className="layout-title">{title}</h2>
          <div className="layout-line"></div>
          <article className="content border rounded">
            <Outlet></Outlet>
          </article>
        </article>
      </article>
    </section>
  );
}
