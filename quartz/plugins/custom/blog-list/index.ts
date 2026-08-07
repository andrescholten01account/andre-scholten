import type {
  PageMatcher,
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPageTypePlugin,
} from "@quartz-community/types"
import type { Root, Element } from "hast"
import { h } from "preact"
import { resolveRelative } from "../../../util/path.ts"

function formatDatum(d: Date, locale?: string): string {
  return d.toLocaleDateString(locale ?? "nl-NL", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  })
}

function alsDatum(waarde: unknown): Date | null {
  if (!waarde) return null
  if (waarde instanceof Date) return waarde
  const m = String(waarde).match(/^\d{4}-\d{2}-\d{2}/)
  return m ? new Date(m[0]) : null
}

type BlogPost = { f: QuartzComponentProps["allFiles"][number]; datum: Date }

function gepubliceerdeBlogposten(allFiles: QuartzComponentProps["allFiles"]): BlogPost[] {
  return allFiles
    .filter((f) => f.frontmatter?.blog === true || f.frontmatter?.blog === "true")
    .map((f) => ({ f, datum: alsDatum(f.frontmatter?.publicatiedatum) }))
    .filter((x): x is BlogPost => x.datum !== null)
    .sort((a, b) => b.datum.getTime() - a.datum.getTime())
}

const BlogList: QuartzComponent = ({ cfg, fileData, allFiles }: QuartzComponentProps) => {
  const posten = gepubliceerdeBlogposten(allFiles)

  if (posten.length === 0) {
    return h(
      "div",
      { class: "blog-lijst" },
      h("p", { class: "blog-leeg" }, "Nog geen blogberichten gepubliceerd."),
    )
  }

  return h(
    "div",
    { class: "blog-lijst" },
    h(
      "ul",
      { class: "blog-lijst-ul" },
      posten.map(({ f, datum }) =>
        h(
          "li",
          { class: "blog-lijst-li" },
          h(
            "a",
            {
              href: resolveRelative(fileData.slug!, f.slug!),
              class: "internal internal-link blog-lijst-titel",
            },
            String(f.frontmatter?.title ?? ""),
          ),
          h(
            "p",
            { class: "blog-lijst-datum" },
            h("time", { datetime: datum.toISOString() }, formatDatum(datum, cfg.locale)),
          ),
        ),
      ),
    ),
  )
}

BlogList.css = `
.blog-lijst-ul { list-style: none; margin: 0; padding: 0; }
.blog-lijst-li { padding: .9rem 0; border-bottom: 1px solid var(--lightgray); }
.blog-lijst-li:first-child { padding-top: 0; }
.blog-lijst-titel { font-size: 1.1rem; font-weight: 600; }
.blog-lijst-datum { margin: .25rem 0 0; color: var(--gray); font-size: .85rem; }
.blog-leeg { color: var(--gray); }
`

const blogMatcher: PageMatcher = ({ slug }) => slug === "blog"

/**
 * Vindt in de HAST-boom van de homepage het element <div id="blog-widget">
 * (door de gebruiker neergezet tussen twee HTML-commentaarmarkeringen in
 * content/index.md) en vult het met de nieuwste gepubliceerde blogpost.
 * Alleen deze ene div wordt aangeraakt; de eigen tekst van de gebruiker
 * eromheen blijft ongewijzigd.
 */
function vindWidget(node: Root | Element): Element | null {
  if ("tagName" in node && node.properties?.id === "blog-widget") return node
  for (const child of node.children ?? []) {
    if (child.type === "element") {
      const gevonden = vindWidget(child as Element)
      if (gevonden) return gevonden
    }
  }
  return null
}

function homepageBlogTransform(root: Root, slug: string, componentData: QuartzComponentProps) {
  if (slug !== "index") return
  const widget = vindWidget(root)
  if (!widget) return

  const posten = gepubliceerdeBlogposten(componentData.allFiles)
  if (posten.length === 0) {
    widget.children = [{ type: "text", value: "" }]
    return
  }

  const { f, datum } = posten[0]
  const href = resolveRelative(componentData.fileData.slug!, f.slug!)
  const titel = String(f.frontmatter?.title ?? "")
  const datumTekst = formatDatum(datum, componentData.cfg.locale)

  widget.tagName = "div"
  widget.properties = { class: "blog-widget-inhoud" }
  widget.children = [
    {
      type: "element",
      tagName: "p",
      properties: { class: "blog-widget-datum" },
      children: [{ type: "text", value: datumTekst }],
    },
    {
      type: "element",
      tagName: "h3",
      properties: {},
      children: [
        {
          type: "element",
          tagName: "a",
          properties: { href, class: ["internal", "internal-link"] },
          children: [{ type: "text", value: titel }],
        },
      ],
    },
  ]
}

export const BlogListPage: QuartzPageTypePlugin<object> = () => ({
  name: "BlogListPage",
  priority: 10,
  match: blogMatcher,
  layout: "content",
  body: (() => BlogList) as QuartzComponentConstructor,
  treeTransforms: () => [homepageBlogTransform],
})
