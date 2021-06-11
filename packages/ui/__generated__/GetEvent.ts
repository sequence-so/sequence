/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetEvent
// ====================================================

export interface GetEvent_events_nodes_productUser {
  __typename: "ProductUser";
  firstName: string | null;
  lastName: string | null;
}

export interface GetEvent_events_nodes {
  __typename: "Event";
  id: string;
  name: string | null;
  type: string | null;
  source: string | null;
  personId: string | null;
  properties: any | null;
  productUser: GetEvent_events_nodes_productUser | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetEvent_events {
  __typename: "PaginatedEvent";
  nodes: (GetEvent_events_nodes | null)[] | null;
  page: number | null;
  rows: number | null;
}

export interface GetEvent {
  events: GetEvent_events | null;
}

export interface GetEventVariables {
  id?: string | null;
}
