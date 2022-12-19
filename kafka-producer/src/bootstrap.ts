import Fastify from 'fastify';
import cors from '@fastify/cors';
import { Kafka } from 'kafkajs';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { config } from 'dotenv';

async function bootstrap() {
  config();

  const fastify = Fastify({ logger: true });

  await fastify.register(cors, {
    origin: true,
  });

  await fastify.post('/create-kafka-producer', async (request, reply) => {
    const kafkaProducerBody = z.object({
      content: z.string(),
      category: z.string(),
      recipientId: z.string(),
    });

    const { category, content, recipientId } = kafkaProducerBody.parse(
      request.body,
    );

    const kafka = new Kafka({
      brokers: [String(process.env.UPSTASH_KAFKA_BROKERS)],
      sasl: {
        mechanism: 'scram-sha-256',
        username: String(process.env.UPSTASH_KAFKA_REST_USERNAME),
        password: String(process.env.UPSTASH_KAFKA_REST_PASSWORD),
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
            content,
            category,
            recipientId: recipientId || randomUUID(),
          }),
        },
      ],
    });

    await producer.disconnect();

    return reply.status(204).send({ message: 'Producer criado com sucesso!' });
  });

  await fastify.listen({ port: 8080 }, () => {
    console.log('Servidor executando.');
  });
}

bootstrap();
