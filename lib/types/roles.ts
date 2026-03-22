export type UserRole = 'super_admin' | 'admin' | 'operator'

export const DEFAULT_ROLE: UserRole = 'admin'

export function isValidRole(role: unknown): role is UserRole {
  return role === 'super_admin' || role === 'admin' || role === 'operator'
}

export function getUserRole(userMetadata: Record<string, unknown> | null | undefined): UserRole {
  const role = userMetadata?.role
  return isValidRole(role) ? role : DEFAULT_ROLE
}
