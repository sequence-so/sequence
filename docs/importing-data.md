---
description: Describes how to import your events and user data into Sequence.
---

# Importing Data

### Importing Data

There are three ways you can import data into Sequence at the moment:

* Via **Segment Webhook** connector \(read below\)
* Via [**HTTP API**](api-reference/segment/)\*\*\*\*
* Via [**NodeJS SDK**](https://www.npmjs.com/package/sequence-node)\*\*\*\*
* Via CSV \(coming soon\)
* Via Intercom \(coming soon\)

### Segment Connector

{% hint style="info" %}
Note: these instructions are available via our onboarding flow, accessible [here](https://my.sequence.so/onboarding) \([https://my.sequence.so/onboarding](https://my.sequence.so/onboarding)\). 
{% endhint %}

In this setup, we'll create a pipeline from your Segment data to Sequence. In Segment, visit **Connections &gt; Source** and select the source you'd like to send data from. 

![](.gitbook/assets/segment_first.gif)

Then, click **Add Destination.** Select **Custom Webhook \(Raw Data\) &gt; Configure Webhook** and give it a name \(Sequence\). 

![](.gitbook/assets/segment_second.gif)

The Webhook URL is `https://api.sequence.so/api/segment`. 

Next you'll need your auth token. This is available at `https://my.sequence.so/onboarding/segment`.

Fill in the custom headers field with `Authorization: {Token}`.

![](.gitbook/assets/segment_third.gif)

Lastly, make sure the webhook is turned on!

![](.gitbook/assets/segment_fourth.gif)

Back in the Sequence dashboard, click "Next" at the bottom of the Segment integration page. You'll see this page:

![](.gitbook/assets/image%20%283%29.png)

Once Segment sends over data, you'll see this:

![](.gitbook/assets/image%20%2817%29.png)

### API Import

You can also import data via our HTTP API. 

{% page-ref page="api-reference/create-person.md" %}



