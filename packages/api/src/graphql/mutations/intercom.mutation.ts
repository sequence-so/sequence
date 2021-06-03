import FormData from "form-data";
import fetch from "node-fetch";

export const saveIntercomCode = async (
  root: any,
  { code }: { code: string },
  { models, user }: { models: any; user: any }
) => {
  const intercom = await models.AuthIntercom.create({
    userId: user.id,
    code,
  });

  const formData = new FormData();
  formData.append("code", code);
  formData.append("client_id", process.env.INTERCOM_CLIENT_ID);
  formData.append("client_secret", process.env.INTERCOM_CLIENT_SECRET);
  const fetchResult = await fetch("https://api.intercom.io/auth/eagle/token", {
    method: "POST",
    body: formData,
  });
  const json = (await fetchResult.json()) as { token: string };

  console.log(json);
  intercom.token = json.token;
  intercom.save();

  return {
    id: intercom.id,
    isEnabled: true,
    createdAt: intercom.createdAt,
    updatedAt: intercom.updatedAt,
  };
};
