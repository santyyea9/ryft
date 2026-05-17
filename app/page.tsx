"use client";
import { useState, useEffect, useRef } from "react";

// ─── Sample Data ────────────────────────────────────────────────────────────

const CAMPS = [
  {
    id: 1,
    name: "Surf House Ericeira",
    activity: "Surfing",
    country: "Portugal",
    location: "Ericeira, Portugal",
    price_min: 800,
    price_max: 1400,
    price_label: "$800–$1,400 / week",
    skill_level: "All levels",
    duration: "7 days",
    rating: 4.9,
    reviews: 214,
    age_group: "Adults",
    vibe: ["Solo travelers", "Social"],
    tags: ["Beginner friendly", "Eco-lodge"],
    best_season: "Apr–Oct",
    description: "World-class waves, Michelin-starred food scene, and a surf house that feels like a boutique hotel. Ericeira is the only World Surfing Reserve in Europe.",
    activities: ["Daily surf lessons", "Video analysis", "Yoga at sunrise", "Wine tours"],
    image: "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800&q=80",
    featured: true,
    sponsored: false,
  },
  {
    id: 2,
    name: "Alps Powder Academy",
    activity: "Skiing",
    country: "France",
    location: "Chamonix, France",
    price_min: 2200,
    price_max: 3800,
    price_label: "$2,200–$3,800 / week",
    skill_level: "Intermediate–Expert",
    duration: "7 days",
    rating: 4.8,
    reviews: 98,
    age_group: "Adults",
    vibe: ["Luxury", "Adventurous"],
    tags: ["Luxury", "Extreme", "Small groups"],
    best_season: "Dec–Mar",
    description: "Heli-skiing, off-piste mastery, and five-star chalets in the shadow of Mont Blanc. Limited to 6 guests per cohort.",
    activities: ["Heli-ski drops", "Off-piste guiding", "Avalanche safety", "Après-ski"],
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80",
    featured: true,
    sponsored: true,
  },
  {
    id: 3,
    name: "Costa Rica Kite Camp",
    activity: "Kiteboarding",
    country: "Costa Rica",
    location: "Guanacaste, Costa Rica",
    price_min: 1100,
    price_max: 1900,
    price_label: "$1,100–$1,900 / week",
    skill_level: "Beginner–Intermediate",
    duration: "7–14 days",
    rating: 4.7,
    reviews: 137,
    age_group: "Adults",
    vibe: ["Adventure", "Social"],
    tags: ["Beginner friendly", "Solo travelers"],
    best_season: "Dec–Apr",
    description: "Flat-water lagoons, consistent 20-knot winds, and jungle cabins steps from the beach. Best kite school in Central America.",
    activities: ["IKO certified instruction", "Equipment rental", "Waterstart coaching", "Jungle ATV"],
    image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&q=80",
    featured: false,
    sponsored: false,
  },
  {
    id: 4,
    name: "Andalucía Equestrian Retreat",
    activity: "Horseback Riding",
    country: "Spain",
    location: "Ronda, Spain",
    price_min: 1500,
    price_max: 2600,
    price_label: "$1,500–$2,600 / week",
    skill_level: "All levels",
    duration: "5–10 days",
    rating: 4.9,
    reviews: 61,
    age_group: "All ages",
    vibe: ["Luxury", "Family friendly"],
    tags: ["Luxury", "Family friendly", "Beginner friendly"],
    best_season: "Mar–Jun, Sep–Nov",
    description: "Ride Andalusian stallions through whitewashed villages and dramatic gorges. A UNESCO cultural experience on horseback.",
    activities: ["Dressage lessons", "Trail rides", "Flamenco evening", "Tapas cooking class"],
    image: "https://images.unsplash.com/photo-1553284965-83fd3e82fa5a?w=800&q=80",
    featured: false,
    sponsored: false,
  },
  {
    id: 5,
    name: "Bali MMA & Wellness Camp",
    activity: "Martial Arts",
    country: "Indonesia",
    location: "Canggu, Bali",
    price_min: 600,
    price_max: 1100,
    price_label: "$600–$1,100 / week",
    skill_level: "All levels",
    duration: "7–30 days",
    rating: 4.8,
    reviews: 302,
    age_group: "Adults",
    vibe: ["Solo travelers", "Transformative"],
    tags: ["Beginner friendly", "Solo travelers", "Wellness"],
    best_season: "May–Sep",
    description: "Morning Muay Thai, afternoon yoga, cold plunges, and farm-to-table meals. The ultimate reset for mind and body in the heart of Canggu.",
    activities: ["Muay Thai twice daily", "BJJ fundamentals", "Breathwork", "Rice terrace hikes"],
    image: "https://images.unsplash.com/photo-1555597673-b21d5c935865?w=800&q=80",
    featured: true,
    sponsored: false,
  },
  {
    id: 6,
    name: "Maldives Dive Liveaboard",
    activity: "Scuba Diving",
    country: "Maldives",
    location: "North Malé Atoll",
    price_min: 2800,
    price_max: 4200,
    price_label: "$2,800–$4,200 / week",
    skill_level: "Open Water+",
    duration: "7 days",
    rating: 5.0,
    reviews: 44,
    age_group: "Adults",
    vibe: ["Luxury", "Adventure"],
    tags: ["Luxury", "Extreme", "Small groups"],
    best_season: "Nov–Apr",
    description: "Live aboard a 38m yacht and dive manta ray cleaning stations, shark corridors, and pristine reef walls. 4 dives per day.",
    activities: ["4 dives daily", "Night dives", "Whale shark snorkeling", "Marine biology talks"],
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
    featured: false,
    sponsored: true,
  },
  {
    id: 7,
    name: "Patagonia Climbing Expedition",
    activity: "Rock Climbing",
    country: "Chile",
    location: "Torres del Paine, Chile",
    price_min: 3200,
    price_max: 5500,
    price_label: "$3,200–$5,500 / 10 days",
    skill_level: "Intermediate–Expert",
    duration: "10 days",
    rating: 4.9,
    reviews: 29,
    age_group: "Adults",
    vibe: ["Extreme", "Adventure"],
    tags: ["Extreme", "Small groups", "Remote"],
    best_season: "Nov–Mar",
    description: "Guided multi-pitch climbing on granite towers with IFMGA-certified mountain guides. Basecamp in a luxury geodesic dome.",
    activities: ["Multi-pitch climbing", "Rappelling", "Glacier trekking", "Wildlife spotting"],
    image: "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=800&q=80",
    featured: false,
    sponsored: false,
  },
  {
    id: 8,
    name: "Mediterranean Sailing School",
    activity: "Sailing",
    country: "Greece",
    location: "Cyclades, Greece",
    price_min: 1800,
    price_max: 3200,
    price_label: "$1,800–$3,200 / week",
    skill_level: "Beginner–Advanced",
    duration: "7 days",
    rating: 4.7,
    reviews: 88,
    age_group: "Adults",
    vibe: ["Social", "Adventure"],
    tags: ["Beginner friendly", "Solo travelers"],
    best_season: "May–Oct",
    description: "Learn to skipper a 40ft yacht island-hopping through the Cyclades. RYA Day Skipper certification available. Feta not included.",
    activities: ["Sail training", "Island hopping", "Snorkeling", "Harbor dining"],
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    featured: false,
    sponsored: false,
  },
  {
    id: 9,
    name: "Morocco Tennis Academy",
    activity: "Tennis",
    country: "Morocco",
    location: "Marrakech, Morocco",
    price_min: 950,
    price_max: 1700,
    price_label: "$950–$1,700 / week",
    skill_level: "All levels",
    duration: "7 days",
    rating: 4.6,
    reviews: 73,
    age_group: "Adults",
    vibe: ["Luxury", "Family friendly"],
    tags: ["Luxury", "Family friendly"],
    best_season: "Oct–Apr",
    description: "Clay courts inside a 5-star riad, with former ATP coaches and a souk shopping excursion mid-week. The classiest tennis camp on earth.",
    activities: ["4hrs coaching daily", "Video analysis", "Fitness sessions", "Souk tour"],
    image: "https://images.unsplash.com/photo-1544298103-c9e4b4fd3f2b?w=800&q=80",
    featured: false,
    sponsored: false,
  },
];

const ACTIVITIES = ["All", "Surfing", "Skiing", "Kiteboarding", "Horseback Riding", "Martial Arts", "Scuba Diving", "Rock Climbing", "Sailing", "Tennis"];
const SKILL_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced", "Expert"];
const VIBES = ["All", "Solo travelers", "Family friendly", "Luxury", "Adventure", "Extreme", "Social"];
const PRICE_RANGES = [
  { label: "Any budget", min: 0, max: Infinity },
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000–$2,000", min: 1000, max: 2000 },
  { label: "$2,000–$4,000", min: 2000, max: 4000 },
  { label: "$4,000+", min: 4000, max: Infinity },
];

// ─── Utility ────────────────────────────────────────────────────────────────

const StarRating = ({ rating }) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <span style={{ color: "#F59E0B", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(full)}{half ? "½" : ""}{"☆".repeat(5 - full - (half ? 1 : 0))}
    </span>
  );
};

const Tag = ({ label, color = "#E8F5E9", textColor = "#2E7D32" }) => (
  <span style={{
    background: color, color: textColor,
    borderRadius: 999, padding: "3px 10px",
    fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    whiteSpace: "nowrap",
  }}>{label}</span>
);

// ─── Admin Dashboard ─────────────────────────────────────────────────────────

const AdminDashboard = ({ camps, onBack, onSave, onDelete }) => {
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({});
  const [view, setView] = useState("list"); // list | edit | add

  const startEdit = (camp) => {
    setEditing(camp.id);
    setForm({ ...camp });
    setView("edit");
  };

  const startAdd = () => {
    setEditing(null);
    setForm({
      name: "", activity: "Surfing", country: "", location: "",
      price_min: "", price_max: "", skill_level: "All levels",
      duration: "", rating: 4.5, reviews: 0, age_group: "Adults",
      vibe: [], tags: [], best_season: "", description: "",
      activities: [], image: "", featured: false, sponsored: false,
    });
    setView("add");
  };

  const handleSave = () => {
    const camp = {
      ...form,
      id: editing || Date.now(),
      price_label: `$${form.price_min}–$${form.price_max} / week`,
      vibe: typeof form.vibe === "string" ? form.vibe.split(",").map(s => s.trim()) : form.vibe,
      tags: typeof form.tags === "string" ? form.tags.split(",").map(s => s.trim()) : form.tags,
      activities: typeof form.activities === "string" ? form.activities.split(",").map(s => s.trim()) : form.activities,
    };
    onSave(camp);
    setView("list");
  };

  const field = (label, key, type = "text", opts = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
      {type === "textarea" ? (
        <textarea value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          rows={3} style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
      ) : type === "checkbox" ? (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input type="checkbox" checked={!!form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))} />
          <span style={{ fontSize: 14 }}>{opts.checkLabel || label}</span>
        </label>
      ) : type === "select" ? (
        <select value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}>
          {opts.options?.map(o => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={form[key] || ""} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }} />
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Admin Header */}
      <div style={{ background: "#111827", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #374151", color: "#9CA3AF", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>← Back to site</button>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>⛺ ryft <span style={{ color: "#10B981", fontSize: 12, fontWeight: 600 }}>Admin</span></span>
        </div>
        {view === "list" && (
          <button onClick={startAdd} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>+ Add Listing</button>
        )}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        {view === "list" ? (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>All Listings</h2>
            <p style={{ color: "#6B7280", marginBottom: 28 }}>{camps.length} camps in database</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {camps.map(c => (
                <div key={c.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <img src={c.image} alt={c.name} style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{c.name}</span>
                      {c.sponsored && <Tag label="Sponsored" color="#FEF3C7" textColor="#92400E" />}
                      {c.featured && <Tag label="Featured" color="#EDE9FE" textColor="#5B21B6" />}
                    </div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>{c.activity} · {c.location} · {c.price_label}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => startEdit(c)} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Edit</button>
                    <button onClick={() => onDelete(c.id)} style={{ background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E5E7EB", padding: 32 }}>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 28 }}>{view === "add" ? "Add New Listing" : `Editing: ${form.name}`}</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <div>{field("Camp Name", "name")}</div>
              <div>{field("Activity", "activity", "select", { options: ACTIVITIES.filter(a => a !== "All") })}</div>
              <div>{field("Country", "country")}</div>
              <div>{field("Full Location", "location")}</div>
              <div>{field("Min Price ($)", "price_min", "number")}</div>
              <div>{field("Max Price ($)", "price_max", "number")}</div>
              <div>{field("Skill Level", "skill_level", "select", { options: ["All levels", "Beginner", "Intermediate", "Advanced", "Expert", "Beginner–Intermediate", "Intermediate–Expert", "Open Water+"] })}</div>
              <div>{field("Duration", "duration")}</div>
              <div>{field("Age Group", "age_group")}</div>
              <div>{field("Best Season", "best_season")}</div>
              <div>{field("Rating", "rating", "number")}</div>
              <div>{field("Reviews Count", "reviews", "number")}</div>
            </div>
            {field("Image URL", "image")}
            {form.image && <img src={form.image} alt="preview" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 10, marginBottom: 16 }} />}
            {field("Description", "description", "textarea")}
            {field("Activities included (comma separated)", "activities", "textarea")}
            {field("Tags (comma separated)", "tags")}
            {field("Vibe (comma separated)", "vibe")}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 24px" }}>
              <div>{field("Featured", "featured", "checkbox", { checkLabel: "Show as featured on homepage" })}</div>
              <div>{field("Sponsored", "sponsored", "checkbox", { checkLabel: "Mark as sponsored listing" })}</div>
            </div>
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button onClick={handleSave} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>Save Listing</button>
              <button onClick={() => setView("list")} style={{ background: "#F3F4F6", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Camp Detail Page ────────────────────────────────────────────────────────

const CampDetail = ({ camp, onBack, saved, onToggleSave }) => {
  const [activeImg, setActiveImg] = useState(0);
  const images = [camp.image, camp.image + "&sat=-20", camp.image + "&blur=0"];

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", backdropFilter: "blur(12px)", borderBottom: "1px solid #E5E7EB", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={onBack} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", cursor: "pointer", color: "#374151", fontWeight: 600, fontSize: 14 }}>
            ← Back to results
          </button>
          <span style={{ fontWeight: 900, fontSize: 20, color: "#111827", letterSpacing: -0.5 }}>⛺ ryft</span>
          <button onClick={() => onToggleSave(camp.id)} style={{
            display: "flex", alignItems: "center", gap: 6,
            background: saved ? "#ECFDF5" : "#F9FAFB", color: saved ? "#059669" : "#374151",
            border: `1.5px solid ${saved ? "#6EE7B7" : "#E5E7EB"}`,
            borderRadius: 999, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13,
          }}>
            {saved ? "♥ Saved" : "♡ Save"}
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          {camp.sponsored && <Tag label="✦ Sponsored" color="#FEF3C7" textColor="#92400E" />}
          <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, color: "#111827", margin: "12px 0 8px", letterSpacing: -1 }}>{camp.name}</h1>
          <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", color: "#6B7280", fontSize: 14 }}>
            <span><StarRating rating={camp.rating} /> <strong style={{ color: "#111" }}>{camp.rating}</strong> ({camp.reviews} reviews)</span>
            <span>📍 {camp.location}</span>
            <span>🏄 {camp.activity}</span>
            <span>📅 Best: {camp.best_season}</span>
          </div>
        </div>

        {/* Image Gallery */}
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 8, borderRadius: 20, overflow: "hidden", marginBottom: 40, height: 420 }}>
          <img src={camp.image} alt={camp.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ display: "grid", gridTemplateRows: "1fr 1fr", gap: 8 }}>
            <img src={camp.image} alt={camp.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.85)" }} />
            <div style={{ position: "relative" }}>
              <img src={camp.image} alt={camp.name} style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(0.7)" }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 14, background: "rgba(0,0,0,0.4)", borderRadius: 8, padding: "8px 16px" }}>View all photos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content + Booking Sidebar */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 48, alignItems: "start" }}>
          <div>
            {/* Tags */}
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
              {camp.tags.map(t => <Tag key={t} label={t} />)}
              {camp.vibe.map(v => <Tag key={v} label={v} color="#EFF6FF" textColor="#1D4ED8" />)}
            </div>

            {/* Description */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About this experience</h2>
              <p style={{ color: "#374151", lineHeight: 1.75, fontSize: 15 }}>{camp.description}</p>
            </div>

            {/* Activities */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>What's included</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {camp.activities.map(a => (
                  <div key={a} style={{ display: "flex", alignItems: "center", gap: 10, background: "#F0FDF4", borderRadius: 10, padding: "12px 14px" }}>
                    <span style={{ fontSize: 18 }}>✓</span>
                    <span style={{ fontSize: 14, fontWeight: 600, color: "#166534" }}>{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div style={{ marginBottom: 32 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Camp details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  ["🧗 Skill Level", camp.skill_level],
                  ["⏱ Duration", camp.duration],
                  ["👥 Age Group", camp.age_group],
                  ["🌞 Best Season", camp.best_season],
                  ["📍 Location", camp.location],
                  ["🏄 Activity", camp.activity],
                ].map(([label, value]) => (
                  <div key={label} style={{ background: "#F9FAFB", borderRadius: 10, padding: "14px 16px", border: "1px solid #E5E7EB" }}>
                    <div style={{ fontSize: 12, color: "#9CA3AF", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>{label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>{value}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div style={{ position: "sticky", top: 80 }}>
            <div style={{ background: "#fff", borderRadius: 20, border: "1.5px solid #E5E7EB", padding: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 4 }}>{camp.price_label}</div>
              <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>per person, all-inclusive</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                <div style={{ border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Dates</div>
                  <div style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>Select arrival date →</div>
                </div>
                <div style={{ border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "14px 16px" }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5 }}>Guests</div>
                  <div style={{ fontSize: 14, color: "#374151", marginTop: 4 }}>1 guest</div>
                </div>
              </div>

              <a href="#" style={{
                display: "block", textAlign: "center",
                background: "linear-gradient(135deg, #059669, #10B981)",
                color: "#fff", borderRadius: 12, padding: "16px",
                fontWeight: 800, fontSize: 16, textDecoration: "none",
                boxShadow: "0 4px 20px rgba(16,185,129,0.35)",
              }}>
                🌐 Visit Official Website
              </a>

              <button style={{ width: "100%", marginTop: 12, background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "14px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
                ✉ Send Enquiry
              </button>

              <div style={{ marginTop: 20, padding: "14px 0", borderTop: "1px solid #F3F4F6", display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280" }}>
                  <span>📊 Booking enquiries tracked</span>
                  <span style={{ color: "#10B981", fontWeight: 700 }}>Live</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, color: "#6B7280" }}>
                  <span>🏷 Claim this listing</span>
                  <span style={{ color: "#6366F1", fontWeight: 700, cursor: "pointer" }}>→</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── Camp Card ───────────────────────────────────────────────────────────────

const CampCard = ({ camp, onClick, saved, onToggleSave }) => (
  <div onClick={onClick} style={{
    background: "#fff", borderRadius: 16, overflow: "hidden",
    border: "1px solid #E5E7EB", cursor: "pointer",
    transition: "transform 0.2s, box-shadow 0.2s",
    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
  }}
    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)"; }}
    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)"; }}
  >
    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
      <img src={camp.image} alt={camp.name} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
        onMouseEnter={e => e.target.style.transform = "scale(1.05)"}
        onMouseLeave={e => e.target.style.transform = ""} />
      {camp.sponsored && (
        <div style={{ position: "absolute", top: 12, left: 12, background: "#F59E0B", color: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>✦ Sponsored</div>
      )}
      {camp.featured && !camp.sponsored && (
        <div style={{ position: "absolute", top: 12, left: 12, background: "#6366F1", color: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>★ Featured</div>
      )}
      <button onClick={e => { e.stopPropagation(); onToggleSave(camp.id); }} style={{
        position: "absolute", top: 10, right: 10,
        background: saved ? "#ECFDF5" : "rgba(255,255,255,0.9)",
        border: "none", borderRadius: 999, width: 34, height: 34,
        cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}>
        {saved ? "♥" : "♡"}
      </button>
    </div>
    <div style={{ padding: "16px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: 0.5 }}>{camp.activity}</span>
        <div style={{ textAlign: "right" }}>
          <StarRating rating={camp.rating} />
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{camp.reviews}</div>
        </div>
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "4px 0 4px", lineHeight: 1.3 }}>{camp.name}</h3>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>📍 {camp.location}</div>
      <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {camp.description}
      </p>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <Tag label={camp.skill_level} color="#F0F9FF" textColor="#0369A1" />
        <Tag label={camp.duration} color="#FDF4FF" textColor="#7E22CE" />
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
        <div>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#111827" }}>from ${camp.price_min.toLocaleString()}</span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}> /wk</span>
        </div>
        <span style={{ fontSize: 12, color: "#6B7280" }}>{camp.age_group}</span>
      </div>
    </div>
  </div>
);

// ─── Listings Page ───────────────────────────────────────────────────────────

const ListingsPage = ({ initialSearch, onSelectCamp, saved, onToggleSave }) => {
  const [query, setQuery] = useState(initialSearch.query || "");
  const [activity, setActivity] = useState(initialSearch.activity || "All");
  const [skillLevel, setSkillLevel] = useState("All levels");
  const [vibe, setVibe] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [sort, setSort] = useState("featured");

  const filtered = CAMPS.filter(c => {
    const pr = PRICE_RANGES[priceRange];
    if (query && !c.name.toLowerCase().includes(query.toLowerCase()) &&
        !c.activity.toLowerCase().includes(query.toLowerCase()) &&
        !c.country.toLowerCase().includes(query.toLowerCase()) &&
        !c.description.toLowerCase().includes(query.toLowerCase())) return false;
    if (activity !== "All" && c.activity !== activity) return false;
    if (skillLevel !== "All levels" && !c.skill_level.includes(skillLevel)) return false;
    if (vibe !== "All" && !c.vibe.includes(vibe) && !c.tags.includes(vibe)) return false;
    if (c.price_min > pr.max || c.price_max < pr.min) return false;
    return true;
  }).sort((a, b) => {
    if (sort === "featured") return (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || (b.sponsored ? 1 : 0) - (a.sponsored ? 1 : 0);
    if (sort === "price_asc") return a.price_min - b.price_min;
    if (sort === "price_desc") return b.price_min - a.price_min;
    if (sort === "rating") return b.rating - a.rating;
    return 0;
  });

  const selectStyle = { padding: "9px 14px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "#fff", cursor: "pointer", fontFamily: "inherit" };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'DM Sans', sans-serif" }}>
      {/* Top bar */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 40, padding: "12px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 900, fontSize: 20, marginRight: 12, whiteSpace: "nowrap" }}>⛺ ryft</span>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search camps..."
            style={{ flex: 1, minWidth: 160, padding: "9px 14px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, fontFamily: "inherit" }} />
          <select value={activity} onChange={e => setActivity(e.target.value)} style={selectStyle}>
            {ACTIVITIES.map(a => <option key={a}>{a}</option>)}
          </select>
          <select value={skillLevel} onChange={e => setSkillLevel(e.target.value)} style={selectStyle}>
            {SKILL_LEVELS.map(s => <option key={s}>{s}</option>)}
          </select>
          <select value={vibe} onChange={e => setVibe(e.target.value)} style={selectStyle}>
            {VIBES.map(v => <option key={v}>{v}</option>)}
          </select>
          <select value={priceRange} onChange={e => setPriceRange(Number(e.target.value))} style={selectStyle}>
            {PRICE_RANGES.map((p, i) => <option key={i} value={i}>{p.label}</option>)}
          </select>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...selectStyle, color: "#6B7280" }}>
            <option value="featured">Sort: Featured</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>{filtered.length} experiences found</h2>
          <span style={{ fontSize: 13, color: "#9CA3AF" }}>Prices in USD per person</span>
        </div>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🏕</div>
            <div style={{ fontSize: 18, fontWeight: 700 }}>No camps found</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map(c => (
              <CampCard key={c.id} camp={c} onClick={() => onSelectCamp(c)} saved={saved.has(c.id)} onToggleSave={onToggleSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Homepage ────────────────────────────────────────────────────────────────

const Homepage = ({ onSearch, onSelectCamp, onAdmin, saved, onToggleSave }) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("All");
  const heroRef = useRef(null);

  const featured = CAMPS.filter(c => c.featured);
  const sponsored = CAMPS.filter(c => c.sponsored);

  const handleSearch = () => onSearch({ query, location, activity });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF9" }}>
      {/* Nav */}
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>⛺ ryft</span>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onAdmin} style={{ background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Admin ⚙️</button>
          <button onClick={handleSearch} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>Explore All →</button>
        </div>
      </nav>

      {/* Hero */}
      <div ref={heroRef} style={{
        minHeight: "92vh", position: "relative",
        background: "linear-gradient(160deg, #064E3B 0%, #065F46 30%, #047857 60%, #0F766E 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "100px 24px 60px",
        overflow: "hidden",
      }}>
        {/* Background texture */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.04) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.06) 0%, transparent 50%)", pointerEvents: "none" }} />

        <div style={{ position: "relative", textAlign: "center", maxWidth: 760, zIndex: 2 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", backdropFilter: "blur(8px)", borderRadius: 999, padding: "6px 18px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.2)" }}>
            <span style={{ color: "#A7F3D0", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>🌍 500+ camps across 60 countries</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: -2, marginBottom: 20 }}>
            Find your next<br />
            <span style={{ color: "#6EE7B7" }}>adventure camp.</span>
          </h1>

          <p style={{ color: "#A7F3D0", fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.6, marginBottom: 40, opacity: 0.9 }}>
            Surf, ski, sail, climb, ride, dive — discover world-class sports camps and skill experiences designed for adults who want to live more fully.
          </p>

          {/* Search Box */}
          <div style={{ background: "#fff", borderRadius: 20, padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 2, minWidth: 180 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Activity</div>
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Surfing, skiing, sailing..."
                style={{ width: "100%", border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#111", fontFamily: "inherit" }} />
            </div>
            <div style={{ width: 1, height: 40, background: "#E5E7EB" }} />
            <div style={{ flex: 2, minWidth: 160, padding: "0 8px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Destination</div>
              <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Portugal, Bali, anywhere..."
                style={{ width: "100%", border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#111", fontFamily: "inherit" }} />
            </div>
            <div style={{ width: 1, height: 40, background: "#E5E7EB" }} />
            <div style={{ flex: 1, minWidth: 130, padding: "0 8px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>Activity type</div>
              <select value={activity} onChange={e => setActivity(e.target.value)} style={{ border: "none", outline: "none", fontSize: 14, fontWeight: 600, color: "#111", fontFamily: "inherit", background: "none", cursor: "pointer" }}>
                {ACTIVITIES.map(a => <option key={a}>{a}</option>)}
              </select>
            </div>
            <button onClick={handleSearch} style={{
              background: "linear-gradient(135deg, #059669, #10B981)", color: "#fff",
              border: "none", borderRadius: 14, padding: "16px 28px",
              fontWeight: 800, fontSize: 16, cursor: "pointer",
              boxShadow: "0 4px 20px rgba(16,185,129,0.4)",
              whiteSpace: "nowrap",
            }}>
              Search →
            </button>
          </div>

          {/* Quick activity pills */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginTop: 20 }}>
            {["🏄 Surfing", "⛷ Skiing", "🤿 Diving", "🧗 Climbing", "🪂 Kiteboarding", "⛵ Sailing"].map(a => (
              <button key={a} onClick={() => { setQuery(a.split(" ")[1]); onSearch({ query: a.split(" ")[1], location: "", activity: "All" }); }}
                style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(8px)", border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", borderRadius: 999, padding: "7px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                {a}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position: "absolute", bottom: 32, color: "rgba(255,255,255,0.5)", fontSize: 13, textAlign: "center", animation: "bounce 2s infinite" }}>
          <div>↓</div>
          <div>scroll to explore</div>
        </div>
      </div>

      {/* Sponsored Banner */}
      {sponsored.length > 0 && (
        <div style={{ background: "linear-gradient(90deg, #FFFBEB, #FEF3C7)", borderTop: "1px solid #FDE68A", borderBottom: "1px solid #FDE68A", padding: "8px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>✦ Sponsored</span>
            <span style={{ fontSize: 13, color: "#78350F" }}>Premium camps featured by partners — {sponsored.map(s => s.name).join(", ")}</span>
          </div>
        </div>
      )}

      {/* Featured Camps */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#10B981", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>★ Handpicked experiences</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#111827", letterSpacing: -1 }}>Featured camps</h2>
          </div>
          <button onClick={handleSearch} style={{ background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>View all →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
          {featured.map(c => <CampCard key={c.id} camp={c} onClick={() => onSelectCamp(c)} saved={saved.has(c.id)} onToggleSave={onToggleSave} />)}
        </div>
      </div>

      {/* Activity Categories */}
      <div style={{ background: "#111827", padding: "60px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#fff", letterSpacing: -1, marginBottom: 8 }}>Browse by activity</h2>
          <p style={{ color: "#6B7280", marginBottom: 36 }}>Every discipline. Every level. Every corner of the planet.</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
            {[
              { icon: "🏄", name: "Surfing", count: 89 },
              { icon: "⛷", name: "Skiing", count: 47 },
              { icon: "🪂", name: "Kiteboarding", count: 34 },
              { icon: "🐴", name: "Horseback Riding", count: 28 },
              { icon: "🥋", name: "Martial Arts", count: 52 },
              { icon: "🤿", name: "Scuba Diving", count: 63 },
              { icon: "🧗", name: "Rock Climbing", count: 41 },
              { icon: "⛵", name: "Sailing", count: 37 },
              { icon: "🎾", name: "Tennis", count: 29 },
              { icon: "🏍", name: "Racing Schools", count: 15 },
              { icon: "🧘", name: "Wellness Retreats", count: 78 },
              { icon: "🪁", name: "More →", count: 200 },
            ].map(({ icon, name, count }) => (
              <button key={name} onClick={() => onSearch({ query: name === "More →" ? "" : name, location: "", activity: "All" })}
                style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 14, padding: "20px 16px", cursor: "pointer", textAlign: "left",
                  transition: "all 0.2s",
                }}
                onMouseEnter={e => { e.currentTarget.style.background = "rgba(16,185,129,0.15)"; e.currentTarget.style.borderColor = "#10B981"; }}
                onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; }}
              >
                <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
                <div style={{ color: "#fff", fontWeight: 700, fontSize: 14 }}>{name}</div>
                <div style={{ color: "#6B7280", fontSize: 12, marginTop: 2 }}>{count} camps</div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Monetization CTA — Claim Listing */}
      <div style={{ background: "#ECFDF5", padding: "60px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>🏕</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 12 }}>Own a sports camp or retreat?</h2>
          <p style={{ color: "#6B7280", marginBottom: 28, lineHeight: 1.6 }}>List your camp on ryft and reach thousands of adventure seekers every month. Claim your listing or add a new one — free to start.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 12, padding: "14px 32px", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>Claim your listing</button>
            <button style={{ background: "#fff", color: "#374151", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: "14px 32px", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>Learn about featured spots</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: "#111827", padding: "40px 24px", color: "#6B7280", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>⛺ ryft</div>
        <p style={{ fontSize: 13 }}>Discover sports camps and adventure experiences worldwide · MVP v0.1</p>
      </footer>
    </div>
  );
};

// ─── Root App ────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home"); // home | listings | detail | admin
  const [selectedCamp, setSelectedCamp] = useState(null);
  const [searchParams, setSearchParams] = useState({});
  const [saved, setSaved] = useState(new Set());
  const [camps, setCamps] = useState(CAMPS);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  const toggleSave = (id) => setSaved(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });

  const handleSearch = (params) => { setSearchParams(params); setPage("listings"); };
  const handleSelectCamp = (camp) => { setSelectedCamp(camp); setPage("detail"); };

  const handleSaveCamp = (camp) => {
    setCamps(prev => {
      const idx = prev.findIndex(c => c.id === camp.id);
      if (idx >= 0) { const next = [...prev]; next[idx] = camp; return next; }
      return [...prev, camp];
    });
  };

  const handleDeleteCamp = (id) => {
    if (window.confirm("Delete this listing?")) setCamps(prev => prev.filter(c => c.id !== id));
  };

  if (page === "admin") return <AdminDashboard camps={camps} onBack={() => setPage("home")} onSave={handleSaveCamp} onDelete={handleDeleteCamp} />;
  if (page === "detail") return <CampDetail camp={selectedCamp} onBack={() => setPage("listings")} saved={saved.has(selectedCamp?.id)} onToggleSave={toggleSave} />;
  if (page === "listings") return <ListingsPage initialSearch={searchParams} onSelectCamp={handleSelectCamp} saved={saved} onToggleSave={toggleSave} />;
  return <Homepage onSearch={handleSearch} onSelectCamp={handleSelectCamp} onAdmin={() => setPage("admin")} saved={saved} onToggleSave={toggleSave} />;
}