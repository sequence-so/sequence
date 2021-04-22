import { Client as IntercomClient } from "intercom-client";
import User from "../models/user";
import AuthIntercom from "../models/auth_intercom";
import ProductUser from "../models/product_user";

class IntercomService {
  client: IntercomClient;
  async getFromUser(user: User): Promise<IntercomService | null> {
    const intercom = await AuthIntercom.findOne({
      where: {
        userId: user.id,
      },
    });
    if (!intercom) {
      return null;
    }
    this.client = new IntercomClient({
      token: intercom.token,
    });
    return this;
  }
  async fetchAllContacts() {
    const contacts = ((await this.client.contacts.list()).body as any)
      .data as any;
    Promise.all(
      contacts.map(async (contact: any) => {
        const {
          email,
          name,
          phone,
          avatar: photo,
          type,
          last_seen_at,
          signed_up_at,
          id: intercomId,
          external_id: externalId,
        } = contact;
        const nameSplit = name ? name.split(" ") : "";
        const firstName = nameSplit.length > 0 ? nameSplit[0] : "";
        const lastName = nameSplit.length > 1 ? nameSplit[1] : "";
        let productUser = await ProductUser.findOne({
          where: { email },
        });
        if (!productUser) {
          productUser = await ProductUser.create({
            email,
            lastName,
            firstName,
            photo,
            phone,
            lastSeenAt: Number.isInteger(last_seen_at)
              ? new Date(last_seen_at * 1000)
              : null,
            signedUpAt: Number.isInteger(signed_up_at)
              ? new Date(signed_up_at * 1000)
              : null,
            intercomId,
            externalId,
          });
        }
      })
    );
    console.log(contacts);
  }
}

export default IntercomService;
