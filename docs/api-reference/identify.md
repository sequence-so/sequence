---
description: Sending "Identify" events.
---

# Identify

**Identify** creates a new **User** with the specific attributes you provide it.

The Identify spec is based off of the [Segment Identify spec](https://segment.com/docs/connections/spec/identify/).

We support the following reserved traits:

| Trait | Type |
| :--- | :--- |
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
| userId | String |
| websiteUrl | String |

### Custom Traits

When you use a trait that isn't specified above, we will store the trait and make it available to you via the **Audience Builder** page.



