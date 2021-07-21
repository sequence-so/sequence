# Campaign Blocks

Campaigns are composed of **Blocks** which let you perform different actions in a Campaign. 

![Image of Campaign Blocks](../.gitbook/assets/image%20%2820%29.png)

## Block Types

### Trigger Block

A **Trigger Block** lets you create a custom Audience right inside of your Campaign. This Audience functions exactly like a normal Audience except that it's not visible from your main Audiences page. 

Trigger Blocks can't receive any connections, meaning that they must be at the start a Campaign. Trigger Blocks can be connected to a **Filter**, **Wait**, and **Email block**. 

### Audience Block

An **Audience Block** lets you choose an existing Audience you've created from the Audiences page. Modifying an Audience block's Audience settings is not possible. 

Like a Trigger Block, Audience Blocks can't receive any connections, meaning that they mus**t** be at the start a Campaign. Audience Blocks can be connected to a **Filter**, **Wait**, and **Email block**. 

### Filter Block

A **Filter Block** filters down the set of Product Users that are in the current step of a Campaign. 

Filter blocks can receive connections from any other Block. Filters can connect to **Filter**, **Wait**, and **Email Blocks**.

Filter Blocks' have two outgoing connections: when a Product User matches the Filter and when they don't match the Filter. 

![Outgoing connections for a Filter Block.](../.gitbook/assets/image%20%2819%29.png)

### Wait Block

A **Wait Block** lets you specify a time period to pause the campaign for. You can specify a number of days that must elapse before continuing. 

Wait blocks can receive connections from any other Block. Wait blocks can connect to **Filter**, **Wait**, and **Email Blocks**.

### Email Block

An **Email Block** lets you send an email to your customers. Emails can be HTML or Plain, support variables, and provide flexibility as to sending times according to the Email Sending Rules section. You can select a template and customize it \(which are pulled from the emails accessible from your Emails page\) or you can begin an entirely new email. 

Email blocks can receive connections from any other Block. Email blocks can connect to **Filter, Wait,** and other **Email Blocks.** 

