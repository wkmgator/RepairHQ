import { supabaseAdmin } from "./supabase"

export interface BackupConfig {
  tables: string[]
  includeSchema: boolean
  compression: boolean
  encryption: boolean
}

export class BackupService {
  private supabase = supabaseAdmin

  async createBackup(config: BackupConfig): Promise<string> {
    const backupId = crypto.randomUUID()
    const startTime = new Date()

    try {
      // Log backup start
      await this.supabase.from("backup_history").insert({
        id: backupId,
        backup_type: "full",
        status: "started",
        tables_backed_up: config.tables,
        started_at: startTime.toISOString(),
      })

      // Create backup for each table
      const backupData: Record<string, any[]> = {}

      for (const table of config.tables) {
        const { data, error } = await this.supabase.from(table).select("*")

        if (error) {
          throw new Error(`Failed to backup table ${table}: ${error.message}`)
        }

        backupData[table] = data || []
      }

      // Calculate backup size
      const backupJson = JSON.stringify(backupData)
      const sizeBytes = new TextEncoder().encode(backupJson).length

      // Store backup in Supabase Storage
      const fileName = `backup_${backupId}_${startTime.toISOString()}.json`
      const { error: uploadError } = await this.supabase.storage.from("backups").upload(fileName, backupJson, {
        contentType: "application/json",
        cacheControl: "3600",
      })

      if (uploadError) {
        throw new Error(`Failed to upload backup: ${uploadError.message}`)
      }

      // Update backup history
      const endTime = new Date()
      const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      await this.supabase
        .from("backup_history")
        .update({
          status: "completed",
          size_bytes: sizeBytes,
          duration_seconds: duration,
          completed_at: endTime.toISOString(),
        })
        .eq("id", backupId)

      return backupId
    } catch (error) {
      // Log backup failure
      await this.supabase
        .from("backup_history")
        .update({
          status: "failed",
          error_message: error instanceof Error ? error.message : "Unknown error",
          completed_at: new Date().toISOString(),
        })
        .eq("id", backupId)

      throw error
    }
  }

  async restoreBackup(backupId: string): Promise<void> {
    try {
      // Get backup metadata
      const { data: backupInfo, error: infoError } = await this.supabase
        .from("backup_history")
        .select("*")
        .eq("id", backupId)
        .single()

      if (infoError || !backupInfo) {
        throw new Error("Backup not found")
      }

      // Download backup file
      const fileName = `backup_${backupId}_${backupInfo.started_at}.json`
      const { data: fileData, error: downloadError } = await this.supabase.storage.from("backups").download(fileName)

      if (downloadError || !fileData) {
        throw new Error("Failed to download backup file")
      }

      // Parse backup data
      const backupContent = await fileData.text()
      const backupData = JSON.parse(backupContent)

      // Restore each table
      for (const [table, records] of Object.entries(backupData)) {
        if (Array.isArray(records) && records.length > 0) {
          // Delete existing data (be careful with this in production!)
          await this.supabase.from(table).delete().neq("id", "00000000-0000-0000-0000-000000000000")

          // Insert backup data
          const { error: insertError } = await this.supabase.from(table).insert(records)

          if (insertError) {
            throw new Error(`Failed to restore table ${table}: ${insertError.message}`)
          }
        }
      }

      // Log successful restore
      await this.logApplicationEvent("INFO", "backup", "Backup restored successfully", {
        backupId,
      })
    } catch (error) {
      // Log restore failure
      await this.logApplicationEvent("ERROR", "backup", "Backup restore failed", {
        backupId,
        error: error instanceof Error ? error.message : "Unknown error",
      })

      throw error
    }
  }

  async scheduleAutomaticBackups(): Promise<void> {
    // This would typically be handled by a cron job or scheduled function
    // For Supabase, you can use pg_cron extension or external schedulers

    const criticalTables = ["customers", "inventory", "tickets", "pos_transactions", "invoices", "appointments"]

    try {
      await this.createBackup({
        tables: criticalTables,
        includeSchema: true,
        compression: true,
        encryption: true,
      })
    } catch (error) {
      await this.logApplicationEvent("ERROR", "backup", "Automatic backup failed", {
        error: error instanceof Error ? error.message : "Unknown error",
      })
    }
  }

  async cleanOldBackups(retentionDays = 30): Promise<void> {
    const cutoffDate = new Date()
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays)

    // Get old backups
    const { data: oldBackups, error } = await this.supabase
      .from("backup_history")
      .select("id, started_at")
      .lt("started_at", cutoffDate.toISOString())

    if (error) {
      throw new Error(`Failed to fetch old backups: ${error.message}`)
    }

    // Delete old backup files
    for (const backup of oldBackups || []) {
      const fileName = `backup_${backup.id}_${backup.started_at}.json`

      await this.supabase.storage.from("backups").remove([fileName])
    }

    // Delete old backup records
    await this.supabase.from("backup_history").delete().lt("started_at", cutoffDate.toISOString())
  }

  private async logApplicationEvent(level: string, category: string, message: string, metadata?: any): Promise<void> {
    await this.supabase.from("application_logs").insert({
      level,
      category,
      message,
      metadata,
      created_at: new Date().toISOString(),
    })
  }
}

export const backupService = new BackupService()
