export const API_BASE_URL =
  process.env.NEXT_PUBLIC_REWORE_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export const AUTH_TOKEN_KEY = "rewore_token";
export const AUTH_FLAG_KEY = "rewore_authed";
export const AUTH_USER_KEY = "rewore_user";

export type Role = "BUYER" | "SELLER" | "ADMIN";
export type ProductStatus = "ACTIVE" | "SOLD" | "AUCTION" | "INACTIVE";
export type ProductCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type AuctionStatus = "UPCOMING" | "LIVE" | "ENDED" | "CANCELLED";
export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "REFUNDED";

export type ApiMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type ApiListResponse<T> = {
  success: true;
  data: T[];
  meta: ApiMeta;
};

export type ApiItemResponse<T> = {
  success: true;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  stack?: string;
};

export type User = {
  id: string;
  email: string;
  name: string;
  avatar: string | null;
  bio: string | null;
  phone: string | null;
  address: string | null;
  role: Role;
  reputation: number;
  totalSales: number;
  totalBids: number;
  isVerified: boolean;
  createdAt: string;
};

export type AuthUser = Partial<User> & {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export type AuthResponse = {
  success: true;
  token: string;
  user: AuthUser;
};

export type MeResponse = {
  success: true;
  user: User;
};

export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  condition: ProductCondition;
  status: ProductStatus;
  brand: string | null;
  size: string | null;
  color: string | null;
  tags: string[];
  viewCount: number;
  sellerId: string;
  seller?: Pick<User, "id" | "name" | "avatar" | "reputation" | "isVerified">;
  _count?: {
    wishlistItems: number;
  };
  auction?: Auction | null;
  createdAt: string;
  updatedAt: string;
};

export type Auction = {
  id: string;
  productId: string;
  sellerId: string;
  startPrice: number;
  currentBid: number;
  minIncrement: number;
  startTime: string;
  endTime: string;
  status: AuctionStatus;
  winnerId: string | null;
  product?: Product;
  seller?: Pick<User, "id" | "name" | "avatar" | "reputation" | "isVerified">;
  bids?: Bid[];
  _count?: {
    bids: number;
  };
  createdAt: string;
  updatedAt: string;
};

export type Bid = {
  id: string;
  auctionId: string;
  bidderId: string;
  amount: number;
  isWinning: boolean;
  bidder?: Pick<User, "id" | "name" | "avatar">;
  auction?: Auction;
  createdAt: string;
};

export type Order = {
  id: string;
  buyerId: string;
  sellerId: string;
  productId: string | null;
  auctionId: string | null;
  totalPrice: number;
  shippingFee: number;
  status: OrderStatus;
  shippingAddress: string | null;
  note: string | null;
  paidAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
  buyer?: Pick<User, "id" | "name" | "avatar" | "email">;
  seller?: Pick<User, "id" | "name" | "avatar" | "email">;
  product?: Pick<Product, "id" | "title" | "images" | "category" | "price"> | null;
  auction?: Pick<Auction, "id" | "currentBid" | "endTime"> | null;
  createdAt: string;
  updatedAt: string;
};

export type WishlistItem = {
  id: string;
  userId: string;
  productId: string;
  product: Product;
  createdAt: string;
};

export type ProductListQuery = {
  page?: number;
  limit?: number;
  category?: string;
  condition?: ProductCondition;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  sellerId?: string;
  sortBy?: "price_asc" | "price_desc" | "newest" | "popular";
};

export type AuctionListQuery = {
  page?: number;
  limit?: number;
  status?: AuctionStatus;
  category?: string;
};

export type PageQuery = {
  page?: number;
  limit?: number;
};

export type OrderListQuery = PageQuery & {
  role?: "buyer" | "seller";
  status?: OrderStatus;
};

export type UserListQuery = PageQuery & {
  search?: string;
};

export type CreateProductPayload = {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ProductCondition;
  images?: string[];
  brand?: string;
  size?: string;
  color?: string;
  tags?: string[];
};

export type CreateAuctionPayload = {
  productId: string;
  startPrice: number;
  minIncrement?: number;
  startTime: string;
  endTime: string;
};

export type UpdateUserPayload = Partial<
  Pick<User, "name" | "bio" | "phone" | "address" | "avatar">
>;

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
  }
}

export function getStoredToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(AUTH_TOKEN_KEY);
}

export function setStoredAuth(token: string, user: AuthUser | User) {
  localStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.setItem(AUTH_FLAG_KEY, "true");
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function clearStoredAuth() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(AUTH_FLAG_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
}

export function getStoredUser(): AuthUser | User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser | User) : null;
  } catch {
    return null;
  }
}

function toQueryString(params?: Record<string, string | number | undefined>) {
  if (!params) return "";
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

async function readJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return {} as T;
  return JSON.parse(text) as T;
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = false, headers, body, ...init } = options;
  const token = auth ? getStoredToken() : null;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    body,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  });

  const json = await readJson<T | ApiErrorResponse>(response);
  const isApiError =
    typeof json === "object" &&
    json !== null &&
    "success" in json &&
    json.success === false;

  if (!response.ok || isApiError) {
    const error = json as ApiErrorResponse;
    throw new ApiError(
      error.message || `Request failed with status ${response.status}`,
      response.status,
      error.errors
    );
  }

  return json as T;
}

export const healthApi = {
  check: () => apiRequest<{ status: "ok"; timestamp: string }>("/health"),
};

export const authApi = {
  register: (payload: { email: string; password: string; name: string }) =>
    apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: { email: string; password: string }) =>
    apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () => apiRequest<MeResponse>("/api/auth/me", { auth: true }),
  logout: () =>
    apiRequest<{ success: true; message: string }>("/api/auth/logout", {
      method: "POST",
      auth: true,
    }),
};

export const usersApi = {
  list: (query?: UserListQuery) =>
    apiRequest<ApiListResponse<User>>(`/api/users${toQueryString(query)}`, {
      auth: true,
    }),
  get: (id: string) => apiRequest<ApiItemResponse<User>>(`/api/users/${id}`),
  update: (id: string, payload: UpdateUserPayload) =>
    apiRequest<ApiItemResponse<User>>(`/api/users/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiRequest<{ success: true; message: string }>(`/api/users/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const productsApi = {
  list: (query?: ProductListQuery) =>
    apiRequest<ApiListResponse<Product>>(`/api/products${toQueryString(query)}`),
  get: (id: string) => apiRequest<ApiItemResponse<Product>>(`/api/products/${id}`),
  create: (payload: CreateProductPayload) =>
    apiRequest<ApiItemResponse<Product>>("/api/products", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
  update: (id: string, payload: Partial<CreateProductPayload>) =>
    apiRequest<ApiItemResponse<Product>>(`/api/products/${id}`, {
      method: "PUT",
      auth: true,
      body: JSON.stringify(payload),
    }),
  delete: (id: string) =>
    apiRequest<{ success: true; message: string }>(`/api/products/${id}`, {
      method: "DELETE",
      auth: true,
    }),
};

export const auctionsApi = {
  list: (query?: AuctionListQuery) =>
    apiRequest<ApiListResponse<Auction>>(`/api/auctions${toQueryString(query)}`),
  get: (id: string) => apiRequest<ApiItemResponse<Auction>>(`/api/auctions/${id}`),
  create: (payload: CreateAuctionPayload) =>
    apiRequest<ApiItemResponse<Auction>>("/api/auctions", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
  cancel: (id: string) =>
    apiRequest<{ success: true; message: string; data: Auction }>(
      `/api/auctions/${id}/cancel`,
      {
        method: "PATCH",
        auth: true,
      }
    ),
};

export const bidsApi = {
  create: (payload: { auctionId: string; amount: number }) =>
    apiRequest<ApiItemResponse<Bid>>("/api/bids", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
  forAuction: (auctionId: string, query?: PageQuery) =>
    apiRequest<ApiListResponse<Bid>>(
      `/api/bids/auction/${auctionId}${toQueryString(query)}`
    ),
  myBids: (query?: PageQuery) =>
    apiRequest<ApiListResponse<Bid>>(`/api/bids/my-bids${toQueryString(query)}`, {
      auth: true,
    }),
};

export const ordersApi = {
  list: (query?: OrderListQuery) =>
    apiRequest<ApiListResponse<Order>>(`/api/orders${toQueryString(query)}`, {
      auth: true,
    }),
  get: (id: string) =>
    apiRequest<ApiItemResponse<Order>>(`/api/orders/${id}`, { auth: true }),
  updateStatus: (id: string, status: OrderStatus) =>
    apiRequest<ApiItemResponse<Order>>(`/api/orders/${id}/status`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ status }),
    }),
};

export const wishlistApi = {
  list: (query?: PageQuery) =>
    apiRequest<ApiListResponse<WishlistItem>>(
      `/api/wishlist${toQueryString(query)}`,
      { auth: true }
    ),
  add: (productId: string) =>
    apiRequest<ApiItemResponse<WishlistItem>>("/api/wishlist", {
      method: "POST",
      auth: true,
      body: JSON.stringify({ productId }),
    }),
  remove: (productId: string) =>
    apiRequest<{ success: true; message: string }>(`/api/wishlist/${productId}`, {
      method: "DELETE",
      auth: true,
    }),
  check: (productId: string) =>
    apiRequest<{ success: true; isInWishlist: boolean }>(
      `/api/wishlist/check/${productId}`,
      { auth: true }
    ),
};



