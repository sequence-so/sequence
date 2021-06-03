import Cryptr from "cryptr";
const cryptr = new Cryptr(process.env.ENCRYPTION_KEY);
export default cryptr;
