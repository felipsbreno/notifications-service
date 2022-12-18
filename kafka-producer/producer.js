import { Kafka } from 'kafkajs';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';

async function bootstrap() {
  config();

  const kafka = new Kafka({
    brokers: [process.env.UPSTASH_KAFKA_BROKERS],
    sasl: {
      mechanism: 'scram-sha-256',
      username: process.env.UPSTASH_KAFKA_REST_USERNAME,
      password: process.env.UPSTASH_KAFKA_REST_PASSWORD,
    },
    ssl: true,
  });

  const producer = kafka.producer();

  await producer.connect();

  await producer.send({
    topic: 'notifications.send-notification',
    messages: [
      {
        value: JSON.stringify({
          content: 'Hoje acaba o ignite lab, aproveite!!!',
          category: 'estudo',
          recipientId: randomUUID(),
        }),
      },
    ],
  });

  await producer.disconnect();
}

bootstrap();
