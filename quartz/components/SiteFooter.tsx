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
        <a href={`${baseDir}/basis`}>Basis christelijk geloof</a>
        <a href={`${baseDir}/de-volle-pinksterzegen`}>De Volle Pinksterzegen</a>
        <a href="https://andre-scholten.nl/studiebijbel/">StudieBijbel</a>
      </div>
      <div class="site-footer-col site-footer-mid">
        <button type="button" class="footer-search-trigger">
          Zoekfunctie
        </button>
      </div>
      <div class="site-footer-col site-footer-right">
        <a href={`${baseDir}/over`}>Over</a>
        <a href={`${baseDir}/contact`}>Contact</a>
        <a href={`${baseDir}/verantwoording`}>Verantwoording</a>
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
            var url = new URL(window.location.href);
            url.searchParams.delete("zoeken");
            window.history.replaceState(window.history.state, "", url);
            var pogingen = 0;
            var iv = setInterval(function () {
              pogingen++;
              var container = document.querySelector(".search-container");
              if (container && container.classList.contains("active")) {
                clearInterval(iv);
                return;
              }
              var btn = document.querySelector(".search-button");
              if (btn) btn.click();
              if (pogingen >= 20) clearInterval(iv);
            }, 150);
          });
          `,
        }}
      />
    </footer>
  )
}

export default (() => SiteFooter) satisfies QuartzComponentConstructor
