"use client";

import { ArrowLeft, BarChart3, Bell, Boxes, Check, ChevronDown, CircleDollarSign, Clock3, Eye, Gauge, LayoutDashboard, Mail, Menu, MessageSquareText, MoreHorizontal, PackagePlus, Pause, Pencil, Plus, Search, Settings, Sparkles, Trash2, TrendingUp, Users, X } from "lucide-react";
import { FormEvent, useState } from "react";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const asset = (path: string) => `${BASE_PATH}${path}`;

type VendorListing = {
  id: number;
  title: string;
  part: string;
  image: string;
  status: "Active" | "Paused" | "Deleted";
  views: number;
  inquiries: number;
  featured?: boolean;
};

const initialListings: VendorListing[] = [
  { id: 1, title: "EMD 645E3B Power Assembly", part: "9332901", image: asset("/listings/power-assembly.jpg"), status: "Active", views: 782, inquiries: 14, featured: true },
  { id: 2, title: "GE 752 Traction Motor", part: "5GE752AH", image: asset("/listings/traction-motor.jpg"), status: "Active", views: 506, inquiries: 8 },
  { id: 3, title: "EMD 710 Turbocharger Rotor", part: "40020287", image: asset("/listings/turbocharger.jpg"), status: "Paused", views: 311, inquiries: 4 },
  { id: 4, title: "26-C Brake Control Valve", part: "NYAB-26C-110", image: asset("/listings/warehouse.jpg"), status: "Active", views: 284, inquiries: 6 },
];

export default function VendorDashboard() {
  const [listings, setListings] = useState(initialListings);
  const [showCreate, setShowCreate] = useState(false);
  const [notice, setNotice] = useState("");
  const [mobileNav, setMobileNav] = useState(false);

  function setStatus(id: number, status: VendorListing["status"]) {
    setListings((items) => items.map((item) => item.id === id ? { ...item, status } : item));
    setNotice(status === "Deleted" ? "Listing moved to deleted. You can restore it anytime." : `Listing is now ${status.toLowerCase()}.`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  function addListing(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setListings((items) => [{ id: Date.now(), title: String(data.get("title")), part: String(data.get("part")), image: asset("/listings/engine-blocks.jpg"), status: "Active", views: 0, inquiries: 0 }, ...items]);
    setShowCreate(false);
    setNotice("New listing published.");
    window.setTimeout(() => setNotice(""), 2600);
  }

  return (
    <main className="app-shell">
      <aside className={mobileNav ? "dashboard-sidebar open" : "dashboard-sidebar"}>
        <div className="sidebar-brand"><a href={`${BASE_PATH}/`} className="brand"><span className="brand-mark">LT</span><span className="brand-copy">Locomotive<span>Trader</span></span></a><button type="button" onClick={() => setMobileNav(false)} aria-label="Close navigation"><X /></button></div>
        <div className="company-switcher"><div>MR</div><span><small>Vendor workspace</small><strong>Midwest Rail Systems</strong></span><ChevronDown size={15} /></div>
        <nav className="dash-nav"><small>Workspace</small><a className="active" href="#overview"><LayoutDashboard size={18} /> Overview</a><a href="#inventory"><Boxes size={18} /> Listings <b>{listings.filter((item) => item.status !== "Deleted").length}</b></a><a href="#leads"><MessageSquareText size={18} /> Buyer inquiries <b>3</b></a><a href="#analytics"><BarChart3 size={18} /> Analytics</a><small>Account</small><a href="#profile"><Users size={18} /> Vendor profile</a><a href="#plan"><CircleDollarSign size={18} /> Plan & billing</a><a href="#settings"><Settings size={18} /> Settings</a></nav>
        <div className="sidebar-plan"><div><span>Growth plan</span><strong>72 / 150 listings</strong></div><i><b style={{ width: "48%" }} /></i><small>3 featured boosts available</small><button type="button">Manage plan</button></div>
        <a className="back-market" href={`${BASE_PATH}/`}><ArrowLeft size={16} /> Back to marketplace</a>
      </aside>

      <div className="dashboard-main">
        <header className="dash-header"><button className="dash-mobile" type="button" onClick={() => setMobileNav(true)}><Menu /></button><div className="dash-search"><Search size={17} /><input placeholder="Search your listings or leads" /></div><div className="dash-header-actions"><button type="button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="avatar">AM</div><span><strong>Alex Morgan</strong><small>Vendor admin</small></span></div></header>
        <div className="dashboard-content" id="overview">
          <div className="dash-welcome"><div><div className="eyebrow"><span /> Vendor control panel</div><h1>Good morning, Alex.</h1><p>Here’s how your inventory is performing this month.</p></div><button className="button button-orange" type="button" onClick={() => setShowCreate(true)}><Plus size={17} /> Create listing</button></div>

          <div className="stat-grid">
            <article><span className="stat-icon orange"><Eye size={20} /></span><div><small>Listing views</small><strong>2,841</strong><em><TrendingUp size={13} /> 18.4%</em></div><p>vs. previous 30 days</p></article>
            <article><span className="stat-icon blue"><MessageSquareText size={20} /></span><div><small>Buyer inquiries</small><strong>36</strong><em><TrendingUp size={13} /> 9.1%</em></div><p>8 awaiting a reply</p></article>
            <article><span className="stat-icon green"><Gauge size={20} /></span><div><small>Response rate</small><strong>94%</strong><em>Excellent</em></div><p>Avg. reply in 3h 42m</p></article>
            <article><span className="stat-icon purple"><Boxes size={20} /></span><div><small>Active listings</small><strong>{listings.filter((item) => item.status === "Active").length}</strong><em>of 150</em></div><p>Growth plan capacity</p></article>
          </div>

          <div className="dash-columns" id="analytics">
            <section className="panel analytics-panel"><div className="panel-head"><div><strong>Inventory visibility</strong><span>Qualified listing views</span></div><button type="button">Last 30 days <ChevronDown size={14} /></button></div><div className="big-number">2,841 <span>+18.4%</span></div><div className="line-chart"><div className="chart-grid"><i /><i /><i /><i /></div><div className="trend-bars" aria-label="Listing views trending upward">{[31, 38, 34, 48, 44, 59, 52, 67, 62, 74, 70, 86, 81, 96].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="chart-labels"><span>Jul 8</span><span>Jul 15</span><span>Jul 22</span><span>Jul 29</span><span>Aug 8</span></div></div></section>
            <section className="panel lead-panel" id="leads"><div className="panel-head"><div><strong>Recent inquiries</strong><span>3 need your attention</span></div><button type="button">View all</button></div><div className="lead-item"><span className="lead-avatar">RC</span><div><strong>Ryan Chen</strong><p>EMD 645E3B Power Assembly</p><small><Clock3 size={12} /> 18 minutes ago</small></div><i>New</i></div><div className="lead-item"><span className="lead-avatar blue">JM</span><div><strong>Jamie Morales</strong><p>GE 752 Traction Motor</p><small><Clock3 size={12} /> 2 hours ago</small></div><i>New</i></div><div className="lead-item"><span className="lead-avatar green">TB</span><div><strong>Travis Bell</strong><p>26-C Brake Control Valve</p><small><Clock3 size={12} /> Yesterday</small></div><i>New</i></div><button className="button button-outline button-full" type="button"><Mail size={15} /> Open inquiry inbox</button></section>
          </div>

          <section className="panel inventory-panel" id="inventory">
            <div className="panel-head inventory-head"><div><strong>Your listings</strong><span>Manage status, visibility, and buyer activity.</span></div><div><label className="table-search"><Search size={15} /><input placeholder="Search inventory" /></label><button className="button button-dark button-small" type="button" onClick={() => setShowCreate(true)}><PackagePlus size={15} /> New listing</button></div></div>
            <div className="listing-table"><div className="table-row table-labels"><span>Listing</span><span>Status</span><span>Views</span><span>Inquiries</span><span>Actions</span></div>{listings.map((listing) => <div className={listing.status === "Deleted" ? "table-row deleted" : "table-row"} key={listing.id}><div className="table-product"><img src={listing.image} alt="" /><span><strong>{listing.title}</strong><small>Part #{listing.part}</small>{listing.featured && <em><Sparkles size={11} /> Featured</em>}</span></div><span><b className={`status ${listing.status.toLowerCase()}`}>{listing.status}</b></span><span className="metric-cell"><strong>{listing.views}</strong><small>total</small></span><span className="metric-cell"><strong>{listing.inquiries}</strong><small>leads</small></span><div className="row-actions">{listing.status === "Deleted" ? <button type="button" onClick={() => setStatus(listing.id, "Active")}><Check size={15} /> Restore</button> : <><button type="button" title={listing.status === "Active" ? "Pause listing" : "Activate listing"} onClick={() => setStatus(listing.id, listing.status === "Active" ? "Paused" : "Active")}>{listing.status === "Active" ? <Pause size={16} /> : <Check size={16} />}</button><button type="button" title="Edit listing"><Pencil size={16} /></button><button type="button" title="Delete listing" onClick={() => setStatus(listing.id, "Deleted")}><Trash2 size={16} /></button><button type="button" title="More options"><MoreHorizontal size={17} /></button></>}</div></div>)}</div>
          </section>
        </div>
      </div>

      {notice && <div className="toast"><Check size={17} /> {notice}</div>}
      {showCreate && <div className="modal-backdrop" onMouseDown={() => setShowCreate(false)}><section className="create-modal" role="dialog" aria-modal="true" aria-labelledby="create-title" onMouseDown={(event) => event.stopPropagation()}><button className="modal-close" type="button" onClick={() => setShowCreate(false)}><X /></button><div className="create-head"><span><PackagePlus size={24} /></span><div><h2 id="create-title">Create a new listing</h2><p>Add the essentials now. You can refine the listing later.</p></div></div><form onSubmit={addListing}><label>Listing title<input name="title" required placeholder="e.g. EMD 645 Oil Pump" /></label><div className="form-row"><label>Part number<input name="part" required placeholder="Manufacturer part #" /></label><label>Condition<select required defaultValue=""><option value="" disabled>Select</option><option>New</option><option>New surplus</option><option>Remanufactured</option><option>Rebuildable core</option></select></label></div><div className="form-row"><label>Category<select><option>Engines</option><option>Engine Components</option><option>Traction Motors</option><option>Turbochargers</option><option>Air & Brake</option></select></label><label>Quantity<input type="number" min="1" defaultValue="1" /></label></div><label>Description<textarea required placeholder="Condition, test documentation, lead time, and exchange terms..." /></label><div className="create-actions"><button className="button button-outline" type="button" onClick={() => setShowCreate(false)}>Save draft</button><button className="button button-orange" type="submit">Publish listing <ArrowRightIcon /></button></div></form></section></div>}
    </main>
  );
}

function ArrowRightIcon() {
  return <span aria-hidden="true">→</span>;
}
