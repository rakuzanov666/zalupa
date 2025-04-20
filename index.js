require('dotenv').config();
const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');

const app = express();
const port = process.env.PORT || 8000;

// Инициализация Discord клиента
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers
  ]
});

let userActivity = {
  status: 'offline',
  activity: 'Нет активности',
  color: '#747f8d'
};

// Укажи здесь свой Discord user ID
const TARGET_USER_ID = '1229044115594018960'; // вставь свой ID

client.once('ready', async () => {
  console.log(`Бот запущен как ${client.user.tag}`);

  const guilds = client.guilds.cache;
  for (const [guildId, guild] of guilds) {
    try {
      const member = await guild.members.fetch(TARGET_USER_ID);
      if (member) {
        updateActivity(member);
      }
    } catch (e) {
      console.log(`Ошибка при поиске участника: ${e.message}`);
    }
  }
});

// Обновление активности
function updateActivity(member) {
  const statusMap = {
    online: '#3ba55c',
    idle: '#faa61a',
    dnd: '#ed4245',
    offline: '#747f8d'
  };

  const presence = member.presence;
  if (!presence) return;

  const status = presence.status;
  const activities = presence.activities;
  const activity = activities.length > 0 ? activities[0].name : 'Нет активности';

  userActivity = {
    status,
    activity,
    color: statusMap[status] || '#747f8d'
  };
}

// API endpoint
app.get('/status', (req, res) => {
  res.json(userActivity);
});

// Старт Express
app.listen(port, () => {
  console.log(`API слушает на порту ${port}`);
});

// Логин в Discord
client.login(process.env.DISCORD_TOKEN);
