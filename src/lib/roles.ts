/** Customer — can browse, cart, checkout */
export function isCustomerRole(role: string | undefined) {
  return role === "USER";
}

export function isFarmerRole(role: string | undefined) {
  return role === "FARMER";
}

export function isSuperAdminRole(role: string | undefined) {
  return role === "SUPER_ADMIN" || role === "ADMIN";
}

/** Farmer may list/manage products only when verified by super admin */
export function farmerCanSell(
  role: string | undefined,
  farmerVerified: boolean | undefined
) {
  return role === "FARMER" && !!farmerVerified;
}
