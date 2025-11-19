import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Ochrana osobných údajov | Rise.sk',
  description: 'Informácie o ochrane osobných údajov a spracovaní dát v súlade s GDPR na Rise.sk.',
}

export default function OchranaOsobnychUdajov() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Ochrana osobných údajov (GDPR)
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Základné informácie
              </h2>
              <p className="text-gray-600 mb-4">
                Spoločnosť <strong>Rise.sk s.r.o.</strong> (ďalej len &ldquo;spoločnosť&rdquo; alebo &ldquo;my&rdquo;) 
                so sídlom v Bratislave, Slovenská republika, IČO: 56 911 157, berie ochranu 
                osobných údajov veľmi vážne a zaväzuje sa chrániť súkromie všetkých návštevníkov 
                našej webovej stránky a klientov.
              </p>
              <p className="text-gray-600 mb-4">
                Táto zásada ochrany osobných údajov vysvetľuje, ako zhromažďujeme, používame, 
                uchovávame a chránime vaše osobné údaje v súlade s Nariadením Európskeho 
                parlamentu a Rady (EU) 2016/679 (GDPR) a zákonom č. 18/2018 Z.z. o ochrane 
                osobných údajov.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. Kontaktné údaje prevádzkovateľa
              </h2>
              <div className="bg-bronze-50 p-4 rounded-lg text-gray-800">
                <p><strong>Názov:</strong> Rise.sk s.r.o.</p>
                <p><strong>Sídlo:</strong> Bratislava, Slovenská republika</p>
                <p><strong>IČO:</strong> 56 911 157</p>
                <p><strong>Email:</strong> rise@rise.sk</p>
                <p><strong>Telefón:</strong> +421 911 670 188</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. Aké osobné údaje spracúvame
              </h2>
              <p className="text-gray-600 mb-4">Spracúvame nasledovné kategórie osobných údajov:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Identifikačné údaje:</strong> meno, priezvisko, email, telefón</li>
                <li><strong>Obchodné údaje:</strong> názov spoločnosti, pozícia</li>
                <li><strong>Komunikačné údaje:</strong> správy z kontaktných formulárov</li>
                <li><strong>Technické údaje:</strong> IP adresa, informácie o prehliadači, cookies</li>
                <li><strong>Správanie na webe:</strong> návštevnosť stránok, čas strávený na stránke</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Účely spracúvania osobných údajov
              </h2>
              <p className="text-gray-600 mb-4">Vaše osobné údaje spracúvame na tieto účely:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Komunikácia s klientmi a odpovede na požiadavky</li>
                <li>Poskytovanie služieb web developmentu a IT konzultácií</li>
                <li>Marketingová komunikácia (len so súhlasom)</li>
                <li>Analýza návštevnosti a zlepšovanie webovej stránky</li>
                <li>Plnenie zákonných povinností</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Právny základ spracúvania
              </h2>
              <p className="text-gray-600 mb-4">Osobné údaje spracúvame na základe:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Súhlas dotknutej osoby</strong> (Art. 6 ods. 1 písm. a) GDPR) - pre marketingové účely</li>
                <li><strong>Plnenie zmluvy</strong> (Art. 6 ods. 1 písm. b) GDPR) - poskytovanie služieb</li>
                <li><strong>Oprávnený záujem</strong> (Art. 6 ods. 1 písm. f) GDPR) - analýza návštevnosti</li>
                <li><strong>Plnenie právnej povinnosti</strong> (Art. 6 ods. 1 písm. c) GDPR) - účtovníctvo</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. Doba uchovávania údajov
              </h2>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Kontaktné formuláre:</strong> 3 roky od poslednej komunikácie</li>
                <li><strong>Zmluvy a účtovné doklady:</strong> 10 rokov (zákonná lehota)</li>
                <li><strong>Marketingové súhlasy:</strong> do odvolania súhlasu</li>
                <li><strong>Cookies a analytické údaje:</strong> maximálne 2 roky</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. Vaše práva
              </h2>
              <p className="text-gray-600 mb-4">V súlade s GDPR máte tieto práva:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Právo na prístup</strong> - informácie o spracúvaní vašich údajov</li>
                <li><strong>Právo na opravu</strong> - oprava nesprávnych údajov</li>
                <li><strong>Právo na vymazanie</strong> - &ldquo;právo byť zabudnutý&rdquo;</li>
                <li><strong>Právo na obmedzenie</strong> - obmedzenie spracúvania</li>
                <li><strong>Právo na námietku</strong> - námietka proti spracúvaniu</li>
                <li><strong>Právo na prenosnosť</strong> - prenos údajov k inému správcovi</li>
                <li><strong>Právo odvolať súhlas</strong> - kedykoľvek bez udania dôvodu</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. Cookies
              </h2>
              <p className="text-gray-600 mb-4">
                Naša webová stránka používa cookies na zlepšenie používateľského zážitku. 
                Rozlišujeme tieto kategórie cookies:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Nevyhnutné cookies:</strong> potrebné pre fungovanie webu</li>
                <li><strong>Analytické cookies:</strong> Google Analytics (len so súhlasom)</li>
                <li><strong>Funkčné cookies:</strong> jazykové preferencie, chat nastavenia</li>
                <li><strong>Marketingové cookies:</strong> sledovanie pre reklamné účely</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Svoje nastavenia cookies môžete kedykoľvek zmeniť v pätičke našej stránky.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. Bezpečnosť údajov
              </h2>
              <p className="text-gray-600 mb-4">
                Implementovali sme vhodné technické a organizačné opatrenia na ochranu 
                vašich osobných údajov proti neoprávnenému prístupu, zmene, zverejneniu 
                alebo zničeniu, vrátane:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>SSL šifrovanie pre všetky komunikácie</li>
                <li>Pravidelné zálohovanie údajov</li>
                <li>Obmedzený prístup k osobným údajom</li>
                <li>Pravidelné bezpečnostné audity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                10. Kontakt a sťažnosti
              </h2>
              <p className="text-gray-600 mb-4">
                V prípade otázok týkajúcich sa ochrany osobných údajov nás kontaktujte:
              </p>
              <div className="bg-bronze-50 p-4 rounded-lg mb-4 text-gray-800">
                <p><strong>Email:</strong> rise@rise.sk</p>
                <p><strong>Telefón:</strong> +421 911 670 188</p>
              </div>
              <p className="text-gray-600 mb-4">
                Máte právo podať sťažnosť na Úrade na ochranu osobných údajov SR:
              </p>
              <div className="bg-gray-100 p-4 rounded-lg text-gray-800">
                <p><strong>Úrad na ochranu osobných údajov SR</strong></p>
                <p>Hraničná 12, 820 07 Bratislava</p>
                <p>Tel.: +421 2 3231 3214</p>
                <p>Email: statny.dozor@pdp.gov.sk</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                11. Zmeny tejto zásady
              </h2>
              <p className="text-gray-600 mb-4">
                Túto zásadu ochrany osobných údajov môžeme priebežne aktualizovať. 
                O významných zmenách vás budeme informovať prostredníctvom našej 
                webovej stránky alebo emailom.
              </p>
              <p className="text-gray-600">
                <strong>Posledná aktualizácia:</strong> 25. august 2025
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link 
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-bronze-600 hover:text-bronze-700 font-medium"
            >
              ← Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
