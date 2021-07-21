---
description: Import your Users.
---

# User API

{% api-method method="post" host="https://api.sequence.so" path="/user" %}
{% api-method-summary %}
Create User
{% endapi-method-summary %}

{% api-method-description %}
Create a new **User** with specific attributes. Equivalent to a sending an event of type **identify** \(see Batch Import API\).
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="Authentication" type="string" required=true %}
Base64 encoded token in "Authorization: Bearer {token}" format. See Getting Started /Authentication for more. 
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="externalId" type="string" required=true %}
User's ID in your app \(for ID linking\).
{% endapi-method-parameter %}

{% api-method-parameter name="intercomId" type="string" required=false %}
The associated Intercom ID for this User. 
{% endapi-method-parameter %}

{% api-method-parameter name="industry" type="string" required=false %}
The User's industry. 
{% endapi-method-parameter %}

{% api-method-parameter name="companyName" type="string" required=false %}
Name of the User's company.
{% endapi-method-parameter %}

{% api-method-parameter name="websiteUrl" type="string" required=false %}
URL of the User's website. 
{% endapi-method-parameter %}

{% api-method-parameter name="title" type="string" required=false %}
Title of the User in their company.
{% endapi-method-parameter %}

{% api-method-parameter name="city" type="string" required=false %}
City of the User.
{% endapi-method-parameter %}

{% api-method-parameter name="region" type="string" required=false %}
Region \(state or province\) of the User.
{% endapi-method-parameter %}

{% api-method-parameter name="country" type="string" required=false %}
Country of the User.
{% endapi-method-parameter %}

{% api-method-parameter name="os" type="string" required=false %}
Operating system last used to access your app.
{% endapi-method-parameter %}

{% api-method-parameter name="browserLanguage" type="string" required=false %}
Language settings for browser last used to access your app.
{% endapi-method-parameter %}

{% api-method-parameter name="browserVersion" type="string" required=false %}
Version of last browser used to access your app.
{% endapi-method-parameter %}

{% api-method-parameter name="browser" type="string" required=false %}
Last browser used to access your app.
{% endapi-method-parameter %}

{% api-method-parameter name="lastSeenAt" type="string" required=false %}
Last time the person performed an action, in ISO date format.
{% endapi-method-parameter %}

{% api-method-parameter name="signedUpAt" type="string" required=false %}
Sign up date \(ISO date format\).
{% endapi-method-parameter %}

{% api-method-parameter name="phone" type="string" required=false %}
User phone \(no formatting enforced\).
{% endapi-method-parameter %}

{% api-method-parameter name="photo" type="string" required=false %}
URL to User's photo.
{% endapi-method-parameter %}

{% api-method-parameter name="email" type="string" required=false %}
User's email.
{% endapi-method-parameter %}

{% api-method-parameter name="firstName" type="string" required=false %}
User's first name.
{% endapi-method-parameter %}

{% api-method-parameter name="lastName" type="string" required=false %}
User's last name.
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

### Passing in Custom Attributes

If you need to pass in custom attributes, simply add a key/value pair to your request body and it will automatically be saved.

{% hint style="info" %}
It's preferable to use the [Batch Import API](segment/) for large imports. 
{% endhint %}

### Examples

**Create a new User**

```typescript
import fetch from "node-fetch";

// 1. Get token from https://my.sequence.so/onboarding/node-sdk
const basicUsername = "TOKEN";

// 2. Base64 encode the Username:Password (password is empty)
const token = Buffer.from(basicUsername + ":").toString("base64");

const data = {
  firstName: "Wei",
  lastName: "James",
  email: "pifagor@example.me",
  plan: "premium",
  logins: 5,
  myCustomAttribute: "testing",
  externalId: "kfzKyjdURh",
};

// 3. Perform request with `Authorization: Basic [token]` in the header
fetch("https://api.sequence.so/user", {
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

**Updating User Attributes**

To update user attributes, use the [Batch Import API](segment/) and provide the user id in the `identify` call. Providing new attributes will overwrite existing ones. In order to remove a User attribute, simply pass the value `null` and it will be cleared from that User. 

