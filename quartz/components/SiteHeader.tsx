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
  const title = cfg?.pageTitle ?? "Gezin voor God"
  const baseDir = pathToRoot(fileData.slug as string)

  return (
    <div class="site-header">
      <h2 class="page-title">
        <a href={baseDir}>{title}</a>
      </h2>
      <p class="site-subtitle">De man als leider van het gezin</p>
      <nav class="site-nav">
        <a href={`${baseDir}/man`}>Man</a>
        <span class="nav-sep"> | </span>
        <a href={`${baseDir}/echtgenoot`}>Echtgenoot</a>
        <span class="nav-sep"> | </span>
        <a href={`${baseDir}/vader`}>Vader</a>
      </nav>
    </div>
  )
}

export default (() => SiteHeader) satisfies QuartzComponentConstructor
