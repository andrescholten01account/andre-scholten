---
Status: Draft
draft: true
blog: false
publicatiedatum:
---
# Compleet stappenplan: cursief-reparatie StatenvertalingNu (SVnu)

Context: 4.116 verzen missen (deels of geheel) de cursief-markering (*woord*) die de Statenvertaling wél heeft voor door de vertalers zelf toegevoegde woorden. Structureel gat uit de oorspronkelijke vertaalrun (ontdekt 18 juli 2026), geen recente regressie. Bron: hertaling/json/*.json, velden sv en svnu — wordt overal gebruikt (hoofdtekst, popups, tabs, concordantie), dus één reparatie hier lost het overal tegelijk op.

Totale kosten: €2-5. Alleen stap 3 kost geld.

---

### Stap 1 — Omvang opnieuw vaststellen

python scripts/controle_cursief.py

Model: Claude Code / Sonnet (het bestaande script alleen uitvoeren). Effort: laag. Kosten: €0.

---

### Stap 2 — Gratis, deterministisch oplossen met code

Prompt (voor Claude Code):

Bouw scripts/fix_cursief_deterministisch.py: lees pipeline/datagat_cursief.tsv.

Voor elk vers daarin: zoek in de svnu-tekst een woord dat exact (of via

dezelfde stam-vergelijking als koppel_woorden.py) overeenkomt met elk

SV-cursiefwoord. ALLEEN aanpassen als er precies één ondubbelzinnige

kandidaat is in de zin; zet daar een asterisk-paar omheen in svnu, verder

niets wijzigen. Bij twijfel (0 of >1 kandidaten) NIETS aanpassen -- laat

dat vers over voor stap 3. Rapporteer aan het einde: hoeveel verzen zijn

opgelost, hoeveel blijven over.

Model: Claude Code / Sonnet (bouwt en test het script zelf, geen apart vertaalmodel nodig). Effort: middel (de stam-matchlogica moet correct hergebruikt worden, niet triviale boilerplate). Kosten: €0.

---

### Stap 3 — De rest naar het AI-model (enige betaalde stap)

Prompt (voor het hertaalmodel, via Batch API):

Verwerk de resterende onopgeloste verzen (na stap 2) via de Batch API.

Voor elk vers: geef het model de sv-tekst en de huidige svnu-tekst, en

vraag welk woord/welke woorden in svnu overeenkomen met elk SV-cursiefwoord.

Voeg daar een asterisk-paar omheen toe, verander verder niets aan de

bewoording. Bij twijfel: NIET gokken, vlag het vers voor handmatige

beoordeling. Bundel meerdere verzen per verzoek (net als de oorspronkelijke

vertaling), niet één-voor-één.

Schrijf verzen die ook na deze verwerking nog gevlagd blijven (geen

eenduidige match) weg naar pipeline/cursief_handmatig_nazien.tsv --

niet stilzwijgend laten liggen.

Model: Sonnet 5 (via Batch API — dit is het aparte vertaalmodel, niet Claude Code zelf). Effort: thinking UIT (net als de oorspronkelijke hertaling). Kosten: €2-5.

---

### Stap 4 — Verifiëren (vaste stap, geen optie)

python scripts/controle_cursief.py

Model: Claude Code / Sonnet (script draaien + resultaat rapporteren). Effort: laag. De steekproef zelf (15-20 verzen naast SV leggen) doe jij zelf, geen AI voor nodig. Kosten: €0.

---

### Stap 5 — Regenereren en publiceren

python scripts/maak_alles.py

gevolgd door de publiceerroute (kopiëren naar de site-repo, committen, pushen naar v5).  
Model: Claude Code / Sonnet (meerdere routinematige stappen, zoals eerder deze sessie). Effort: middel. Kosten: €0.

  

  

-------------------------------------------------------------------

  

Prompt B — Woordkoppeling-escalatie:

  

Rond de woordkoppeling af (de stippellijn-functie waarmee je op een woord in

SVnu klikt en het grondtekstwoord ziet). Context: ~86,5% is al deterministisch

gekoppeld; de rest staat klaar in pipeline/koppel_escalatie.jsonl (28.391

verzoeken, gebouwd 8 juli). Details in ONTWERP_WOORDKOPPELING.md en

pipeline/STATUS.md.

  

BELANGRIJK eerst checken: koppeling/*/*.json is ná 8 juli opnieuw

gegenereerd (het "vliegwiel" — deterministische regels bijgewerkt in

woordenlijst.tsv) maar koppel_escalatie.jsonl zelf niet. Regenereer eerst de

escalatie-lijst opnieuw vanuit de huidige koppeling-staat vóór je iets indient

bij de API — anders betaal je voor het opnieuw oplossen van gevallen die het

vliegwiel al heeft opgelost.

  

Doe dan:

1. Dien de (opnieuw opgebouwde) escalatielijst in via de Batch API — Sonnet 5,

   klein prompt per vers/eenheid, zoals in §6 van ONTWERP_WOORDKOPPELING.md

   beschreven.

2. Bij onzekere gevallen die Sonnet zelf vlagt: die apart met Opus beoordelen

   (klein aantal, geen aparte batch nodig).

3. Verwerk het resultaat terug in koppeling/*/*.json.

4. Rapporteer de nieuwe dekkingsgraad; publiceer niet automatisch naar de

   live site zonder akkoord.

  

Geef vooraf een token-telling (count_tokens) op de definitieve, opnieuw

opgebouwde lijst zodat de werkelijke kosten bekend zijn voordat je indient.

  
  

=> dit kwam ik ook nog tegen:

  

1-  Laat met weten welke taken er straks nog open staan, zoals dit:

  

Niet nu (kost echt geld / is moeilijk terug te draaien): de betaalde escalatie-batch (~€15-25) en de cursief-fix (~€3-10) start ik niet zonder jouw akkoord over de kosten; de GitHub-repo hernoemen laat ik ook liggen — dat is lastig terug te draaien en jij twijfelde daar zelf al over.

  

-> is dit nodig? vertel hier iets over. de SVnu-vertaling was toch al geregeld (behalve de cursivering dan).