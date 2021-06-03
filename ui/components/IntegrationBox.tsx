import Link from "next/link";
import classNames from "classnames";
import styles from "../styles/Home.module.css";
import React from "react";

interface Props {
  active: boolean;
  imgProps: React.ImgHTMLAttributes<any>;
  text: string;
  link: string;
}

const IntegrationBox = ({ active, imgProps, text, link }: Props) => {
  return (
    <Link href={link}>
      <div
        className={classNames(
          active ? styles.integration_box_done : styles.integration_box,
          styles.integration
        )}
      >
        <img {...imgProps}></img>
        <span>{text}</span>
      </div>
    </Link>
  );
};

export default IntegrationBox;
