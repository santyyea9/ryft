"use client";

import { supabase } from "@/lib/supabase";
import { useEffect, useMemo, useState } from "react";

type Camp = {
  id: string | number;
  name: string;
  activity: string;
  country: string;
  description: string;
  duration: string;
  featured: boolean;
  image: string;
  location: string;
  price_max: number;
  price_min: number;
  rating: number;
  website: string;
};

const ACTIVITIES = [
  "All",
  "Surfing",
  "Skiing",
  "Kiteboarding",
  "Horseback Riding",
  "Martial Arts",
  "Scuba Diving",
  "Rock Climbing",
  "Sailing",
  "Tennis",
];

const PRICE_RANGES = [
  { label: "Any budget", min: 0, max: Infinity },
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000-$2,000", min: 1000, max: 2000 },
  { label: "$2,000-$4,000", min: 2000, max: 4000 },
  { label: "$4,000+", min: 4000, max: Infinity },
];

const fallbackImage =
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80";

const formatPrice = (camp: Camp) => {
  const min = Number(camp.price_min) || 0;
  const max = Number(camp.price_max) || 0;

  if (!min && !max) return "Price on request";
  if (min && !max) return `from $${min.toLocaleString()}`;
  if (!min && max) return `up to $${max.toLocaleString()}`;

  return `$${min.toLocaleString()}-$${max.toLocaleString()}`;
};

const StarRating = ({ rating }: { rating: number }) => {
  const safeRating = Math.max(0, Math.min(5, Number(rating) || 0));
  const full = Math.floor(safeRating);
  const half = safeRating % 1 >= 0.5;

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

const CampCard = ({
  camp,
  onClick,
}: {
  camp: Camp;
  onClick: () => void;
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
      transition: "transform 0.2s, box-shadow 0.2s",
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = "translateY(-4px)";
      e.currentTarget.style.boxShadow = "0 12px 40px rgba(0,0,0,0.12)";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = "";
      e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
    }}
  >
    <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
      <img
        src={camp.image || fallbackImage}
        alt={camp.name}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
      />

      {camp.featured && (
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            background: "#6366F1",
            color: "#fff",
            borderRadius: 999,
            padding: "3px 10px",
            fontSize: 11,
            fontWeight: 800,
          }}
        >
          Featured
        </div>
      )}
    </div>

    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: 4,
          gap: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#10B981",
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {camp.activity}
        </span>

        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <StarRating rating={camp.rating} />
          <div style={{ fontSize: 11, color: "#9CA3AF" }}>{camp.rating}</div>
        </div>
      </div>

      <h3
        style={{
          fontSize: 16,
          fontWeight: 800,
          color: "#111827",
          margin: "4px 0",
          lineHeight: 1.3,
        }}
      >
        {camp.name}
      </h3>

      <div style={{ fontSize: 12, color: "#6B7280", marginBottom: 10 }}>
        {camp.location}, {camp.country}
      </div>

      <p
        style={{
          fontSize: 13,
          color: "#6B7280",
          lineHeight: 1.5,
          marginBottom: 12,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {camp.description}
      </p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 12 }}>
        <Tag label={camp.duration || "Flexible duration"} color="#FDF4FF" textColor="#7E22CE" />
        {camp.featured && <Tag label="Featured" color="#EDE9FE" textColor="#5B21B6" />}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 12,
          borderTop: "1px solid #F3F4F6",
          gap: 12,
        }}
      >
        <div>
          <span style={{ fontSize: 17, fontWeight: 900, color: "#111827" }}>
            {formatPrice(camp)}
          </span>
          <span style={{ fontSize: 12, color: "#9CA3AF" }}> /wk</span>
        </div>

        {camp.website && (
          <a
            href={camp.website}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontSize: 12,
              color: "#059669",
              fontWeight: 800,
              textDecoration: "none",
              whiteSpace: "nowrap",
            }}
          >
            Visit site
          </a>
        )}
      </div>
    </div>
  </div>
);

const CampDetail = ({
  camp,
  onBack,
}: {
  camp: Camp;
  onBack: () => void;
}) => (
  <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'DM Sans', sans-serif" }}>
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #E5E7EB",
        padding: "0 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#374151",
            fontWeight: 600,
            fontSize: 14,
          }}
        >
          Back to results
        </button>

        <span style={{ fontWeight: 900, fontSize: 20, color: "#111827" }}>ryft</span>

        {camp.website ? (
          <a
            href={camp.website}
            target="_blank"
            rel="noreferrer"
            style={{
              background: "#ECFDF5",
              color: "#059669",
              border: "1.5px solid #6EE7B7",
              borderRadius: 999,
              padding: "7px 16px",
              fontWeight: 700,
              fontSize: 13,
              textDecoration: "none",
            }}
          >
            Website
          </a>
        ) : (
          <span />
        )}
      </div>
    </nav>

    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
      {camp.featured && <Tag label="Featured" color="#EDE9FE" textColor="#5B21B6" />}

      <h1
        style={{
          fontSize: "clamp(26px, 4vw, 40px)",
          fontWeight: 900,
          color: "#111827",
          margin: "12px 0 8px",
        }}
      >
        {camp.name}
      </h1>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
          color: "#6B7280",
          fontSize: 14,
          marginBottom: 28,
        }}
      >
        <span>
          <StarRating rating={camp.rating} />{" "}
          <strong style={{ color: "#111" }}>{camp.rating}</strong>
        </span>
        <span>{camp.location}, {camp.country}</span>
        <span>{camp.activity}</span>
        <span>{camp.duration}</span>
      </div>

      <img
        src={camp.image || fallbackImage}
        alt={camp.name}
        style={{
          width: "100%",
          height: 420,
          objectFit: "cover",
          borderRadius: 20,
          marginBottom: 40,
        }}
      />

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 340px",
          gap: 48,
          alignItems: "start",
        }}
      >
        <div>
          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>
            About this experience
          </h2>

          <p style={{ color: "#374151", lineHeight: 1.75, fontSize: 15, marginBottom: 32 }}>
            {camp.description}
          </p>

          <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>
            Camp details
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[
              ["Activity", camp.activity],
              ["Duration", camp.duration],
              ["Country", camp.country],
              ["Location", camp.location],
            ].map(([label, value]) => (
              <div
                key={label}
                style={{
                  background: "#F9FAFB",
                  borderRadius: 10,
                  padding: "14px 16px",
                  border: "1px solid #E5E7EB",
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    color: "#9CA3AF",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                    marginBottom: 4,
                  }}
                >
                  {label}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                  {value || "Not listed"}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          style={{
            position: "sticky",
            top: 80,
            background: "#fff",
            borderRadius: 20,
            border: "1.5px solid #E5E7EB",
            padding: 28,
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
          }}
        >
          <div style={{ fontSize: 28, fontWeight: 900, color: "#111827", marginBottom: 4 }}>
            {formatPrice(camp)}
          </div>

          <div style={{ fontSize: 13, color: "#9CA3AF", marginBottom: 24 }}>
            per person, estimated
          </div>

          {camp.website ? (
            <a
              href={camp.website}
              target="_blank"
              rel="noreferrer"
              style={{
                display: "block",
                textAlign: "center",
                background: "linear-gradient(135deg, #059669, #10B981)",
                color: "#fff",
                borderRadius: 12,
                padding: 16,
                fontWeight: 800,
                fontSize: 16,
                textDecoration: "none",
              }}
            >
              Visit Official Website
            </a>
          ) : (
            <button
              disabled
              style={{
                width: "100%",
                background: "#E5E7EB",
                color: "#6B7280",
                border: "none",
                borderRadius: 12,
                padding: 16,
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              Website unavailable
            </button>
          )}
        </div>
      </div>
    </div>
  </div>
);

const ListingsPage = ({
  camps,
  initialSearch,
  onSelectCamp,
}: {
  camps: Camp[];
  initialSearch: { query?: string; location?: string; activity?: string };
  onSelectCamp: (camp: Camp) => void;
}) => {
  const [query, setQuery] = useState(initialSearch.query || "");
  const [activity, setActivity] = useState(initialSearch.activity || "All");
  const [priceRange, setPriceRange] = useState(0);
  const [sort, setSort] = useState("featured");

  const filtered = useMemo(() => {
    return camps
      .filter((camp) => {
        const pr = PRICE_RANGES[priceRange];
        const search = query.trim().toLowerCase();
        const activityValue = camp.activity || "";

        if (
          search &&
          !camp.name?.toLowerCase().includes(search) &&
          !activityValue.toLowerCase().includes(search) &&
          !camp.country?.toLowerCase().includes(search) &&
          !camp.location?.toLowerCase().includes(search) &&
          !camp.description?.toLowerCase().includes(search)
        ) {
          return false;
        }

        if (
          activity !== "All" &&
          activityValue.toLowerCase() !== activity.toLowerCase()
        ) {
          return false;
        }

        if (Number(camp.price_min) > pr.max || Number(camp.price_max) < pr.min) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sort === "featured") return Number(b.featured) - Number(a.featured);
        if (sort === "price_asc") return Number(a.price_min) - Number(b.price_min);
        if (sort === "price_desc") return Number(b.price_min) - Number(a.price_min);
        if (sort === "rating") return Number(b.rating) - Number(a.rating);
        return 0;
      });
  }, [activity, camps, priceRange, query, sort]);

  const selectStyle = {
    padding: "9px 14px",
    border: "1.5px solid #E5E7EB",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    background: "#fff",
    cursor: "pointer",
    fontFamily: "inherit",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF9", fontFamily: "'DM Sans', sans-serif" }}>
      <div
        style={{
          background: "#fff",
          borderBottom: "1px solid #E5E7EB",
          position: "sticky",
          top: 0,
          zIndex: 40,
          padding: "12px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <span style={{ fontWeight: 900, fontSize: 20, marginRight: 12, whiteSpace: "nowrap" }}>
            ryft
          </span>

          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search camps..."
            style={{
              flex: 1,
              minWidth: 160,
              padding: "9px 14px",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              fontSize: 13,
              fontFamily: "inherit",
            }}
          />

          <select value={activity} onChange={(e) => setActivity(e.target.value)} style={selectStyle}>
            {ACTIVITIES.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select
            value={priceRange}
            onChange={(e) => setPriceRange(Number(e.target.value))}
            style={selectStyle}
          >
            {PRICE_RANGES.map((item, index) => (
              <option key={item.label} value={index}>
                {item.label}
              </option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            style={{ ...selectStyle, color: "#6B7280" }}
          >
            <option value="featured">Sort: Featured</option>
            <option value="rating">Top rated</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        <div
          style={{
            marginBottom: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <h2 style={{ fontSize: 18, fontWeight: 800 }}>{filtered.length} experiences found</h2>
          <span style={{ fontSize: 13, color: "#9CA3AF" }}>Prices in USD per person</span>
        </div>

        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#9CA3AF" }}>
            <div style={{ fontSize: 18, fontWeight: 700 }}>No camps found</div>
            <div style={{ fontSize: 14, marginTop: 8 }}>Try adjusting your filters.</div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {filtered.map((camp) => (
              <CampCard key={camp.id} camp={camp} onClick={() => onSelectCamp(camp)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const Homepage = ({
  camps,
  onSearch,
  onSelectCamp,
}: {
  camps: Camp[];
  onSearch: (params: { query: string; location: string; activity: string }) => void;
  onSelectCamp: (camp: Camp) => void;
}) => {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [activity, setActivity] = useState("All");

  const featured = camps.filter((camp) => camp.featured);
  const visibleCamps = featured.length > 0 ? featured : camps;

  const handleSearch = () => onSearch({ query, location, activity });

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif", background: "#FAFAF9" }}>
      <nav
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#fff",
            fontWeight: 900,
            fontSize: 22,
            textShadow: "0 2px 8px rgba(0,0,0,0.3)",
          }}
        >
          ryft
        </span>

        <button
          onClick={handleSearch}
          style={{
            background: "#10B981",
            color: "#fff",
            border: "none",
            borderRadius: 10,
            padding: "8px 18px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 13,
          }}
        >
          Explore All
        </button>
      </nav>

      <div
        style={{
          minHeight: "92vh",
          position: "relative",
          background: "linear-gradient(160deg, #064E3B 0%, #065F46 30%, #047857 60%, #0F766E 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "100px 24px 60px",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: 760 }}>
          <div
            style={{
              display: "inline-block",
              background: "rgba(255,255,255,0.12)",
              borderRadius: 999,
              padding: "6px 18px",
              marginBottom: 24,
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <span style={{ color: "#A7F3D0", fontSize: 13, fontWeight: 700, letterSpacing: 1 }}>
              {camps.length} camps loaded from Supabase
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px, 6vw, 72px)",
              fontWeight: 900,
              color: "#fff",
              lineHeight: 1.1,
              marginBottom: 20,
            }}
          >
            Find your next
            <br />
            <span style={{ color: "#6EE7B7" }}>adventure camp.</span>
          </h1>

          <p
            style={{
              color: "#A7F3D0",
              fontSize: "clamp(15px, 2vw, 19px)",
              lineHeight: 1.6,
              marginBottom: 40,
            }}
          >
            Surf, ski, sail, climb, ride, dive. Discover world-class sports camps and skill experiences.
          </p>

          <div
            style={{
              background: "#fff",
              borderRadius: 20,
              padding: 16,
              boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Surfing, skiing, sailing..."
              style={{
                flex: 2,
                minWidth: 180,
                border: "none",
                outline: "none",
                fontSize: 15,
                fontWeight: 600,
                color: "#111",
                fontFamily: "inherit",
                padding: 12,
              }}
            />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Portugal, Bali, anywhere..."
              style={{
                flex: 2,
                minWidth: 160,
                border: "none",
                outline: "none",
                fontSize: 15,
                fontWeight: 600,
                color: "#111",
                fontFamily: "inherit",
                padding: 12,
              }}
            />

            <select
              value={activity}
              onChange={(e) => setActivity(e.target.value)}
              style={{
                flex: 1,
                minWidth: 130,
                border: "none",
                outline: "none",
                fontSize: 14,
                fontWeight: 600,
                color: "#111",
                fontFamily: "inherit",
                background: "none",
                cursor: "pointer",
                padding: 12,
              }}
            >
              {ACTIVITIES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>

            <button
              onClick={handleSearch}
              style={{
                background: "linear-gradient(135deg, #059669, #10B981)",
                color: "#fff",
                border: "none",
                borderRadius: 14,
                padding: "16px 28px",
                fontWeight: 800,
                fontSize: 16,
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            marginBottom: 32,
            gap: 16,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#10B981",
                textTransform: "uppercase",
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              Handpicked experiences
            </div>

            <h2
              style={{
                fontSize: "clamp(24px, 3vw, 36px)",
                fontWeight: 900,
                color: "#111827",
              }}
            >
              {featured.length > 0 ? "Featured camps" : "All camps"}
            </h2>
          </div>

          <button
            onClick={handleSearch}
            style={{
              background: "none",
              border: "1.5px solid #E5E7EB",
              borderRadius: 10,
              padding: "10px 20px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: 14,
            }}
          >
            View all
          </button>
        </div>

        {visibleCamps.length === 0 ? (
          <div
            style={{
              color: "#6B7280",
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: 24,
            }}
          >
            No camps found in Supabase yet.
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {visibleCamps.map((camp) => (
              <CampCard key={camp.id} camp={camp} onClick={() => onSelectCamp(camp)} />
            ))}
          </div>
        )}
      </div>

      <footer
        style={{
          background: "#111827",
          padding: "40px 24px",
          color: "#6B7280",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 20, fontWeight: 900, color: "#fff", marginBottom: 8 }}>
          ryft
        </div>
        <p style={{ fontSize: 13 }}>Discover sports camps and adventure experiences worldwide</p>
      </footer>
    </div>
  );
};

export default function App() {
  const [page, setPage] = useState<"home" | "listings" | "detail">("home");
  const [selectedCamp, setSelectedCamp] = useState<Camp | null>(null);
  const [searchParams, setSearchParams] = useState<{
    query?: string;
    location?: string;
    activity?: string;
  }>({});
  const [camps, setCamps] = useState<Camp[]>([]);
  const [loadingCamps, setLoadingCamps] = useState(true);

  useEffect(() => {
    const loadCamps = async () => {
      setLoadingCamps(true);

      const { data, error } = await supabase.from("camps").select("*");

      if (error) {
        console.error("Error loading camps:", error);
        setCamps([]);
      } else {
        setCamps((data || []) as Camp[]);
      }

      setLoadingCamps(false);
    };

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

  const handleSearch = (params: { query: string; location: string; activity: string }) => {
    setSearchParams(params);
    setPage("listings");
  };

  const handleSelectCamp = (camp: Camp) => {
    setSelectedCamp(camp);
    setPage("detail");
  };

  if (loadingCamps) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'DM Sans', sans-serif",
          background: "#FAFAF9",
          color: "#111827",
          fontWeight: 800,
        }}
      >
        Loading camps...
      </div>
    );
  }

  if (page === "detail" && selectedCamp) {
    return <CampDetail camp={selectedCamp} onBack={() => setPage("listings")} />;
  }

  if (page === "listings") {
    return (
      <ListingsPage
        camps={camps}
        initialSearch={searchParams}
        onSelectCamp={handleSelectCamp}
      />
    );
  }

  return (
    <Homepage
      camps={camps}
      onSearch={handleSearch}
      onSelectCamp={handleSelectCamp}
    />
  );
}