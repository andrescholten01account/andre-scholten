➔ Nog geen idee wat ik hiermee moet ➔ uitzoeken

---
### Verschil met de negen inferentieregels

> De negen inferentieregels leiden een **nieuwe** conclusie af uit premissen. De tien vervangingsregels herschrijven een uitspraak in een logisch **gelijkwaardige** vorm, in beide richtingen.

Dat tweerichtingskarakter (⟺, "dan en slechts dan als") is het belangrijkste kenmerk dat vervangingsregels onderscheidt van inferentieregels, die maar één kant op werken (van premisse naar conclusie).

### Samen compleet

Met deze tien vervangingsregels plus de negen eerder genoemde inferentieregels heb je een compleet systeem: negentien regels waarmee elk geldig argument in de propositielogica stap voor stap bewezen kan worden.

---
#### Regel 1: De Morgan

Niet (P en Q) ⟺ (niet P) of (niet Q)  
Niet (P of Q) ⟺ (niet P) en (niet Q)

**Voorbeeld:**  
"Het is niet zo dat Jan komt en Piet komt" is gelijk aan "Jan komt niet, of Piet komt niet."

#### Regel 2: Commutativiteit

(P of Q) ⟺ (Q of P)  
(P en Q) ⟺ (Q en P)

**Voorbeeld:**  
"Anna zingt of Bram danst" is gelijk aan "Bram danst of Anna zingt."

#### Regel 3: Associativiteit

P of (Q of R) ⟺ (P of Q) of R  
P en (Q en R) ⟺ (P en Q) en R

**Voorbeeld:**  
"Jan komt, of (Piet komt of Klaas komt)" is gelijk aan "(Jan komt of Piet komt), of Klaas komt."

#### Regel 4: Distributiviteit

P en (Q of R) ⟺ (P en Q) of (P en R)  
P of (Q en R) ⟺ (P of Q) en (P of R)

**Voorbeeld:**  
"Het regent en (het is maandag of dinsdag)" is gelijk aan "(het regent en het is maandag) of (het regent en het is dinsdag)."

#### Regel 5: Dubbele ontkenning

P ⟺ niet (niet P)

**Voorbeeld:**  
"Jan is thuis" is gelijk aan "Het is niet zo dat Jan niet thuis is."

#### Regel 6: Transpositie

Als P, dan Q ⟺ Als niet Q, dan niet P

**Voorbeeld:**  
"Als het regent, wordt de straat nat" is gelijk aan "Als de straat niet nat wordt, regent het niet."

#### Regel 7: Materiale implicatie

Als P, dan Q ⟺ (niet P) of Q

**Voorbeeld:**  
"Als Jan slaagt, krijgt hij een diploma" is gelijk aan "Jan slaagt niet, of hij krijgt een diploma."

#### Regel 8: Materiale equivalentie

P dan-en-slechts-dan-als Q ⟺ (Als P, dan Q) en (Als Q, dan P)  
P dan-en-slechts-dan-als Q ⟺ (P en Q) of (niet P en niet Q)

**Voorbeeld:**  
"Jan komt dan en slechts dan als Piet komt" is gelijk aan "Als Jan komt, komt Piet, en als Piet komt, komt Jan."

#### Regel 9: Exportatie

Als (P en Q), dan R ⟺ Als P, dan (als Q, dan R)

**Voorbeeld:**  
"Als het regent en het is koud, blijf ik binnen" is gelijk aan "Als het regent, dan geldt: als het koud is, blijf ik binnen."

#### Regel 10: Tautologie

P ⟺ (P of P)  
P ⟺ (P en P)

**Voorbeeld:**  
"Jan is thuis" is gelijk aan "Jan is thuis, of Jan is thuis."

---
## Waar het misgaat

Vervangingsregels zijn abstract als je ze los ziet staan. Laten we opnieuw beginnen, met het enige dat echt telt.

## Het enige dat je moet snappen

> Een vervangingsregel zegt: deze twee zinnen betekenen precies hetzelfde. Je mag de ene overal vervangen door de andere.

Dat is alles. Geen nieuwe conclusie, geen "dus". Gewoon: hetzelfde in andere woorden.

## Vergelijk met gewone taal

Dit ken je al, zonder logica.

"Jan en Piet komen" betekent hetzelfde als "Piet en Jan komen." Dat is Commutativiteit. Je hebt niks nieuws geleerd, je hebt het alleen anders gezegd.

"Het is niet zo dat ik niet wil" betekent hetzelfde als "ik wil." Dat is Dubbele ontkenning. Weer: geen nieuwe informatie, alleen een andere formulering.

## Het verschil met de negen regels

Dit is waarschijnlijk het punt waar de verwarring zit.

**Inferentieregel (bijv. modus ponens):** Je hebt twee premissen. Je trekt een nieuwe conclusie. Je gaat vooruit.

**Vervangingsregel:** Je hebt één zin. Je herschrijft hem. Je staat stil, maar in een handigere vorm.

> Vervangingsregels leveren geen nieuwe informatie op. Ze zetten iets om in een vorm waarmee de negen inferentieregels wél verder kunnen.

## Waarom heb je dat nodig

Hier wordt het concreet. Stel je hebt dit:

**Premisse:** Niet (P en Q)

Met modus ponens, modus tollens, of een van de andere acht regels kun je hier **niets** mee. Ze verwachten allemaal de vorm "Als P, dan Q" of "P en Q." Deze zin past in geen van die mallen.

**Stap met De Morgan:** Niet (P en Q) wordt: (niet P) of (niet Q)

Nu heb je opeens een "of"-zin. Daar kan bijvoorbeeld disjunctief syllogisme wel mee verder, als je ergens ook "P" hebt staan.

## Simpel voorbeeld, helemaal uitgewerkt

**Premissen:**

1. Niet (Jan komt en Piet komt)
2. Jan komt

**Vraag:** wat volgt hieruit?

**Stap 1, De Morgan toepassen op premisse 1:** Niet (Jan komt) of niet (Piet komt)

**Stap 2, disjunctief syllogisme toepassen op deze nieuwe zin en premisse 2:** Premisse 2 zegt: Jan komt. Dus "niet Jan komt" is onwaar.

**Conclusie:** Piet komt niet.

Zonder De Morgan in stap 1 had je vast gezeten. De negen inferentieregels konden premisse 1 in zijn oorspronkelijke vorm niet gebruiken.

## De kern in één zin

> Vervangingsregels zijn geen redeneerstappen. Het zijn hertaalstappen, nodig om een zin in de juiste vorm te krijgen zodat een inferentieregel hem daarna kan gebruiken.

Wil je dit nog een keer met een ander, iets uitgebreider voorbeeld doen, of is dit onderscheid nu duidelijk?