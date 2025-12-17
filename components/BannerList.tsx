'use client';

import { useState } from 'react';
import { Banner, BannerPlatform, PLATFORM_LABELS, LinkType } from '@/types/banner';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit2, Trash2, ExternalLink, Link2, Pin } from 'lucide-react';
import { format } from 'date-fns';

interface BannerListProps {
    banners: Banner[];
    onEdit: (banner: Banner) => void;
    onDelete: (id: string) => void;
    onUpdateBanner: (banner: Banner) => void;
}

export default function BannerList({ banners, onEdit, onDelete, onUpdateBanner }: BannerListProps) {
    const isActive = (banner: Banner) => {
        const now = new Date();
        return now >= banner.startDate && now <= banner.endDate;
    };

    const togglePlatformDisplay = (banner: Banner, platform: BannerPlatform) => {
        const updatedBanner = { ...banner };
        if (updatedBanner.platformStatuses[platform]) {
            updatedBanner.platformStatuses[platform]!.isDisplayed =
                !updatedBanner.platformStatuses[platform]!.isDisplayed;
            onUpdateBanner(updatedBanner);
        }
    };

    const toggleBannerPin = (banner: Banner) => {
        const updatedBanner = { ...banner, isPinned: !banner.isPinned };
        onUpdateBanner(updatedBanner);
    };

    if (banners.length === 0) {
        return (
            <div className="text-center py-12 text-muted-foreground">
                <p className="text-sm">暂无横幅，点击上方按钮创建</p>
            </div>
        );
    }

    // 所有可能的平台
    const allPlatforms = Object.values(BannerPlatform);

    return (
        <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
                <thead className="bg-muted/50">
                    <tr className="border-b">
                        <th className="text-center p-3 font-medium w-12">序号</th>
                        <th className="text-left p-3 font-medium w-24">平台</th>
                        <th className="text-left p-3 font-medium">图片预览(中)</th>
                        <th className="text-left p-3 font-medium">链接(中)</th>
                        <th className="text-left p-3 font-medium">图片预览(英)</th>
                        <th className="text-left p-3 font-medium">链接(英)</th>
                        <th className="text-center p-3 font-medium">平台展示</th>
                        <th className="text-left p-3 font-medium">生效时间</th>
                        <th className="text-center p-3 font-medium">固定</th>
                        <th className="text-right p-3 font-medium">操作</th>
                    </tr>
                </thead>
                <tbody>
                    {banners.map((banner, index) => {
                        const active = isActive(banner);
                        // 使用通用配置的图片
                        const images = banner.defaultImages;

                        return (
                            <tr key={banner.id} className="border-b hover:bg-muted/30 transition-colors">
                                {/* Index */}
                                <td className="p-3 align-top text-center">
                                    <span className="text-xs font-medium text-muted-foreground">{index + 1}</span>
                                </td>

                                {/* Platform Badges - Narrower */}
                                <td className="p-3 align-top">
                                    <div className="flex flex-col gap-1">
                                        {banner.platforms.map((platform) => (
                                            <Badge key={platform} variant="outline" className="text-[10px] px-1 py-0 h-5 whitespace-nowrap">
                                                {PLATFORM_LABELS[platform].split('(')[0].replace('老版移动端', '老版').replace('新 ', '')}
                                            </Badge>
                                        ))}
                                    </div>
                                </td>

                                {/* Chinese Image */}
                                <td className="p-3 align-top">
                                    {images?.chinese.preview ? (
                                        <div className="relative group">
                                            <img
                                                src={images.chinese.preview}
                                                alt="中文"
                                                className="w-24 h-14 object-cover rounded border"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                                <span className="text-white text-xs">中文版</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">-</span>
                                    )}
                                </td>

                                {/* Chinese Link */}
                                <td className="p-3 align-top">
                                    {images?.chinese.linkUrl ? (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-[150px]">
                                            {images.chinese.linkType === LinkType.INTERNAL ? (
                                                <Link2 className="w-3 h-3 flex-shrink-0" />
                                            ) : (
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{images.chinese.linkUrl}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">-</span>
                                    )}
                                </td>

                                {/* English Image */}
                                <td className="p-3 align-top">
                                    {images?.english.preview ? (
                                        <div className="relative group">
                                            <img
                                                src={images.english.preview}
                                                alt="EN"
                                                className="w-24 h-14 object-cover rounded border"
                                            />
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                                                <span className="text-white text-xs">English</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">-</span>
                                    )}
                                </td>

                                {/* English Link */}
                                <td className="p-3 align-top">
                                    {images?.english.linkUrl ? (
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground max-w-[150px]">
                                            {images.english.linkType === LinkType.INTERNAL ? (
                                                <Link2 className="w-3 h-3 flex-shrink-0" />
                                            ) : (
                                                <ExternalLink className="w-3 h-3 flex-shrink-0" />
                                            )}
                                            <span className="truncate">{images.english.linkUrl}</span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-muted-foreground">-</span>
                                    )}
                                </td>

                                {/* Platform Display Controls - Show ALL platforms */}
                                <td className="p-3 align-top">
                                    <div className="flex flex-col gap-2">
                                        {allPlatforms.map((platform) => {
                                            const status = banner.platformStatuses[platform];
                                            const isDeployed = banner.platforms.includes(platform);

                                            return (
                                                <div key={platform} className="flex items-center gap-2">
                                                    <Switch
                                                        checked={isDeployed && (status?.isDisplayed ?? false)}
                                                        onCheckedChange={() => isDeployed && togglePlatformDisplay(banner, platform)}
                                                        disabled={!isDeployed}
                                                        className="scale-90 data-[state=checked]:bg-green-600"
                                                    />
                                                    <span className={`text-xs whitespace-nowrap ${!isDeployed ? 'text-muted-foreground/50' : 'text-muted-foreground'}`}>
                                                        {PLATFORM_LABELS[platform].split('(')[0]}:{' '}
                                                        {!isDeployed ? '未投放' : (status?.isDisplayed ? '展示' : '不展示')}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </td>

                                {/* Date Range */}
                                <td className="p-3 align-top">
                                    <div className="text-xs text-muted-foreground whitespace-nowrap space-y-1">
                                        <div>{format(banner.startDate, 'yyyy-MM-dd')}</div>
                                        <div>至 {format(banner.endDate, 'yyyy-MM-dd')}</div>
                                        {banner.isAd && (
                                            <div className="text-amber-600 font-medium">
                                                ¥{banner.adCost?.toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </td>

                                {/* Pin Status */}
                                <td className="p-3 align-top text-center">
                                    <Button
                                        variant={banner.isPinned ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => toggleBannerPin(banner)}
                                        className="h-8 w-16"
                                    >
                                        <Pin className={`w-3 h-3 ${banner.isPinned ? 'fill-current' : ''}`} />
                                    </Button>
                                </td>

                                {/* Actions */}
                                <td className="p-3 align-top">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onEdit(banner)}
                                            className="h-7 px-2"
                                        >
                                            <Edit2 className="w-3 h-3" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => onDelete(banner.id)}
                                            className="h-7 px-2"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
