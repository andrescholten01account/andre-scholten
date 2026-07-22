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
        <a href={`${baseDir}/blog`}>Blog</a>
        <a href={`${baseDir}/basis`}>Basis christelijk geloof</a>
        <a href="https://andre-scholten.nl/studiebijbel/genesis/1/" data-router-ignore>StudieBijbel</a>
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

          /* Rechtsklik op een Bijbeltekst-link (/studiebijbel/{boek}/{hfd}#v{vers}):
             toon meteen de volledig uitgeschreven tekst in SVnu, SV en KJV. */
          (function () {
            function parseRef(href) {
              if (!href) return null;
              var m = href.match(/\\/studiebijbel\\/([a-z0-9-]+)\\/(\\d+)#v(\\d+)$/);
              if (!m) return null;
              return { slug: m[1], hfd: m[2], vers: m[3] };
            }
            var popup = document.getElementById('bijbelvertpopup');
            if (!popup) {
              popup = document.createElement('div');
              popup.id = 'bijbelvertpopup';
              popup.style.cssText = 'position:fixed;display:none;max-width:420px;background:#fffdf7;border:1px solid #c9b98a;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.8rem 1rem;font-size:.85rem;line-height:1.55;z-index:9999;font-family:"Lora",serif;color:#3a2a1d;';
              document.body.appendChild(popup);
            }
            var VERTALINGEN = [
              { naam: 'SVnu', map: 'versteksten' },
              { naam: 'SV', map: 'versteksten_sv' },
              { naam: 'KJV', map: 'versteksten_kjv' }
            ];
            function mdMini(t) {
              t = (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
              return t.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
            }
            var cache = {};
            function haal(map, ref) {
              var sleutel = map + ':' + ref.slug + '/' + ref.hfd;
              if (sleutel in cache) return cache[sleutel];
              cache[sleutel] = fetch('https://andre-scholten.nl/studiebijbel/' + map + '/' + ref.slug + '/' + ref.hfd + '.json')
                .then(function (r) { return r.ok ? r.json() : null; })
                .catch(function () { return null; });
              return cache[sleutel];
            }
            document.addEventListener('contextmenu', function (e) {
              var a = e.target.closest ? e.target.closest('a[href*="/studiebijbel/"]') : null;
              var ref = a ? parseRef(a.getAttribute('href')) : null;
              if (!ref) return;
              e.preventDefault();
              // na een SPA-navigatie (Quartz-router) is deze div uit de pagina
              // gehaald (stond niet in de vers gefetchte HTML) -- de popup-
              // variabele bestaat dan nog wel, maar hangt niet meer echt in
              // de zichtbare pagina; steeds opnieuw vastzetten lost dat op.
              if (!document.body.contains(popup)) document.body.appendChild(popup);
              popup.innerHTML = '<div style="text-align:center;color:#8b7355;">laden…</div>';
              popup.style.left = Math.max(4, Math.min(e.clientX, window.innerWidth - 440)) + 'px';
              popup.style.top = Math.max(4, Math.min(e.clientY, window.innerHeight - 40)) + 'px';
              popup.style.display = 'block';
              Promise.all(VERTALINGEN.map(function (v) { return haal(v.map, ref); })).then(function (resultaten) {
                popup.innerHTML = VERTALINGEN.map(function (v, i) {
                  var tekst = resultaten[i] && resultaten[i][ref.vers];
                  var doelHref = 'https://andre-scholten.nl/studiebijbel/' + ref.slug + '/' + ref.hfd + '/?vert=' + v.naam + '#v' + ref.vers;
                  return '<a href="' + doelHref + '" data-router-ignore style="display:block;font-family:Lora;font-weight:700;font-size:.72rem;color:#8b5e34;margin-top:' + (i ? '.8rem' : '0') + ';margin-bottom:.25rem;text-transform:uppercase;letter-spacing:.05em;text-decoration:none;">' + v.naam + ' ›</a>' + (tekst ? mdMini(tekst) : '<em>Tekst niet gevonden.</em>');
                }).join('');
              });
            });
            document.addEventListener('click', function (e) {
              if (!e.target.closest('#bijbelvertpopup')) popup.style.display = 'none';
            });
            document.addEventListener('scroll', function () { popup.style.display = 'none'; }, true);
          })();

          /* Hover over een Bijbeltekst-link: toon de SVnu-tekst in een popup
             (zelfde gedrag als de refchip-popups in de StudieBijbel). */
          (function () {
            function parseRef(href) {
              if (!href) return null;
              var m = href.match(/\\/studiebijbel\\/([a-z0-9-]+)\\/(\\d+)#v(\\d+)$/);
              if (!m) return null;
              return { slug: m[1], hfd: m[2], vers: m[3] };
            }
            function mdMini(t) {
              t = (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
              t = t.replace(/\\[\\d+\\]/g, '');
              return t.replace(/\\*([^*]+)\\*/g, '<em>$1</em>');
            }
            var hoverPopup = document.getElementById('bijbelhoverpopup');
            if (!hoverPopup) {
              hoverPopup = document.createElement('div');
              hoverPopup.id = 'bijbelhoverpopup';
              hoverPopup.style.cssText = 'position:fixed;display:none;max-width:380px;background:#fffdf7;border:1px solid #c9b98a;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.7rem .9rem;font-size:.85rem;line-height:1.55;z-index:9998;font-family:"Lora",serif;color:#3a2a1d;';
              document.body.appendChild(hoverPopup);
            }
            var cache = {};
            function haalVerstekst(ref) {
              var sleutel = ref.slug + '/' + ref.hfd;
              if (sleutel in cache) return cache[sleutel];
              cache[sleutel] = fetch('https://andre-scholten.nl/studiebijbel/versteksten/' + ref.slug + '/' + ref.hfd + '.json')
                .then(function (r) { return r.ok ? r.json() : null; })
                .catch(function () { return null; });
              return cache[sleutel];
            }
            var hoverLink = null;
            document.addEventListener('mouseover', function (e) {
              var a = e.target.closest ? e.target.closest('a[href*="/studiebijbel/"]') : null;
              var ref = a ? parseRef(a.getAttribute('href')) : null;
              if (!ref) return;
              hoverLink = a;
              if (!document.body.contains(hoverPopup)) document.body.appendChild(hoverPopup);
              haalVerstekst(ref).then(function (data) {
                if (hoverLink !== a) return;
                var tekst = data && data[ref.vers];
                if (!tekst) return;
                hoverPopup.innerHTML = '<div style="font-family:Lora;font-weight:700;font-size:.72rem;color:#8b5e34;margin-bottom:.25rem;text-transform:uppercase;letter-spacing:.05em;">' + a.textContent + ' · SVnu</div>' + mdMini(tekst);
                var r = a.getBoundingClientRect();
                hoverPopup.style.left = Math.max(8, Math.min(r.left, window.innerWidth - 400)) + 'px';
                hoverPopup.style.top = (r.bottom + 6) + 'px';
                hoverPopup.style.display = 'block';
              });
            });
            document.addEventListener('mouseout', function (e) {
              var a = e.target.closest ? e.target.closest('a[href*="/studiebijbel/"]') : null;
              if (a) { hoverPopup.style.display = 'none'; hoverLink = null; }
            });
            document.addEventListener('scroll', function () { hoverPopup.style.display = 'none'; }, true);
          })();

          /* Meerdere Bijbelverwijzingen na elkaar (bv. "Ref1; Ref2"): geef de
             scheidende ";" een eigen kleur, zodat de verwijzingen duidelijk
             van elkaar te onderscheiden zijn. */
          (function () {
            function kleurVerwijzingScheiders() {
              var links = document.querySelectorAll('a.external-link[href*="/studiebijbel/"]');
              links.forEach(function (a) {
                var next = a.nextSibling;
                if (!next || next.nodeType !== 3) return;
                var m = next.textContent.match(/^;(\\s*)$/);
                if (!m) return;
                var following = next.nextSibling;
                if (!(following && following.nodeType === 1 && following.matches && following.matches('a.external-link[href*="/studiebijbel/"]'))) return;
                var span = document.createElement('span');
                span.style.color = 'var(--tertiary)';
                span.textContent = ';';
                next.replaceWith(span, document.createTextNode(m[1]));
              });
            }
            kleurVerwijzingScheiders();
            document.addEventListener('nav', kleurVerwijzingScheiders);
          })();
          `,
        }}
      />
    </footer>
  )
}

export default (() => SiteFooter) satisfies QuartzComponentConstructor
