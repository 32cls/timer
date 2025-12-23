import { REST, Routes } from "discord.js";
import timerCommand from "./commands/timer.ts";

const rest = new REST().setToken(process.env.DISCORD_TOKEN!);

(async () => {
    try {
        console.log(
            `Started refreshing application (/) commands.`,
        );

        const data = await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID!,
                process.env.GUILD_ID!,
            ),
            {
                body: [
                    timerCommand.data,
                ],
            },
        );

        console.log(
            `Successfully reloaded ${data.length} application (/) commands.`,
        );
    } catch (error) {
        console.error(error);
    }
})();
