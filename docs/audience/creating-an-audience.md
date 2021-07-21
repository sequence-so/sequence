# Creating an Audience

### Creating an Audience

To create an Audience, click on **Audiences** on the sidebar and click **Create Audience**. 

![Audience Builder View](../.gitbook/assets/image%20%2811%29.png)

### Configuring an Audience

![](../.gitbook/assets/image%20%288%29.png)

Configuring an Audience is straight forward. Begin by selecting root condition: either an **All** condition which means all sub-queries must match or an **One of** condition which matches if just one sub-query matches.

You can filter by **Event** or **User Attribute**. 

### Filtering by Events

Any Event can be filtered by whether it was performed by the User or not. 

Note: to see a User's Event stream, you can view the **User Explorer,** find the User, and see what Events they've performed.

{% page-ref page="../event-explorer/event-explorer.md" %}

### Filtering by User Attributes

You can filter by the following attributes for a User:

```text
Attribute Name | Attribute Type
-------------------------------
firstName:       string
lastName:        string
email:           string
photo:           string
phone:           string
signedUpAt:      Date
lastSeenAt:      Date
browser:         string
browserVersion:  string
browserLanguage: string
os:              string
country:         string
region:          string
city:            string
title:           string
websiteUrl:      string
companyName:     string
industry:        string
intercomId:      string
externalId:      string
```

You can also filter by any custom User attributes that you've specified.

{% page-ref page="../user-explorer/person-explorer.md" %}

