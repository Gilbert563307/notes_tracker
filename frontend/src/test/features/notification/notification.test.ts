import { expect, test } from "vitest";
import { NotificationDto } from "../../../shared/features/notification/domain/dto/NotificationDto";
import { ALERT_TYPES } from "../../../shared/features/notification/constants";

test("should first build valid  notification", () => {
  const notification = new NotificationDto.Builder()
  .message("Invalid email or password")
  .build();

  expect(notification.getMessage()).toBe("Invalid email or password")
  expect(notification.getType()).toBe(ALERT_TYPES.PRIMARY)
  expect(notification.toJson()).toStrictEqual({
    message: "Invalid email or password", type: ALERT_TYPES.PRIMARY
  })
});


