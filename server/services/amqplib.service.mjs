import amqp from 'amqplib';

let connection;
let channel;

async function initRabbitMQ() {
  const RABBITMQ_URI = process.env.RABBITMQ_URI || 'amqp://rabbitmq:5672';
  let retries = 10;
  const delayMs = 5000;
  let attempt = 0;
  while (attempt < retries) {
    try {
      console.log(`Connecting to RabbitMQ at ${RABBITMQ_URI}...`);
      connection = await amqp.connect(RABBITMQ_URI);
      channel = await connection.createChannel();
      console.log('[AMQP] Connected and channel created');
      return channel;
    } catch (error) {
      console.error(`[AMQP] Attempt ${attempt + 1} failed: ${error.message}`);
      attempt++;
      if (attempt < retries) {
        console.log(`[AMQP] Retrying in ${delayMs / 1000} seconds...`);
        await new Promise(res => setTimeout(res, delayMs));
      }
    }
  }
  throw new Error('Failed to connect to RabbitMQ after multiple retries.');
}

export async function publishMessage(exchange, routingKey, message) {
  const ch = await initRabbitMQ();
  await ch.assertExchange(exchange, 'topic', { durable: false });
  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
  console.log(`[AMQP] Message sent to ${exchange}/${routingKey}`, message);
}

export async function consumeMessage(queue, callback) {
  const ch = await initRabbitMQ();
  await ch.assertQueue(queue, { durable: false });
  ch.consume(queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      ch.ack(msg);
    }
  }, { noAck: false });
  console.log(`[AMQP] Listening on queue ${queue}`);
}
