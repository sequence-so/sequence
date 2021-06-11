import HalfCircleLeft from "public/half_circle_left.svg";
import HalfCircleRight from "public/half_circle_right.svg";
import HalfCircleFull from "public/full_circle_full.svg";
import { CampaignAudienceRules } from "common/campaign";
import { defaultProp } from "services/defaultProp";
import styles from "./campaign.module.css";
import { useCallback } from "react";
import classNames from "classnames";

interface InnerProps {
  onClick: () => void;
  image: string;
  title: string;
  subtitle: string;
  value: CampaignAudienceRules;
  selected: CampaignAudienceRules;
}

const AudienceRules = (props: InnerProps) => {
  return (
    <div
      className={classNames(
        "container",
        props.selected === props.value ? "selected" : ""
      )}
      onClick={props.onClick}
    >
      <img src={props.image} />
      <div className="text">
        <h3>{props.title}</h3>
        <p>{props.subtitle}</p>
      </div>
      <style jsx>
        {`
          .container {
            display: flex;
            flex-direction: row;
            flex-grow: 1;
            padding: 0.75em;
            flex-basis: 0;
            align-items: flex-start;
            border: 1px solid #c8c8c8;
            border-radius: 4px;
            position: relative;
            -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
            transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
          }
          .container:hover {
            box-shadow: 0px 0px 0px 1px rgba(15, 15, 15, 0.05),
              0px 3px 6px rgba(15, 15, 15, 0.1),
              0px 9px 24px rgba(15, 15, 15, 0.2);
            cursor: pointer;
          }
          .text {
            display: flex;
            flex-direction: column;
            margin-left: 0.75em;
          }
          .selected {
            box-shadow: var(--subtle-shadow);
          }
          .selected::before {
            content: "";
            position: absolute;
            z-index: 4;
            width: 50px;
            top: -17px;
            right: -19px;
            height: 50px;
            background-image: url("/green_check.svg");
            background-size: 50px 50px;
            background-position: 0px 0px, right 0px bottom 0px;
            background-repeat: no-repeat;
          }
          h3 {
            margin-block-start: 0px;
            margin-block-end: 0px;
            font-weight: 600;
            font-size: 16px;
            line-height: 21px;
            color: var(--body-text);
          }
          p {
            margin-block-start: 0.25em;
            margin-block-end: 0px;
            font-weight: normal;
            font-size: 16px;
            line-height: 21px;
            color: var(--body-text);
          }
        `}
      </style>
    </div>
  );
};

interface Props {
  selected?: CampaignAudienceRules;
  onClick?: (rule: CampaignAudienceRules) => void;
}

const RenderAudienceRules = (props: Props) => {
  const propsClick = defaultProp(props.onClick, () => {});
  const selected = props.selected;
  const onClick = (rule: CampaignAudienceRules) => () => propsClick(rule);

  return (
    <div className={styles.audience_rules}>
      <AudienceRules
        image={HalfCircleLeft}
        onClick={onClick(CampaignAudienceRules.Existing)}
        value={CampaignAudienceRules.Existing}
        selected={selected}
        title="EXISTING USERS ONLY"
        subtitle="Apply this filter to users created before campaign launch."
      />
      <AudienceRules
        image={HalfCircleRight}
        onClick={onClick(CampaignAudienceRules.New)}
        value={CampaignAudienceRules.New}
        selected={selected}
        title="NEW USERS ONLY"
        subtitle="Apply this filter to new Users moving forward."
      />
      <AudienceRules
        image={HalfCircleFull}
        onClick={onClick(CampaignAudienceRules.Both)}
        value={CampaignAudienceRules.Both}
        selected={selected}
        title="BOTH"
        subtitle="Apply this filter to existing and new Users moving forward."
      />
    </div>
  );
};

export default RenderAudienceRules;
