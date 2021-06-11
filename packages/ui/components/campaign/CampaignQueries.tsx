import { gql } from "@apollo/client";

export const GET_CAMAPIGNS = gql`
  query GetCampaigns($page: Int) {
    campaigns(page: $page) {
      page
      rows
      nodes {
        id
        name
        state
        isDraft
        userId
        launchedAt
        stoppedAt
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_CAMPAIGN_NODE_WITH_STATES = gql`
  query GetCampaignNodeWithStates($id: ID!, $page: Int, $limit: Int) {
    campaignNodes(id: $id, page: $page, limit: $limit) {
      page
      rows
      nodes {
        id
        kind
        name
        json
        positionX
        positionY
        campaignNodeStates {
          id
          state
          didTimeout
          attempts
          userId
          campaignId
          productUserId
          campaignNodeId
          runAt
          timeoutAt
          completedAt
          createdAt
          updatedAt
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const CREATE_CAMPAIGN = gql`
  mutation CreateCampaign {
    createCampaign {
      id
      name
      state
      isDraft
      userId
      launchedAt
      stoppedAt
      createdAt
      updatedAt
      campaignNodes {
        id
        kind
        name
        json
        positionX
        positionY
      }
      campaignNodeEdges {
        id
        edgeKind
        fromId
        toId
      }
    }
  }
`;

export const UPDATE_CAMPAIGN = gql`
  mutation UpdateCampaign($id: ID!, $name: String) {
    updateCampaign(id: $id, name: $name) {
      id
      name
      state
      isDraft
      userId
      launchedAt
      stoppedAt
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CAMPAIGN_NODE = gql`
  mutation CreateCampaignNode(
    $id: ID
    $name: String
    $campaignId: ID!
    $kind: String!
    $positionX: Int
    $positionY: Int
  ) {
    createCampaignNode(
      id: $id
      name: $name
      campaignId: $campaignId
      kind: $kind
      positionX: $positionX
      positionY: $positionY
    ) {
      id
      name
      kind
      json
      positionX
      positionY
      campaign {
        id
        name
      }
    }
  }
`;

export const GET_CAMPAIGNS_WITH_NODES = gql`
  query GetCampaignsWithNodes {
    campaigns {
      page
      rows
      nodes {
        id
        name
        state
        isDraft
        userId
        launchedAt
        stoppedAt
        createdAt
        updatedAt
        campaignNodes {
          id
          kind
          name
          json
          positionX
          positionY
        }
        campaignNodeEdges {
          id
          edgeKind
          fromId
          toId
        }
      }
    }
  }
`;

export const UPDATE_CAMPAIGN_NODE = gql`
  mutation UpdateCampaignNode(
    $id: ID!
    $name: String
    $json: JSONObject
    $kind: String
    $positionX: Int
    $positionY: Int
  ) {
    updateCampaignNode(
      id: $id
      name: $name
      kind: $kind
      json: $json
      positionX: $positionX
      positionY: $positionY
    ) {
      id
      name
      kind
      json
      positionX
      positionY
    }
  }
`;

export const DELETE_CAMAPIGN_NODE = gql`
  mutation DeleteCampaignNode($id: ID!) {
    deleteCampaignNode(id: $id) {
      success
    }
  }
`;

export const CREATE_CAMPAIGN_NODE_EDGE = gql`
  mutation ConnectCampaignNodes(
    $id: ID
    $fromId: String!
    $toId: String!
    $edgeKind: String!
  ) {
    connectCampaignNodes(
      id: $id
      fromId: $fromId
      toId: $toId
      edgeKind: $edgeKind
    ) {
      fromId
      toId
      edgeKind
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_CAMAPIGN_NODE_EDGE = gql`
  mutation DeleteCampaignNodeEdge($id: ID!) {
    deleteCampaignNodeEdge(id: $id) {
      success
    }
  }
`;

export const LAUNCH_CAMPAIGN = gql`
  mutation LaunchCampaign($id: ID!) {
    launchCampaign(id: $id) {
      id
      name
      state
      isDraft
      userId
      launchedAt
      stoppedAt
      createdAt
      updatedAt
    }
  }
`;

export const STOP_CAMPAIGN = gql`
  mutation StopCampaign($id: ID!) {
    stopCampaign(id: $id) {
      id
      name
      state
      isDraft
      userId
      launchedAt
      stoppedAt
      createdAt
      updatedAt
    }
  }
`;
