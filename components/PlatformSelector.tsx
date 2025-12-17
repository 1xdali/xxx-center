'use client';

import { BannerPlatform, PLATFORM_LABELS } from '@/types/banner';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface PlatformSelectorProps {
    selectedPlatforms: BannerPlatform[];
    onChange: (platforms: BannerPlatform[]) => void;
}

export default function PlatformSelector({
    selectedPlatforms,
    onChange,
}: PlatformSelectorProps) {
    const togglePlatform = (platform: BannerPlatform) => {
        if (selectedPlatforms.includes(platform)) {
            onChange(selectedPlatforms.filter((p) => p !== platform));
        } else {
            onChange([...selectedPlatforms, platform]);
        }
    };

    return (
        <div className="flex flex-wrap gap-4">
            {Object.values(BannerPlatform).map((platform) => {
                const isSelected = selectedPlatforms.includes(platform);

                return (
                    <div key={platform} className="flex items-start gap-2">
                        <Checkbox
                            id={platform}
                            checked={isSelected}
                            onCheckedChange={() => togglePlatform(platform)}
                            className="mt-0.5"
                        />
                        <Label
                            htmlFor={platform}
                            className={cn(
                                "cursor-pointer text-sm font-normal leading-none",
                                isSelected ? "text-foreground" : "text-muted-foreground"
                            )}
                        >
                            {PLATFORM_LABELS[platform]}
                        </Label>
                    </div>
                );
            })}
        </div>
    );
}
