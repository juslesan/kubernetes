const NATS = require('nats')
const nc = NATS.connect({
  url: process.env.NATS_URL || 'nats://my-nats:4222'
})
const { WebClient } = require('@slack/web-api')

const web = new WebClient(process.env.SLACK_BOT_TOKEN);

const conversationId = 'week4';

nc.subscribe('todo_status', {queue: "workers"}, (msg) => {
  console.log('Broadcaster received', msg)
  web.chat.postMessage({ channel: conversationId, text: msg})
})

console.log("Broadcaster started")