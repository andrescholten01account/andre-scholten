---
Status: Draft
draft: true
blog: false
publicatiedatum:
---
Noodplan: laptop kwijt of kapot
Dit document staat op twee plekken: in het project (NOODPLAN.md) en los in OneDrive (.md en .docx), zodat je het ook kunt vinden als je de projectmap niet meer weet te vinden.
Waar staat alles opgeslagen?
Alles staat dubbel:
1.     OneDrive — synct automatisch naar de Microsoft-cloud.
2.     GitHub — twee onafhankelijke plekken, los van je laptop én los van OneDrive:
◦       pinksterzegen → de website + je Obsidian-notities (back-up elke paar minuten via de Obsidian-git plugin, zolang Obsidian open staat)
◦       pinksterzegen-bronbestanden → de hoofdmap (bronnen, hertaling, koppeling, pipeline, scripts) (back-up elke 30 minuten via de Windows-taak “PinksterzegenBronbestandenBackup”)
Beide zijn privé GitHub-repositories onder het account andrescholten01account.
Stappenplan op een nieuwe laptop
Stap 1 — Claude Code installeren
Zie https://docs.claude.com/claude-code voor installatie-instructies, of vraag iemand die je helpt om dit te doen.
https://docs.claude.com/claude-code
Stap 2 — Plak deze prompt in Claude Code
Kopieer onderstaande tekst en plak hem als eerste bericht in Claude Code. Claude leidt je dan door de rest van het herstel heen, en wacht op jou bij de onderdelen die je zelf moet doen (inloggen, klikken in een programma).

---

Mijn laptop is kwijt of kapot en ik wil alles herstellen. Help me hier stap  
voor stap doorheen en wacht steeds tot ik zeg dat een stap gelukt is voor je  
verdergaat:  
   
1. Zet OneDrive terug: help me OneDrive te installeren, ik log zelf in met  
   mijn Microsoft-account.  
2. Installeer Git en GitHub CLI. Laat mij `gh auth login` zelf uitvoeren en  
   inloggen via de browser.  
3. Haal mijn bestanden op van GitHub (account: andrescholten01account):  
   - repo "pinksterzegen-bronbestanden" -> map "C:\Users\andre\OneDrive\Documenten\Claude\Projects\De Volle Pinksterzegen"  
   - repo "pinksterzegen" -> submap "pinksterzegen" daarbinnen  
4. Herinner me eraan om het .env-bestand uit 1Password (notitie "Github  
   .env-bestand") te kopiëren naar de hoofdmap.  
5. Help me Obsidian te installeren en de vault te openen op de map  
   "pinksterzegen\content" daarbinnen.  
   
Lees, als die er al staat, ook het bestand NOODPLAN.md in die hoofdmap voor  
de volledige details.

---

### Stap 3 — OneDrive terugzetten

(back-up stap — als het goed is leidt Claude je hier via de prompt al doorheen)

Installeer OneDrive en log in met je Microsoft-account. Alles wat op het moment van uitval al gesynchroniseerd was, komt vanzelf terug.

Handmatig: zelf inloggen met je Microsoft-account.

### Stap 4 — Git installeren

(back-up stap — als het goed is leidt Claude je hier via de prompt al doorheen)

Download en installeer Git:

[https://git-scm.com/downloads](https://git-scm.com/downloads)

### Stap 5 — GitHub CLI installeren en inloggen

(back-up stap — als het goed is leidt Claude je hier via de prompt al doorheen)

3.     Download en installeer GitHub CLI: https://cli.github.com/

4.     Open een terminal (PowerShell) en voer uit: gh auth login

5.     Volg de stappen op het scherm: kies GitHub.com → HTTPS → inloggen via de browser.

Handmatig: dit inloggen kan Claude niet voor je doen, dat moet je zelf even doen.

### Stap 6 — Bestanden ophalen van GitHub

(back-up stap — als het goed is leidt Claude je hier via de prompt al doorheen)

Open een terminal (PowerShell) en voer uit:

---

cd "C:\Users\andre\OneDrive\Documenten\Claude\Projects"  
gh repo clone andrescholten01account/pinksterzegen-bronbestanden "De Volle Pinksterzegen"  
cd "De Volle Pinksterzegen"  
gh repo clone andrescholten01account/pinksterzegen pinksterzegen

---

Dit haalt alles terug zoals het laatst is opgeslagen op GitHub — altijd actueel, ongeacht wat er met de laptop of OneDrive is gebeurd.

### Stap 7 — Het .env-bestand terugzetten

(back-up stap — als het goed is leidt Claude je hier via de prompt al doorheen)

Dit bestand (met wachtwoorden/sleutels) zit met opzet niet in de GitHub-back-up.

6.     Open 1Password → notitie “Github .env-bestand”.

7.     Kopieer de inhoud naar een nieuw bestand: De Volle Pinksterzegen\.env

Handmatig: dit moet je zelf uit 1Password halen, Claude heeft daar geen toegang toe.

### Stap 8 — Obsidian terugzetten

(back-up stap — als het goed is leidt Claude je hier via de prompt al doorheen)

8.     Download en installeer Obsidian: https://obsidian.md

9.     Open Obsidian → “Open folder as vault” → kies de map: De Volle Pinksterzegen\pinksterzegen\content

10.  Je notities staan er weer (ze zaten in de GitHub-back-up). Instellingen/plugins van Obsidian zelf (zoals obsidian-git) staan niet in de back-up — die moet je opnieuw installeren via Instellingen → Community plugins, als je die weer wilt gebruiken.

Handmatig: Obsidian installeren en de vault openen is een handeling in het programma zelf.

## Losse aandachtspunten

•       De automatische taak “PinksterzegenBronbestandenBackup” (Windows Taakplanner) draait alleen als deze laptop aan staat en je bent ingelogd — check dit af en toe via de app “Taakplanner”.

•       Beide GitHub-repositories zijn privé; alleen jouw account (andrescholten01account) heeft er toegang toe.

  

—------------------------------------------------------------------------------------------

  

Als ik de naam bij github, enz. van /pinksterzegen verander naar andre-scholten -> dan bovenstaande handleiding aan laten passen door claude.

---

