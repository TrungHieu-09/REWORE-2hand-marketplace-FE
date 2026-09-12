export const API_BASE_URL =
  process.env.NEXT_PUBLIC_REWORE_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export const AUTH_TOKEN_KEY = "rewore_token";
export const AUTH_FLAG_KEY = "rewore_authed";
export const AUTH_USER_KEY = "rewore_user";
export const PENDING_OTP_EMAIL_KEY = "rewore_pending_otp_email";

export type Role = "BUYER" | "SELLER" | "ADMIN";
export type ProductStatus = "ACTIVE" | "SOLD" | "AUCTION" | "INACTIVE" | "HIDDEN" | "REMOVED";
export type ProductCondition = "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
export type AuctionStatus = "UPCOMING" | "LIVE" | "ENDED" | "CANCELLED";
export type SellerApplicationStatus =
  | "PENDING"
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";
export type SellerStatus =
  | "NONE"
  | "PENDING"
  | "PENDING_VERIFICATION"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED";
export type ReportStatus = "OPEN" | "RESOLVED" | "DISMISSED";
export type PaymentStatus = "UNPAID" | "PAID" | "REFUNDED";
export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PAID"
  | "SHIPPED"
  | "DELIVERED"
  | "COMPLETED"
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
  requiresOtp?: boolean;
  email?: string;
  retryAfter?: number;
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
  sellerStatus?: SellerStatus;
  sellerApprovedAt?: string | null;
  sellerSuspendedReason?: string | null;
  createdAt: string;
};

export type AuthUser = Partial<User> & {
  id: string;
  email: string;
  name: string;
  role?: Role;
};

export type AuthResponse = {
  success: true;
  token: string;
  user: AuthUser;
};

export type RegisterOtpResponse = {
  success: true;
  message: string;
  email?: string;
  requiresOtp: true;
};

export type ResendOtpResponse = {
  success: true;
  message: string;
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
  paymentStatus?: PaymentStatus;
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

export type SellerApplication = {
  id: string;
  userId: string;
  shopName: string;
  legalName?: string;
  idCardFrontImage?: string;
  idCardBackImage?: string;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  selfieUrl?: string | null;
  phone?: string;
  pickupAddress: string;
  bankName: string | null;
  bankAccountNumber: string;
  bankAccountHolder?: string;
  bankAccountName?: string;
  vietQr?: string | null;
  sellingDescription?: string | null;
  acceptedSellerTerms?: boolean;
  status: SellerApplicationStatus;
  rejectionReason: string | null;
  reviewedByAdminId: string | null;
  reviewedAt: string | null;
  rejectedReason?: string | null;
  reviewedBy?: string | null;
  user?: Pick<User, "id" | "email" | "name" | "phone" | "address" | "role" | "isVerified" | "sellerStatus" | "createdAt"> & {
    isBanned?: boolean;
  };
  createdAt: string;
  updatedAt: string;
};

export type SellerReport = {
  id: string;
  reporterId: string;
  targetType?: "USER" | "PRODUCT" | "ORDER";
  targetId?: string;
  sellerId?: string;
  reason: string;
  description?: string | null;
  status: ReportStatus;
  resolutionAction?: "WARN" | "SUSPEND" | "DISMISS" | null;
  resolutionNote?: string | null;
  reporter?: Pick<User, "id" | "email" | "name" | "avatar">;
  resolvedByAdmin?: Pick<User, "id" | "email" | "name">;
  seller?: Pick<User, "id" | "email" | "name" | "avatar" | "role" | "sellerStatus">;
  createdAt: string;
  updatedAt: string;
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

export type AdminApplicationQuery = PageQuery & {
  status?: SellerApplicationStatus | "ALL";
};

export type AdminReportQuery = PageQuery & {
  status?: ReportStatus | "ALL";
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
  requiresOtp?: boolean;
  email?: string;
  retryAfter?: number;

  constructor(
    message: string,
    status: number,
    errors?: Record<string, string[]>,
    meta?: Pick<ApiErrorResponse, "requiresOtp" | "email" | "retryAfter">
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors;
    this.requiresOtp = meta?.requiresOtp;
    this.email = meta?.email;
    this.retryAfter = meta?.retryAfter;
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

export function setPendingOtpEmail(email: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(PENDING_OTP_EMAIL_KEY, email);
}

export function getPendingOtpEmail() {
  if (typeof window === "undefined") return "";
  return sessionStorage.getItem(PENDING_OTP_EMAIL_KEY) ?? "";
}

export function clearPendingOtpEmail() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(PENDING_OTP_EMAIL_KEY);
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
      error.errors,
      {
        requiresOtp: error.requiresOtp,
        email: error.email,
        retryAfter: error.retryAfter,
      }
    );
  }

  return json as T;
}

export const healthApi = {
  check: () => apiRequest<{ status: "ok"; timestamp: string }>("/health"),
};

export const authApi = {
  register: (payload: { email: string; password: string; name: string }) =>
    apiRequest<RegisterOtpResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  verifyOtp: (payload: { email: string; otp: string }) =>
    apiRequest<AuthResponse>("/api/auth/verify-otp", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  resendOtp: (payload: { email: string }) =>
    apiRequest<ResendOtpResponse>("/api/auth/resend-otp", {
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

export const adminApi = {
  sellerApplications: (query?: AdminApplicationQuery) =>
    apiRequest<ApiListResponse<SellerApplication>>(
      `/api/admin/sellers${toQueryString({
        ...query,
        status: query?.status === "ALL" ? undefined : query?.status,
      })}`,
      { auth: true }
    ),
  sellerApplication: (id: string) =>
    apiRequest<ApiItemResponse<SellerApplication>>(
      `/api/admin/sellers/${id}`,
      { auth: true }
    ),
  approveSellerApplication: (id: string) =>
    apiRequest<{
      success: true;
      message: string;
      data: SellerApplication;
    }>(`/api/admin/sellers/${id}/approve`, {
      method: "POST",
      auth: true,
    }),
  rejectSellerApplication: (id: string, reason: string) =>
    apiRequest<{
      success: true;
      message: string;
      data: SellerApplication;
    }>(`/api/admin/sellers/${id}/reject`, {
      method: "POST",
      auth: true,
      body: JSON.stringify({ reason }),
    }),
  reports: (query?: AdminReportQuery) =>
    apiRequest<ApiListResponse<SellerReport>>(
      `/api/admin/reports${toQueryString({
        ...query,
        status: query?.status === "ALL" ? undefined : query?.status,
      })}`,
      { auth: true }
    ),
  reviewReport: (
    id: string,
    payload: { action: "warn" | "suspend" | "dismiss"; note?: string }
  ) =>
    apiRequest<ApiItemResponse<SellerReport>>(
      `/api/admin/reports/${id}/resolve`,
      {
        method: "POST",
        auth: true,
        body: JSON.stringify(payload),
      }
    ),
  users: (query?: UserListQuery) =>
    apiRequest<ApiListResponse<User>>(`/api/admin/users${toQueryString(query)}`, {
      auth: true,
    }),
  products: (query?: ProductListQuery) =>
    apiRequest<ApiListResponse<Product>>(`/api/admin/products${toQueryString(query)}`, {
      auth: true,
    }),
  orders: (query?: PageQuery & { paymentStatus?: PaymentStatus; orderStatus?: OrderStatus }) =>
    apiRequest<ApiListResponse<Order>>(`/api/admin/orders${toQueryString(query)}`, {
      auth: true,
    }),
  confirmOrderPayment: (id: string) =>
    apiRequest<ApiItemResponse<Order>>(`/api/admin/orders/${id}/confirm-payment`, {
      method: "PATCH",
      auth: true,
    }),
  statsOverview: () =>
    apiRequest<ApiItemResponse<{
      total_users: number;
      total_sellers_approved: number;
      total_products: number;
      total_orders: number;
      gmv_total: number;
      pending_sellers_count: number;
      open_reports_count: number;
    }>>("/api/admin/stats/overview", { auth: true }),
  statsGrowth: (range: "week" | "month" = "week") =>
    apiRequest<{
      success: true;
      range: "week" | "month";
      data: { date: string; users_new: number; orders_new: number; gmv: number }[];
    }>(`/api/admin/stats/growth${toQueryString({ range })}`, { auth: true }),
};



