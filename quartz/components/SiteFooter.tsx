import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const SiteFooter: QuartzComponent = (_props: QuartzComponentProps) => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `
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
    </>
  )
}

export default (() => SiteFooter) satisfies QuartzComponentConstructor
