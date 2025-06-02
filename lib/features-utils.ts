import { createClient } from "@/lib/supabase"

export interface FeatureModule {
  id: string
  name: string
  description: string
  created_at: string
  updated_at: string
  features?: Feature[]
}

export interface Feature {
  id: string
  module_id: string
  name: string
  description: string
  status: "complete" | "in-progress" | "planned"
  created_at: string
  updated_at: string
}

export async function getFeatureModules(): Promise<FeatureModule[]> {
  const supabase = createClient()

  const { data: modules, error } = await supabase.from("features_modules").select("*").order("name")

  if (error) {
    console.error("Error fetching feature modules:", error)
    return []
  }

  return modules || []
}

export async function getFeatures(): Promise<Feature[]> {
  const supabase = createClient()

  const { data: features, error } = await supabase.from("features").select("*")

  if (error) {
    console.error("Error fetching features:", error)
    return []
  }

  return features || []
}

export async function getModulesWithFeatures(): Promise<FeatureModule[]> {
  const modules = await getFeatureModules()
  const features = await getFeatures()

  // Group features by module_id
  const moduleFeatures = features.reduce(
    (acc, feature) => {
      if (!acc[feature.module_id]) {
        acc[feature.module_id] = []
      }
      acc[feature.module_id].push(feature)
      return acc
    },
    {} as Record<string, Feature[]>,
  )

  // Attach features to their respective modules
  return modules.map((module) => ({
    ...module,
    features: moduleFeatures[module.id] || [],
  }))
}

export async function addFeatureModule(name: string, description: string): Promise<FeatureModule | null> {
  const supabase = createClient()

  const { data, error } = await supabase.from("features_modules").insert([{ name, description }]).select().single()

  if (error) {
    console.error("Error adding feature module:", error)
    return null
  }

  return data
}

export async function addFeature(
  module_id: string,
  name: string,
  description: string,
  status: "complete" | "in-progress" | "planned",
): Promise<Feature | null> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from("features")
    .insert([{ module_id, name, description, status }])
    .select()
    .single()

  if (error) {
    console.error("Error adding feature:", error)
    return null
  }

  return data
}

export async function updateFeatureStatus(
  id: string,
  status: "complete" | "in-progress" | "planned",
): Promise<boolean> {
  const supabase = createClient()

  const { error } = await supabase
    .from("features")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) {
    console.error("Error updating feature status:", error)
    return false
  }

  return true
}
