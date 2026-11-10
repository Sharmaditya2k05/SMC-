import { ImageResponse } from "next/og";

export const alt = "S.M.C – Siddhu Mathematics Classes. Mathematics Made Simple. Concepts Made Strong.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#101C35", color: "#F8F6F0", padding: 72 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", background: "#D4B477", color: "#101C35", padding: "10px 18px", fontSize: 34, borderRadius: "4px 22px 4px 4px" }}>S.M.C</div>
          <div style={{ display: "flex", fontSize: 30 }}>Siddhu Mathematics Classes</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>Mathematics Made Simple. Concepts Made Strong.</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 30, color: "#D4B477" }}>Mathematics for Class XI and Class XII</div>
        </div>
        <div style={{ display: "flex", height: 4, width: 220, background: "#D4B477" }} />
      </div>
    ),
    size,
  );
}
