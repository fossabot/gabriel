import { GabrielCommand } from "@gabriel/shared";
import { RegisterBehavior } from "@sapphire/framework";
import { Message, SlashCommandBuilder } from "discord.js";

export class RegisterCommand extends GabrielCommand {
    public constructor(context: GabrielCommand.Context, options: GabrielCommand.Options) {
        super(context, {
            ...options,
            name: "register",
            description: "Register an account and begin your journey on Gabriel.",
        });
    }

    public override registerApplicationCommands(registry: GabrielCommand.Registry) {
        const command: SlashCommandBuilder = new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(this.description);

        registry.registerChatInputCommand(command, {
            behaviorWhenNotIdentical: RegisterBehavior.Overwrite,
            guildIds: [],
            idHints: [],
        });
    }

    public async chatInputRun(interaction: GabrielCommand.ChatInputCommandInteraction): Promise<Message> {
        await interaction.deferReply({ ephemeral: true });

        const user = await this.container.trpcClient.user.findOne.query(interaction.user.id);

        if (!user) {
            const createdUser = await this.container.trpcClient.user.create.mutate({
                discordId: interaction.user.id,
            });

            if (!createdUser) {
                return interaction.editReply("There was an error while registering your account.");
            }

            const createdEconomy = await this.container.trpcClient.economy.create.mutate({
                discordId: interaction.user.id,
            });

            if (!createdEconomy) {
                return interaction.editReply("There was an error while registering your account.");
            }

            return interaction.editReply("You have successfully registered your account.");
        }

        return interaction.editReply("You are already registered.");
    }
}
