"use client";

import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Bell,
  Box,
  Boxes,
  Check,
  ChevronDown,
  CircleGauge,
  Clock3,
  Cog,
  ExternalLink,
  Factory,
  Globe2,
  Heart,
  Mail,
  MapPin,
  Menu,
  MessageSquareText,
  PackageSearch,
  Phone,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingUp,
  Wrench,
  X,
  Zap,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${BASE_PATH}${path}`;
const route = (path: string) => BASE_PATH
  ? `${BASE_PATH}${path.replace(/\/$/, "")}.html`
  : path;

type Listing = {
  id: number;
  title: string;
  category: string;
  condition: string;
  region: string;
  location: string;
  quantity: number;
  partNumber: string;
  models: string[];
  vendor: string;
  vendorSince: string;
  image: string;
  featured?: boolean;
  posted: string;
  description: string;
};

const listings: Listing[] = [
  {
    id: 1,
    title: "EMD 645E3B Power Assembly",
    category: "Engines",
    condition: "Remanufactured",
    region: "United States",
    location: "Chicago, Illinois",
    quantity: 4,
    partNumber: "9332901",
    models: ["GP38", "GP40", "SD40-2"],
    vendor: "Midwest Rail Systems",
    vendorSince: "Verified since 2019",
    image: asset("/listings/power-assembly.jpg"),
    featured: true,
    posted: "2 hours ago",
    description:
      "Fully remanufactured 645E3B power assembly, dyno-tested and supplied with inspection documentation. Exchange core program available.",
  },
  {
    id: 2,
    title: "GE 7FDL16 Prime Mover",
    category: "Engines",
    condition: "Rebuildable Core",
    region: "United States",
    location: "Houston, Texas",
    quantity: 2,
    partNumber: "7FDL16-CORE",
    models: ["C40-8", "C44-9W", "AC4400CW"],
    vendor: "Gulf Coast Locomotive",
    vendorSince: "Verified since 2016",
    image: asset("/listings/prime-mover.jpg"),
    featured: true,
    posted: "Yesterday",
    description:
      "Complete take-out 7FDL16 prime movers available as rebuildable cores. Stored indoors and ready for inspection or export preparation.",
  },
  {
    id: 3,
    title: "GE 752 Traction Motor",
    category: "Traction Motors",
    condition: "Rebuilt",
    region: "United States",
    location: "Birmingham, Alabama",
    quantity: 6,
    partNumber: "5GE752AH",
    models: ["Dash 8", "Dash 9", "AC4400"],
    vendor: "Southern Traction & Electric",
    vendorSince: "Verified since 2021",
    image: asset("/listings/traction-motor.jpg"),
    posted: "2 days ago",
    description:
      "Rebuilt GE 752 traction motor with new bearings, rewound armature, documented megger readings, and twelve-month service warranty.",
  },
  {
    id: 4,
    title: "EMD 710 Turbocharger Rotor Assembly",
    category: "Turbochargers",
    condition: "New Surplus",
    region: "Canada",
    location: "Calgary, Alberta",
    quantity: 8,
    partNumber: "40020287",
    models: ["SD70", "SD75", "GP60"],
    vendor: "Northline Components",
    vendorSince: "Verified since 2018",
    image: asset("/listings/turbocharger.jpg"),
    posted: "3 days ago",
    description:
      "Unused surplus rotor assemblies for EMD 710 turbochargers. Preserved in sealed packaging with traceable inventory records.",
  },
  {
    id: 5,
    title: "EMD 645 Cylinder Heads — Lot of 12",
    category: "Engine Components",
    condition: "Remanufactured",
    region: "United States",
    location: "Altoona, Pennsylvania",
    quantity: 24,
    partNumber: "40021310",
    models: ["GP38", "GP40", "SD40"],
    vendor: "Keystone Diesel Works",
    vendorSince: "Verified since 2017",
    image: asset("/listings/engine-blocks.jpg"),
    posted: "4 days ago",
    description:
      "Pressure-tested remanufactured cylinder heads with new valves, guides, and seats. Volume pricing available for lots of twelve or more.",
  },
  {
    id: 6,
    title: "26-C Brake Control Valve",
    category: "Air & Brake",
    condition: "New",
    region: "United States",
    location: "Elkhart, Indiana",
    quantity: 12,
    partNumber: "NYAB-26C-110",
    models: ["GP Series", "SD Series", "SW Series"],
    vendor: "Great Lakes Rail Supply",
    vendorSince: "Verified since 2020",
    image: asset("/listings/warehouse.jpg"),
    posted: "5 days ago",
    description:
      "New 26-C compatible brake control valve assemblies with certificates of conformity. Same-day dispatch for stocked quantities.",
  },
];

const categories = [
  { name: "Engines", count: 486, icon: CircleGauge },
  { name: "Engine Components", count: 728, icon: Cog },
  { name: "Traction Motors", count: 214, icon: Zap },
  { name: "Turbochargers", count: 162, icon: TrendingUp },
  { name: "Air & Brake", count: 339, icon: SlidersHorizontal },
  { name: "Electrical", count: 512, icon: Bell },
  { name: "Cooling & Lube", count: 284, icon: Box },
  { name: "Running Gear", count: 193, icon: Wrench },
];

const vendors = [
  {
    name: "Midwest Rail Systems",
    location: "Chicago, IL",
    specialties: "EMD engines · Power assemblies · Exchange programs",
    listings: 142,
    initials: "MR",
  },
  {
    name: "Southern Traction & Electric",
    location: "Birmingham, AL",
    specialties: "Traction motors · Generators · Electrical rebuilds",
    listings: 86,
    initials: "ST",
  },
  {
    name: "Northline Components",
    location: "Calgary, AB",
    specialties: "Turbochargers · New surplus · Export logistics",
    listings: 119,
    initials: "NC",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");
  const [heroCategory, setHeroCategory] = useState("All categories");
  const [region, setRegion] = useState("All regions");
  const [condition, setCondition] = useState("All conditions");
  const [activeSearch, setActiveSearch] = useState("");
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [saved, setSaved] = useState<Set<number>>(new Set());
  const [messageSent, setMessageSent] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const results = useMemo(() => {
    const needle = activeSearch.toLowerCase();
    return listings.filter((listing) => {
      const text = [
        listing.title,
        listing.partNumber,
        listing.category,
        listing.vendor,
        ...listing.models,
      ]
        .join(" ")
        .toLowerCase();
      return (
        (!needle || text.includes(needle)) &&
        (heroCategory === "All categories" || listing.category === heroCategory) &&
        (region === "All regions" || listing.region === region) &&
        (condition === "All conditions" || listing.condition === condition)
      );
    });
  }, [activeSearch, heroCategory, region, condition]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedListing(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function submitSearch(event: FormEvent) {
    event.preventDefault();
    setActiveSearch(query.trim());
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  function chooseCategory(name: string) {
    setHeroCategory(name);
    setActiveSearch("");
    document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleSaved(id: number) {
    setSaved((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <main>
      <div className="utility-bar">
        <div className="shell utility-inner">
          <span>Built for railroad professionals</span>
          <span className="utility-trust"><ShieldCheck size={14} /> Verified vendors · Direct contact · No buyer fees</span>
        </div>
      </div>

      <header className="site-header">
        <div className="shell header-inner">
          <a className="brand" href="#top" aria-label="Locomotive Trader home">
            <span className="brand-mark" aria-hidden="true">LT</span>
            <span className="brand-copy">Locomotive<span>Trader</span><small>.com</small></span>
          </a>
          <nav className={mobileOpen ? "main-nav is-open" : "main-nav"} aria-label="Main navigation">
            <a href="#categories" onClick={() => setMobileOpen(false)}>Browse parts</a>
            <a href="#vendors" onClick={() => setMobileOpen(false)}>Vendor directory</a>
            <a href="#pricing" onClick={() => setMobileOpen(false)}>Pricing</a>
            <a href="#wanted" onClick={() => setMobileOpen(false)}>Wanted board</a>
          </nav>
          <div className="header-actions">
            <a className="text-button" href={route("/vendor/")}>Vendor sign in</a>
            <a className="button button-dark button-small" href={route("/vendor/")}>List inventory <ArrowRight size={15} /></a>
          </div>
          <button className="mobile-toggle" type="button" aria-label="Toggle menu" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-image" aria-hidden="true" style={{ backgroundImage: `url(${asset("/listings/power-assembly.jpg")})` }} />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="shell hero-inner">
          <div className="hero-copy">
            <div className="eyebrow light"><span /> The dedicated locomotive parts market</div>
            <h1>The part you need.<br /><em>Without the runaround.</em></h1>
            <p>Search verified locomotive inventory by part number, model, condition, or region. Contact the vendor directly—no buyer account and no commission.</p>
          </div>

          <form className="hero-search" onSubmit={submitSearch}>
            <div className="search-heading">
              <span><PackageSearch size={20} /> Find locomotive parts</span>
              <small>3,280 active listings</small>
            </div>
            <label className="search-keyword">
              <Search size={21} />
              <span className="sr-only">Part number or keyword</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Part number, component, or locomotive model" />
            </label>
            <div className="search-selects">
              <label>
                <span>Category</span>
                <select value={heroCategory} onChange={(event) => setHeroCategory(event.target.value)}>
                  <option>All categories</option>
                  {categories.map((item) => <option key={item.name}>{item.name}</option>)}
                </select>
                <ChevronDown size={16} />
              </label>
              <label>
                <span>Region</span>
                <select value={region} onChange={(event) => setRegion(event.target.value)}>
                  <option>All regions</option>
                  <option>United States</option>
                  <option>Canada</option>
                </select>
                <ChevronDown size={16} />
              </label>
              <button className="button button-orange" type="submit">Search inventory <ArrowRight size={17} /></button>
            </div>
            <div className="popular-searches">
              <span>Popular:</span>
              {["EMD 645", "GE 752", "Turbocharger", "26-C brake"].map((term) => (
                <button key={term} type="button" onClick={() => { setQuery(term); setActiveSearch(term); document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }); }}>{term}</button>
              ))}
            </div>
          </form>

          <div className="hero-proof">
            <div><strong>84</strong><span>Verified vendors</span></div>
            <div><strong>34</strong><span>Countries reached</span></div>
            <div><strong>6 hr</strong><span>Avg. reply time</span></div>
          </div>
        </div>
      </section>

      <section className="category-section section" id="categories">
        <div className="shell">
          <div className="section-heading split-heading">
            <div>
              <div className="eyebrow"><span /> Browse by system</div>
              <h2>Get to the right shelf, faster.</h2>
            </div>
            <button className="arrow-link" type="button" onClick={() => { setHeroCategory("All categories"); document.getElementById("listings")?.scrollIntoView({ behavior: "smooth" }); }}>View all 3,280 parts <ArrowRight size={17} /></button>
          </div>
          <div className="category-grid">
            {categories.map(({ name, count, icon: Icon }) => (
              <button className="category-card" key={name} type="button" onClick={() => chooseCategory(name)}>
                <span className="category-icon"><Icon size={24} strokeWidth={1.7} /></span>
                <span><strong>{name}</strong><small>{count} listings</small></span>
                <ArrowRight className="category-arrow" size={17} />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="listings-section section" id="listings">
        <div className="shell">
          <div className="section-heading split-heading listing-title-row">
            <div>
              <div className="eyebrow"><span /> Live inventory</div>
              <h2>{activeSearch || heroCategory !== "All categories" ? "Search results" : "Featured and recent parts"}</h2>
              <p>{results.length} demo listing{results.length === 1 ? "" : "s"} match your current search.</p>
            </div>
            <div className="view-note"><Clock3 size={16} /> Updated daily by vendors</div>
          </div>

          <div className="market-layout">
            <aside className="filters" aria-label="Listing filters">
              <div className="filter-title"><SlidersHorizontal size={18} /> Refine results</div>
              <label>
                <span>Condition</span>
                <select value={condition} onChange={(event) => setCondition(event.target.value)}>
                  <option>All conditions</option>
                  <option>New</option>
                  <option>New Surplus</option>
                  <option>Remanufactured</option>
                  <option>Rebuilt</option>
                  <option>Rebuildable Core</option>
                </select>
              </label>
              <label>
                <span>Region</span>
                <select value={region} onChange={(event) => setRegion(event.target.value)}>
                  <option>All regions</option>
                  <option>United States</option>
                  <option>Canada</option>
                </select>
              </label>
              <label>
                <span>Category</span>
                <select value={heroCategory} onChange={(event) => setHeroCategory(event.target.value)}>
                  <option>All categories</option>
                  {categories.map((item) => <option key={item.name}>{item.name}</option>)}
                </select>
              </label>
              <label className="check-row"><input type="checkbox" /> <span>In-stock only</span></label>
              <label className="check-row"><input type="checkbox" /> <span>Verified vendors</span></label>
              <button className="clear-button" type="button" onClick={() => { setActiveSearch(""); setQuery(""); setCondition("All conditions"); setRegion("All regions"); setHeroCategory("All categories"); }}>Clear all filters</button>
              <div className="filter-help">
                <MessageSquareText size={19} />
                <strong>Can’t find it?</strong>
                <span>Post a wanted request and alert matching vendors.</span>
                <a href="#wanted">Post wanted part →</a>
              </div>
            </aside>

            <div className="listing-results">
              {results.length === 0 ? (
                <div className="empty-state">
                  <PackageSearch size={34} />
                  <h3>No exact matches yet</h3>
                  <p>Clear a filter or post a wanted request so vendors can come to you.</p>
                  <button className="button button-dark" type="button" onClick={() => { setActiveSearch(""); setCondition("All conditions"); setRegion("All regions"); setHeroCategory("All categories"); }}>Show all inventory</button>
                </div>
              ) : results.map((listing) => (
                <article className="listing-card" key={listing.id}>
                  <button className="listing-image" type="button" onClick={() => { setSelectedListing(listing); setMessageSent(false); }} aria-label={`View ${listing.title}`}>
                    <img src={listing.image} alt={listing.title} />
                    {listing.featured && <span className="featured-label"><Sparkles size={12} /> Featured</span>}
                    <span className="condition-label">{listing.condition}</span>
                  </button>
                  <div className="listing-body">
                    <div className="listing-kicker"><span>{listing.category}</span><small>{listing.posted}</small></div>
                    <button className="listing-title" type="button" onClick={() => { setSelectedListing(listing); setMessageSent(false); }}>{listing.title}</button>
                    <div className="part-number">Part # <strong>{listing.partNumber}</strong></div>
                    <div className="model-tags">
                      {listing.models.slice(0, 3).map((model) => <span key={model}>{model}</span>)}
                    </div>
                    <div className="listing-location"><MapPin size={15} /> {listing.location} <span>·</span> Qty {listing.quantity}</div>
                    <div className="vendor-line"><BadgeCheck size={16} /><span><strong>{listing.vendor}</strong><small>{listing.vendorSince}</small></span></div>
                    <div className="listing-footer">
                      <div>
                        <button className={saved.has(listing.id) ? "save-button saved" : "save-button"} type="button" onClick={() => toggleSaved(listing.id)} aria-label={saved.has(listing.id) ? "Remove saved listing" : "Save listing"}><Heart size={18} fill={saved.has(listing.id) ? "currentColor" : "none"} /></button>
                        <button className="button button-outline button-small" type="button" onClick={() => { setSelectedListing(listing); setMessageSent(false); }}>View & contact</button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="wanted-section" id="wanted">
        <div className="shell wanted-inner">
          <div className="wanted-copy">
            <div className="eyebrow light"><span /> Wanted board</div>
            <h2>Let the inventory<br />come to you.</h2>
            <p>Post one hard-to-find part request. We’ll notify qualified vendors whose inventory and capabilities match.</p>
            <div className="wanted-points"><span><Check size={16} /> Free for buyers</span><span><Check size={16} /> No account required</span><span><Check size={16} /> Responses go to your inbox</span></div>
          </div>
          <form className="wanted-form" onSubmit={(event) => { event.preventDefault(); alert("Demo request received — matching vendors would be notified."); }}>
            <div className="form-title"><strong>Post a wanted part</strong><span>Takes about 60 seconds</span></div>
            <label>Part or description<input required placeholder="e.g. EMD 645 oil pump" /></label>
            <div className="form-row"><label>Part number<input placeholder="If known" /></label><label>Quantity<input type="number" min="1" defaultValue="1" /></label></div>
            <div className="form-row"><label>Your work email<input required type="email" placeholder="name@company.com" /></label><label>Needed by<input type="date" /></label></div>
            <button className="button button-orange button-full" type="submit">Alert matching vendors <ArrowRight size={17} /></button>
          </form>
        </div>
      </section>

      <section className="vendors-section section" id="vendors">
        <div className="shell">
          <div className="section-heading split-heading">
            <div><div className="eyebrow"><span /> Vendor directory</div><h2>Specialists who know the hardware.</h2><p>Browse established suppliers, rebuilders, machine shops, and surplus experts.</p></div>
            <button className="arrow-link" type="button">Browse all vendors <ArrowRight size={17} /></button>
          </div>
          <div className="vendor-grid">
            {vendors.map((vendor) => (
              <article className="vendor-card" key={vendor.name}>
                <div className="vendor-logo">{vendor.initials}</div>
                <div className="vendor-card-head"><h3>{vendor.name}</h3><BadgeCheck size={18} /><span>Premium vendor</span></div>
                <p>{vendor.specialties}</p>
                <div className="vendor-meta"><span><MapPin size={14} /> {vendor.location}</span><span><Boxes size={14} /> {vendor.listings} listings</span></div>
                <button className="button button-outline button-full" type="button">View vendor profile <ArrowRight size={15} /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="sell-banner">
        <div className="shell sell-inner">
          <div className="sell-icon"><Factory size={31} /></div>
          <div><span>For suppliers, rebuilders & machine shops</span><h2>Turn idle inventory into qualified conversations.</h2><p>One predictable monthly rate. Unlimited buyer contacts. Zero commission on the sale.</p></div>
          <a className="button button-light" href="#pricing">See vendor plans <ArrowRight size={17} /></a>
        </div>
      </section>

      <section className="pricing-section section" id="pricing">
        <div className="shell">
          <div className="section-heading centered-heading"><div className="eyebrow"><span /> Vendor plans</div><h2>List more. Pay the same.</h2><p>Simple subscriptions built around inventory volume—not sales commission.</p><div className="trial-pill"><Sparkles size={15} /> First month free for founding vendors</div></div>
          <div className="pricing-grid">
            <article className="price-card"><div className="plan-name">Starter</div><p>For specialists testing a new sales channel.</p><ul><li><Check size={16} /> Up to 25 active listings</li><li><Check size={16} /> Direct buyer inquiries</li><li><Check size={16} /> Vendor profile</li><li><Check size={16} /> Basic listing analytics</li></ul><a className="button button-outline button-full" href={route("/vendor/")}>Start free month</a></article>
            <article className="price-card popular"><div className="popular-flag">Most popular</div><div className="plan-name">Growth</div><p>For active suppliers with rotating inventory.</p><ul><li><Check size={16} /> Up to 150 active listings</li><li><Check size={16} /> 3 featured boosts / month</li><li><Check size={16} /> Premium vendor badge</li><li><Check size={16} /> Lead & search analytics</li><li><Check size={16} /> Priority search placement</li></ul><a className="button button-orange button-full" href={route("/vendor/")}>Start free month</a></article>
            <article className="price-card"><div className="plan-name">Network</div><p>For high-volume and multi-location vendors.</p><ul><li><Check size={16} /> Unlimited active listings</li><li><Check size={16} /> 10 featured boosts / month</li><li><Check size={16} /> Multiple team members</li><li><Check size={16} /> Inventory feed imports</li><li><Check size={16} /> Priority support</li></ul><a className="button button-outline button-full" href={route("/vendor/")}>Start free month</a></article>
          </div>
          <p className="pricing-note">All plans include a 30-day trial. No setup fee. Cancel anytime. Listings are hidden—not deleted—if a subscription lapses.</p>
        </div>
      </section>

      <section className="dashboard-preview section">
        <div className="shell dashboard-preview-inner">
          <div className="dashboard-copy"><div className="eyebrow light"><span /> Vendor control panel</div><h2>Know what inventory is working.</h2><p>Manage every listing, respond to buyer inquiries, monitor searches, and boost the parts buyers need now.</p><div className="dashboard-features"><span><BarChart3 size={17} /> Listing-level analytics</span><span><Bell size={17} /> Lead notifications</span><span><TrendingUp size={17} /> One-click featured boosts</span></div><a className="button button-orange" href={route("/vendor/")}>Open vendor dashboard demo <ArrowRight size={17} /></a></div>
          <div className="dashboard-card" aria-label="Vendor analytics preview">
            <div className="dashboard-card-top"><span><i /> <i /> <i /></span><small>Last 30 days <ChevronDown size={13} /></small></div>
            <div className="dash-summary"><div><span>Listing views</span><strong>2,841</strong><small>↑ 18.4%</small></div><div><span>Buyer inquiries</span><strong>36</strong><small>↑ 9.1%</small></div><div><span>Response rate</span><strong>94%</strong><small>Excellent</small></div></div>
            <div className="mini-chart"><div className="chart-title"><strong>Qualified views</strong><span>July 8 – Aug 8</span></div><div className="bars">{[34, 54, 42, 72, 61, 84, 68, 91, 76, 96, 82, 100].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div></div>
            <div className="dash-list"><div><img src={asset("/listings/power-assembly.jpg")} alt="" /><span><strong>EMD 645E3B Power Assembly</strong><small>782 views · 14 leads</small></span><b>Active</b></div><div><img src={asset("/listings/traction-motor.jpg")} alt="" /><span><strong>GE 752 Traction Motor</strong><small>506 views · 8 leads</small></span><b>Active</b></div></div>
          </div>
        </div>
      </section>

      <footer>
        <div className="shell footer-top">
          <div className="footer-brand"><a className="brand footer-logo" href="#top"><span className="brand-mark">LT</span><span className="brand-copy">Locomotive<span>Trader</span><small>.com</small></span></a><p>The dedicated marketplace for locomotive parts, components, and qualified industry leads.</p><div className="footer-contact"><a href="tel:+13125550184"><Phone size={15} /> (312) 555-0184</a><a href="mailto:hello@locomotivetrader.com"><Mail size={15} /> hello@locomotivetrader.com</a></div></div>
          <div><strong>Marketplace</strong><a href="#categories">Browse parts</a><a href="#vendors">Vendor directory</a><a href="#wanted">Wanted board</a><a href="#listings">Recent listings</a></div>
          <div><strong>For vendors</strong><a href="#pricing">Pricing & plans</a><a href={route("/vendor/")}>Vendor dashboard</a><a href="#pricing">List inventory</a><a href="#vendors">Success stories</a></div>
          <div><strong>Company</strong><a href="#top">About</a><a href="#top">Trade shows</a><a href="#top">Contact</a><a href={route("/admin/")}>Admin demo</a></div>
        </div>
        <div className="shell footer-bottom"><span>© 2026 LocomotiveTrader.com. Demo marketplace.</span><span><a href="#top">Terms</a><a href="#top">Privacy</a><a href="#top"><Globe2 size={14} /> English</a></span></div>
      </footer>

      {selectedListing && (
        <div className="modal-backdrop" role="presentation" onMouseDown={() => setSelectedListing(null)}>
          <section className="listing-modal" role="dialog" aria-modal="true" aria-labelledby="listing-modal-title" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" type="button" aria-label="Close listing" onClick={() => setSelectedListing(null)}><X /></button>
            <div className="modal-image"><img src={selectedListing.image} alt={selectedListing.title} />{selectedListing.featured && <span className="featured-label"><Sparkles size={12} /> Featured</span>}</div>
            <div className="modal-content">
              <div className="modal-detail">
                <div className="listing-kicker"><span>{selectedListing.category}</span><small>Posted {selectedListing.posted}</small></div>
                <h2 id="listing-modal-title">{selectedListing.title}</h2>
                <div className="spec-grid"><div><span>Part number</span><strong>{selectedListing.partNumber}</strong></div><div><span>Condition</span><strong>{selectedListing.condition}</strong></div><div><span>Quantity</span><strong>{selectedListing.quantity} available</strong></div><div><span>Location</span><strong>{selectedListing.location}</strong></div></div>
                <h3>Compatible models</h3><div className="model-tags">{selectedListing.models.map((model) => <span key={model}>{model}</span>)}</div>
                <h3>About this part</h3><p>{selectedListing.description}</p>
                <div className="modal-vendor"><div className="vendor-logo">{selectedListing.vendor.split(" ").map((word) => word[0]).slice(0, 2).join("")}</div><div><span>Listed by</span><strong>{selectedListing.vendor} <BadgeCheck size={16} /></strong><small>{selectedListing.vendorSince}</small></div><button type="button">View profile <ExternalLink size={14} /></button></div>
              </div>
              <aside className="contact-panel">
                {messageSent ? <div className="success-message"><span><Check size={28} /></span><h3>Inquiry sent</h3><p>{selectedListing.vendor} has your request. Replies go directly to your inbox.</p><button className="button button-outline button-full" type="button" onClick={() => setMessageSent(false)}>Send another</button></div> : <form onSubmit={(event) => { event.preventDefault(); setMessageSent(true); }}><div className="contact-title"><MessageSquareText size={21} /><div><strong>Contact the vendor</strong><span>No buyer account required</span></div></div><label>Name<input required placeholder="Your name" /></label><label>Work email<input required type="email" placeholder="name@company.com" /></label><label>Company<input required placeholder="Railroad or company" /></label><label>Message<textarea required defaultValue={`I'm interested in ${selectedListing.title} (Part #${selectedListing.partNumber}). Please send availability and lead time.`} /></label><button className="button button-orange button-full" type="submit">Send inquiry <ArrowRight size={16} /></button><p className="form-privacy"><ShieldCheck size={14} /> Your details go only to this vendor.</p></form>}
              </aside>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
