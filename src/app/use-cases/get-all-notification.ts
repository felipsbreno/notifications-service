import { Notification } from '@app/entities/notification';
import { NotificationsRepository } from '@app/repositories/notifications-repository';
import { Injectable } from '@nestjs/common';

interface GetAllNotificationsProps {
  notifications: Notification[];
}

@Injectable()
export class GetAllNotifications {
  constructor(private notificationRepository: NotificationsRepository) {}

  async execute(): Promise<GetAllNotificationsProps> {
    const notifications = await this.notificationRepository.findAll();
    return { notifications };
  }
}
