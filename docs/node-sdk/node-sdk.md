# Node SDK

The [Node SDK](https://github.com/sequence-so/sequence-node) allows you to send **track** and **identify** calls to the Sequence backend, allowing you to create **Events** and **Users**. 

### Track Call

The NodeJS SDK offers the following method for tracking events:

```typescript
import Analytics from 'sequence-node';
// Pass the API Token from your onboarding (no need to Base64 encode it)
const analytics = new Analytics(process.env.SEQUENCE_API_KEY);

interface SequenceEvent {
  /**
   * Defines the name of the event.
   */
  event: string;
  /**
   * Timestamp of the event. If you're doing a historical import,
   * specify the timestamp here. Otherwise, leave empty.
   */
  timestamp?: string | Date;
  /**
   * Custom properties on the event.
   */
  properties?: {
    [k: string]: any;
  };
}

// Track an event
analytics.track(event: SequenceEvent, callback?: CallbackFunction)
```

### Identify Call

```typescript
export interface Identify extends BaseEvent {
  /**
   * Timestamp of the event.
   */
  timestamp?: string | Date;
  /**
   * User ID associated with the event
   */
  userId: string;
  /**
   * Optional: unique message idempotency key.
   */
  messageId?: string;
  /**
   * Custom traits on the user.
   */
  traits?: Record<string, any>;
}

// Identify a user (no anonymous user support)
analytics.identify({
  userId: 'my-user-id',
  traits: {
    email: 'snoop@dogg.com',
    firstName: 'Snoop',
    lastName: 'Lion',
  }
})
```

## Examples

**Track Event**

```typescript
import Sequence from 'sequence-node';
const analytics = new Sequence(process.env.SEQUENCE_API_KEY)
analytics.track({
  // id of user (required)
  userId: 'my-user-id',
  // event name (required)
  event: 'User Registered',
  // properties associated with event
  properties: {
    firstName: 'John',
    lastName: 'Smith'
  },
  // original event date
  timestamp: new Date()
})
```

**Identify Event**

```typescript
import Sequence from 'sequence-node';
const analytics = new Sequence(process.env.SEQUENCE_API_KEY)

analytics.identify({
  // id of user (required)
  userId: 'my-user-id',
  // traits associated with the user
  traits: {
    firstName: 'John',
    lastName: 'Smith'
  }
})
```

