import BreadcrumbSchema, { getBreadcrumbsForPage } from '@/components/seo/BreadcrumbSchema';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Obchodné podmienky | Rise.sk',
  description: 'Obchodné podmienky a podmienky používania služieb Rise.sk pre vývoj webových stránok a IT riešení.',
  openGraph: {
    title: 'Obchodné podmienky | Rise.sk',
    description: 'Obchodné podmienky a podmienky používania služieb Rise.sk pre vývoj webových stránok a IT riešení.',
    url: 'https://rise.sk/sk/obchodne-podmienky',
    siteName: 'Rise.sk',
    locale: 'sk_SK',
    type: 'website',
  },
}

export default async function ObchodnePodmienky({
  params,
}: {
  params: Promise<{ locale: 'en' | 'sk' }>;
}) {
  const { locale } = await params;
  const breadcrumbs = getBreadcrumbsForPage(locale, 'obchodne-podmienky');

  return (
    <div className="min-h-screen bg-gray-50">
      <BreadcrumbSchema items={breadcrumbs} page="obchodne-podmienky" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Obchodné podmienky
          </h1>

          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                1. Základné ustanovenia
              </h2>
              <p className="text-gray-600 mb-4">
                Tieto obchodné podmienky (ďalej len &ldquo;OP&rdquo;) upravujú vzťahy medzi
                spoločnosťou <strong>Rise.sk s.r.o.</strong> so sídlom v Bratislave,
                Slovenská republika, IČO: 56 911 157 (ďalej len &ldquo;poskytovateľ&rdquo;
                alebo &ldquo;Rise.sk&rdquo;) a objednávateľom služieb (ďalej len &ldquo;klient&rdquo;).
              </p>
              <p className="text-gray-600 mb-4">
                Tieto OP sa vzťahujú na všetky služby poskytované spoločnosťou Rise.sk,
                vrátane vývoja webových stránok, mobilných aplikácií, e-commerce riešení
                a IT konzultácií.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                2. Kontaktné údaje poskytovateľa
              </h2>
              <div className="bg-primary/10 p-4 rounded-lg text-gray-800">
                <p><strong>Názov:</strong> Rise.sk s.r.o.</p>
                <p><strong>Sídlo:</strong> Bratislava, Slovenská republika</p>
                <p><strong>IČO:</strong> 56 911 157</p>
                <p><strong>DIČ:</strong> 2122 587 890</p>
                <p><strong>Email:</strong> rise@rise.sk</p>
                <p><strong>Telefón:</strong> +421 911 670 188</p>
                <p><strong>Web:</strong> www.rise.sk</p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                3. Služby a ich rozsah
              </h2>
              <p className="text-gray-600 mb-4">Rise.sk poskytuje nasledovné služby:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li><strong>Vývoj webových stránok:</strong> responzívne weby, e-shopy, firemné prezentácie</li>
                <li><strong>Mobilné aplikácie:</strong> iOS a Android aplikácie</li>
                <li><strong>UX/UI Design:</strong> dizajn používateľského rozhrania a skúsenosti</li>
                <li><strong>IT konzultácie:</strong> technické poradenstvo a optimalizácia</li>
                <li><strong>Údržba a podpora:</strong> technická podpora existujúcich riešení</li>
                <li><strong>Hosting a doména:</strong> webhosting a správa domén</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                4. Objednávanie služieb
              </h2>
              <p className="text-gray-600 mb-4">
                Objednávka služieb sa uskutočňuje:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Vyplnením kontaktného formulára na webovej stránke</li>
                <li>Emailom na adresu rise@rise.sk</li>
                <li>Telefonicky na čísle +421 911 670 188</li>
                <li>Osobnou návštevou po predchádzajúcej dohode</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Po prijatí objednávky vás budeme kontaktovať do 24 hodín na upresnenie
                požiadaviek a vytvorenie cenové ponuky.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                5. Uzavretie zmluvy
              </h2>
              <p className="text-gray-600 mb-4">
                Zmluva sa považuje za uzavretú momentom:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Písomného akceptovania cenovej ponuky klientom</li>
                <li>Uhradenia zálohy (ak je požadovaná)</li>
                <li>Podpisu písomnej zmluvy o dielo/poskytovaní služieb</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                6. Ceny a platobné podmienky
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Ceny:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Všetky ceny sú uvedené vrátane 20% DPH</li>
                <li>Ceny sú platné 30 dní od vystavenia ponuky</li>
                <li>Pri projektoch nad 2000€ je možná platba v splátkach</li>
              </ul>
              <p className="text-gray-600 mb-4">
                <strong>Platba:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Bankový prevod na účet poskytovateľa</li>
                <li>Splatnosť faktúry: 14 dní od vystavenia</li>
                <li>Pri projektoch nad 1000€ sa požaduje 50% záloha</li>
                <li>Zvyšná suma je splatná po dokončení a akceptovaní diela</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                7. Postupy plnenia a termíny
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Vývoj prebieha v týchto fázach:</strong>
              </p>
              <ol className="list-decimal pl-6 mb-4 text-gray-600">
                <li>Analýza požiadaviek a tvorba technickej špecifikácie</li>
                <li>UX/UI dizajn a wireframy</li>
                <li>Vývoj funkcionality a programovanie</li>
                <li>Testovanie a optimalizácia</li>
                <li>Spustenie a odovzdanie projektu</li>
              </ol>
              <p className="text-gray-600 mb-4">
                <strong>Termíny:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Jednoduchá webová stránka: 2-4 týždne</li>
                <li>Firemná prezentácia: 3-6 týždňov</li>
                <li>E-commerce riešenie: 6-12 týždňov</li>
                <li>Mobilná aplikácia: 8-16 týždňov</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                8. Povinnosti klienta
              </h2>
              <p className="text-gray-600 mb-4">Klient sa zaväzuje:</p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Poskytnúť všetky potrebné podklady a informácie</li>
                <li>Spolupracovať pri testovaní a akceptovaní diela</li>
                <li>Uhradiť faktúry v dohodnutých termínoch</li>
                <li>Informovať o zmenách požiadaviek písomne</li>
                <li>Zabezpečiť prístup k potrebným systémom (hosting, domény)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                9. Autorské práva a licencie
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Zdrojový kód a dizajn:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Autorské práva k vyvinutému kódu zostávajú u Rise.sk</li>
                <li>Klient získava nevýhradnú licenciu na používanie</li>
                <li>Klient môže dielo modifikovať len so súhlasom Rise.sk</li>
              </ul>
              <p className="text-gray-600 mb-4">
                <strong>Obsah poskytnutý klientom:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Klient zodpovedá za autorské práva k poskytnutému obsahu</li>
                <li>Klient udeľuje Rise.sk právo na použitie pre účely projektu</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                10. Záruka a zodpovednosť
              </h2>
              <p className="text-gray-600 mb-4">
                <strong>Záruka:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Na funkčnosť poskytujeme 6-mesačnú záruku</li>
                <li>Záruka sa nevzťahuje na zmeny tretích strán</li>
                <li>Bezplatné opravy chýb a porúch počas záručnej doby</li>
              </ul>
              <p className="text-gray-600 mb-4">
                <strong>Obmedzenie zodpovednosti:</strong>
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Zodpovednosť je obmedzená na výšku uhadenej faktúry</li>
                <li>Nezodpovedáme za nepriame škody a ušlý zisk</li>
                <li>Nezodpovedáme za výpadky tretích strán (hosting, domény)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                11. Ukončenie zmluvy
              </h2>
              <p className="text-gray-600 mb-4">
                Zmluva môže byť ukončená:
              </p>
              <ul className="list-disc pl-6 mb-4 text-gray-600">
                <li>Riadnym splnením záväzkov oboch strán</li>
                <li>Dohodou oboch strán</li>
                <li>Výpoveďou s 30-dňovou výpovednou lehotou</li>
                <li>Okamžite pri podstatnom porušení povinností</li>
              </ul>
              <p className="text-gray-600 mb-4">
                Pri predčasnom ukončení má Rise.sk nárok na úhradu za vykonanú prácu.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                12. Riešenie sporov
              </h2>
              <p className="text-gray-600 mb-4">
                Všetky spory sa riešia prednostne mimosúdnou cestou. V prípade
                neúspešného riešenia je príslušný súd v Bratislave podľa sídla
                poskytovateľa.
              </p>
              <p className="text-gray-600 mb-4">
                Na zmluvné vzťahy sa vzťahuje slovenské právo.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                13. Záverečné ustanovenia
              </h2>
              <p className="text-gray-600 mb-4">
                Tieto obchodné podmienky nadobúdajú účinnosť 25. augusta 2025
                a nahrádzajú všetky predchádzajúce verzie.
              </p>
              <p className="text-gray-600 mb-4">
                Rise.sk si vyhradzuje právo na zmenu týchto podmienok. O zmenách
                budú klienti informovaní prostredníctvom webovej stránky alebo emailom.
              </p>
              <p className="text-gray-600">
                V prípade rozporu medzi týmito OP a písomnou zmluvou má prednosť
                písomná zmluva.
              </p>
            </section>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-dark hover:text-primary-darker font-medium"
            >
              ← Späť na hlavnú stránku
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
