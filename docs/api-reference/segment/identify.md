---
description: How we process "Identify" events.
---

# Identify Specification

Performing an **identify** event creates a new **User** with the specific attributes you provide it if the User with the given `externalId` doesn't exist. If a User exists for the given `externalId`, then the User's attributes will be updated. 

The identify spec is based off of the [Segment Identify spec](https://segment.com/docs/connections/spec/identify/).

We support the following reserved traits:

| Trait | Type |
| :--- | :--- |
| browser | String |
| browserVersion | String |
| browserLanguage | String |
| city | String |
| companyName | String |
| country | String |
| createdAt | Date |
| email | String |
| firstName | String |
| industry | String |
| intercomId | String |
| lastName | String |
| phone | String |
| photo | String |
| region | String |
| title | String |
| signedUpAt | Date |
| userId | String |
| websiteUrl | String |

### Custom Traits

When you use a trait that isn't specified above, we will store the trait and make it available to you via the **Audience Builder** page.

### Processing Notes

1. If you provide an attribute in `snake_case` format that matches a reserved trait, we'll automatically save it under our `camelCase` trait. 
2. If you provide a `name` attribute, the name will be split it by the first space in the string, dividing it into a `firstName` and `lastName`. If there isn't a space to split on, the name attribute will be mapped to `firstName`. 
3. Ensure that the Dates you provide are in ISO format. If you provide a number, ensure that it is in **number of milliseconds** since 1970/01/01. 

