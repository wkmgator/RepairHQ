// Legacy Firebase file - kept for compatibility
// Note: This system now uses Supabase exclusively

// Mock Firebase db export for compatibility
export const db = {
  collection: () => ({
    doc: () => ({
      get: () => Promise.resolve({ exists: false, data: () => null }),
      set: () => Promise.resolve(),
      update: () => Promise.resolve(),
      delete: () => Promise.resolve(),
    }),
    add: () => Promise.resolve({ id: "mock-id" }),
    where: () => ({
      get: () => Promise.resolve({ docs: [] }),
    }),
  }),
}

// Mock auth export
export const auth = {
  currentUser: null,
  signInWithEmailAndPassword: () => Promise.resolve({ user: null }),
  createUserWithEmailAndPassword: () => Promise.resolve({ user: null }),
  signOut: () => Promise.resolve(),
}

console.warn("Firebase is deprecated in this system. Please use Supabase instead.")
