export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
  },
  CONTENT: {
    LIST: "/content",
    CREATE: "/content",
    UPDATE: (id: string) => `/content/${id}`,
    DELETE: (id: string) => `/content/${id}`,
  },
  STRUCTURE: {
    LIST: "/structure",
    CREATE: "/structure",
    UPDATE: (id: string) => `/structure/${id}`,
    DELETE: (id: string) => `/structure/${id}`,
  },
  DONATION: {
    LIST: "/donations",
    CREATE: "/donations",
    UPDATE: (id: string) => `/donations/${id}`,
    DELETE: (id: string) => `/donations/${id}`,
  },
  SCHEDULE: {
    LIST: "/schedules",
    CREATE: "/schedules",
    UPDATE: (id: string) => `/schedules/${id}`,
    DELETE: (id: string) => `/schedules/${id}`,
  },
  ANNOUNCEMENT: {
    LIST: "/announcements",
    CREATE: "/announcements",
    UPDATE: (id: string) => `/announcements/${id}`,
    DELETE: (id: string) => `/announcements/${id}`,
  },
} as const;

