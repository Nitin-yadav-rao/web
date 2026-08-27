import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0c0e",
          border: "1px solid rgba(232,228,218,0.2)",
        }}
      >
        <div style={{ width: 10, height: 10, background: "#3fb6c9", borderRadius: 1 }} />
      </div>
    ),
    { ...size }
  );
}
