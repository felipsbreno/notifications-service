import { GetAllNotifications } from '@app/use-cases/get-all-notification';
import { Content } from '@app/entities/content';
import { makeNotification } from '@test/factories/notification-factory';
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository';

describe('Get all notifications', () => {
  it('should be able to recipient notifications', async () => {
    const notificationsRepository = new InMemoryNotificationsRepository();
    const getAllNotifications = new GetAllNotifications(
      notificationsRepository,
    );

    await notificationsRepository.create(makeNotification());
    await notificationsRepository.create(makeNotification());

    const { notifications } = await getAllNotifications.execute();

    expect(notifications).toHaveLength(2);
    expect(notifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          category: 'social',
          content: new Content('Nova solicitação de amizade!'),
          recipientId: 'recipient-2',
        }),
        expect.objectContaining({
          category: 'social',
          content: new Content('Nova solicitação de amizade!'),
          recipientId: 'recipient-2',
        }),
      ]),
    );
  });
});
