import type { QuartzFilterPlugin } from "@quartz-community/types"

function vandaagISO(): string {
  return new Date().toISOString().slice(0, 10)
}

function alsISODatum(waarde: unknown): string | null {
  if (!waarde) return null
  if (waarde instanceof Date) return waarde.toISOString().slice(0, 10)
  const s = String(waarde).trim()

  // ISO: JJJJ-MM-DD
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return `${m[1]}-${m[2]}-${m[3]}`

  // NL-notatie: DD-MM-JJJJ (of DD/MM/JJJJ)
  m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/)
  if (m) return `${m[3]}-${m[2]}-${m[1]}`

  return null
}

/**
 * Vervangt de standaard remove-draft-filter. Voor blogpagina's (frontmatter
 * blog: true) telt de publicatiedatum als bron van waarheid: zodra die datum
 * is aangebroken publiceert de pagina automatisch, ongeacht de losse
 * draft-property. Voor alle andere pagina's geldt het gewone draft-gedrag.
 */
export const BlogFilter: QuartzFilterPlugin<object> = () => ({
  name: "BlogFilter",
  shouldPublish(_ctx, [_tree, vfile]) {
    const fm = vfile.data?.frontmatter as Record<string, unknown> | undefined
    const isBlog = fm?.blog === true || fm?.blog === "true"

    if (isBlog) {
      const datum = alsISODatum(fm?.publicatiedatum)
      if (!datum) return false
      return datum <= vandaagISO()
    }

    const draftFlag = fm?.draft === true || fm?.draft === "true"
    return !draftFlag
  },
})
