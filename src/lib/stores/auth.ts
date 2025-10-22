import { writable, derived } from "svelte/store";
import { browser } from "$app/environment";
import { goto } from "$app/navigation";

export enum Role {
  SUPER_ADMIN = "manufacturer",
  TENANT_OWNER = "golf_course_owner",
  TENANT_MANAGER = "golf_course_manager",
  SYSTEM_ADMIN = "developer",
  OPERATION_STAFF = "staff",
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  tenantId?: string;
  avatar?: string;
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

function createAuthStore() {
  const { subscribe, set, update } = writable<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    token: null,
  });

  // Load token from localStorage on init
  if (browser) {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // Validate token and load user
      validateToken(token);
    } else {
      update((state) => ({ ...state, isLoading: false }));
    }
  }

  async function validateToken(token: string) {
    try {
      const response = await fetch("/api/auth/validate", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const user = await response.json();
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
          token,
        });
      } else {
        // Invalid token, clear localStorage and logout
        if (browser) {
          localStorage.removeItem("auth_token");
        }
        update((_state) => ({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          token: null,
        }));
      }
    } catch (error) {
      // Network error or other issue - clear auth state
      if (browser) {
        localStorage.removeItem("auth_token");
      }
      update((_state) => ({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        token: null,
      }));
    }
  }

  async function login(email: string, password: string) {
    update((state) => ({ ...state, isLoading: true }));

    // DEMO MODE - Mock authentication
    // In production, replace with real API call
    const demoAccounts: Record<
      string,
      { role: Role; name: string; tenantId?: string }
    > = {
      "admin@dyinnovate.com": { role: Role.SUPER_ADMIN, name: "DY Admin" },
      "owner@golfcourse.com": {
        role: Role.TENANT_OWNER,
        name: "Golf Course Owner",
        tenantId: "tenant-001",
      },
      "manager@golfcourse.com": {
        role: Role.TENANT_MANAGER,
        name: "Golf Course Manager",
        tenantId: "tenant-001",
      },
      "dev@via.com": { role: Role.SYSTEM_ADMIN, name: "System Developer" },
      "staff@golfcourse.com": {
        role: Role.OPERATION_STAFF,
        name: "Operation Staff",
        tenantId: "tenant-001",
      },
    };

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Check if email exists in demo accounts and password is 'demo123'
    if (demoAccounts[email] && password === "demo123") {
      const account = demoAccounts[email];
      const user: User = {
        id: `user-${Math.random().toString(36).substr(2, 9)}`,
        email,
        name: account.name,
        role: account.role,
        tenantId: account.tenantId,
        permissions: getPermissionsByRole(account.role),
      };

      const token = `demo-token-${Date.now()}`;

      if (browser) {
        localStorage.setItem("auth_token", token);

        // Store token-user mapping on server for validation
        fetch("/api/auth/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, user }),
        }).catch(() => {
          // Ignore errors in demo mode
        });
      }

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        token,
      });

      return { success: true };
    } else {
      update((state) => ({ ...state, isLoading: false }));
      return {
        success: false,
        error: "Invalid credentials. Use demo accounts with password: demo123",
      };
    }
  }

  function getPermissionsByRole(role: Role): string[] {
    const permissions: Record<Role, string[]> = {
      [Role.SUPER_ADMIN]: ["*"],
      [Role.TENANT_OWNER]: [
        "tenant:*",
        "vehicle:*",
        "reservation:*",
        "customer:*",
      ],
      [Role.TENANT_MANAGER]: ["vehicle:*", "reservation:*", "customer:read"],
      [Role.SYSTEM_ADMIN]: ["system:*", "logs:*", "deployment:*"],
      [Role.OPERATION_STAFF]: [
        "vehicle:read",
        "reservation:manage",
        "customer:read",
      ],
    };
    return permissions[role] || [];
  }

  function logout() {
    if (browser) {
      localStorage.removeItem("auth_token");
    }

    set({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      token: null,
    });

    // Redirect to login page
    if (browser) {
      goto("/login");
    }
  }

  function hasPermission(permission: string): boolean {
    const state = get(auth);
    return state.user?.permissions.includes(permission) || false;
  }

  function hasRole(role: Role | Role[]): boolean {
    const state = get(auth);
    if (!state.user) return false;

    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(state.user.role);
  }

  return {
    subscribe,
    login,
    logout,
    hasPermission,
    hasRole,
  };
}

export const auth = createAuthStore();

// Derived stores for common checks
export const isManufacturer = derived(
  auth,
  ($auth) => $auth.user?.role === Role.SUPER_ADMIN,
);

export const isTenantAdmin = derived(
  auth,
  ($auth) =>
    $auth.user?.role === Role.TENANT_OWNER ||
    $auth.user?.role === Role.TENANT_MANAGER,
);

export const isSystemAdmin = derived(
  auth,
  ($auth) => $auth.user?.role === Role.SYSTEM_ADMIN,
);

// Helper function to get auth state
function get<T>(store: {
  subscribe: (run: (value: T) => void) => () => void;
}): T {
  let value: T | undefined;
  store.subscribe((v) => (value = v))();
  return value as T;
}
