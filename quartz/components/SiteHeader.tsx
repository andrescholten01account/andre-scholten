import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

function pathToRoot(slug: string): string {
  let rootPath = slug
    .split("/")
    .filter((x) => x !== "")
    .slice(0, -1)
    .map(() => "..")
    .join("/")
  return rootPath.length === 0 ? "." : rootPath
}

const SiteHeader: QuartzComponent = ({ fileData, cfg }: QuartzComponentProps) => {
  const title = cfg?.pageTitle ?? "De Volle Pinksterzegen"
  const baseDir = pathToRoot(fileData.slug as string)

  return (
    <div class="site-header">
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
      <p class="site-subtitle">Jezus volgen in de kracht van de Geest</p>
      <nav class="site-nav">
        <a href={`${baseDir}/blog`}>Blog</a>
        <span class="nav-sep"> | </span>
        <a href={`${baseDir}/bijbel`}>Bijbel</a>
        <span class="nav-sep"> | </span>
        <a href={`${baseDir}/de-volle-pinksterzegen---boek`}>Boek</a>
      </nav>
    </div>
  )
}


export default (() => SiteHeader) satisfies QuartzComponentConstructor
