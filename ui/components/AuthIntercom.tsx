const AuthIntercom = () => {
  return (
    <a
      href={`https://app.intercom.com/oauth?client_id=8c465a1a-0bae-46b1-981f-a0cc915f7410&state=example&redirect_uri=${process.env.NEXT_PUBLIC_INTERCOM_REDIRECT_URI}`}
    >
      <img
        src="https://static.intercomassets.com/assets/oauth/primary-7edb2ebce84c088063f4b86049747c3a.png"
        srcSet="https://static.intercomassets.com/assets/oauth/primary-7edb2ebce84c088063f4b86049747c3a.png 1x, https://static.intercomassets.com/assets/oauth/primary@2x-0d69ca2141dfdfa0535634610be80994.png 2x, https://static.intercomassets.com/assets/oauth/primary@3x-788ed3c44d63a6aec3927285e920f542.png 3x"
      />
    </a>
  );
};

export default AuthIntercom;
