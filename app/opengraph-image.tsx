import { ImageResponse } from "next/og";
import { getProfile } from "@/lib/content-store";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";
export const alt = "Field notes on cybersecurity careers";

export default async function OpengraphImage() {
  const profile = await getProfile();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0b0c0e",
          backgroundImage:
            "linear-gradient(rgba(232,228,218,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(232,228,218,0.05) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            color: "#3fb6c9",
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Field notes · cybersecurity careers
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 62,
            fontWeight: 700,
            color: "#e8e4da",
            maxWidth: 980,
            lineHeight: 1.15,
          }}
        >
          Everyone says get into cyber. Nobody says which door.
        </div>
        <div style={{ display: "flex", marginTop: 30, fontSize: 26, color: "rgba(232,228,218,0.6)" }}>
          {profile.name}.log
        </div>
      </div>
    ),
    { ...size }
  );
}
