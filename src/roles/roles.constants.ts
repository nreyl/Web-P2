import type { User } from '../users/user.entity.js';

export const ADMIN_ROLE = 'admin';
export const CONDUCTOR_ROLE = 'conductor';
export const SUPERVISOR_ROLE = 'supervisor';

export const hasRole = (user: User | null, role: string) =>
  !!user?.roles?.some((r) => r.role_name === role);
