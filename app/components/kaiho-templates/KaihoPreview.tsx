"use client";

import { forwardRef } from "react";
import type { KaihoData, TemplateProps } from "./types";
import { PopTemplate } from "./PopTemplate";
import { CheerfulTemplate } from "./CheerfulTemplate";
import { MagazineTemplate } from "./MagazineTemplate";
import { EventTemplate } from "./EventTemplate";
import { SimplePopTemplate } from "./SimplePopTemplate";

const A4_W = 794;
const A4_H = 1123;

function getTemplate(pattern: string): React.ComponentType<TemplateProps> {
  switch (pattern) {
    case "pop": return PopTemplate;
    case "cheerful": return CheerfulTemplate;
    case "magazine": return MagazineTemplate;
    case "event": return EventTemplate;
    case "simple_pop": return SimplePopTemplate;
    default: return PopTemplate;
  }
}

type Props = {
  data: KaihoData;
  photos: string[];
};

export const KaihoPreview = forwardRef<HTMLDivElement, Props>(({ data, photos }, ref) => {
  const pattern = data.layoutPattern || "pop";
  const variant = Number(data.layoutVariant) || 1;
  const Template = getTemplate(pattern);

  const tc = data.themeColor;

  return (
    <div
      ref={ref}
      style={{
        width: `${A4_W}px`,
        height: `${A4_H}px`,
        background: tc.background || "#FBF7EC",
        overflow: "hidden",
        boxSizing: "border-box",
        fontFamily: "'Hiragino Kaku Gothic ProN', 'Hiragino Sans', sans-serif",
        position: "relative",
        // CSS custom properties for dynamic theming
        ["--c-main" as string]: tc.main || "#7BAE5E",
        ["--c-sub" as string]: tc.sub || "#E8A849",
        ["--c-accent" as string]: tc.accent || "#E8A0B4",
        ["--c-bg" as string]: tc.background || "#FBF7EC",
        ["--c-text" as string]: tc.text || "#3D3D3D",
      }}
    >
      <Template data={data} photos={photos} variant={variant} />
    </div>
  );
});

KaihoPreview.displayName = "KaihoPreview";
