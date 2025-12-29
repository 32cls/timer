import {
    ChatInputCommandInteraction,
    MessageFlags,
    SlashCommandBuilder,
} from "discord.js";
import {
    createAudioPlayer,
    createAudioResource,
    joinVoiceChannel,
} from "@discordjs/voice";

const timerCommand = {
    data: new SlashCommandBuilder().setName("timer").setDescription(
        "Sets a timer",
    ).addIntegerOption((option) =>
        option.setName("minutes").setDescription(
            "The remaining time in minutes before the alarm rings",
        ).setMinValue(1).setMaxValue(Math.floor((Math.pow(2, 31) - 1) / 60000))
            .setRequired(
                true,
            )
    ),
    async execute(interaction: ChatInputCommandInteraction) {
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const guildMember = await interaction.guild?.members.fetch(
            interaction.user.id,
        );
        if (!guildMember || !guildMember.voice.channelId) {
            await interaction.editReply(
                "User currently not in a voice channel",
            );
            console.log(
                `User requested a timer but was not in a voice channel`,
            );
            return;
        }
        if (!interaction.guildId || !interaction.guild) {
            await interaction.editReply("User not in a guild");
            console.log(`User requested a timer but was not in a server`);
            return;
        }
        const timeout = interaction.options.getInteger("minutes", true);
        console.log(`Received request for timer to ring in ${timeout} minutes`);
        await interaction.editReply(
            `Joining voice channel: <#${guildMember.voice.channelId}>. Ringing in ${timeout} minute${
                timeout === 1 ? "" : "s"
            }.`,
        );
        const connection = joinVoiceChannel({
            channelId: guildMember.voice.channelId,
            guildId: interaction.guildId,
            adapterCreator: interaction.guild.voiceAdapterCreator,
        });
        const resource = createAudioResource("alarm.opus");
        const player = createAudioPlayer();
        connection.subscribe(player);
        setTimeout(
            () => {
                console.log("Playing timer sound");
                player.play(resource);
            },
            timeout * 60000,
        );
        player.on("stateChange", (oldState, newState) => {
            if (oldState.status == "playing" && newState.status == "idle") {
                connection.destroy();
            }
        });
        player.on("error", (error) => {
            console.error(error);
        });
    },
};

export default timerCommand;
