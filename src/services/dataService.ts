export function uid(prefix = ''): string {
  return `${prefix}${Date.now().toString(36)}_${Math.random().toString(36).substr(2, 6)}`;
}

export function ts(offset = 0): string {
  return new Date(Date.now() + offset).toISOString();
}

export function rnd(a: number, b: number): number {
  return Math.round(a + Math.random() * (b - a));
}

export function timeAgo(dateStr: string): string {
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return 'همین الان';
  if (mins < 60) return `${mins} دقیقه پیش`;
  if (mins < 1440) return `${Math.floor(mins / 60)} ساعت پیش`;
  if (mins < 43200) return `${Math.floor(mins / 1440)} روز پیش`;
  return `${Math.floor(mins / 43200)} ماه پیش`;
}
