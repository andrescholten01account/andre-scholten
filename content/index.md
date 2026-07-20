---
title: Home
---
%% 

André Scholten
andre-scholten.nl

Persoonlijke blog 

[[Blog]] | [[Basis]] | [[Boek]] | [Bijbel](/studiebijbel/) 

%%

<div align="center">

![[Pasted image 20260715071609.png|450]]

</div>

<div style="text-align: center;">

> En vaders, wek geen toorn bij uw kinderen op, maar voed hen op in de onderwijzing en de terechtwijzing van de Heere.
> ~ [Efeze 6:4](https://andre-scholten.nl/studiebijbel/efeze/6#v4) 

> Husbands should try to make home happy and holy.
> ~ John Ploughman (Charles Spurgeon)

</div>

<script>
(function () {
  function parseRef(href) {
    if (!href) return null;
    var m = href.match(/\/studiebijbel\/([a-z0-9-]+)\/(\d+)#v(\d+)$/);
    if (!m) return null;
    return { slug: m[1], hfd: m[2], vers: m[3] };
  }
  var links = Array.prototype.filter.call(
    document.querySelectorAll('a[href*="/studiebijbel/"]'),
    function (a) { return !!parseRef(a.getAttribute('href')); }
  );
  if (!links.length) return;

  var menu = document.getElementById('bijbelvertmenu');
  if (!menu) {
    menu = document.createElement('div');
    menu.id = 'bijbelvertmenu';
    menu.style.cssText = 'position:fixed;display:none;background:#fffdf7;border:1px solid #c9b98a;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.3rem;font-family:sans-serif;font-size:.85rem;z-index:9999;min-width:7rem;';
    document.body.appendChild(menu);
  }
  var popup = document.getElementById('bijbelvertpopup');
  if (!popup) {
    popup = document.createElement('div');
    popup.id = 'bijbelvertpopup';
    popup.style.cssText = 'position:fixed;display:none;max-width:380px;background:#fffdf7;border:1px solid #c9b98a;border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.7rem .9rem;font-size:.85rem;line-height:1.55;z-index:9999;font-family:Georgia,serif;color:#3a2a1d;';
    document.body.appendChild(popup);
  }

  var VERTALINGEN = ['SVnu', 'SV', 'KJV'];
  var cache = {};
  function haal(vert, ref) {
    var sleutel = vert + ':' + ref.slug + '/' + ref.hfd;
    if (sleutel in cache) return cache[sleutel];
    var map = vert === 'SVnu' ? 'versteksten' : (vert === 'SV' ? 'versteksten_sv' : 'versteksten_kjv');
    cache[sleutel] = fetch('https://andre-scholten.nl/studiebijbel/' + map + '/' + ref.slug + '/' + ref.hfd + '.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    return cache[sleutel];
  }

  var actieveRef = null;
  function toonMenu(x, y, ref) {
    actieveRef = ref;
    menu.innerHTML = VERTALINGEN.map(function (v) {
      return '<div class="bvm-optie" data-v="' + v + '" style="padding:.35rem .6rem;border-radius:5px;cursor:pointer;">' + v + '</div>';
    }).join('');
    menu.style.left = Math.max(4, Math.min(x, window.innerWidth - 130)) + 'px';
    menu.style.top = y + 'px';
    menu.style.display = 'block';
    popup.style.display = 'none';
  }
  links.forEach(function (a) {
    a.addEventListener('contextmenu', function (e) {
      var ref = parseRef(a.getAttribute('href'));
      if (!ref) return;
      e.preventDefault();
      toonMenu(e.clientX, e.clientY, ref);
    });
  });
  menu.addEventListener('mouseover', function (e) {
    var o = e.target.closest('.bvm-optie');
    if (o) o.style.background = '#f2ead8';
  });
  menu.addEventListener('mouseout', function (e) {
    var o = e.target.closest('.bvm-optie');
    if (o) o.style.background = '';
  });
  menu.addEventListener('click', function (e) {
    var o = e.target.closest('.bvm-optie');
    if (!o || !actieveRef) return;
    var vert = o.dataset.v;
    var ref = actieveRef;
    var rect = menu.getBoundingClientRect();
    haal(vert, ref).then(function (data) {
      var tekst = data && data[ref.vers];
      popup.innerHTML = '<div style="font-family:sans-serif;font-weight:700;font-size:.72rem;color:#8b5e34;margin-bottom:.25rem;text-transform:uppercase;letter-spacing:.05em;">' + vert + '</div>' + (tekst || '<em>Tekst niet gevonden.</em>');
      popup.style.left = Math.max(4, Math.min(rect.left, window.innerWidth - 400)) + 'px';
      popup.style.top = (rect.bottom + 6) + 'px';
      popup.style.display = 'block';
    });
    menu.style.display = 'none';
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#bijbelvertmenu') && !e.target.closest('#bijbelvertpopup')) {
      menu.style.display = 'none';
      popup.style.display = 'none';
    }
  });
  document.addEventListener('scroll', function () { menu.style.display = 'none'; }, true);
})();
</script>

Lees meer over het [[Blog|gezin]]. 

%%
## Footer

Links:
- [[Blog]]
- [[Basis|Basis christelijk geloof]]
- [[Boek]]
- StudieBijbel

Midden:
- Zoekfunctie

Rechts:
- [[Over]]
- [[Contact]]
- [[Verantwoording]]

[[Copyright policy]]

## Meer

- Blogupdate kan later onder Midden. 
- [To do andre-scholten.nl](https://docs.google.com/document/d/1jtzucFNI_9Exy_BSg7btDH-yfkHD7HdMJq-uZg6YcHY/edit?tab=t.0)

https://books.google.nl/books/about/Divine_and_Moral_Songs_for_Children.html?id=4UdcjfX2b3QC&redir_esc=y

%%

