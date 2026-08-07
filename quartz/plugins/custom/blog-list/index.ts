import type {
  PageMatcher,
  QuartzComponent,
  QuartzComponentConstructor,
  QuartzComponentProps,
  QuartzPageTypePlugin,
} from "@quartz-community/types"
import type { Root, Element, ElementContent } from "hast"
import { h } from "preact"
import { resolveRelative, normalizeHastElement } from "../../../util/path.ts"

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
  const s = String(waarde).trim()

  // ISO: JJJJ-MM-DD
  let m = s.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))

  // NL-notatie: DD-MM-JJJJ (of DD/MM/JJJJ)
  m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})/)
  if (m) return new Date(Number(m[3]), Number(m[2]) - 1, Number(m[1]))

  return null
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
.blog-lijst-titel { font-size: 16px; font-weight: 600; }
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
  const doelSlug = f.slug!
  const titel = String(f.frontmatter?.title ?? "")
  const datumTekst = formatDatum(datum, componentData.cfg.locale)

  widget.tagName = "div"
  widget.properties = { class: "blog-widget-inhoud" }

  const inhoud: ElementContent[] = f.htmlAst
    ? (f.htmlAst.children as ElementContent[]).map((c) =>
        normalizeHastElement(c as Element, componentData.fileData.slug!, doelSlug),
      )
    : []

  widget.children = [
    {
      type: "element",
      tagName: "p",
      properties: { class: "blog-widget-datum" },
      children: [{ type: "text", value: datumTekst }],
    },
    {
      type: "element",
      tagName: "h2",
      properties: { class: "blog-widget-titel" },
      children: [{ type: "text", value: titel }],
    },
    ...inhoud,
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
