(function () {
  var invoer = document.getElementById('zoekinvoer');
  var knop = document.getElementById('zoekknop');
  var resultaten = document.getElementById('zoekresultaten');
  if (!invoer || !knop || !resultaten) return;

  var boekenCache = null;
  var shardCache = {};

  // Veelgebruikte Nederlandse enkelvoud/alternatieve vormen die afwijken
  // van de officiele boeknaam of afkorting in boeken.json.
  var BOEK_ALIASSEN = {
    psalm: 'psalmen',
    spreuk: 'spreuken',
    klaaglied: 'klaagliederen',
    kroniek: 'kronieken',
    korinthiers: 'korinthe',
    korinthier: 'korinthe',
  };

  function normaliseer(s) {
    return (s || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9]/g, '');
  }

  function haalBoeken() {
    if (boekenCache) return Promise.resolve(boekenCache);
    return fetch('/studiebijbel/boeken.json')
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var sleutels = {};
        Object.keys(data).forEach(function (slug) {
          var info = data[slug];
          sleutels[normaliseer(slug)] = slug;
          sleutels[normaliseer(info.naam)] = slug;
          sleutels[normaliseer(info.afkorting)] = slug;
        });
        boekenCache = { data: data, sleutels: sleutels };
        return boekenCache;
      })
      .catch(function () { return null; });
  }

  function haalShard(shard) {
    if (shardCache[shard]) return shardCache[shard];
    shardCache[shard] = fetch('/studiebijbel/zoekindex/' + shard + '.json')
      .then(function (r) { return r.ok ? r.json() : {}; })
      .catch(function () { return {}; });
    return shardCache[shard];
  }

  var REF_PATROON = /^(.*?)\.?\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/;

  function vindSlug(boekTekst, sleutels) {
    if (sleutels[boekTekst]) return sleutels[boekTekst];
    var digitMatch = boekTekst.match(/^([123])(.*)$/);
    var cijfer = digitMatch ? digitMatch[1] : '';
    var rest = digitMatch ? digitMatch[2] : boekTekst;
    var alias = BOEK_ALIASSEN[rest];
    if (alias && sleutels[cijfer + alias]) return sleutels[cijfer + alias];
    return null;
  }

  function parseerRegel(regel, boeken) {
    var m = regel.match(REF_PATROON);
    if (!m) return null;
    var boekTekst = normaliseer(m[1]);
    var slug = vindSlug(boekTekst, boeken.sleutels);
    if (!slug) return null;
    var hfd = m[2];
    var versStart = m[3] ? parseInt(m[3], 10) : 1;
    var versEind = m[4] ? parseInt(m[4], 10) : versStart;
    if (versEind < versStart) versEind = versStart;
    if (versEind - versStart > 40) versEind = versStart + 40;
    var verzen = [];
    for (var v = versStart; v <= versEind; v++) verzen.push(v);
    return { type: 'ref', slug: slug, hfd: hfd, verzen: verzen, boekNaam: boeken.data[slug].afkorting };
  }

  function zoekWoorden(regel) {
    var woorden = regel.toLowerCase().split(/\s+/).filter(function (w) { return w.length >= 2; });
    return Promise.all(woorden.map(function (woord) {
      var letters = woord.replace(/[^a-zà-ÿ]/g, '').slice(0, 2);
      if (letters.length < 2) letters = (letters + '_').slice(0, 2);
      return haalShard(letters).then(function (shard) {
        var treffers = shard[woord] || [];
        return treffers.map(function (t) { return { type: 'woord', slug: t.s, hfd: t.h, vers: parseInt(t.v, 10) }; });
      });
    })).then(function (lijsten) {
      return [].concat.apply([], lijsten);
    });
  }

  function toonResultaten(items, boekenData) {
    resultaten.innerHTML = '';
    if (!items.length) {
      resultaten.innerHTML = '<span class="zoek-leeg">Geen resultaten gevonden.</span>';
      return;
    }
    var gezien = {};
    items.forEach(function (it) {
      var sleutel = it.slug + '/' + it.hfd + '/' + it.vers;
      if (gezien[sleutel]) return;
      gezien[sleutel] = true;
      var info = boekenData[it.slug];
      var naam = info ? info.afkorting : it.slug;
      var a = document.createElement('a');
      a.href = '/studiebijbel/' + it.slug + '/' + it.hfd + '#v' + it.vers;
      a.className = 'external-link';
      a.textContent = naam + ' ' + it.hfd + ':' + it.vers;
      resultaten.appendChild(a);
    });
    if (!Object.keys(gezien).length) {
      resultaten.innerHTML = '<span class="zoek-leeg">Geen resultaten gevonden.</span>';
    }
  }

  function zoeken() {
    var regels = invoer.value.split('\n').map(function (r) { return r.trim(); }).filter(Boolean);
    if (!regels.length) { resultaten.innerHTML = ''; return; }
    resultaten.innerHTML = '<span class="zoek-leeg">Zoeken…</span>';
    haalBoeken().then(function (boeken) {
      if (!boeken) { resultaten.innerHTML = '<span class="zoek-leeg">Zoeken mislukt.</span>'; return; }
      var taken = regels.map(function (regel) {
        var ref = parseerRegel(regel, boeken);
        if (ref) {
          return Promise.resolve(ref.verzen.map(function (v) {
            return { type: 'ref', slug: ref.slug, hfd: ref.hfd, vers: v };
          }));
        }
        return zoekWoorden(regel);
      });
      Promise.all(taken).then(function (lijsten) {
        var alles = [].concat.apply([], lijsten);
        toonResultaten(alles, boeken.data);
      });
    });
  }

  knop.addEventListener('click', zoeken);
})();

/* ---------- Hover/rechtermuisknop-popup voor zoekresultaten (en elke
   andere /studiebijbel/-link op deze statische pagina's): dezelfde
   functie als Bijbelverswijzingen op de hoofdsite. ---------- */
(function () {
  function parseRef(href) {
    if (!href) return null;
    var m = href.match(/\/studiebijbel\/([a-z0-9-]+)\/(\d+)#v(\d+)$/);
    if (!m) return null;
    return { slug: m[1], hfd: m[2], vers: m[3] };
  }

  function mdMini(t) {
    t = (t || '').replace(/&/g, '&amp;').replace(/</g, '&lt;');
    return t.replace(/\*([^*]+)\*/g, '<em>$1</em>');
  }

  var hoverPopup = document.getElementById('zoek-hoverpopup');
  if (!hoverPopup) {
    hoverPopup = document.createElement('div');
    hoverPopup.id = 'zoek-hoverpopup';
    hoverPopup.style.cssText =
      'position:fixed;display:none;max-width:380px;background:#fff;border:1px solid #cccccc;' +
      'border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.7rem .9rem;font-size:.85rem;' +
      'line-height:1.55;z-index:9998;font-family:"Lora",serif;color:#111111;';
    document.body.appendChild(hoverPopup);
  }
  var hoverCache = {};
  function haalVerstekst(ref) {
    var sleutel = ref.slug + '/' + ref.hfd;
    if (sleutel in hoverCache) return hoverCache[sleutel];
    hoverCache[sleutel] = fetch('/studiebijbel/versteksten/' + ref.slug + '/' + ref.hfd + '.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    return hoverCache[sleutel];
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
      hoverPopup.innerHTML =
        '<div style="font-family:Lora;font-weight:700;font-size:.72rem;color:#1a1a1a;' +
        'margin-bottom:.25rem;text-transform:uppercase;letter-spacing:.05em;">' +
        a.textContent + ' · SVnu</div><div>' + mdMini(tekst) + '</div>';
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

  var vertPopup = document.getElementById('zoek-vertpopup');
  if (!vertPopup) {
    vertPopup = document.createElement('div');
    vertPopup.id = 'zoek-vertpopup';
    vertPopup.style.cssText =
      'position:fixed;display:none;max-width:420px;background:#fff;border:1px solid #cccccc;' +
      'border-radius:8px;box-shadow:0 6px 24px rgba(0,0,0,.16);padding:.8rem 1rem;font-size:.85rem;' +
      'line-height:1.55;z-index:9999;font-family:"Lora",serif;color:#111111;';
    document.body.appendChild(vertPopup);
  }
  var VERTALINGEN = [
    { naam: 'SVnu', map: 'versteksten' },
    { naam: 'SV', map: 'versteksten_sv' },
    { naam: 'KJV', map: 'versteksten_kjv' },
  ];
  var vertCache = {};
  function haalVert(map, ref) {
    var sleutel = map + ':' + ref.slug + '/' + ref.hfd;
    if (sleutel in vertCache) return vertCache[sleutel];
    vertCache[sleutel] = fetch('/studiebijbel/' + map + '/' + ref.slug + '/' + ref.hfd + '.json')
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
    return vertCache[sleutel];
  }

  // dubbele rechtsklik (binnen 500ms, zelfde vers) kopieert het vers i.p.v.
  // de vertalingen-popup te tonen (enkele rechtsklik blijft dat bestaande gedrag)
  var toast = document.getElementById('zoek-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'zoek-toast';
    toast.textContent = 'Gekopieerd';
    toast.style.cssText =
      'position:fixed;left:50%;bottom:2rem;transform:translateX(-50%);background:#1a1a1a;color:#fff;' +
      'font-family:sans-serif;font-size:.85rem;padding:.5rem 1.2rem;border-radius:999px;opacity:0;' +
      'transition:opacity .25s;pointer-events:none;z-index:9999;';
    document.body.appendChild(toast);
  }
  function toonToast() {
    toast.style.opacity = '1';
    setTimeout(function () { toast.style.opacity = '0'; }, 1400);
  }
  function kopieerVers(a, ref) {
    haalVerstekst(ref).then(function (data) {
      var tekst = data && data[ref.vers];
      if (!tekst) return;
      var url = location.origin + '/studiebijbel/' + ref.slug + '/' + ref.hfd + '#v' + ref.vers;
      var kopie = tekst.replace(/\*/g, '') + '\n~ [' + a.textContent + '](' + url + ') (SVnu)';
      navigator.clipboard.writeText(kopie).then(toonToast);
    });
  }
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
      hoverPopup.style.display = 'none';
      vertPopup.style.display = 'none';
      kopieerVers(a, ref);
      return;
    }
    hoverPopup.style.display = 'none';
    if (!document.body.contains(vertPopup)) document.body.appendChild(vertPopup);
    vertPopup.innerHTML = '<div style="text-align:center;color:#666666;">laden…</div>';
    vertPopup.style.left = Math.max(4, Math.min(e.clientX, window.innerWidth - 440)) + 'px';
    vertPopup.style.top = Math.max(4, Math.min(e.clientY, window.innerHeight - 40)) + 'px';
    vertPopup.style.display = 'block';
    Promise.all(VERTALINGEN.map(function (v) { return haalVert(v.map, ref); })).then(function (resultaten) {
      vertPopup.innerHTML = VERTALINGEN.map(function (v, i) {
        var tekst = resultaten[i] && resultaten[i][ref.vers];
        var doelHref = '/studiebijbel/' + ref.slug + '/' + ref.hfd + '/?vert=' + v.naam + '#v' + ref.vers;
        return (
          '<a href="' + doelHref + '" style="display:block;font-family:Lora;font-weight:700;' +
          'font-size:.72rem;color:#1a1a1a;margin-top:' + (i ? '.8rem' : '0') + ';margin-bottom:.25rem;' +
          'text-transform:uppercase;letter-spacing:.05em;text-decoration:none;">' + v.naam + ' ›</a>' +
          (tekst ? mdMini(tekst) : '<em>Tekst niet gevonden.</em>')
        );
      }).join('');
    });
  });
  document.addEventListener('click', function (e) {
    if (!e.target.closest('#zoek-vertpopup')) vertPopup.style.display = 'none';
  });
  document.addEventListener('scroll', function () { vertPopup.style.display = 'none'; }, true);
})();
