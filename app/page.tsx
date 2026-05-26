"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

type Camp = {
  id?: string | number;
  name: string;
  activity: string;
  country: string;
  location: string;
  price_min: number;
  price_max: number;
  price_label?: string;
  skill_level: string;
  duration: string;
  rating: number;
  reviews: number;
  age_group: string;
  vibe: string[];
  tags: string[];
  best_season: string;
  description: string;
  activities: string[];
  image: string;
  featured: boolean;
  sponsored: boolean;
};

const ACTIVITIES = ["All", "test123", "Skiing", "Kiteboarding", "Horseback Riding", "Martial Arts", "Scuba Diving", "Rock Climbing", "Sailing", "Tennis"];
const SKILL_LEVELS = ["All levels", "Beginner", "Intermediate", "Advanced", "Expert"];
const VIBES = ["All", "Solo travelers", "Family friendly", "Luxury", "Adventure", "Extreme", "Social"];
const PRICE_RANGES = [
  { label: "Any budget", min: 0, max: Infinity },
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000-$2,000", min: 1000, max: 2000 },
  { label: "$2,000-$4,000", min: 2000, max: 4000 },
  { label: "$4,000+", min: 4000, max: Infinity },
];

const emptyCamp: Camp = {
  name: "",
  activity: "Surfing",
  country: "",
  location: "",
  price_min: 0,
  price_max: 0,
  price_label: "",
  skill_level: "All levels",
  duration: "",
  rating: 4.5,
  reviews: 0,
  age_group: "Adults",
  vibe: [],
  tags: [],
  best_season: "",
  description: "",
  activities: [],
  image: "",
  featured: false,
  sponsored: false,
};

const listFromInput = (value: string[] | string | undefined) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  return value.split(",").map((item) => item.trim()).filter(Boolean);
};

const formatPrice = (camp: Pick<Camp, "price_min" | "price_max" | "price_label">) => {
  if (camp.price_label) return camp.price_label;
  if (!camp.price_min && !camp.price_max) return "Price on request";
  return `$${Number(camp.price_min).toLocaleString()}-$${Number(camp.price_max).toLocaleString()} / week`;
};

const StarRating = ({ rating }: { rating: number }) => {
  const full = Math.floor(Number(rating) || 0);
  const half = rating % 1 >= 0.5;

  return (
    <span style={{ color: "#F59E0B", fontSize: 13, letterSpacing: 1 }}>
      {"★".repeat(full)}
      {half ? "½" : ""}
      {"☆".repeat(Math.max(0, 5 - full - (half ? 1 : 0)))}
    </span>
  );
};

const Tag = ({
  label,
  color = "#E8F5E9",
  textColor = "#2E7D32",
}: {
  label: string;
  color?: string;
  textColor?: string;
}) => (
  <span
    style={{
      background: color,
      color: textColor,
      borderRadius: 999,
      padding: "3px 10px",
      fontSize: 11,
      fontWeight: 700,
      letterSpacing: 0.5,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

const AdminDashboard = ({
  camps,
  onBack,
  onSave,
  onDelete,
}: {
  camps: Camp[];
  onBack: () => void;
  onSave: (camp: Camp) => Promise<void>;
  onDelete: (id: Camp["id"]) => Promise<void>;
}) => {
  const [editing, setEditing] = useState<Camp["id"] | null>(null);
  const [form, setForm] = useState<any>(emptyCamp);
  const [view, setView] = useState<"list" | "edit" | "add">("list");
  const [saving, setSaving] = useState(false);

  const startEdit = (camp: Camp) => {
    setEditing(camp.id ?? null);
    setForm({
      ...camp,
      vibe: (camp.vibe || []).join(", "),
      tags: (camp.tags || []).join(", "),
      activities: (camp.activities || []).join(", "),
    });
    setView("edit");
  };

  const startAdd = () => {
    setEditing(null);
    setForm(emptyCamp);
    setView("add");
  };

  const handleSave = async () => {
    setSaving(true);

    const camp: Camp = {
      ...form,
      ...(editing ? { id: editing } : {}),
      price_min: Number(form.price_min) || 0,
      price_max: Number(form.price_max) || 0,
      rating: Number(form.rating) || 0,
      reviews: Number(form.reviews) || 0,
      price_label: `$${Number(form.price_min || 0).toLocaleString()}-$${Number(form.price_max || 0).toLocaleString()} / week`,
      vibe: listFromInput(form.vibe),
      tags: listFromInput(form.tags),
      activities: listFromInput(form.activities),
      featured: Boolean(form.featured),
      sponsored: Boolean(form.sponsored),
    };

    await onSave(camp);
    setSaving(false);
    setView("list");
  };

  const field = (label: string, keyName: keyof Camp, type = "text", opts: any = {}) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#6B7280", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>
        {label}
      </label>

      {type === "textarea" ? (
        <textarea
          value={form[keyName] || ""}
          onChange={(e) => setForm((f: any) => ({ ...f, [keyName]: e.target.value }))}
          rows={3}
          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }}
        />
      ) : type === "checkbox" ? (
        <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={!!form[keyName]}
            onChange={(e) => setForm((f: any) => ({ ...f, [keyName]: e.target.checked }))}
          />
          <span style={{ fontSize: 14 }}>{opts.checkLabel || label}</span>
        </label>
      ) : type === "select" ? (
        <select
          value={form[keyName] || ""}
          onChange={(e) => setForm((f: any) => ({ ...f, [keyName]: e.target.value }))}
          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit" }}
        >
          {opts.options?.map((o: string) => <option key={o}>{o}</option>)}
        </select>
      ) : (
        <input
          type={type}
          value={form[keyName] || ""}
          onChange={(e) => setForm((f: any) => ({ ...f, [keyName]: e.target.value }))}
          style={{ width: "100%", padding: "10px 12px", border: "1.5px solid #E5E7EB", borderRadius: 8, fontSize: 14, fontFamily: "inherit", boxSizing: "border-box" }}
        />
      )}
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#F9FAFB", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#111827", padding: "16px 32px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={onBack} style={{ background: "none", border: "1px solid #374151", color: "#9CA3AF", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 13 }}>
            Back to site
          </button>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>ryft <span style={{ color: "#10B981", fontSize: 12, fontWeight: 600 }}>Admin</span></span>
        </div>

        {view === "list" && (
          <button onClick={startAdd} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 8, padding: "8px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Add Listing
          </button>
        )}
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        {view === "list" ? (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 8 }}>All Listings</h2>
            <p style={{ color: "#6B7280", marginBottom: 28 }}>{camps.length} camps in Supabase</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {camps.map((camp) => (
                <div key={camp.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #E5E7EB", padding: "16px 20px", display: "flex", alignItems: "center", gap: 16 }}>
                  <img src={camp.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"} alt={camp.name} style={{ width: 72, height: 56, objectFit: "cover", borderRadius: 8, flexShrink: 0 }} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{camp.name}</span>
                      {camp.sponsored && <Tag label="Sponsored" color="#FEF3C7" textColor="#92400E" />}
                      {camp.featured && <Tag label="Featured" color="#EDE9FE" textColor="#5B21B6" />}
                    </div>
                    <div style={{ fontSize: 13, color: "#6B7280", marginTop: 2 }}>
                      {camp.activity} · {camp.location} · {formatPrice(camp)}
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button onClick={() => startEdit(camp)} style={{ background: "#F3F4F6", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                      Edit
                    </button>
                    <button onClick={() => onDelete(camp.id)} style={{ background: "#FEE2E2", color: "#DC2626", border: "none", borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
                      Delete
                    </button>
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
              <div>{field("Activity", "activity", "select", { options: ACTIVITIES.filter((a) => a !== "All") })}</div>
              <div>{field("Country", "country")}</div>
              <div>{field("Full Location", "location")}</div>
              <div>{field("Min Price ($)", "price_min", "number")}</div>
              <div>{field("Max Price ($)", "price_max", "number")}</div>
              <div>{field("Skill Level", "skill_level", "select", { options: ["All levels", "Beginner", "Intermediate", "Advanced", "Expert", "Beginner-Intermediate", "Intermediate-Expert", "Open Water+"] })}</div>
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
              <button disabled={saving} onClick={handleSave} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "12px 32px", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
                {saving ? "Saving..." : "Save Listing"}
              </button>
              <button onClick={() => setView("list")} style={{ background: "#F3F4F6", border: "none", borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 15, cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const CampCard = ({
  camp,
  onClick,
  saved,
  onToggleSave,
}: {
  camp: Camp;
  onClick: () => void;
  saved: boolean;
  onToggleSave: (id: Camp["id"]) => void;
}) => (
  <div
    onClick={onClick}
    style={{
      background: "#fff",
      borderRadius: 16,
      overflow: "hidden",
      border: "1px solid #E5E7EB",
      cursor: "pointer",
      boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
    }}
  >
    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
      <img
        src={camp.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80"}
        alt={camp.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {camp.sponsored && (
        <div style={{ position: "absolute", top: 12, left: 12, background: "#F59E0B", color: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>
          Sponsored
        </div>
      )}

      {camp.featured && !camp.sponsored && (
        <div style={{ position: "absolute", top: 12, left: 12, background: "#6366F1", color: "#fff", borderRadius: 999, padding: "3px 10px", fontSize: 11, fontWeight: 800 }}>
          Featured
        </div>
      )}

      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggleSave(camp.id);
        }}
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          background: saved ? "#ECFDF5" : "rgba(255,255,255,0.9)",
          border: "none",
          borderRadius: 999,
          width: 34,
          height: 34,
          cursor: "pointer",
          fontSize: 16,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        }}
      >
        {saved ? "♥" : "♡"}
      </button>
    </div>

    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
        <span style={{ fontSize: 12, fontWeight: 700, color: "#10B981", textTransform: "uppercase", letterSpacing: 0.5 }}>{camp.activity}</span>
        <div style={{ textAlign: "right" }}>
          <StarRating rating={camp.rating} />
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{camp.reviews} reviews</div>
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 800, color: "#111827", margin: "4px 0", lineHeight: 1.3 }}>{camp.name}</h3>
      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>{camp.location}</div>

      <p style={{ fontSize: 13, color: "#6B7280", lineHeight: 1.5, marginBottom: 12, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
        {camp.description}
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <Tag label={camp.skill_level} color="#F0F9FF" textColor="#0369A1" />
        <Tag label={camp.duration} color="#FDF4FF" textColor="#7E22CE" />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: "1px solid #F3F4F6" }}>
        <div>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#111827" }}>
            from ${Number(camp.price_min || 0).toLocaleString()}
          </span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}> /wk</span>
        </div>
        <span style={{ fontSize: 12, color: "#6B7280" }}>{camp.age_group}</span>
      </div>
    </div>
  </div>
);

const ListingsPage = ({
  camps,
  initialSearch,
  onSelectCamp,
  saved,
  onToggleSave,
}: {
  camps: Camp[];
  initialSearch: any;
  onSelectCamp: (camp: Camp) => void;
  saved: Set<Camp["id"]>;
  onToggleSave: (id: Camp["id"]) => void;
}) => {
  const [query, setQuery] = useState(initialSearch.query || "");
  const [activity, setActivity] = useState(initialSearch.activity || "All");
  const [skillLevel, setSkillLevel] = useState("All levels");
  const [vibe, setVibe] = useState("All");
  const [priceRange, setPriceRange] = useState(0);
  const [sort, setSort] = useState("featured");

  const filtered = camps
    .filter((camp) => {
      const pr = PRICE_RANGES[priceRange];
      const search = query.toLowerCase();

      if (
        search &&
        !camp.name?.toLowerCase().includes(search) &&
        !camp.activity?.toLowerCase().includes(search) &&
        !camp.country?.toLowerCase().includes(search) &&
        !camp.description?.toLowerCase().includes(search)
      ) return false;

      if (activity !== "All" && camp.activity !== activity) return false;
      if (skillLevel !== "All levels" && !camp.skill_level?.includes(skillLevel)) return false;
      if (vibe !== "All" && !camp.vibe?.includes(vibe) && !camp.tags?.includes(vibe)) return false;
      if (camp.price_min > pr.max || camp.price_max < pr.min) return false;

      return true;
    })
    .sort((a, b) => {
      if (sort === "featured") return Number(b.featured) - Number(a.featured) || Number(b.sponsored) - Number(a.sponsored);
      if (sort === "price_asc") return a.price_min - b.price_min;
      if (sort === "price_desc") return b.price_min - a.price_min;
      if (sort === "rating") return b.rating - a.rating;
      return 0;
    });

  const selectStyle = { padding: "9px 14px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, fontWeight: 600, background: "#fff", cursor: "pointer", fontFamily: "inherit" };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'DM Sans', sans-serif" }}>
      <div style={{ background: "#fff", borderBottom: "1px solid #E5E7EB", position: "sticky", top: 0, zIndex: 40, padding: "12px 24px" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontWeight: 900, fontSize: 20, marginRight: 12, whiteSpace: "nowrap" }}>ryft</span>

          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search camps..." style={{ flex: 1, minWidth: 160, padding: "9px 14px", border: "1.5px solid #E5E7EB", borderRadius: 10, fontSize: 13, fontFamily: "inherit" }} />

          <select value={activity} onChange={(e) => setActivity(e.target.value)} style={selectStyle}>
            {ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
          </select>

          <select value={skillLevel} onChange={(e) => setSkillLevel(e.target.value)} style={selectStyle}>
            {SKILL_LEVELS.map((s) => <option key={s}>{s}</option>)}
          </select>

          <select value={vibe} onChange={(e) => setVibe(e.target.value)} style={selectStyle}>
            {VIBES.map((v) => <option key={v}>{v}</option>)}
          </select>

          <select value={priceRange} onChange={(e) => setPriceRange(Number(e.target.value))} style={selectStyle}>
            {PRICE_RANGES.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
          </select>

          <select value={sort} onChange={(e) => setSort(e.target.value)} style={{ ...selectStyle, color: "#6B7280" }}>
            <option value="featured">Sort: Featured</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
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
            <div style={{ fontSize: 18, fontWeight: 700 }}>No camps found</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters or add camps in Admin.</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {filtered.map((camp) => (
              <CampCard key={camp.id} camp={camp} onClick={() => onSelectCamp(camp)} saved={saved.has(camp.id)} onToggleSave={onToggleSave} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const CampDetail = ({
  camp,
  onBack,
  saved,
  onToggleSave,
}: {
  camp: Camp;
  onBack: () => void;
  saved: boolean;
  onToggleSave: (id: Camp["id"]) => void;
}) => (
  <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'DM Sans', sans-serif" }}>
    <nav style={{ position: "sticky", top: 0, zIndex: 50, background: "rgba(255,255,255,0.95)", borderBottom: "1px solid #E5E7EB", padding: "0 24px" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", color: "#374151", fontWeight: 600, fontSize: 14 }}>
          Back to results
        </button>
        <span style={{ fontWeight: 900, fontSize: 20, color: "#111827" }}>ryft</span>
        <button onClick={() => onToggleSave(camp.id)} style={{ background: saved ? "#ECFDF5" : "#F9FAFB", color: saved ? "#059669" : "#374151", border: `1.5px solid ${saved ? "#6EE7B7" : "#E5E7EB"}`, borderRadius: 999, padding: "7px 16px", cursor: "pointer", fontWeight: 700, fontSize: 13 }}>
          {saved ? "Saved" : "Save"}
        </button>
      </div>
    </nav>

    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {camp.sponsored && <Tag label="Sponsored" color="#FEF3C7" textColor="#92400E" />}

      <h1 style={{ fontSize: "clamp(26px, 4vw, 40px)", fontWeight: 900, color: "#111827", margin: "12px 0 8px" }}>{camp.name}</h1>

      <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap", color: "#6B7280", fontSize: 14, marginBottom: 28 }}>
        <span><StarRating rating={camp.rating} /> <strong style={{ color: "#111" }}>{camp.rating}</strong> ({camp.reviews} reviews)</span>
        <span>{camp.location}</span>
        <span>{camp.activity}</span>
        <span>Best: {camp.best_season}</span>
      </div>

      <img src={camp.image || "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"} alt={camp.name} style={{ width: "100%", height: 420, objectFit: "cover", borderRadius: 20, marginBottom: 40 }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 48, alignItems: "start" }}>
        <div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 28 }}>
            {(camp.tags || []).map((tag) => <Tag key={tag} label={tag} />)}
            {(camp.vibe || []).map((item) => <Tag key={item} label={item} color="#EFF6FF" textColor="#1D4ED8" />)}
          </div>

          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>About this experience</h2>
          <p style={{ color: "#374151", lineHeight: 1.75, fontSize: 15, marginBottom: 32 }}>{camp.description}</p>

          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>What's included</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 32 }}>
            {(camp.activities || []).map((activity) => (
              <div key={activity} style={{ background: "#F0FDF4", borderRadius: 10, padding: "12px 14px", fontSize: 14, fontWeight: 600, color: "#166534" }}>
                {activity}
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "sticky", top: 80, background: "#fff", borderRadius: 20, border: "1.5px solid #E5E7EB", padding: 28, boxShadow: "0 8px 40px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 4 }}>{formatPrice(camp)}</div>
          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>per person, all-inclusive</div>

          <button style={{ width: "100%", background: "linear-gradient(135deg, #059669, #10B981)", color: "#fff", border: "none", borderRadius: 12, padding: 16, fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
            Visit Official Website
          </button>

          <button style={{ width: "100%", marginTop: 12, background: "#F9FAFB", border: "1.5px solid #E5E7EB", borderRadius: 12, padding: 14, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            Send Enquiry
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Homepage = ({
  camps,
  onSearch,
  onSelectCamp,
  onAdmin,
  saved,
  onToggleSave,
}: {
  camps: Camp[];
  onSearch: (params: any) => void;
  onSelectCamp: (camp: Camp) => void;
  onAdmin: () => void;
  saved: Set<Camp["id"]>;
  onToggleSave: (id: Camp["id"]) => void;
}) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("All");

  const featured = camps.filter((camp) => camp.featured);
  const sponsored = camps.filter((camp) => camp.sponsored);

  const handleSearch = () => onSearch({ query, location, activity });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF9" }}>
      <nav style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 10, padding: "20px 40px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#fff", fontWeight: 900, fontSize: 22, textShadow: "0 2px 8px rgba(0,0,0,0.3)" }}>ryft</span>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={onAdmin} style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.3)", borderRadius: 10, padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Admin
          </button>
          <button onClick={handleSearch} style={{ background: "#10B981", color: "#fff", border: "none", borderRadius: 10, padding: "8px 18px", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>
            Explore All
          </button>
        </div>
      </nav>

      <div style={{ minHeight: "92vh", position: "relative", background: "linear-gradient(160deg, #064E3B 0%, #065F46 30%, #047857 60%, #0F766E 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px 60px" }}>
        <div style={{ textAlign: "center", maxWidth: 760 }}>
          <div style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", borderRadius: 999, padding: "6px 18px", marginBottom: 24, border: "1px solid rgba(255,255,255,0.2)" }}>
            <span style={{ color: "#A7F3D0", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>{camps.length} camps loaded from Supabase</span>
          </div>

          <h1 style={{ fontSize: "clamp(36px, 6vw, 72px)", fontWeight: 900, color: "#fff", lineHeight: 1.1, marginBottom: 20 }}>
            Find your next<br />
            <span style={{ color: "#6EE7B7" }}>adventure camp.</span>
          </h1>

          <p style={{ color: "#A7F3D0", fontSize: "clamp(15px, 2vw, 19px)", lineHeight: 1.6, marginBottom: 40 }}>
            Surf, ski, sail, climb, ride, dive. Discover world-class sports camps and skill experiences.
          </p>

          <div style={{ background: "#fff", borderRadius: 20, padding: 16, boxShadow: "0 20px 60px rgba(0,0,0,0.25)", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Surfing, skiing, sailing..." style={{ flex: 2, minWidth: 180, border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#111", fontFamily: "inherit", padding: 12 }} />

            <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Portugal, Bali, anywhere..." style={{ flex: 2, minWidth: 160, border: "none", outline: "none", fontSize: 15, fontWeight: 600, color: "#111", fontFamily: "inherit", padding: 12 }} />

            <select value={activity} onChange={(e) => setActivity(e.target.value)} style={{ flex: 1, minWidth: 130, border: "none", outline: "none", fontSize: 14, fontWeight: 600, color: "#111", fontFamily: "inherit", background: "none", cursor: "pointer", padding: 12 }}>
              {ACTIVITIES.map((a) => <option key={a}>{a}</option>)}
            </select>

            <button onClick={handleSearch} style={{ background: "linear-gradient(135deg, #059669, #10B981)", color: "#fff", border: "none", borderRadius: 14, padding: "16px 28px", fontWeight: 800, fontSize: 16, cursor: "pointer" }}>
              Search
            </button>
          </div>
        </div>
      </div>

      {sponsored.length > 0 && (
        <div style={{ background: "linear-gradient(90deg, #FFFBEB, #FEF3C7)", borderTop: "1px solid #FDE68A", borderBottom: "1px solid #FDE68A", padding: "8px 24px" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#92400E", textTransform: "uppercase", letterSpacing: 0.5, whiteSpace: "nowrap" }}>Sponsored</span>
            <span style={{ fontSize: 13, color: "#78350F" }}>{sponsored.map((camp) => camp.name).join(", ")}</span>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: "#10B981", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Handpicked experiences</div>
            <h2 style={{ fontSize: "clamp(24px, 3vw, 36px)", fontWeight: 900, color: "#111827" }}>Featured camps</h2>
          </div>
          <button onClick={handleSearch} style={{ background: "none", border: "1.5px solid #E5E7EB", borderRadius: 10, padding: "10px 20px", fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
            View all
          </button>
        </div>

        {featured.length === 0 ? (
          <div style={{ color: "#6B7280", background: "#fff", border: "1px solid #E5E7EB", borderRadius: 12, padding: 24 }}>
            No featured camps yet. Open Admin and mark a listing as featured.
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
            {featured.map((camp) => (
              <CampCard key={camp.id} camp={camp} onClick={() => onSelectCamp(camp)} saved={saved.has(camp.id)} onToggleSave={onToggleSave} />
            ))}
          </div>
        )}
      </div>

      <footer style={{ background: "#111827", padding: "40px 24px", color: "#6B7280", textAlign: "center" }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>ryft</div>
        <p style={{ fontSize: 13 }}>Discover sports camps and adventure experiences worldwide</p>
      </footer>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<"home" | "listings" | "detail" | "admin">("home");
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [searchParams, setSearchParams] = useState<any>({});
  const [saved, setSaved] = useState<Set<Camp["id"]>>(new Set());
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loadingCamps, setLoadingCamps] = useState(true);

  const loadCamps = async () => {
    setLoadingCamps(true);

    const { data, error } = await supabase
      .from("camps")
      .select("*")
      .order("featured", { ascending: false });

    if (error) {
      console.error(error);
      setCamps([]);
    } else {
      setCamps((data || []) as Camp[]);
    }

    setLoadingCamps(false);
  };

  useEffect(() => {
    loadCamps();
  }, []);

  useEffect(() => {
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800;900&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const toggleSave = (id: Camp["id"]) => {
    setSaved((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSearch = (params: any) => {
    setSearchParams(params);
    setPage("listings");
  };

  const handleSelectCamp = (camp: Camp) => {
    setSelectedCamp(camp);
    setPage("detail");
  };

  const handleSaveCamp = async (camp: Camp) => {
    const payload: any = { ...camp };

    if (!payload.id) {
      delete payload.id;
    }

    const { error } = await supabase
      .from("camps")
      .upsert(payload);

    if (error) {
      console.error(error);
      alert("Could not save this listing.");
      return;
    }

    await loadCamps();
  };

  const handleDeleteCamp = async (id: Camp["id"]) => {
    if (!id) return;
    if (!window.confirm("Delete this listing?")) return;

    const { error } = await supabase
      .from("camps")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete this listing.");
      return;
    }

    setCamps((prev) => prev.filter((camp) => camp.id !== id));
  };

  if (loadingCamps) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif", background: "#FAFAF9", color: "#111827", fontWeight: 800 }}>
        Loading camps...
      </div>
    );
  }

  if (page === "admin") {
    return <AdminDashboard camps={camps} onBack={() => setPage("home")} onSave={handleSaveCamp} onDelete={handleDeleteCamp} />;
  }

  if (page === "detail" && selectedCamp) {
    return <CampDetail camp={selectedCamp} onBack={() => setPage("listings")} saved={saved.has(selectedCamp.id)} onToggleSave={toggleSave} />;
  }

  if (page === "listings") {
    return <ListingsPage camps={camps} initialSearch={searchParams} onSelectCamp={handleSelectCamp} saved={saved} onToggleSave={toggleSave} />;
  }

  return <Homepage camps={camps} onSearch={handleSearch} onSelectCamp={handleSelectCamp} onAdmin={() => setPage("admin")} saved={saved} onToggleSave={toggleSave} />;
}