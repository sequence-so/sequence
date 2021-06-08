# Node SDK

The [Node SDK](https://github.com/sequence-so/sequence-node) allows you to send **track** and **identify** calls to the Sequence backend, allowing you to create **Events** and **Users**. 

### Track Call

The NodeJS SDK offers the following method for tracking events:

```typescript
import Analytics from 'sequence-lib';
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

