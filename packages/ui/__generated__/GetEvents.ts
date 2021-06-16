/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: GetEvents
// ====================================================

export interface GetEvents_events_nodes_productUser {
  __typename: "ProductUser";
  firstName: string | null;
  lastName: string | null;
}

export interface GetEvents_events_nodes {
  __typename: "Event";
  id: string;
  name: string | null;
  type: string | null;
  source: string | null;
  personId: string | null;
  properties: any | null;
  productUser: GetEvents_events_nodes_productUser | null;
  createdAt: any | null;
  updatedAt: any | null;
}

export interface GetEvents_events {
  __typename: "PaginatedEvent";
  nodes: (GetEvents_events_nodes | null)[] | null;
  page: number | null;
  rows: number | null;
}

export interface GetEvents {
  events: GetEvents_events | null;
}

export interface GetEventsVariables {
  page?: number | null;
  limit?: number | null;
  personId?: string | null;
}
