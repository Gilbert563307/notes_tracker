import React, { createRef, useEffect, useState } from "react";

import "../../notificationv4.css";
import { ALERT_TYPES } from "../../constants";
import type { NotificationDto } from "../../domain/dto/NotificationDto";
import { notificationObserver } from "../../observers/NotificationObserver";


export default function NotificationV4() {
  const typeMap = {
    [ALERT_TYPES.INFO]: "text-info border-info",
    [ALERT_TYPES.DANGER]: "text-danger border-danger",
    [ALERT_TYPES.SUCCESS]: "text-success border-success",
    [ALERT_TYPES.PRIMARY]: "text-primary border-primary",
  };

  const [notification, setNotification] = useState<{ message: string; type: number }>({ message: "", type: 0 });
  const articleRef = createRef<HTMLElement>();

  const getTypeClasses = (type: number) => typeMap[type] || typeMap[ALERT_TYPES.INFO];

  /**
   * Will be called as a callback function because this class subscribed to the notification observer
   * Then the data will be passes as an array with
   *
   */
  function next(notification: NotificationDto) {
    if (!notification) return;
    setNotification(notification.toJson());
    articleRef.current?.focus();
  }

  function closeNotification() {
    setNotification({ message: "", type: 0 });
  }

  const observer = { next: next };

  useEffect(() => {
    notificationObserver.subscribe(observer);
  }, []);

  return (
    <article
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      tabIndex={-1}
      ref={articleRef}
      className={`notification ${notification.message != "" ? "show" : "hide"}  ${getTypeClasses(notification.type)} `}
    >
      <button className="close-btn" title="Close" onClick={closeNotification}>
        ×
      </button>
      <p className="notification-message">{notification.message}</p>
    </article>
  );
}
