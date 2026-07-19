export type PhotoSlot = { type: string; useUploadedPhoto?: boolean; illustrationPrompt?: string; altText?: string };
export type ActivityItem = { date: string; headline: string; body: string; photoSlot?: PhotoSlot };
export type ScheduleItem = { date: string; event: string; description?: string; iconPrompt?: string };
export type NoticeItem = { headline: string; body: string; iconPrompt?: string };
export type MemberVoice = { name: string; comment: string; avatarPrompt?: string };
export type ExtraBox = { title: string; body: string; iconPrompt?: string } | null;

export type ThemeColor = {
  main: string;
  sub: string;
  accent: string;
  background: string;
  text?: string;
};

export type KaihoData = {
  title: string;
  subtitle: string;
  issueLabel: string;
  publishDate: string;
  clubName: string;
  layoutPattern?: string;
  layoutVariant?: string | number;
  seasonTheme?: string;
  themeColor: ThemeColor;
  fontDirection?: { titleFont?: string; headingFont?: string; bodyFont?: string; accentFont?: string };
  designDirection: string;
  mainVisual?: { type?: string; position?: string; imagePrompt?: string; altText?: string };
  illustrationDirection?: { mainIllustration?: string; smallDecorations?: string[]; sectionIcons?: Record<string, string> };
  sections: {
    activityReport: { title: string; summaryLead?: string; items: ActivityItem[] };
    nextSchedule: { title: string; items: ScheduleItem[] };
    notices: { title: string; items: NoticeItem[] };
    memberVoices: { title: string; items: MemberVoice[] };
    extraBox?: ExtraBox;
    editorNote: { title: string; body: string };
    editor: { title: string; name: string };
  };
};

export type TemplateProps = {
  data: KaihoData;
  photos: string[];
  variant: number;
};
