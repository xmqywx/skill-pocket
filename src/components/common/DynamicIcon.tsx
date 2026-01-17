import { icons, LucideIcon } from 'lucide-react';
import type { SVGProps } from 'react';

interface DynamicIconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export function DynamicIcon({ name, ...props }: DynamicIconProps) {
  const IconComponent = icons[name as keyof typeof icons] as LucideIcon | undefined;

  if (!IconComponent) {
    // Fallback to a default icon
    const FallbackIcon = icons.Circle;
    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
}
