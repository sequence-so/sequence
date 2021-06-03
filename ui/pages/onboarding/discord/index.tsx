import AuthDiscord from "../../../components/AuthDiscord";
import IntegrationLayout from "../../../layout/IntegrationLayout";

const DiscordPage = () => {
  return (
    <IntegrationLayout
      title="Discord"
      authorization={<AuthDiscord />}
      content={
        <p>
          By connecting your Discord account, you will be able to send alerts to
          your team or send communications to your customers based on product
          events.
        </p>
      }
      name="discord"
      thumbnail="/discord.svg"
    />
  );
};

export default DiscordPage;
