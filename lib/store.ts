import { create } from "zustand"
import { persist } from "zustand/middleware"

interface User {
  id: string
  email: string
  user_name?: string
}

interface Profile {
  id: string
  consent?: boolean
  alpha_value?: number
  lambda_value?: number
  gamma_value?: number
  living_situation?: string
  has_children?: string
  marital_status?: string
  income_range?: string
  occupation_category?: string
  gender_assigned_at_birth_differs?: string
  gender_identity?: string
  age_group?: string
  country?: string
  persona_choice?: string
  user_name?: string
  chronic_illness?: string
  record_mode?: string
  created_at?: string
}

interface ValueSettings {
  profile_id: string
  q_finance: number
  q_autonomy: number
  q_meaning: number
  q_relationships: number
  q_health: number
  q_competition: number
  q_leisure: number
}

interface AppState {
  user: User | null
  profile: Profile | null
  valueSettings: ValueSettings | null
  streakCount: number
  isLoading: boolean

  // Actions
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
  setValueSettings: (settings: ValueSettings | null) => void
  setStreakCount: (count: number) => void
  setLoading: (loading: boolean) => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      profile: null,
      valueSettings: null,
      streakCount: 0,
      isLoading: false,

      setUser: (user) => set({ user }),
      setProfile: (profile) => set({ profile }),
      setValueSettings: (valueSettings) => set({ valueSettings }),
      setStreakCount: (streakCount) => set({ streakCount }),
      setLoading: (isLoading) => set({ isLoading }),
      reset: () =>
        set({
          user: null,
          profile: null,
          valueSettings: null,
          streakCount: 0,
          isLoading: false,
        }),
    }),
    {
      name: "harmony-navigator-storage",
      partialize: (state) => ({
        streakCount: state.streakCount,
        // Don't persist sensitive user data - will be loaded from Supabase
      }),
    },
  ),
)
