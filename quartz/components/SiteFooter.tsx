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
      <div class="site-footer-row">
        <a href={`${baseDir}/blog`}>Blog</a>
        <span class="nav-sep"> | </span>
        <a href={`${baseDir}/over-deze-site`}>Over deze site</a>
        <span class="nav-sep"> | </span>
        <a href={`${baseDir}/contact`}>Contact</a>
      </div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
              popup.style.cssText = 'position:fixed;display:none;max-width:420px;background:#ffffff;border:1px solid #cccccc;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.8rem 1rem;font-size:.85rem;line-height:1.55;z-index:9999;font-family:"Lora",serif;color:#111111;';
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
              cache[sleutel] = fetch('https://gezinvoorgod.nl/studiebijbel/' + map + '/' + ref.slug + '/' + ref.hfd + '.json')
                .then(function (r) { return r.ok ? r.json() : null; })
                .catch(function () { return null; });
              return cache[sleutel];
            }
            var toast = document.getElementById('bijbeltoast');
            if (!toast) {
              toast = document.createElement('div');
              toast.id = 'bijbeltoast';
              toast.textContent = 'Gekopieerd';
              toast.style.cssText = 'position:fixed;left:50%;bottom:2rem;transform:translateX(-50%);background:#1a1a1a;color:#fff;font-family:sans-serif;font-size:.85rem;padding:.5rem 1.2rem;border-radius:999px;opacity:0;transition:opacity .25s;pointer-events:none;z-index:9999;';
              document.body.appendChild(toast);
            }
            function toonToast() {
              toast.style.opacity = '1';
              setTimeout(function () { toast.style.opacity = '0'; }, 1400);
            }
            function kopieerVers(a, ref) {
              haal('versteksten', ref).then(function (data) {
                var tekst = data && data[ref.vers];
                if (!tekst) return;
                var url = 'https://gezinvoorgod.nl/studiebijbel/' + ref.slug + '/' + ref.hfd + '#v' + ref.vers;
                var kopie = tekst.replace(/\\*/g, '') + '\\n~ [' + a.textContent + '](' + url + ') (SVnu)';
                navigator.clipboard.writeText(kopie).then(toonToast);
              });
            }
            // enkele rechtsklik toont de vertalingen-popup (bestaand gedrag);
            // dubbele rechtsklik (binnen 500ms, zelfde vers) kopieert het vers
            var laatsteRechtsklik = { sleutel: null, tijd: 0 };
            document.addEventListener('contextmenu', function (e) {
              var a = e.target.closest ? e.target.closest('a[href*="/studiebijbel/"]') : null;
              var ref = a ? parseRef(a.getAttribute('href')) : null;
              if (!ref) return;
              e.preventDefault();
              var sleutel = ref.slug + '/' + ref.hfd + '/' + ref.vers;
              var nu = Date.now();
              var isDubbelklik = laatsteRechtsklik.sleutel === sleutel && (nu - laatsteRechtsklik.tijd) < 500;
              laatsteRechtsklik = isDubbelklik ? { sleutel: null, tijd: 0 } : { sleutel: sleutel, tijd: nu };
              if (isDubbelklik) {
                popup.style.display = 'none';
                kopieerVers(a, ref);
                return;
              }
              // na een SPA-navigatie (Quartz-router) is deze div uit de pagina
              // gehaald (stond niet in de vers gefetchte HTML) -- de popup-
              // variabele bestaat dan nog wel, maar hangt niet meer echt in
              // de zichtbare pagina; steeds opnieuw vastzetten lost dat op.
              if (!document.body.contains(popup)) document.body.appendChild(popup);
              popup.innerHTML = '<div style="text-align:center;color:#666666;">laden…</div>';
              popup.style.left = Math.max(4, Math.min(e.clientX, window.innerWidth - 440)) + 'px';
              popup.style.top = Math.max(4, Math.min(e.clientY, window.innerHeight - 40)) + 'px';
              popup.style.display = 'block';
              Promise.all(VERTALINGEN.map(function (v) { return haal(v.map, ref); })).then(function (resultaten) {
                popup.innerHTML = VERTALINGEN.map(function (v, i) {
                  var tekst = resultaten[i] && resultaten[i][ref.vers];
                  var doelHref = 'https://gezinvoorgod.nl/studiebijbel/' + ref.slug + '/' + ref.hfd + '/?vert=' + v.naam + '#v' + ref.vers;
                  return '<a href="' + doelHref + '" data-router-ignore style="display:block;font-family:Lora;font-weight:700;font-size:.72rem;color:#1a1a1a;margin-top:' + (i ? '.8rem' : '0') + ';margin-bottom:.25rem;text-transform:uppercase;letter-spacing:.05em;text-decoration:none;">' + v.naam + ' ›</a>' + (tekst ? mdMini(tekst) : '<em>Tekst niet gevonden.</em>');
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
              hoverPopup.style.cssText = 'position:fixed;display:none;max-width:380px;background:#ffffff;border:1px solid #cccccc;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.7rem .9rem;font-size:.85rem;line-height:1.55;z-index:9998;font-family:"Lora",serif;color:#111111;';
              document.body.appendChild(hoverPopup);
            }
            var cache = {};
            function haalVerstekst(ref) {
              var sleutel = ref.slug + '/' + ref.hfd;
              if (sleutel in cache) return cache[sleutel];
              cache[sleutel] = fetch('https://gezinvoorgod.nl/studiebijbel/versteksten/' + ref.slug + '/' + ref.hfd + '.json')
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
              var eindMatch = a.textContent.match(/-(\\d+)/);
              var eind = eindMatch ? parseInt(eindMatch[1], 10) : undefined;
              haalVerstekst(ref).then(function (data) {
                if (hoverLink !== a) return;
                if (!data) return;
                var start = parseInt(ref.vers, 10);
                var totaal = eind ? Math.max(1, eind - start + 1) : 1;
                var aantal = Math.min(totaal, 3);
                var nummers = [];
                for (var i = 0; i < aantal; i++) { var n = start + i; if (data[n]) nummers.push(n); }
                if (!nummers.length) return;
                var meerdere = nummers.length > 1;
                var versenHtml = nummers.map(function (n) {
                  var nr = meerdere ? '<span style="color:var(--tertiary);font-weight:700;margin-right:.35rem;">' + n + '</span>' : '';
                  return '<div style="margin-bottom:.3rem;">' + nr + mdMini(data[n]) + '</div>';
                }).join('');
                hoverPopup.innerHTML = '<div style="font-family:Lora;font-weight:700;font-size:.72rem;color:#1a1a1a;margin-bottom:.25rem;text-transform:uppercase;letter-spacing:.05em;">' + a.textContent + ' · SVnu</div>' + versenHtml;
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
