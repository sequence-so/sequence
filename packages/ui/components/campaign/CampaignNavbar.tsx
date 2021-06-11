import classNames from "classnames";
import TitleInput from "components/input/TitleInput";
import { CALENDAR_ICON } from "constants/page";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import styles from "styles/Home.module.css";
import debounce from "lodash/debounce";
import BlueButton from "components/BlueButton";
import { useMutation } from "@apollo/client";
import {
  GET_CAMPAIGNS_WITH_NODES,
  LAUNCH_CAMPAIGN,
  STOP_CAMPAIGN,
  UPDATE_CAMPAIGN,
} from "./CampaignQueries";
import {
  UpdateCampaign,
  UpdateCampaignVariables,
} from "__generated__/UpdateCampaign";
import { EditorContext } from "./CampaignEditorGrid";
import {
  LaunchCampaign,
  LaunchCampaignVariables,
} from "__generated__/LaunchCampaign";
import {
  StopCampaign,
  StopCampaignVariables,
} from "__generated__/StopCampaign";
import { GetCampaignsWithNodes } from "__generated__/GetCampaignsWithNodes";

const CampaignNavbar = () => {
  const context = useContext(EditorContext);
  const [title, setTitle] = useState("");
  const [campaignState, setCampaignState] = useState("PENDING");
  const [updateCampaign] = useMutation<UpdateCampaign, UpdateCampaignVariables>(
    UPDATE_CAMPAIGN
  );
  const [launchCampaign] = useMutation<LaunchCampaign, LaunchCampaignVariables>(
    LAUNCH_CAMPAIGN,
    {
      update: (cache, mutationResult) => {
        setCampaignState(mutationResult.data.launchCampaign.state);
        return;

        context.campaign.launchedAt =
          mutationResult.data.launchCampaign.launchedAt;
        const result = mutationResult.data.launchCampaign;
        const data = cache.readQuery<GetCampaignsWithNodes>({
          query: GET_CAMPAIGNS_WITH_NODES,
          variables: { id: context.campaignId },
        });
        const campaignIndex = data?.campaigns?.nodes?.findIndex(
          (c) => c.id === context.campaignId
        );
        if (campaignIndex === -1) {
          return;
        }

        const newCampaign = {
          ...data.campaigns.nodes[campaignIndex],
          stoppedAt: result.stoppedAt,
          state: result.state,
        };
        const nextCampaigns = [...data.campaigns.nodes].splice(
          campaignIndex,
          1,
          newCampaign
        );
        cache.writeQuery({
          query: GET_CAMPAIGNS_WITH_NODES,
          variables: { id: context.campaignId },
          data: { campaigns: { nodes: nextCampaigns } },
        });
      },
    }
  );
  const [stopCampaign] = useMutation<StopCampaign, StopCampaignVariables>(
    STOP_CAMPAIGN,
    {
      update: (cache, mutationResult) => {
        setCampaignState(mutationResult.data.stopCampaign.state);
        return;
        context.campaign.launchedAt =
          mutationResult.data.stopCampaign.launchedAt;
        const result = mutationResult.data.stopCampaign;
        const data = cache.readQuery<GetCampaignsWithNodes>({
          query: GET_CAMPAIGNS_WITH_NODES,
          variables: { id: context.campaignId },
        });
        const campaignIndex = data.campaigns.nodes.findIndex(
          (c) => c.id === context.campaignId
        );
        if (campaignIndex === -1) {
          return;
        }

        const newCampaign = {
          ...data.campaigns.nodes[campaignIndex],
          stoppedAt: result.stoppedAt,
          state: result.state,
        };
        const nextCampaigns = [...data.campaigns.nodes].splice(
          campaignIndex,
          1,
          newCampaign
        );
        cache.writeQuery({
          query: GET_CAMPAIGNS_WITH_NODES,
          variables: { id: context.campaignId },
          data: { campaigns: { nodes: nextCampaigns } },
        });
      },
    }
  );
  const debouncedUpdate = useRef(
    debounce((variables: UpdateCampaignVariables) => {
      updateCampaign({
        variables,
      });
    })
  );

  //SSR issues
  useEffect(() => {
    if (context.campaign) {
      setTitle(context.campaign.name);
      setCampaignState(context.campaign.state);
    }
  }, [context.campaign]);

  const onChangeTitleText = (value: string) => {
    setTitle(value);
    context.campaign.name = value;
    debouncedUpdate.current({
      id: context.campaignId,
      name: value,
    });
  };

  console.log({ campaignState });
  const onClickLaunch = useCallback(() => {
    if (campaignState === "PENDING") {
      launchCampaign({
        variables: {
          id: context.campaignId,
        },
      });
    } else {
      stopCampaign({
        variables: {
          id: context.campaignId,
        },
      });
    }
  }, [campaignState]);

  return (
    <div className="wrapper">
      <div className={classNames("container", true ? "show-container" : "")}>
        <span className={styles.title_icon}>{CALENDAR_ICON}</span>
        <TitleInput
          className={styles.campaign_title_input}
          value={title}
          onChangeText={onChangeTitleText}
          placeholder={"Untitled Campaign"}
        />
        <BlueButton
          text={
            campaignState === "PENDING"
              ? "Launch"
              : campaignState === "STOPPED"
              ? "Campaign Stopped."
              : campaignState === "RUNNING"
              ? "Stop"
              : ""
          }
          style={{
            minWidth: 130,
            border: "none",
            height: 37,
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 20,
            marginRight: 0,
          }}
          onClick={onClickLaunch}
        ></BlueButton>
      </div>

      <style jsx>{`
        .wrapper {
          display: flex;
          z-index: 20;
          height: 71px;
          width: 100%;
          border-bottom: 1px solid #d0d0d0;
        }
        .container {
          display: flex;
          flex-direction: row;
          align-items: baseline;
          padding-left: 40px;
          padding-right: 40px;
          padding-bottom: 0px;
          background: #f8fafc;
          width: 100%;
          box-shadow: var(--subtle-shadow);
          -webkit-transition-property: -webkit-transform;
          -moz-transition-property: -moz-transform;
          -ms-transition-property: -ms-transform;
          -o-transition-property: -o-transform;
          transition-property: transform;
          transform: translateY(0px);
          transition: transform 0.25s ease-in;
        }
      `}</style>
    </div>
  );
};

export default CampaignNavbar;
