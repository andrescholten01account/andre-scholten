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
  const title = cfg?.pageTitle ?? "André Scholten"
  const baseDir = pathToRoot(fileData.slug as string)

  return (
    <div class="site-header">
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
      <p class="site-subtitle">Persoonlijke blog</p>
      <nav class="site-nav">
        <a href={`${baseDir}/blog`}>Blog</a>
        <span class="nav-sep"> | </span>
        <a href={`${baseDir}/basis`}>Basis</a>
        <span class="nav-sep"> | </span>
        <a href="https://andre-scholten.nl/studiebijbel/genesis/1/">Bijbel</a>
      </nav>
    </div>
  )
}


export default (() => SiteHeader) satisfies QuartzComponentConstructor
