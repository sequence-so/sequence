import { useQuery, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import DownArrow from "../public/down_arrow.svg";

export const GET_USER = gql`
  query GetUser {
    getUser {
      id
      firstName
      lastName
      email
      photo
    }
  }
`;

const ProfileDropdown = () => {
  const { loading, error, data } = useQuery(GET_USER);

  return data ? (
    <div className={styles.profile}>
      <img
        className={styles.profile_image}
        width={30}
        height={30}
        src={data.getUser.photo}
      />
      <p>Hi, {data.getUser.firstName}</p>
      <img className={styles.profile_arrow} src={DownArrow} />
    </div>
  ) : null;
};

export default ProfileDropdown;
