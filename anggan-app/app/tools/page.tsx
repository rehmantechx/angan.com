"use client";
import { useEffect, useMemo, useState } from "react";
import { getPublicListings } from "../../lib/db";
import { Listing, LISTINGS, GRAIN_MARKET } from "../../lib/seed";
import { ListingCard } from "../../components/ListingCard";
import { CalcIcon, LoanIcon, ConvertIcon, FileIcon, MapIcon, HomeIcon } from "../../lib/icons";

// Services-style card: navy header, gold icon, number, like /services.
// Same design language, so tools read as visual cards, not text blocks.
const TOOL_ICONS: Record<string, React.ReactNode> = {
  cost: <CalcIcon size={36} />, loan: <LoanIcon size={36} />, area: <ConvertIcon size={36} />,
  index: <HomeIcon size={36} />, guides: <MapIcon size={36} />, finder: <FileIcon size={36} />,
};
function Tool({ title, children, id, num }: { title: string; children: React.ReactNode; id: string; num: string }) {
  return (
    <section id={id} className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden scroll-mt-4 flex flex-col h-full">
      <div className="bg-navy px-5 pt-5 pb-4 text-white flex items-start justify-between">
        <span className="text-[#DDB78B]">{TOOL_ICONS[id]}</span>
        <span className="block text-white font-bold text-2xl leading-none">{num}</span>
      </div>
      <div className="w-10 h-1 bg-anngan ml-5 -mt-0.5" aria-hidden="true" />
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-bold text-navy text-lg">{title}</h2>
        <div className="mt-3 grid gap-2">{children}</div>
      </div>
    </section>
  );
}

const inputCls = "border border-gray-300 rounded px-3 py-2 w-full";
const btnCls = "bg-anngan text-white px-4 py-2.5 rounded min-h-[48px] inline-flex items-center w-fit";

export default function ToolsPage() {
  // Seed first, like home and Properties, so the tools never show
  // prices from 0 listings while Firestore is loading or empty.
  const [listings, setListings] = useState<Listing[]>(LISTINGS.filter((l) => l.liveStatus === "live" && l.visible !== false));
  useEffect(() => {
    getPublicListings().then((rows) => { if (rows.length > 0) setListings(rows); });
  }, []);

  // 1. Building cost
  const [ccArea, setCcArea] = useState("");
  const [ccRate, setCcRate] = useState("");
  const [ccCont, setCcCont] = useState(false);
  const [ccOut, setCcOut] = useState("");

  // 2. Home loan
  const [lnAmt, setLnAmt] = useState("");
  const [lnYears, setLnYears] = useState("");
  const [lnRate, setLnRate] = useState("");
  const [lnOut, setLnOut] = useState("");

  // 3. Area converter
  const [acVal, setAcVal] = useState("");
  const [acFrom, setAcFrom] = useState("Marla");
  const [acOut, setAcOut] = useState("");

  // 4. City prices (from real listings, sale only, rent separate)
  const [pfCity, setPfCity] = useState("");
  const [pfSize, setPfSize] = useState("");
  const [pfGo, setPfGo] = useState(false);

  // 5. Area guides
  const [guide, setGuide] = useState("");

  // 6. Plot / file finder
  const [ffQ, setFfQ] = useState("");
  const [ffGo, setFfGo] = useState(false);

  const sale = useMemo(() => listings.filter((l) => l.status === "sale"), [listings]);
  const rent = useMemo(() => listings.filter((l) => l.status === "rent"), [listings]);

  const cityPrices = useMemo(() => {
    const rows = sale.filter((l) => !pfCity || l.city === pfCity).filter((l) => !pfSize || l.size === pfSize);
    return rows;
  }, [sale, pfCity, pfSize]);

  const fileHits = useMemo(() => {
    const key = ffQ.trim().toLowerCase();
    const files = [
      { name: "MGH Zamindar File", where: "MGH Pakistan, Mangla", note: "Zamindar File, Affidavit MGH and Serene Farm Houses, inside one project." },
      { name: "Pak China Grain Market shops", where: "Shujabad Road, Multan", note: "996 shops, 54 acres. 2 Marla Rs 56 Lac, 3 Marla Rs 84 Lac, 4 Marla Rs 112 Lac." },
      { name: "Al Ghani Phase 7 file", where: "Bhaini Road, Lahore", note: "Al Ghani Phase 7, Lahore." },
      { name: "Kashmir Modern City file", where: "Mirpur, Kashmir", note: "Sold Out. Mirpur, Kashmir." },
    ];
    if (!key) return files;
    return files.filter((f) => (f.name + " " + f.where).toLowerCase().includes(key));
  }, [ffQ]);

  const guides: Record<string, string> = {
    "DHA Lahore": "DHA Lahore: 10 Marla houses from Rs 46,000,000 to Rs 60,000,000 in the real listings, 1 Kanal at Rs 65,000,000 in Phase 7. Call the office for the latest files.",
    "Bahria Town Lahore": "Bahria Town Lahore: 10 Marla luxury house at Rs 47,500,000 in the real listings. Bahria Orchard upper portion for rent at Rs 39,000 per month.",
    "Bahria Town Rawalpindi": "Bahria Town Rawalpindi: 5 Marla house for sale at Rs 16,500,000, and a 10 Marla furnished house for rent in Phase 8 at Rs 300,000 per month.",
    "Karachi": "Karachi: only 1 real listing on anngan.com, the Shamsi Society Airport flat at Rs 3,600,000, 2 bed, 2 bath, 4 Marla.",
    "Multan": "Multan: 5 Marla house in Citi Housing Phase 1 at Rs 10,000,000, and Pak China Grain Market shops on Shujabad Road, 2 Marla Rs 56 Lac, 3 Marla Rs 84 Lac, 4 Marla Rs 112 Lac.",
    "Islamabad": "Islamabad: 6 Marla house for rent on Kuri Road near Pindoriya at Rs 70,000 per month.",
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-navy">Tools</h1>
      <p className="text-gray-600 mt-1">Free tools. Prices come from the listings on this site.</p>

      <div className="grid gap-4 mt-4 md:grid-cols-2">
        <Tool id="cost" num="01" title="Building cost calculator">
          <input value={ccArea} onChange={(e) => setCcArea(e.target.value)} placeholder="Covered area in sqft" inputMode="decimal" className={inputCls} />
          <input value={ccRate} onChange={(e) => setCcRate(e.target.value)} placeholder="Rate per sqft in Rs" inputMode="decimal" className={inputCls} />
          <label className="text-sm flex gap-2 items-center">
            <input type="checkbox" checked={ccCont} onChange={(e) => setCcCont(e.target.checked)} /> Add 10% extra for surprises
          </label>
          <button
            className={btnCls}
            onClick={() => {
              const a = parseFloat(ccArea);
              const r = parseFloat(ccRate);
              if (!a || !r) { setCcOut("Enter both the covered area and your rate per sqft."); return; }
              const total = a * r;
              const grand = ccCont ? total * 1.1 : total;
              setCcOut("Cost: Rs " + Math.round(total).toLocaleString("en-PK") + (ccCont ? " + 10% extra = Rs " + Math.round(grand).toLocaleString("en-PK") : ""));
            }}
          >
            Work out cost
          </button>
          {ccOut ? <p className="text-sm font-semibold">{ccOut}</p> : null}
        </Tool>

        <Tool id="loan" num="02" title="Home loan calculator">
          <input value={lnAmt} onChange={(e) => setLnAmt(e.target.value)} placeholder="Loan amount in Rs" inputMode="decimal" className={inputCls} />
          <input value={lnYears} onChange={(e) => setLnYears(e.target.value)} placeholder="Years" inputMode="decimal" className={inputCls} />
          <input value={lnRate} onChange={(e) => setLnRate(e.target.value)} placeholder="Yearly markup % (for example 18)" inputMode="decimal" className={inputCls} />
          <button
            className={btnCls}
            onClick={() => {
              const P = parseFloat(lnAmt);
              const y = parseFloat(lnYears);
              const rate = parseFloat(lnRate);
              if (!P || !y || lnRate.trim() === "" || Number.isNaN(rate) || rate < 0) { setLnOut("Enter the loan amount, years and yearly markup."); return; }
              const n = y * 12;
              // 0% markup is a real rate: no markup, just split the loan
              // over the months, never divide by zero.
              const pay = rate === 0 ? P / n : (P * (rate / 100 / 12) * Math.pow(1 + rate / 100 / 12, n)) / (Math.pow(1 + rate / 100 / 12, n) - 1);
              setLnOut("Monthly payment: Rs " + Math.round(pay).toLocaleString("en-PK") + ". Total paid over " + y + " years: Rs " + Math.round(pay * n).toLocaleString("en-PK") + ".");
            }}
          >
            Work out payment
          </button>
          {lnOut ? <p className="text-sm font-semibold">{lnOut}</p> : null}
        </Tool>

        <Tool id="area" num="03" title="Area converter">
          <input value={acVal} onChange={(e) => setAcVal(e.target.value)} placeholder="Enter a number" inputMode="decimal" className={inputCls} />
          <select value={acFrom} onChange={(e) => setAcFrom(e.target.value)} className={inputCls}>
            <option>Marla</option>
            <option>Kanal</option>
            <option>Sqft</option>
            <option>Sqyd</option>
            <option>Acre</option>
          </select>
          <button
            className={btnCls}
            onClick={() => {
              const v = parseFloat(acVal);
              if (!v) { setAcOut("Enter a number first."); return; }
              const sqft = ({ Marla: 272.25, Kanal: 5445, Sqft: 1, Sqyd: 9, Acre: 43560 } as Record<string, number>)[acFrom] * v;
              setAcOut(v + " " + acFrom + " = " + sqft.toLocaleString("en-PK") + " sqft = " + (sqft / 272.25).toFixed(2) + " Marla = " + (sqft / 5445).toFixed(2) + " Kanal = " + (sqft / 9).toFixed(2) + " sqyd = " + (sqft / 43560).toFixed(3) + " Acre");
            }}
          >
            Convert
          </button>
          {acOut ? <p className="text-sm font-semibold">{acOut}</p> : null}
        </Tool>

        <Tool id="index" num="04" title="City prices from real listings">
          <p className="text-sm text-gray-600">For sale only. Rent is listed separately below, so sale prices and rent are never mixed.</p>
          <select value={pfCity} onChange={(e) => setPfCity(e.target.value)} className={inputCls}>
            <option value="">All cities</option>
            {["Lahore", "Karachi", "Rawalpindi", "Multan", "Islamabad"].map((c) => <option key={c}>{c}</option>)}
          </select>
          <select value={pfSize} onChange={(e) => setPfSize(e.target.value)} className={inputCls}>
            <option value="">All sizes</option>
            {["4 Marla", "5 Marla", "6 Marla", "10 Marla", "1 Kanal"].map((s) => <option key={s}>{s}</option>)}
          </select>
          <button className={btnCls} onClick={() => setPfGo(true)}>Show prices</button>
          {pfGo ? (
            <div>
              <p className="text-sm font-semibold">For sale: {cityPrices.length} {cityPrices.length === 1 ? "listing" : "listings"}</p>
              {cityPrices.map((l) => (
                <p key={l.id} className="text-sm mt-1">{l.title} &middot; {l.price}</p>
              ))}
              <p className="text-sm font-semibold mt-3">For rent ({rent.length}):</p>
              {rent.map((l) => (
                <p key={l.id} className="text-sm mt-1">{l.title} &middot; {l.price}</p>
              ))}
            </div>
          ) : null}
        </Tool>

        <Tool id="guides" num="05" title="Area guides">
          <select value={guide} onChange={(e) => setGuide(e.target.value)} className={inputCls}>
            <option value="">Pick an area</option>
            {Object.keys(guides).map((g) => <option key={g}>{g}</option>)}
          </select>
          {guide ? <p className="text-sm">{guides[guide]}</p> : <p className="text-sm text-gray-600">Guides use only the real listings and projects on this site.</p>}
        </Tool>

        <Tool id="finder" num="06" title="Plot and file finder">
          <input value={ffQ} onChange={(e) => setFfQ(e.target.value)} placeholder="Search files, for example MGH or Grain Market" className={inputCls} />
          <button className={btnCls} onClick={() => setFfGo(true)}>Find</button>
          {ffGo ? (
            <div>
              {fileHits.length === 0 ? <p className="text-sm">No file matched that word. Call +92 304 1111 698 to ask.</p> : null}
              {fileHits.map((f) => (
                <div key={f.name} className="border-t border-gray-100 pt-2 mt-2">
                  <p className="font-semibold text-sm">{f.name}</p>
                  <p className="text-sm text-gray-600">{f.where}</p>
                  <p className="text-sm">{f.note}</p>
                </div>
              ))}
              <p className="text-sm mt-2 text-gray-600">
                Pak China Grain Market: {GRAIN_MARKET.shops} shops, {GRAIN_MARKET.acres} acres, {GRAIN_MARKET.road}.
              </p>
            </div>
          ) : null}
        </Tool>
      </div>
    </div>
  );
}
