---
description: Batch import Events and Users.
---

# Batch Import API

{% api-method method="post" host="https://api.sequence.so" path="/event/batch" %}
{% api-method-summary %}
Import Events and Users
{% endapi-method-summary %}

{% api-method-description %}
Import **Events** or **Users** via this API call. 
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="Authentication" type="string" required=true %}
See Authentication section 
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="batch" type="array" required=true %}
Array of objects with the Event or Identify call you'd like to track. See full definition below. 
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Import was successful and the events were handled. 
{% endapi-method-response-example-description %}

```javascript
{
  success: true,
  total: 2,
  errors: 0,
  processed: 2,
  batch: [
    { messageId: 'kfzKyjdURh', success: true, processed: true },
    { messageId: 'rQeUO6L9yV', success: true, processed: true }
  ]
}
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=500 %}
{% api-method-response-example-description %}
Internal Server Error has occurred.
{% endapi-method-response-example-description %}

```
{
  success: false,
  error: "An error occured processing your request"
}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

## Import Specification

Based off the Segment specification, we currently support the following event types: 

* Track \([Segment Track Specification](https://segment.com/docs/connections/spec/track/)\)
* Identify \([Segment Identify Specification](https://segment.com/docs/connections/spec/identify/)\)

{% hint style="danger" %}
Creating Events for anonymous users is currently not supported.
{% endhint %}

### Request Body

The request body expects a key `batch` with an array of elements, described by the `EventPayload` Typescript definition below. 

```typescript
type HttpRequest {
    batch: EventPayload[];
}

interface EventPayload {
    /**
     * Required: The event type.
     */
    type: 'track' | 'identify';
    /**
     * Required: User ID associated with the event
     */
    userId: string;
    /**
     * Properties object used for *track* calls. You can send in any values
     * you'd like. 
     */
    properties?: Record<string, any>;
    /**
     * Name of event, used for *track* calls
     */
    event?: string;
    /**
     * Traits object used for *identify* calls.
     */
    traits?: Record<string, any>;
    /**
     * Timestamp of the event. (Not required, will be Date.now() if undefined)
     * Use this to perform a historical import and save the date of the original
     * event. 
     */
    timestamp?: string | Date;
    /**
     * Optional: unique message idempotency key. Duplicate events will be ignored. 
     */
    messageId?: string;
}
```

### **Examples**

**Upload Users and Events**

```typescript
import fetch from "node-fetch";

// 1. Get token from https://my.sequence.so/onboarding/node-sdk
const basicUsername = "MY_TOKEN";

// 2. Base64 encode the Username:Password (password is empty)
const token = Buffer.from(basicUsername + ":").toString("base64");

const data = {
  batch: [
    {
      // Type of event (required)
      type: "identify",
      traits: {
        firstName: "Wei",
        lastName: "James",
        email: "pifagor@example.me",
        plan: "premium",
        logins: 5,
      },
      // Your internal User ID (required)
      userId: "2zeqgSkKjz",
      // Use `timestamp` for historical data import
      timestamp: "2021-07-21T01:43:55Z",
      // Recommended: use an idempotency key to make sure your events are unique
      // and your event pipeline is resilient to failures
      messageId: "kfzKyjdURh",
      // `sentAt` isn't required
      sentAt: new Date().toUTCString(),
    },
    {
      // Type of event (required)
      type: "track",
      // Name of the event (required)
      event: "Experiment Viewed",
      properties: {
        experiment_id: "Sp0n1Q2ziJ",
        experiment_name: "button_alteration",
        variation_id: "B4Atsa9ahA",
        variation_name: "blue",
      },
      // Your internal User ID (required)
      userId: "1cezxfHlqZ",
      timestamp: "2021-07-21T01:43:55Z",
      // Recommended: use an idempotency key to make sure your events are unique
      // and your event pipeline is resilient to failures
      messageId: "rQeUO6L9yV",
    },
  ],
};

// 3. Perform request with `Authorization: Basic [token]` in the header
fetch("https://api.sequence.so/event/batch", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Basic ${token}`,
  },
  body: JSON.stringify(data),
})
  .then((res) => res.json())
  .then((result) => console.log(result));

```

The Response from the API will be:

```javascript
{
  success: true,
  total: 2,
  errors: 0,
  processed: 2,
  batch: [
    { messageId: 'kfzKyjdURh', success: true, processed: true },
    { messageId: 'rQeUO6L9yV', success: true, processed: true }
  ]
}
```

If any `messageId` duplicates are provided, the event will be marked as `processed=false`. 

### Performing Other Operations

**Updating User Attributes**

To update user attributes, use an `identify` call and provide new values for existing attributes. This will overwrite existing attributes. 

**Removing User Attributes**

In order to remove a User attribute, in an `identify` call, pass the value `null` for your attribute and it will be cleared for that User. Reserved properties will be **cleared**; custom properties will be **removed**. 

