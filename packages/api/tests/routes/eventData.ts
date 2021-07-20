export const courseClicked = {
  receivedAt: "2021-06-07T03:56:05Z",
  messageId: "DjqvhmyoSH",
  type: "track",
  context: {
    app: {
      name: "Sanis",
      version: "-1491.0585",
      namespace: "test.me",
    },
    device: {
      id: "eb747522-b276-4775-bcdd-34b6862698ce",
      advertisingId: "57cb62d2-3745-4935-9d9e-d90d1ebc8296",
      manufacturer: "Tanwarm",
      model: "Quote-Cof",
      type: "android",
    },
    ip: "200.187.119.253",
    locale: "nl-NL",
    os: {
      version: "-903.1988",
    },
  },
  properties: {
    title: "Intro to Analytics",
  },
  event: "Course Clicked",
  userId: "5ISdAioec6",
  anonymousId: "tdW5jUef4q",
  timestamp: "2021-06-07T03:56:05Z",
};

export const ecommerceOrderCompleted = {
  receivedAt: "2021-07-21T01:43:55Z",
  messageId: "z9WKlllaNM",
  type: "track",
  context: {
    app: {
      name: "Statis",
      version: "-1500.9333",
      namespace: "test.name",
    },
    device: {
      id: "21637c09-df20-46cb-9c54-4b0fdb4dedfe",
      advertisingId: "3f2d5051-ce5a-432c-98f5-07bf284f6fe5",
      manufacturer: "Quotecom",
      model: "Lat Lex",
      type: "android",
    },
    ip: "75.246.51.222",
    locale: "nl-NL",
    os: {
      version: "1200.9387",
    },
  },
  properties: {
    checkout_id: "checkout-tclqF8ynMc",
    order_id: "order-mqSm8xBjgD",
    affiliation: "Google",
    value: 19.99,
    total: 19.99,
    revenue: 19.99,
    shipping: 1.99,
    tax: 0.93,
    products: [
      {
        product_id: "prod-BYcTYq6lla",
        sku: "sku-4GY5T11lMo",
        name: "Men's 501 Jeans",
        brand: "Levis",
        price: 19.99,
        quantity: 1,
        variant: "Black",
        coupon: "MAY_DEALS_3",
        position: 1,
        url: "test.name",
        image_url:
          "https://s3.amazonaws.com/uifaces/faces/twitter/tereshenkov/128.jpg",
      },
    ],
  },
  event: "Order Completed",
  userId: "JEko06EZDV",
  anonymousId: "nWwfklYQ6u",
  timestamp: "2021-07-21T01:43:55Z",
};

export const trackExperimentViewed = {
  receivedAt: "2021-07-21T01:43:55Z",
  messageId: "rQeUO6L9yV",
  type: "track",
  properties: {
    experiment_id: "Sp0n1Q2ziJ",
    experiment_name: "button_alteration",
    variation_id: "B4Atsa9ahA",
    variation_name: "blue",
  },
  event: "Experiment Viewed",
  userId: "1cezxfHlqZ",
  anonymousId: "qQWQzsOa22",
  timestamp: "2021-07-21T01:43:55Z",
};

export const identify1 = {
  receivedAt: "2021-06-07T03:56:05Z",
  messageId: "AcxAMBYg5x",
  type: "identify",
  traits: {
    firstName: "Michale",
    lastName: "Burgess",
  },
  userId: "eCiPRk7U2A",
  anonymousId: "QCXdx6LtMv",
  timestamp: "2021-06-07T03:56:05Z",
};

export const identify2 = {
  receivedAt: "2021-07-21T01:43:55Z",
  messageId: "kfzKyjdURh",
  type: "identify",
  traits: {
    name: "Wei James",
    email: "pifagor@example.me",
    plan: "premium",
    logins: 5,
  },
  userId: "2zeqgSkKjz",
  anonymousId: "gLGn8AaUxx",
  timestamp: "2021-07-21T01:43:55Z",
};

export const identify3 = {
  receivedAt: "2021-07-21T01:43:55Z",
  messageId: "ILuRjMsgnJ",
  type: "identify",
  traits: {
    address: {
      city: "San Francisco",
      country: "US",
      postalCode: "94111",
      state: "CA",
    },
  },
  userId: "NwoR4l3ixj",
  anonymousId: "423nk60AgF",
  timestamp: "2021-07-21T01:43:55Z",
};
