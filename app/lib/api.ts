export const API_BASE_URL =
  process.env.NEXT_PUBLIC_REWORE_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3001";

export const AUTH_TOKEN_KEY = "rewore_token";
export const AUTH_FLAG_KEY = "rewore_authed";
export const AUTH_USER_KEY = "rewore_user";
export const PENDING_OTP_EMAIL_KEY = "rewore_pending_otp_email";

export function apiAssetUrl(value?: string | null, fallback = "") {
  if (!value) return fallback;
  if (/^(https?:|data:|blob:)/i.test(value)) return value;

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export type Role = "BUYER" | "SELLER" | "ADMIN";
export type ProductStatus = "ACTIVE" | "SOLD" | "AUCTION" | "INACTIVE" | "HIDDEN" | "REMOVED";
export type ProductAvailabilityStatus = "upcoming_drop" | "available" | "held" | "sold";
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
  isBanned?: boolean;
  bannedReason?: string | null;
  bannedAt?: string | null;
  sellerStatus?: SellerStatus;
  sellerApprovedAt?: string | null;
  sellerSuspendedReason?: string | null;
  sellerProfile?: {
    id: string;
    shopName: string;
    shop_name?: string;
    idCardFrontUrl?: string | null;
    idCardBackUrl?: string | null;
    selfieUrl?: string | null;
    id_card_front_url?: string | null;
    id_card_back_url?: string | null;
    selfie_url?: string | null;
    status: SellerApplicationStatus;
    pickupAddress?: string | null;
    bankName?: string | null;
    bankAccountName?: string | null;
    createdAt?: string;
  } | null;
  createdAt: string;
};

export type SellerPublic = Pick<User, "id" | "name"> &
  Partial<Pick<User, "email" | "avatar" | "reputation" | "isVerified" | "role" | "sellerProfile" | "sellerStatus">> & {
    shopName?: string | null;
    shop_name?: string | null;
  };

export function sellerDisplayName(seller?: SellerPublic | null, fallback = "REWORE Seller") {
  return (
    seller?.sellerProfile?.shopName ||
    seller?.sellerProfile?.shop_name ||
    seller?.shopName ||
    seller?.shop_name ||
    seller?.name ||
    fallback
  );
}

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
  quantity?: number;
  availabilityStatus?: ProductAvailabilityStatus;
  brand: string | null;
  size: string | null;
  color: string | null;
  tags: string[];
  viewCount: number;
  sellerId: string;
  seller?: SellerPublic;
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
  seller?: SellerPublic;
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
  seller?: SellerPublic;
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
  shop_name?: string;
  legalName?: string;
  legal_name?: string;
  idCardFrontImage?: string;
  idCardBackImage?: string;
  idCardFrontUrl?: string;
  idCardBackUrl?: string;
  id_card_front_url?: string;
  id_card_back_url?: string;
  selfieUrl?: string | null;
  selfie_url?: string | null;
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

export type CreateSellerApplicationPayload = {
  shopName: string;
  legalName: string;
  idCardFrontImage: File;
  idCardBackImage: File;
  selfieImage?: File | null;
  phone: string;
  pickupAddress: string;
  bankName?: string;
  bankAccountNumber: string;
  bankAccountHolder: string;
  vietQr?: string;
  sellingDescription?: string;
  acceptedSellerTerms: true;
};

export type SellerApplicationResponse = {
  success: true;
  message?: string;
  sellerStatus: SellerStatus | SellerApplicationStatus;
  application: SellerApplication;
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
  seller?: SellerPublic;
  createdAt: string;
  updatedAt: string;
};

export type ProductListQuery = {
  page?: number;
  limit?: number;
  category?: string;
  condition?: ProductCondition;
  status?: ProductStatus;
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
  status?: "active" | "banned";
  sortBy?: "createdAt" | "email" | "name" | "role";
  sortOrder?: "asc" | "desc";
};

export type AdminApplicationQuery = PageQuery & {
  status?: SellerApplicationStatus | "ALL";
};

export type AdminReportQuery = PageQuery & {
  status?: ReportStatus | "ALL";
};

export type AdminProductQuery = PageQuery & {
  status?: ProductStatus | "ALL";
  sellerId?: string;
  sortBy?: "createdAt" | "price" | "title" | "status" | "viewCount" | "availabilityStatus";
  sortOrder?: "asc" | "desc";
};

export type CreateProductPayload = {
  title: string;
  description: string;
  price: number;
  category: string;
  condition: ProductCondition;
  quantity?: 1;
  images?: Array<string | File>;
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

function productRequestBody(payload: Partial<CreateProductPayload>, forceFormData = false) {
  const images = payload.images ?? [];
  const fileImages =
    typeof File !== "undefined" ? images.filter((image): image is File => image instanceof File) : [];

  if (!forceFormData && fileImages.length === 0) return JSON.stringify(payload);

  const formData = new FormData();
  if (payload.title !== undefined) formData.append("title", payload.title);
  if (payload.description !== undefined) formData.append("description", payload.description);
  if (payload.price !== undefined) formData.append("price", String(payload.price));
  if (payload.category !== undefined) formData.append("category", payload.category);
  if (payload.condition !== undefined) formData.append("condition", payload.condition);
  if (payload.quantity !== undefined) formData.append("quantity", String(payload.quantity));
  if (payload.brand !== undefined) formData.append("brand", payload.brand);
  if (payload.size !== undefined) formData.append("size", payload.size);
  if (payload.color !== undefined) formData.append("color", payload.color);
  if (payload.tags !== undefined) formData.append("tags", JSON.stringify(payload.tags));

  const imageUrls = images.filter((image): image is string => typeof image === "string");
  if (imageUrls.length) formData.append("images", JSON.stringify(imageUrls));
  fileImages.forEach((file) => formData.append("productImages", file));

  return formData;
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
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    body,
    headers: {
      ...(!isFormData ? { "Content-Type": "application/json" } : {}),
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
      body: productRequestBody({ ...payload, quantity: 1 }, true),
    }),
  update: (id: string, payload: Partial<CreateProductPayload>) =>
    apiRequest<ApiItemResponse<Product>>(`/api/products/${id}`, {
      method: "PUT",
      auth: true,
      body: productRequestBody(payload, true),
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

export type CreateOrderPayload = {
  productId: string;
  shippingAddress: string;
  shippingFee?: number;
  note?: string;
};

export const ordersApi = {
  create: (payload: CreateOrderPayload) =>
    apiRequest<ApiItemResponse<Order>>("/api/orders", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
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

export const sellerApi = {
  currentApplication: () =>
    apiRequest<SellerApplicationResponse>("/api/seller/application", {
      auth: true,
    }),
  submitApplication: (payload: CreateSellerApplicationPayload) => {
    const formData = new FormData();
    formData.append("shopName", payload.shopName);
    formData.append("legalName", payload.legalName);
    formData.append("idCardFrontImage", payload.idCardFrontImage);
    formData.append("idCardBackImage", payload.idCardBackImage);
    if (payload.selfieImage) formData.append("selfieImage", payload.selfieImage);
    formData.append("phone", payload.phone);
    formData.append("pickupAddress", payload.pickupAddress);
    if (payload.bankName) formData.append("bankName", payload.bankName);
    formData.append("bankAccountNumber", payload.bankAccountNumber);
    formData.append("bankAccountHolder", payload.bankAccountHolder);
    if (payload.vietQr) formData.append("vietQr", payload.vietQr);
    if (payload.sellingDescription) formData.append("sellingDescription", payload.sellingDescription);
    formData.append("acceptedSellerTerms", String(payload.acceptedSellerTerms));

    return apiRequest<SellerApplicationResponse>("/api/seller/application", {
      method: "POST",
      auth: true,
      body: formData,
    });
  },
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
  banUser: (id: string, reason: string) =>
    apiRequest<ApiItemResponse<User>>(`/api/admin/users/${id}/ban`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ reason }),
    }),
  unbanUser: (id: string) =>
    apiRequest<ApiItemResponse<User>>(`/api/admin/users/${id}/unban`, {
      method: "PATCH",
      auth: true,
    }),
  products: (query?: AdminProductQuery) =>
    apiRequest<ApiListResponse<Product>>(
      `/api/admin/products${toQueryString({
        ...query,
        status: query?.status === "ALL" ? undefined : query?.status,
      })}`,
      { auth: true }
    ),
  hideProduct: (id: string, reason: string) =>
    apiRequest<ApiItemResponse<Product>>(`/api/admin/products/${id}/hide`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify({ reason }),
    }),
  removeProduct: (id: string, reason: string) =>
    apiRequest<ApiItemResponse<Product>>(`/api/admin/products/${id}`, {
      method: "DELETE",
      auth: true,
      body: JSON.stringify({ reason }),
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



