

require('dotenv').config();
const { Client, GatewayIntentBits, Partials, Events, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Channel]
});

// IDs fornecidos
const RECRUTA_ID = '1386179984804020294';
const COMUNIDADE_ID = '1386076815260520499';
const STREAMER_ID = '1385877215509745735';
const CANAL_RECRUTAS_ID = '1386973851279429663';

client.once(Events.ClientReady, () => {
  console.log(`Bot conectado como ${client.user.tag}`);
});

client.on(Events.MessageCreate, async (message) => {
  if (message.channel.id !== CANAL_RECRUTAS_ID || message.author.bot) return;
  
  if (message.content.toLowerCase() === 'ok') {
    const pergunta = await message.reply({
      content: 'Você leu e concorda com todas as regras do servidor e promete cumpri-las?',
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('resposta_sim')
            .setLabel('Sim')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('resposta_nao')
            .setLabel('Não')
            .setStyle(ButtonStyle.Danger)
        )
      ]
    });
  }
});

client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isButton()) return;

  const member = interaction.member;

  if (interaction.customId === 'resposta_nao') {
  await interaction.reply({ content: 'Você foi removido do servidor por não aceitar as regras.', ephemeral: true });
  await member.kick('Não aceitou as regras do servidor.');
  return;
  }

  if (interaction.customId === 'resposta_sim') {
    await interaction.update({
      content: 'Com qual comunidade você se identifica mais?',
      components: [
        new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId('escolha_streamer')
            .setLabel('Streamer')
            .setStyle(ButtonStyle.Primary),
          new ButtonBuilder()
            .setCustomId('escolha_comunidade')
            .setLabel('Espectador')
            .setStyle(ButtonStyle.Secondary)
        )
      ]
    });
    return;
  }

  if (interaction.customId === 'escolha_streamer') {
    await member.roles.add(STREAMER_ID);
    await member.roles.remove(RECRUTA_ID);
    await interaction.update({ content: 'Você foi adicionado como Streamer. Bem-vindo!', components: [] });
  }

  if (interaction.customId === 'escolha_comunidade') {
    await member.roles.add(COMUNIDADE_ID);
    await member.roles.remove(RECRUTA_ID);
    await interaction.update({ content: 'Você foi adicionado como membro da Comunidade. Bem-vindo!', components: [] });
  }
});

client.login(process.env.DISCORD_TOKEN);