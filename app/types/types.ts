export interface CurrentUser {
  currentUser: { id: string; email: string; iat: number } | null;
}

// export type CurrentUser = {
//   id: string;
//   email: string;
//   iat: number;
// };

export type TicketResult = {
  title: string;
  price: number;
  category: string;
  description: string;
  thumbnailImagePublicId: string;
  ticketImagePublicId: string;
  userId: string;
  orderId: string | null;
  createdAt: string;
  updatedAt: string;
  version: number;
  id: string;
};

export type OrderResult = {
  userId: string;
  status: string;
  expiresAt: string;
  serverTime: string;
  ticket: {
    title: string;
    price: number;
    category: string;
    description: string;
    thumbnailImagePublicId: string;
    ticketImagePublicId: string;
    version: number;
    id: string;
  };
  version: number;
  id: string;
};

export const OrderStatus = {
  Created: "created",
  Cancelled: "cancelled",
  AwaitingPayment: "awaiting:payment",
  Complete: "complete",
};

export type User = {
  id: string;
  email: string;
  billingAddress?: {
    name: string;
    address: string;
    postalCode: string;
    city: string;
    state: string;
    country: string;
  };
  iat: number;
};

export type OrderData = {
  userId: string;
  status: string;
  expiresAt: string;
  ticket: {
    title: string;
    price: number;
    category: string;
    description: string;
    thumbnailImagePublicId: string;
    ticketImagePublicId: string;
    version: number;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  version: number;
  id: string;
};

export type EnvType = {
  HOST: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  CLOUDINARY_UPLOAD_PRESET: string;
};
