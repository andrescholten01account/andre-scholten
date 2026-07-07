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

const SiteFooter: QuartzComponent = ({ fileData }: QuartzComponentProps) => {
  const baseDir = pathToRoot(fileData.slug as string)

  return (
    <footer class="site-footer">
      <div class="site-footer-col">
        <a href={`${baseDir}/de-volle-pinksterzegen`}>De Volle Pinksterzegen</a>
        <a href={`${baseDir}/bijbelteksten-heilige-geest`}>Bijbelteksten Heilige Geest</a>
        <a href="https://andre-scholten.nl/bereastudiebijbel/">BereaStudieBijbel</a>
        <a href={`${baseDir}/bibliotheek`}>Bibliotheek</a>
      </div>
      <div class="site-footer-col site-footer-mid">
        <button type="button" class="footer-search-trigger">
          Zoekfunctie
        </button>
      </div>
      <div class="site-footer-col site-footer-right">
        <span class="footer-plain">Over</span>
        <span class="footer-plain">Contact</span>
        <span class="footer-plain">Verantwoording</span>
        <a href={`${baseDir}/uitgangspunten`}>Uitgangspunten</a>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener("click", function (e) {
            var t = e.target.closest(".footer-search-trigger");
            if (!t) return;
            var btn = document.querySelector(".search-button");
            if (btn) btn.click();
          });
          document.addEventListener("nav", function () {
            if (!/[?&]zoeken=1(&|$)/.test(window.location.search)) return;
            var btn = document.querySelector(".search-button");
            if (btn) btn.click();
            var url = new URL(window.location.href);
            url.searchParams.delete("zoeken");
            window.history.replaceState(window.history.state, "", url);
          });
          `,
        }}
      />
    </footer>
  )
}

export default (() => SiteFooter) satisfies QuartzComponentConstructor
