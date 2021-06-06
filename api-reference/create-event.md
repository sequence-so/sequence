# Event

{% api-method method="post" host="https://api.cakes.com" path="/api/v1/event" %}
{% api-method-summary %}
Create Event
{% endapi-method-summary %}

{% api-method-description %}
Create an Event associated with a particular Person. Based off the Segment specification, we currently support the following event types:  
- Track  
- Identify  
  
Note: Anonymous events not currently supported.
{% endapi-method-description %}

{% api-method-spec %}
{% api-method-request %}
{% api-method-path-parameters %}
{% api-method-parameter name="id" type="string" %}
ID of the cake to get, for free of course.
{% endapi-method-parameter %}
{% endapi-method-path-parameters %}

{% api-method-headers %}
{% api-method-parameter name="Authentication" type="string" required=true %}
Authentication token to track down who is emptying our stocks.
{% endapi-method-parameter %}
{% endapi-method-headers %}

{% api-method-body-parameters %}
{% api-method-parameter name="personId" type="string" required=true %}
The Person associated with this event.
{% endapi-method-parameter %}

{% api-method-parameter name="messageId" type="string" required=false %}
Unique event id. If a duplicate identifier is used, an error will be thrown. If none is passed, a unique identifier will be generated \(this is not recommend because this ID functions as an idempotency key\). 
{% endapi-method-parameter %}

{% api-method-parameter name="event" type="string" required=false %}
Action name.
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



