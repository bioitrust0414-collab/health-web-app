import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import {
  getStoredProfileId,
  setStoredProfileId,
} from "@/lib/memberSession";
import { createServerFn } from "@tanstack/react-start";

// ── Server Functions ──
const checkPatientMapping = createServerFn({ method: "GET" })
  .validator((profileId: unknown) => {
    if (typeof profileId !== "string" || profileId.length === 0) {
      throw new Error("profileId is required");
    }
    return profileId;
  })
  .handler(async ({ data: profileId }) => {
    const { restGetOne } = await import("@/lib/supabaseAdmin");
    const mapping = await restGetOne(
      "patient_mappings",
      `profile_id=eq.${profileId}`
    );
    return { hasMapping: !!mapping };
  });

// ── Types ──
interface AuthUser {
  profileId: string;
  displayName?: string;
  pictureUrl?: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isVerified: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  setUser: (user: AuthUser | null, isVerified?: boolean) => void;
  setVerified: (verified: boolean) => void;
  logout: () => void;
}

// ── Context ──
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isVerified: false,
    isLoading: true,
  });

  // 初始化：檢查 localStorage 是否有 profileId
  useEffect(() => {
    const init = async () => {
      const profileId = getStoredProfileId();
      if (profileId) {
        try {
          const { hasMapping } = await checkPatientMapping({ data: profileId });
          setState({
            user: { profileId },
            isAuthenticated: true,
            isVerified: hasMapping,
            isLoading: false,
          });
        } catch {
          localStorage.removeItem("dahua_member_profile_id");
          setState({
            user: null,
            isAuthenticated: false,
            isVerified: false,
            isLoading: false,
          });
        }
      } else {
        setState((s) => ({ ...s, isLoading: false }));
      }
    };
    init();
  }, []);

  const setUser = useCallback(
    (user: AuthUser | null, isVerified = false) => {
      if (user) setStoredProfileId(user.profileId);
      setState({
        user,
        isAuthenticated: !!user,
        isVerified,
        isLoading: false,
      });
    },
    []
  );

  const setVerified = useCallback((verified: boolean) => {
    setState((s) => ({ ...s, isVerified: verified }));
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("dahua_member_profile_id");
    setState({
      user: null,
      isAuthenticated: false,
      isVerified: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, setUser, setVerified, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
