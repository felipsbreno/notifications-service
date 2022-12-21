import { Injectable } from '@nestjs/common';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { Notification } from '../entities/notification';

interface GetNotificationsResponse {
  notifications: Notification[];
}

@Injectable()
export class GetNotifications {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(): Promise<GetNotificationsResponse> {
    const notifications = await this.notificationRepository.get();

    return {
      notifications,
    };
  }
}
