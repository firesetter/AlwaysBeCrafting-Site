import axios from 'axios';
import tmi from 'tmi.js';

let chatLog = [];
let voteLog = [];

window.setInterval(() => {
  console.log('interval fired');
  if (typeof chatLog !== 'undefined' && chatLog.length > 0) {
    axios.post('http://localhost:3000/api/chat', {
      data: chatLog,
    })
    .then((res) => {
      chatLog = [];
      console.log(res.data);
    })
    .catch(console.error);
  }
  if (typeof voteLog !== 'undefined' && voteLog.length > 0) {
    axios.post('http://localhost:3000/api/vote', {
      data: voteLog,
    })
    .then((res) => {
      voteLog = [];
      console.log(res.data);
    })
    .catch(console.error);
  }
},
30000);

const client = new tmi.client({
  options: {
    debug: true,
  },
  connection: {
    reconnect: true,
  },
  identity: token,
  channels: [config.channel],
});
client.on('connecting', console.log);

client.on('disconnected', console.error);

client.on('message', (channel, user, message, self) => {
  if (user.username === token.username) { return; }
  if (message[0] !== '!') {
    chatLog = [...chatLog, { timestamp: user['tmi-sent-ts'], user: user.username, message }];
  } else {
    const splitMessage = message.trim().split(/\s+/);
    const commandName = splitMessage.shift().replace('!', '');
    const command = commands[commandName];
    command(splitMessage, channel);
  }
});

client.connect();
