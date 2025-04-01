import { db } from "@/lib/db"
import { cache } from "react"

export type SettingKey =
  | "site.name"
  | "site.description"
  | "site.logo"
  | "site.favicon"
  | "site.themeColor"
  | "site.keywords"
  | "site.url"
  | "social.twitter"
  | "social.facebook"
  | "social.instagram"
  | "seo.defaultTitle"
  | "seo.defaultDescription"
  | "seo.titleTemplate"
  | "seo.robotsTxt"
  | "analytics.googleAnalyticsId"

export type SettingType = "TEXT" | "TEXTAREA" | "COLOR" | "IMAGE" | "JSON" | "BOOLEAN"

export interface Setting {
  key: SettingKey
  value: string
  type: SettingType
  description?: string
}

export interface SettingsResponse {
  data: Record<SettingKey, string | boolean | number | object>
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

// Cache the settings to avoid multiple DB queries
export const getSettings = cache(async (page: number = 1): Promise<SettingsResponse> => {
  const itemsPerPage = 10
  const skip = (page - 1) * itemsPerPage

  const [settings, total] = await Promise.all([
    db.setting.findMany({
      skip,
      take: itemsPerPage,
      orderBy: {
        key: 'asc'
      }
    }),
    db.setting.count()
  ])

  const totalPages = Math.ceil(total / itemsPerPage)

  // Convert to a key-value object
  const settingsMap = settings.reduce(
    (acc: Record<SettingKey, string | boolean | number | object>, setting: Setting) => {
      let value: string | boolean | number | object = setting.value

      // Parse JSON values
      if (setting.type === "JSON") {
        try {
          value = JSON.parse(setting.value)
        } catch (e) {
          console.error(`Failed to parse JSON setting: ${setting.key}`)
        }
      }

      // Convert boolean values
      if (setting.type === "BOOLEAN") {
        value = value === "true"
      }

      return { ...acc, [setting.key]: value }
    },
    {} as Record<SettingKey, string | boolean | number | object>,
  )

  return {
    data: settingsMap,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: total,
      itemsPerPage
    }
  }
})

export async function getSetting(key: SettingKey): Promise<string | null> {
  const setting = await db.setting.findUnique({
    where: { key }
  })
  return setting?.value || null
}

export async function updateSetting(key: string, value: string, type = "TEXT") {
  // Upsert the setting (create if it doesn't exist, update if it does)
  return db.setting.upsert({
    where: { key },
    update: { value, type: type as any },
    create: { key, value, type: type as any },
  })
}

export async function updateSettings(settings: Record<string, { value: string; type?: string }>) {
  // Use Promise.all to update all settings in parallel
  return Promise.all(Object.entries(settings).map(([key, { value, type = "TEXT" }]) => updateSetting(key, value, type)))
}

