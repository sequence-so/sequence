const AuthDiscord = () => {
  const url = `https://discord.com/oauth2/authorize?client_id=837753780756807750&redirect_uri=${encodeURIComponent(
    process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI
  )}&response_type=code&scope=webhook.incoming`;

  return (
    <>
      <a href={url}>
        <span>Connect with</span>
      </a>
      <style jsx>
        {`
          a {
            background: #635bff;
            display: inline-block;
            height: 38px;
            position: relative;
            text-decoration: none;
            width: 180px;
            border-radius: 4px;
            -moz-border-radius: 4px;
            -webkit-border-radius: 4px;
            user-select: none;
            -moz-user-select: none;
            -webkit-user-select: none;
            -ms-user-select: none;
            -webkit-font-smoothing: antialiased;
            cursor: pointer;
            -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          a::after {
            opacity: 0;
            content: " ";
            border-radius: 4px;
            position: absolute;
            z-index: -1;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.05),
              0px 3px 6px rgba(15, 15, 15, 0.1),
              0px 9px 24px rgba(15, 15, 15, 0.2);
          }
          a:hover::after {
            opacity: 1;
          }
          a:hover {
            background: #756ff4;
          }
          span {
            color: #ffffff;
            display: block;
            font-family: "Helvetica Neue", Arial, sans-serif;
            font-size: 15px;
            font-weight: 400;
            line-height: 14px;
            padding: 11px 0px 0px 24px;
            position: relative;
            text-align: left;
            margin-left: -8px;
          }

          span::after {
            background-image: url("/discord_wordmark_white.svg");
            background-repeat: no-repeat;
            background-size: 58px;
            content: "";
            height: 21px;
            left: 62.5%;
            position: absolute;
            top: 42%;
            width: 60px;
          }
        `}
      </style>
    </>
  );
};

export default AuthDiscord;
