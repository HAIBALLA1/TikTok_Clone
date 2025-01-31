import amqp from 'amqplib';

let connection;
let channel;

async function initRabbitMQ() {
  if (!connection) {
    connection = await amqp.connect('amqp://localhost');
    channel = await connection.createChannel();
    console.log('[AMQP] Connected and channel created');
  }
  return channel;
}

export async function publishMessage(exchange, routingKey, message) {
  const ch = await initRabbitMQ();
  await ch.assertExchange(exchange, 'topic', { durable: false });
  ch.publish(exchange, routingKey, Buffer.from(JSON.stringify(message)));
  console.log(`[AMQP] Sent to ${exchange}/${routingKey}`, message);
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
