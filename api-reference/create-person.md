---
description: Person API for Sequence.
---

# Person

{% api-method method="post" host="https://api.sequence.so" path="/api/v1/person" %}
{% api-method-summary %}
Create Person
{% endapi-method-summary %}

{% api-method-description %}
Create a new Person with specific attributes. 
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-headers %}
{% api-method-parameter name="Authentication" type="string" required=true %}
Provide the Sequence Webhook Token in "Authorization: Bearer {token}" format.
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="externalId" type="string" required=true %}
Person's ID in your app \(so you can link IDs\).
{% endapi-method-parameter %}

{% api-method-parameter name="intercomId" type="string" required=false %}
The associated Intercom ID for this Person. 
{% endapi-method-parameter %}

{% api-method-parameter name="industry" type="string" required=false %}
The Person's industry. 
{% endapi-method-parameter %}

{% api-method-parameter name="companyName" type="string" required=false %}
Name of the Person's company.
{% endapi-method-parameter %}

{% api-method-parameter name="websiteUrl" type="string" required=false %}
URL of the Person's website. 
{% endapi-method-parameter %}

{% api-method-parameter name="title" type="string" required=false %}
Title of the person in their company.
{% endapi-method-parameter %}

{% api-method-parameter name="city" type="string" required=false %}
City of the person.
{% endapi-method-parameter %}

{% api-method-parameter name="region" type="string" required=false %}
Region \(state or province\) of the person.
{% endapi-method-parameter %}

{% api-method-parameter name="country" type="string" required=false %}
Country of the person.
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
Signed up date in ISO date format.
{% endapi-method-parameter %}

{% api-method-parameter name="phone" type="string" required=false %}
Person phone \(no format enforced\).
{% endapi-method-parameter %}

{% api-method-parameter name="photo" type="string" required=false %}
URL to person's photo.
{% endapi-method-parameter %}

{% api-method-parameter name="email" type="string" required=false %}
Person email.
{% endapi-method-parameter %}

{% api-method-parameter name="firstName" type="string" required=false %}
Person first name.
{% endapi-method-parameter %}

{% api-method-parameter name="lastName" type="string" required=false %}
Person last name.
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



