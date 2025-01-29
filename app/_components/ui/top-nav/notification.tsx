"use client";

import { useAppDispatch } from "@/lib/hooks";
import { TNotificationState, uiActions } from "@/lib/ui";
import { useEffect } from "react";
import Icon from "@/app/_components/ui/icons";

interface NotificationParams {
  notification: TNotificationState;
}

export default function Notification({ notification }: NotificationParams) {
  const dispatch = useAppDispatch();

  function handleCloseNotification() {
    dispatch(uiActions.showNotification(null));
  }

  const randomKey = Math.random();

  let styling = " bg-yellow-300 text-yellow-800";
  let src = "/cross-yellow.svg";
  let iconColor = "#947705";

  if (notification.status === "error") {
    styling = " bg-red-300 text-red-800";
    src = "/cross-red.svg";
    iconColor = "#980115";
  }

  if (notification.status === "success") {
    styling = " bg-green-300 text-green-800";
    src = "/cross-green.svg";
    iconColor = "#1c7d38";
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      handleCloseNotification();
    }, 4500);

    return () => {
      clearTimeout(timer);
    };
  }, [notification]);

  return (
    <section
      key={randomKey}
      className={
        "animate-notification w-full fixed z-50 top-0 text-center p-1 flex justify-between item-center" +
        styling
      }
    >
      <div />
      <div className="flex justify-center item-center gap-2">
        <h2>{notification.title}:</h2>
        <p>{notification.message}</p>
      </div>

      <button onClick={handleCloseNotification}>
        <Icon iconName="cross" color={iconColor} height="20px" width="20px" />
      </button>
    </section>
  );
}
