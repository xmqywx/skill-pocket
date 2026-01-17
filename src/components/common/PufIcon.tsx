import { useEffect, useState } from 'react';
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';
import { cn } from '@/lib/utils';

interface PufIconProps {
  name: string;
  className?: string;
  size?: number;
}

// Icon cache to avoid re-reading files
const iconCache: Record<string, string> = {};

export function PufIcon({ name, className, size = 24 }: PufIconProps) {
  const [svgContent, setSvgContent] = useState<string>('');

  useEffect(() => {
    async function loadIcon() {
      const cacheKey = name;

      if (iconCache[cacheKey]) {
        setSvgContent(iconCache[cacheKey]);
        return;
      }

      try {
        const path = `.claude/skill-pocket/icons/svgs/skillpocket-puf/${name}.svg`;
        const content = await readTextFile(path, { baseDir: BaseDirectory.Home });

        // Process SVG to make it responsive
        const processed = content
          .replace(/width="64"/g, `width="${size}"`)
          .replace(/height="64"/g, `height="${size}"`)
          .replace(/viewBox="0 0 64 64"/g, 'viewBox="0 0 64 64"');

        iconCache[cacheKey] = processed;
        setSvgContent(processed);
      } catch (error) {
        console.error(`Failed to load icon: ${name}`, error);
      }
    }

    loadIcon();
  }, [name, size]);

  if (!svgContent) {
    return <div className={cn('animate-pulse bg-muted rounded', className)} style={{ width: size, height: size }} />;
  }

  return (
    <span
      className={cn('inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  );
}

// Inline SVG icons for faster loading (no file system read needed)
export const PufIcons = {
  mySkills: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Magic book/skill pocket -->
  <path d="M12 14C12 12 14 10 16 10H48C50 10 52 12 52 14V50C52 52 50 54 48 54H16C14 54 12 52 12 50V14Z" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M20 10V54" stroke="#1A1A1A" stroke-width="2"/>
  <!-- Cute face on book -->
  <circle cx="36" cy="28" r="10" fill="#BFFF00"/>
  <circle cx="33" cy="26" r="2" fill="#1A1A1A"/>
  <circle cx="39" cy="26" r="2" fill="#1A1A1A"/>
  <path d="M33 32C33 32 35 35 36 35C37 35 39 32 39 32" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <!-- Sparkle lines indicating magic/skills -->
  <path d="M28 42H44" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M30 46H42" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <!-- Stars -->
  <path d="M50 8L51 11L54 11L51.5 13L52.5 16L50 14L47.5 16L48.5 13L46 11L49 11L50 8Z" fill="#BFFF00"/>
  <path d="M8 6L9 8L11 8L9.5 9.5L10 12L8 10.5L6 12L6.5 9.5L5 8L7 8L8 6Z" fill="#BFFF00"/>
</svg>`,

  store: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 24L12 12H52L56 24H8Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="8" y="24" width="48" height="32" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="26" y="40" width="12" height="16" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="48" r="2" fill="#1A1A1A"/>
  <path d="M8 24C8 24 14 32 20 24" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M20 24C20 24 26 32 32 24" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M32 24C32 24 38 32 44 24" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M44 24C44 24 50 32 56 24" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <circle cx="28" cy="17" r="2" fill="#1A1A1A"/>
  <circle cx="36" cy="17" r="2" fill="#1A1A1A"/>
  <path d="M28 21C28 21 31 23 32 23C33 23 36 21 36 21" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  create: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="20" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M32 22V42" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M22 32H42" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="8" fill="#BFFF00"/>
  <circle cx="29" cy="30" r="1.5" fill="#1A1A1A"/>
  <circle cx="35" cy="30" r="1.5" fill="#1A1A1A"/>
  <path d="M29 35C29 35 31 37 32 37C33 37 35 35 35 35" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M50 10L51 13L54 13L51.5 15L52.5 18L50 16L47.5 18L48.5 15L46 13L49 13L50 10Z" fill="#BFFF00"/>
  <path d="M14 8L15 10L17 10L15.5 11.5L16 14L14 12.5L12 14L12.5 11.5L11 10L13 10L14 8Z" fill="#BFFF00"/>
</svg>`,

  settings: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 8H36L38 16L46 20L54 16V24L46 28V36L54 40V48L46 44L38 48L36 56H28L26 48L18 44L10 48V40L18 36V28L10 24V16L18 20L26 16L28 8Z" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="10" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="28" cy="30" r="2" fill="#1A1A1A"/>
  <circle cx="36" cy="30" r="2" fill="#1A1A1A"/>
  <path d="M28 36C28 36 30 39 32 39C34 39 36 36 36 36" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  icons: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <!-- Paint palette shape -->
  <path d="M32 8C18 8 8 18 8 32C8 46 18 56 32 56C38 56 42 52 42 48C42 46 41 44 42 42C43 40 46 38 50 38C54 38 56 34 56 30C56 18 46 8 32 8Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5"/>
  <!-- Color dots on palette -->
  <circle cx="20" cy="24" r="5" fill="#FF6B6B" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="18" cy="38" r="5" fill="#4ECDC4" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="28" cy="46" r="5" fill="#FFE66D" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="32" cy="32" r="5" fill="#95E1D3" stroke="#1A1A1A" stroke-width="2"/>
  <!-- Cute face in center -->
  <circle cx="38" cy="22" r="8" fill="white" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="35" cy="20" r="1.5" fill="#1A1A1A"/>
  <circle cx="41" cy="20" r="1.5" fill="#1A1A1A"/>
  <path d="M35 25C35 25 37 27 38 27C39 27 41 25 41 25" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
  <!-- Star sparkle -->
  <path d="M52 12L53 15L56 15L53.5 17L54.5 20L52 18L49.5 20L50.5 17L48 15L51 15L52 12Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="1"/>
</svg>`,

  search: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="28" cy="28" r="16" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M40 40L54 54" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="28" cy="28" r="8" fill="#BFFF00"/>
  <circle cx="24" cy="26" r="2" fill="#1A1A1A"/>
  <circle cx="32" cy="26" r="2" fill="#1A1A1A"/>
  <path d="M24 32C24 32 27 35 28 35C29 35 32 32 32 32" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M52 12L53 15L56 15L53.5 17L54.5 20L52 18L49.5 20L50.5 17L48 15L51 15L52 12Z" fill="#BFFF00"/>
</svg>`,

  favorite: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 12L38 26H54L42 36L46 52L32 44L18 52L22 36L10 26H26L32 12Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="27" cy="30" r="2" fill="#1A1A1A"/>
  <circle cx="37" cy="30" r="2" fill="#1A1A1A"/>
  <path d="M27 38C27 38 30 42 32 42C34 42 37 38 37 38" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M54 8L55 10L57 10L55.5 11.5L56 14L54 12.5L52 14L52.5 11.5L51 10L53 10L54 8Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="1"/>
</svg>`,

  tags: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 32L10 16L26 16L42 32L26 48L10 32Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="18" cy="24" r="3" fill="#1A1A1A"/>
  <path d="M22 32L22 20L34 20L46 32L34 44L22 32Z" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M50 14L51 17L54 17L51.5 19L52.5 22L50 20L47.5 22L48.5 19L46 17L49 17L50 14Z" fill="#BFFF00"/>
  <circle cx="28" cy="26" r="2" fill="#1A1A1A"/>
</svg>`,

  folder: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8 20V52C8 54 10 56 12 56H52C54 56 56 54 56 52V24C56 22 54 20 52 20H30L26 14H12C10 14 8 16 8 18V20Z" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M8 24H56" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="40" r="8" fill="#BFFF00"/>
  <circle cx="28" cy="38" r="2" fill="#1A1A1A"/>
  <circle cx="36" cy="38" r="2" fill="#1A1A1A"/>
  <path d="M28 44C28 44 30 47 32 47C34 47 36 44 36 44" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M52 10L53 13L56 13L53.5 15L54.5 18L52 16L49.5 18L50.5 15L48 13L51 13L52 10Z" fill="#BFFF00"/>
</svg>`,

  download: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 8V40" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M20 32L32 44L44 32" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 48H52V56H12V48Z" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="52" r="3" fill="#BFFF00"/>
  <circle cx="32" cy="20" r="6" fill="#BFFF00"/>
  <circle cx="30" cy="19" r="1.5" fill="#1A1A1A"/>
  <circle cx="34" cy="19" r="1.5" fill="#1A1A1A"/>
  <path d="M30 23C30 23 31 24 32 24C33 24 34 23 34 23" stroke="#1A1A1A" stroke-width="1" stroke-linecap="round"/>
  <path d="M52 10L53 13L56 13L53.5 15L54.5 18L52 16L49.5 18L50.5 15L48 13L51 13L52 10Z" fill="#BFFF00"/>
</svg>`,

  trash: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 18H52" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M24 18V12H40V18" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M16 18L20 54H44L48 18" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M26 26V46" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M32 26V46" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M38 26V46" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="36" r="6" fill="#BFFF00"/>
  <path d="M29 34L30 36L29 38" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M35 34L34 36L35 38" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M30 40C32 38 34 40 34 40" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  edit: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M44 8L56 20L24 52H12V40L44 8Z" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M36 16L48 28" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M12 52H24" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="50" cy="14" r="6" fill="#BFFF00"/>
  <circle cx="48" cy="13" r="1.5" fill="#1A1A1A"/>
  <circle cx="52" cy="13" r="1.5" fill="#1A1A1A"/>
  <path d="M48 17C48 17 49 18 50 18C51 18 52 17 52 17" stroke="#1A1A1A" stroke-width="1" stroke-linecap="round"/>
  <path d="M8 58L9 60L11 60L9.5 61.5L10 64L8 62.5L6 64L6.5 61.5L5 60L7 60L8 58Z" fill="#BFFF00"/>
</svg>`,

  copy: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="20" y="20" width="32" height="36" rx="4" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M44 20V12C44 10 42 8 40 8H16C14 8 12 10 12 12V44C12 46 14 48 16 48H20" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <rect x="26" y="30" width="20" height="4" rx="2" fill="#BFFF00"/>
  <rect x="26" y="38" width="14" height="4" rx="2" fill="#BFFF00"/>
  <rect x="26" y="46" width="16" height="4" rx="2" fill="#BFFF00"/>
  <path d="M54 8L55 11L58 11L55.5 13L56.5 16L54 14L51.5 16L52.5 13L50 11L53 11L54 8Z" fill="#BFFF00"/>
</svg>`,

  refresh: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 32C12 20 22 12 34 12C46 12 54 22 50 32" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M52 32C52 44 42 52 30 52C18 52 10 42 14 32" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M44 26L50 32L56 26" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M20 38L14 32L8 38" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="6" fill="#BFFF00"/>
  <circle cx="30" cy="31" r="1.5" fill="#1A1A1A"/>
  <circle cx="34" cy="31" r="1.5" fill="#1A1A1A"/>
  <path d="M30 35C30 35 31 36 32 36C33 36 34 35 34 35" stroke="#1A1A1A" stroke-width="1" stroke-linecap="round"/>
</svg>`,

  help: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M24 24C24 20 28 16 32 16C36 16 40 20 40 24C40 28 36 30 32 32V38" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="32" cy="46" r="3" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="32" cy="24" r="5" fill="#BFFF00"/>
  <circle cx="30" cy="23" r="1.5" fill="#1A1A1A"/>
  <circle cx="34" cy="23" r="1.5" fill="#1A1A1A"/>
  <path d="M30 27C30 27 31 28 32 28C33 28 34 27 34 27" stroke="#1A1A1A" stroke-width="1" stroke-linecap="round"/>
  <path d="M52 10L53 13L56 13L53.5 15L54.5 18L52 16L49.5 18L50.5 15L48 13L51 13L52 10Z" fill="#BFFF00"/>
</svg>`,

  grid: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="8" width="20" height="20" rx="4" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5"/>
  <rect x="36" y="8" width="20" height="20" rx="4" stroke="#1A1A1A" stroke-width="2.5"/>
  <rect x="8" y="36" width="20" height="20" rx="4" stroke="#1A1A1A" stroke-width="2.5"/>
  <rect x="36" y="36" width="20" height="20" rx="4" stroke="#1A1A1A" stroke-width="2.5"/>
  <circle cx="18" cy="18" r="4" fill="none" stroke="#1A1A1A" stroke-width="2"/>
  <circle cx="46" cy="18" r="4" fill="#BFFF00"/>
  <circle cx="18" cy="46" r="4" fill="#BFFF00"/>
  <circle cx="46" cy="46" r="4" fill="#BFFF00"/>
</svg>`,

  list: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="14" cy="16" r="6" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2"/>
  <path d="M28 16H56" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="14" cy="32" r="6" stroke="#1A1A1A" stroke-width="2"/>
  <path d="M28 32H56" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="14" cy="48" r="6" stroke="#1A1A1A" stroke-width="2"/>
  <path d="M28 48H56" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="12" cy="15" r="1.5" fill="#1A1A1A"/>
  <circle cx="16" cy="15" r="1.5" fill="#1A1A1A"/>
  <path d="M12 19C12 19 13 20 14 20C15 20 16 19 16 19" stroke="#1A1A1A" stroke-width="1" stroke-linecap="round"/>
</svg>`,

  heart: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 52L14 34C8 28 8 18 16 14C24 10 32 18 32 18C32 18 40 10 48 14C56 18 56 28 50 34L32 52Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="22" cy="24" r="2" fill="#1A1A1A"/>
  <circle cx="42" cy="24" r="2" fill="#1A1A1A"/>
  <path d="M12 8L13 11L16 11L14 13L15 16L12 14L9 16L10 13L8 11L11 11L12 8Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="1"/>
  <path d="M54 10L55 12L57 12L55.5 13.5L56 16L54 14.5L52 16L52.5 13.5L51 12L53 12L54 10Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="1"/>
</svg>`,

  heartOutline: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 52L14 34C8 28 8 18 16 14C24 10 32 18 32 18C32 18 40 10 48 14C56 18 56 28 50 34L32 52Z" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="22" cy="26" r="2" fill="#1A1A1A"/>
  <circle cx="42" cy="26" r="2" fill="#1A1A1A"/>
  <path d="M26 32C26 32 29 35 32 35C35 35 38 32 38 32" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  clock: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M32 16V32L42 38" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="4" fill="#BFFF00"/>
  <circle cx="32" cy="14" r="2" fill="#BFFF00"/>
  <circle cx="32" cy="50" r="2" fill="#BFFF00"/>
  <circle cx="14" cy="32" r="2" fill="#BFFF00"/>
  <circle cx="50" cy="32" r="2" fill="#BFFF00"/>
</svg>`,

  plus: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M32 18V46" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
  <path d="M18 32H46" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
  <circle cx="26" cy="28" r="2" fill="#1A1A1A"/>
  <circle cx="38" cy="28" r="2" fill="#1A1A1A"/>
  <path d="M26 38C26 38 29 42 32 42C35 42 38 38 38 38" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  sun: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="12" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M32 8V14" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M32 50V56" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M8 32H14" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M50 32H56" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M15 15L19 19" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M45 45L49 49" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M15 49L19 45" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M45 19L49 15" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="28" cy="30" r="2" fill="#1A1A1A"/>
  <circle cx="36" cy="30" r="2" fill="#1A1A1A"/>
  <path d="M28 36C28 36 30 39 32 39C34 39 36 36 36 36" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  moon: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M28 8C16 12 10 24 14 38C18 52 32 60 46 56C34 56 24 44 24 30C24 20 28 12 28 8Z" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="24" cy="28" r="2" fill="#1A1A1A"/>
  <circle cx="32" cy="36" r="2" fill="#1A1A1A"/>
  <path d="M24 38C24 38 27 42 30 42" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M48 12L49 15L52 15L49.5 17L50.5 20L48 18L45.5 20L46.5 17L44 15L47 15L48 12Z" fill="#BFFF00"/>
  <path d="M54 28L55 30L57 30L55.5 31.5L56 34L54 32.5L52 34L52.5 31.5L51 30L53 30L54 28Z" fill="#BFFF00"/>
</svg>`,

  monitor: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="8" y="10" width="48" height="32" rx="4" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M24 50H40" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M32 42V50" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="32" cy="26" r="8" fill="#BFFF00"/>
  <circle cx="28" cy="24" r="2" fill="#1A1A1A"/>
  <circle cx="36" cy="24" r="2" fill="#1A1A1A"/>
  <path d="M28 30C28 30 30 33 32 33C34 33 36 30 36 30" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  globe: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" stroke="#1A1A1A" stroke-width="2.5"/>
  <ellipse cx="32" cy="32" rx="10" ry="22" stroke="#1A1A1A" stroke-width="2"/>
  <path d="M10 32H54" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M14 20H50" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <path d="M14 44H50" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="6" fill="#BFFF00"/>
  <circle cx="30" cy="31" r="1.5" fill="#1A1A1A"/>
  <circle cx="34" cy="31" r="1.5" fill="#1A1A1A"/>
  <path d="M30 35C30 35 31 36 32 36C33 36 34 35 34 35" stroke="#1A1A1A" stroke-width="1" stroke-linecap="round"/>
</svg>`,

  upload: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 44V12" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M20 24L32 12L44 24" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 40V52H52V40" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="32" r="6" fill="#BFFF00"/>
  <circle cx="30" cy="31" r="1.5" fill="#1A1A1A"/>
  <circle cx="34" cy="31" r="1.5" fill="#1A1A1A"/>
  <path d="M30 35C30 35 31 36 32 36C33 36 34 35 34 35" stroke="#1A1A1A" stroke-width="1" stroke-linecap="round"/>
</svg>`,

  chevronRight: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 16L40 32L24 48" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="36" cy="32" r="4" fill="#BFFF00"/>
</svg>`,

  chevronDown: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M16 24L32 40L48 24" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="36" r="4" fill="#BFFF00"/>
</svg>`,

  loader: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" stroke="#1A1A1A" stroke-width="2.5" stroke-dasharray="10 5"/>
  <circle cx="32" cy="32" r="10" fill="#BFFF00"/>
  <circle cx="28" cy="30" r="2" fill="#1A1A1A"/>
  <circle cx="36" cy="30" r="2" fill="#1A1A1A"/>
  <path d="M28 36C28 36 30 38 32 38C34 38 36 36 36 36" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  alert: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 8L4 56H60L32 8Z" stroke="#1A1A1A" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="32" cy="44" r="3" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2"/>
  <path d="M32 24V36" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
  <circle cx="32" cy="30" r="5" fill="#BFFF00"/>
  <circle cx="30" cy="29" r="1.5" fill="#1A1A1A"/>
  <circle cx="34" cy="29" r="1.5" fill="#1A1A1A"/>
</svg>`,

  check: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" fill="#BFFF00" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M20 32L28 40L44 24" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="26" cy="28" r="2" fill="#1A1A1A"/>
  <circle cx="38" cy="28" r="2" fill="#1A1A1A"/>
  <path d="M26 38C26 38 29 42 32 42C35 42 38 38 38 38" stroke="#1A1A1A" stroke-width="2" stroke-linecap="round"/>
</svg>`,

  x: `<svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="32" cy="32" r="22" stroke="#1A1A1A" stroke-width="2.5"/>
  <path d="M22 22L42 42" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
  <path d="M42 22L22 42" stroke="#1A1A1A" stroke-width="3" stroke-linecap="round"/>
  <circle cx="32" cy="32" r="6" fill="#BFFF00"/>
  <path d="M29 30L31 32L29 34" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
  <path d="M35 30L33 32L35 34" stroke="#1A1A1A" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,
};

interface InlinePufIconProps {
  name: keyof typeof PufIcons;
  className?: string;
  size?: number;
}

export function InlinePufIcon({ name, className, size = 24 }: InlinePufIconProps) {
  const svgContent = PufIcons[name];

  if (!svgContent) {
    return <div className={cn('bg-muted rounded', className)} style={{ width: size, height: size }} />;
  }

  // Replace size in SVG
  const processed = svgContent
    .replace(/width="64"/g, `width="${size}"`)
    .replace(/height="64"/g, `height="${size}"`);

  return (
    <span
      className={cn('inline-flex items-center justify-center [&>svg]:w-full [&>svg]:h-full', className)}
      style={{ width: size, height: size }}
      dangerouslySetInnerHTML={{ __html: processed }}
    />
  );
}
