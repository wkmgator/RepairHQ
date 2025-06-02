import { getServiceSupabase } from "./supabase-config"

/**
 * Utility to migrate data from any previous system to Supabase
 */
export async function migrateToSupabase(data: any[], tableName: string) {
  const supabase = getServiceSupabase()

  console.log(`Starting migration of ${data.length} records to ${tableName}...`)

  // Process in batches to avoid timeouts
  const batchSize = 100
  const batches = Math.ceil(data.length / batchSize)

  let successCount = 0
  let errorCount = 0

  for (let i = 0; i < batches; i++) {
    const start = i * batchSize
    const end = Math.min(start + batchSize, data.length)
    const batch = data.slice(start, end)

    console.log(`Processing batch ${i + 1}/${batches} (${batch.length} records)`)

    const { data: result, error } = await supabase.from(tableName).upsert(batch, { onConflict: "id" })

    if (error) {
      console.error(`Error in batch ${i + 1}:`, error)
      errorCount += batch.length
    } else {
      successCount += batch.length
      console.log(`Batch ${i + 1} completed successfully`)
    }
  }

  return {
    total: data.length,
    success: successCount,
    error: errorCount,
  }
}

/**
 * Verify data integrity after migration
 */
export async function verifyMigration(tableName: string, sampleSize = 10) {
  const supabase = getServiceSupabase()

  const { data, error } = await supabase.from(tableName).select("*").limit(sampleSize)

  if (error) {
    console.error(`Error verifying migration for ${tableName}:`, error)
    return { success: false, error }
  }

  return {
    success: true,
    sampleData: data,
    count: data.length,
  }
}
