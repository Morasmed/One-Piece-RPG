# 🏴‍☠️ ONE PIECE: THE JOURNEY – CHANGELOG (The Ultimate Update)

## ⚙️ 1. Optymalizacja Silnika i QoL (Quality of Life)
* **Naprawa Animacji Koła:** Wdrożono nowy system oparty na `requestAnimationFrame` i wymuszaniu reflow (`void cvs.offsetWidth`), co całkowicie wyeliminowało błąd zacinającej się animacji i agresywnego cache'owania przeglądarki.
* **Auto-Skip (100% Szans):** Jeśli na kole znajduje się tylko jedna opcja (np. gwarantowany Boss w Finałowej Wojnie), gra zmienia przycisk na "CONTINUE (100%)" i natychmiastowo podaje wynik, pomijając 4.5-sekundową animację kręcenia.
* **Responsywność UI:** Naprawiono znikający List Gończy na węższych ekranach (od teraz plakat skaluje się dynamicznie zamiast znikać).

## 🧬 2. Przebudowa Ras i Rodowodów (Lineage System)
Rasy i frakcje determinują teraz minimalne statystyki i nadają unikalne modyfikatory:
* **Fishman (Ryboludzie):** +10M Bounty, min. Siła: East Blue, gwarantowane *Fish-Man Karate*, 85% szans na przeżycie wpadnięcia do wody.
* **Mink:** +20M Bounty, min. Szybkość: Grand Line, gwarantowany styl walki *Electro*.
* **Giant (Olbrzymy):** +50M Bounty, min. Siła: Supernova. Z powodu ogromnych gabarytów maksymalna Szybkość jest zablokowana na poziomie *Yonko Commander*.
* **Cyborg:** +30M Bounty, gwarantowana unikalna broń (*Lasers/Enhancements*), **0% szans na wybudzenie Conqueror's Haki**.
* **Lunarian:** +300M Bounty, min. Siła: Yonko Commander, **gwarancja potencjału wszystkich 3 rodzajów Haki**.
* **Celestial Dragon (Podział):**
    * *Spoiled Tenryubito:* +500M startowego Bounty, gwarantowany owoc Logia/Mythical. Statystyki fizyczne permanentnie zablokowane na poziomie "Civilian", brak jakiegokolwiek potencjału Haki.
    * *Holy Knight:* +200M Bounty, min. Siła i Szybkość: Warlord, potężna legendarna broń i gwarantowane minimum 2 rodzaje Haki.
* **Will of D.:** Wylosowanie tego rodowodu automatycznie gwarantuje potencjał odblokowania wszystkich 3 rodzajów Haki.

## 🍎 3. Pasywne Bonusy Kategorii Owoców
Zjedzenie owocu zapewnia teraz ukryte globalne wzmocnienia:
* 🌪️ **Logia:** +10% szans na wygraną w każdej walce bitewnej.
* 🦖 **Zoan / Ancient Zoan:** Zwiększona szansa na "Huge Success! (+2 Tiers)" przy treningu Siły (Strength) i Szybkości (Speed).
* ✂️ **Paramecia:** Zwiększona szansa na "Huge Success! (+2 Tiers)" przy treningu Battle IQ i Fruit Mastery.
* 🐉 **Mythical Zoan:** Pasywne +30% do szansy na udaną ucieczkę ("ESCAPED BARELY") po porażce.

## 🌟 4. Unikalne Skrypty Legendarnych Owoców
Najpotężniejsze owoce otrzymały łamiące grę mechaniki ukryte w kodzie:
* **Hito Hito, Model: Nika:** Jeśli zginiesz, a Twoje opanowanie owocu to minimum *Mastered*, automatycznie budzisz Gear 5 (wymuszony status *AWAKENED*), ożywasz i wygrywasz walkę.
* **Yami Yami:** Usuwa pole "Training Failed" z koła treningu i potężnie zwiększa szanse na szybki rozwój (+2 Tiers).
* **Nikyu Nikyu:** Odbija ból treningu. Zastępuje "Training Failed" darmowym "Success! (+1 Tier)".
* **Gura Gura:** W każdej walce masz 10-15% szans na rzucenie potężnego "One-Shot (Earthquake)" dla darmowej, natychmiastowej wygranej.
* **Mero Mero:** 50% szans na "One-Shot (Petrified)" i wygraną w 1 sekundę, ale tylko jeśli Twoja bazowa szansa na zwycięstwo wynosi min. 65%.
* **Ope Ope:** Gwarantuje dokładnie 1 pewną ucieczkę przed śmiercią ("Room: Shambles") na całą rozgrywkę.
* **Hie Hie:** Całkowita odporność na Klątwę Morza. Dodatkowo zapewnia "FROZEN ESCAPE" – darmową ucieczkę przed bitwą, jeśli Twoje szanse na wygraną wynoszą <30%.
* **Pika Pika:** Natychmiastowo winduje Szybkość (*Speed*) na poziom *Pirate King Level* (i usuwa ją z koła treningu).
* **Tori Tori, Model: Phoenix:** Wymusza sztywną, 80% szansę na ucieczkę po przegranej (ignorując wszelkie inne modyfikatory).
* **Soru Soru:** Kradzież Dusz! Za każdą wygraną walkę na stałe powiększasz swoje całkowite Bounty o +20,000,000 Beli.
* **Magu Magu:** +15% do szansy na wygraną w walce, ale potężna kara do mobilności (szansa na przeżycie porażki spada do 5%).
* **Goro Goro:** Błyskawiczna Mantra. Każdy udany trening Observation Haki daje darmowy +1 Tier.
* **Horo Horo:** 25% szans na One-Shot (Negative Hollow), chyba że przeciwnik posiada Conqueror's Haki (wtedy technika nie zadziała).
* **Uo Uo, Model: Seiryu:** Opończa Smoka. Gra traktuje Bounty każdego napotkanego wroga jako o 20% mniejsze podczas kalkulacji szans na wygraną.
* **Yomi Yomi:** Drugie Życie. Ożywasz raz po "KILLED" z wynikiem "ESCAPED BARELY", ale tracisz 20% swojego aktualnego Bounty jako zapłatę za powrót do żywych.

## 🌊 5. Klątwa Morza (Fell into the Sea)
* Posiadacze owoców (poza *Hie Hie*) mają **10% szans** na wylosowanie zdarzenia wpadnięcia do wody na Kole Podróży.
* Aktywuje to Koło Ratunku: **70%** na uratowanie przez załogę i 30% na natychmiastowy Game Over (Utonięcie).
* Ryboludzie (Fishman) oddychają pod wodą, więc ich szanse ratunku rosną do **85%**.

## ⚡ 6. Cud Mistrza Haki (Haki Pinnacle)
* **Wymagania:** Wszystkie 3 rodzaje Haki muszą być wymaksowane (*Mastered*).
* **Efekt:** Raz na walkę, jeśli wylosujesz "DEFEAT", mechanika Haki Pinnacle przewiduje ten cios (Future Sight + ACoC), anuluje porażkę i daje darmowy, ponowny rzut Kołem Walki (Re-spin).

## 📜 7. Interaktywny Interfejs (Tooltipy)
* Specjalne statystyki na Liście Gończym (Wanted Poster) są teraz podświetlone przerywaną linią.
* Najechanie na nie (Hover) wywołuje tematyczne okienko (tooltip), które **tłumaczy wszystkie ukryte pasywki i skrypty** (Rasy, Owoców, Frakcji i Haki Pinnacle).
