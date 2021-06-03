// https://docs.google.com/spreadsheets/d/1ZHGfNrCxBQbEyevmVxNoU0DGjb8cJMro1iwIRZLWjPw/view#gid=1831344391

export const ECOMMERCE_EVENT_LIST = [
  "Products Searched",
  "Product List Viewed",
  "Product List Filtered",
  "Promotion Viewed",
  "Promotion Clicked",
  "Product Clicked",
  "Product Viewed",
  "Product Added",
  "Product Removed",
  "Cart Viewed",
  "Checkout Started",
  "Checkout Step Viewed",
  "Checkout Step Completed",
  "Payment Info Entered",
  "Order Completed",
  "Order Updated",
  "Order Refunded",
  "Order Cancelled",
  "Coupon Entered",
  "Coupon Applied",
  "Coupon Denied",
  "Coupon Removed",
  "Product Added to Wishlist",
  "Product Removed from Wishlist",
  "Wishlist Product Added to Cart",
  "Product Shared",
  "Cart SharedProduct Reviewed",
];

export const B2B_SAAS_EVENT_LIST = [
  "Account Created",
  "Account Deleted",
  "Signed Up",
  "Signed In",
  "Signed Out",
  "Invite Sent",
  "Account Added User",
  "Account Removed User",
  "Trial Started",
  "Trial Ended",
];

export const VIDEO_EVENT_LIST = [
  "Video Playback Started",
  "Video Playback Paused",
  "Video Playback Interrupted",
  "Video Playback Buffer Started",
  "Video Playback Buffer Completed",
  "Video Playback Seek Started",
  "Video Playback Seek Completed",
  "Video Playback Resumed",
  "Video Playback Completed",
  "Video Content Started",
  "Video Content Playing",
  "Video Content Completed",
  "Video Ad Started",
  "Video Ad Playing",
  "Video Ad Completed",
];

export const MOBILE_EVENT_LIST = [
  "Application Installed",
  "Application Opened",
  "Application Updated",
  "Application Backgrounded",
  "Application Crashed",
  "Application Uninstalled",
  "Push Notification Received",
  "Push Notification Tapped",
  "Push Notification Bounced",
  "Install Attributed",
  "Deep Link Clicked",
  "Deep Link Opened",
];

export const EVENT_LIST = ECOMMERCE_EVENT_LIST.concat(
  B2B_SAAS_EVENT_LIST,
  VIDEO_EVENT_LIST,
  MOBILE_EVENT_LIST
);
