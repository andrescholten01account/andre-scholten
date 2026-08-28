import type { QuartzTransformerPlugin, BuildCtx, FilePath, FullSlug } from "@quartz-community/types"
import { slugifyFilePath } from "../../../util/path.ts"

/**
 * Laat een pagina zijn URL zelf bepalen via de frontmatter-property `slug`,
 * zonder dat het bestand hoeft te worden hernoemd.
 *
 *   ---
 *   slug: mooie-geschiedenis
 *   ---
 *
 * Het bestand `Dit is een mooie geschidenis.md` verschijnt dan op
 * `/mooie-geschiedenis` in plaats van `/dit-is-een-mooie-geschidenis`.
 *
 * De oorspronkelijke, van de bestandsnaam afgeleide URL wordt automatisch als
 * alias geregistreerd, zodat de alias-redirects-plugin er een doorverwijzing
 * naar de nieuwe URL van maakt. Bestaande links, bladwijzers en zoekresultaten
 * blijven daardoor werken.
 *
 * Een `slug` met schuine strepen (`onderwerp/mooie-geschiedenis`) plaatst de
 * pagina in een submap-URL. De waarde wordt met dezelfde regels geslugificeerd
 * als bestandsnamen (kleine letters, spaties -> koppelteken).
 */
export const SlugOverride: QuartzTransformerPlugin<object> = () => ({
  name: "SlugOverride",
  markdownPlugins(ctx: BuildCtx) {
    const { allSlugs } = ctx
    return [
      () => {
        return (_tree: unknown, file: { data: Record<string, unknown> }) => {
          const fm = file.data.frontmatter as Record<string, unknown> | undefined
          const raw = fm?.slug
          if (typeof raw !== "string" || raw.trim() === "") return

          const oldSlug = file.data.slug as FullSlug | undefined
          const newSlug = slugifyFilePath((raw.trim() + ".md") as FilePath)
          if (!oldSlug || newSlug === oldSlug) return

          file.data.slug = newSlug
          if (!allSlugs.includes(newSlug)) allSlugs.push(newSlug)

          // oude bestandsnaam-URL als redirect behouden
          const aliases = (file.data.aliases as FullSlug[] | undefined) ?? []
          if (!aliases.includes(oldSlug)) aliases.push(oldSlug)
          file.data.aliases = aliases
        }
      },
    ]
  },
})

export default SlugOverride
