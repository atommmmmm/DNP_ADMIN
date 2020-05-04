import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BaseDropdown from "./BaseDropdown";
import { getNotifications } from "services/notifications/selectors";
import {
  viewedNotifications,
  fetchNotifications
} from "services/notifications/actions";
// Icons
import Bell from "Icons/Bell";

export default function Notifications() {
  const notifications = useSelector(getNotifications);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <BaseDropdown
      name="Notifications"
      messages={notifications}
      Icon={Bell}
      onClick={() => dispatch(viewedNotifications())}
      moreVisible={true}
      className={"notifications"}
      placeholder="No notifications yet"
    />
  );
}
