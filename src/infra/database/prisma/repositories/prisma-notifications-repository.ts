import { Injectable } from '@nestjs/common';
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper';
import { Notification } from '@app/entities/notification';
import { NotificationsRepository } from '@app/repositories/notifications-repository';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const raw = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.create({
      data: raw,
    });
  }
}
