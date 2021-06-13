---
description: Tracking events and identify calls.
---

# Event

{% api-method method="post" host="http://sequence.so" path="/event/batch" %}
{% api-method-summary %}
Create Event
{% endapi-method-summary %}

{% api-method-description %}
Create an Event associated with a particular Person. Based off the Segment specification, we currently support the following event types:  
- Track  
- Identify  
  
Note: Events with anonymous users are not currently supported.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="Authentication" type="string" required=true %}
Form of Authentication: Bearer {token}
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="batch" type="array" required=true %}
Event payload, either a "track" or "identify" call, following the Segment event specification. 
{% endapi-method-parameter %}
{% endapi-method-body-parameters %}
{% endapi-method-request %}

{% api-method-response %}
{% api-method-response-example httpCode=200 %}
{% api-method-response-example-description %}
Cake successfully retrieved.
{% endapi-method-response-example-description %}

```
{    "name": "Cake's name",    "recipe": "Cake's recipe name",    "cake": "Binary cake"}
```
{% endapi-method-response-example %}

{% api-method-response-example httpCode=404 %}
{% api-method-response-example-description %}
Could not find a cake matching this query.
{% endapi-method-response-example-description %}

```
{    "message": "Ain't no cake like that."}
```
{% endapi-method-response-example %}
{% endapi-method-response %}
{% endapi-method-spec %}
{% endapi-method %}

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
     * Timestamp of the event. (Not required, will be now if left undefined)
     */
    timestamp?: string | Date;
    /**
     * Optional: unique message idempotency key. Duplicates will be ignored. 
     */
    messageId?: string;
}
```

#### **Example**

```javascript

fetch("https://app.sequence.so", {
  headers: {
    Authorization: "Bearer {token}",
  },
  body: {
    batch: [
      {
        // Track calls specify properties
        type: "track",
        event: "User Registered",
        userId: "6319fea8-80d1-4488-8a7b-2d524e3c1f2f",
        properties: {
          firstName: "Tom",
          lastName: "Jones",
          clickedButtonTimes: 5,
        },
      },
      {
        // Identify calls specify traits
        type: "identify",
        userId: "6319fea8-80d1-4488-8a7b-2d524e3c1f2f",
        traits: {
          firstName: "Tom",
          lastName: "Jones",
          companyName: 'Tesla',
          phone: '+17173332222'
        },
      },
    ],
  },
});

```

