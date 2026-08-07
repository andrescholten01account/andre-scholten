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
