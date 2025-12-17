'use client';

import { useState, useEffect } from 'react';
import { BannerPlatform, BannerFormData, ImageConfig, LinkType, PLATFORM_LABELS, PlatformImages } from '@/types/banner';
import PlatformSelector from './PlatformSelector';
import ImageUploadWithLink from './ImageUpload';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { DollarSign } from 'lucide-react';

interface BannerFormProps {
    onSubmit: (data: BannerFormData) => void;
    onCancel: () => void;
}

const createEmptyImageConfig = (): ImageConfig => ({
    file: null,
    preview: null,
    linkType: LinkType.EXTERNAL,
    linkUrl: '',
});

const createEmptyPlatformImages = (): PlatformImages => ({
    chinese: createEmptyImageConfig(),
    english: createEmptyImageConfig(),
});

export default function BannerForm({ onSubmit, onCancel }: BannerFormProps) {
    const [platforms, setPlatforms] = useState<BannerPlatform[]>([]);

    // 通用配置（永久显示）
    const [defaultChineseImage, setDefaultChineseImage] = useState<ImageConfig>(createEmptyImageConfig());
    const [defaultEnglishImage, setDefaultEnglishImage] = useState<ImageConfig>(createEmptyImageConfig());

    // 记录哪些平台使用通用配置（默认全部使用）
    const [platformsUsingDefault, setPlatformsUsingDefault] = useState<Set<BannerPlatform>>(new Set());

    // 每个平台的独立配置
    const [platformImages, setPlatformImages] = useState<{
        [key in BannerPlatform]?: PlatformImages;
    }>({});

    const [isAd, setIsAd] = useState(false);
    const [adCost, setAdCost] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    // 当平台改变时，更新使用默认配置的平台集合
    useEffect(() => {
        setPlatformsUsingDefault(new Set(platforms));
    }, [platforms]);

    const togglePlatformUsingDefault = (platform: BannerPlatform) => {
        const newSet = new Set(platformsUsingDefault);
        if (newSet.has(platform)) {
            newSet.delete(platform);
            // 初始化该平台的独立配置
            if (!platformImages[platform]) {
                setPlatformImages(prev => ({
                    ...prev,
                    [platform]: createEmptyPlatformImages(),
                }));
            }
        } else {
            newSet.add(platform);
        }
        setPlatformsUsingDefault(newSet);
    };

    const updatePlatformImage = (
        platform: BannerPlatform,
        language: 'chinese' | 'english',
        config: ImageConfig
    ) => {
        setPlatformImages((prev) => ({
            ...prev,
            [platform]: {
                ...prev[platform]!,
                [language]: config,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalPlatformImages: BannerFormData['platformImages'] = {};

        platforms.forEach((platform) => {
            if (platformsUsingDefault.has(platform)) {
                // 使用通用配置
                finalPlatformImages[platform] = {
                    chinese: defaultChineseImage,
                    english: defaultEnglishImage,
                };
            } else {
                // 使用平台独立配置
                finalPlatformImages[platform] = platformImages[platform]!;
            }
        });

        const formData: BannerFormData = {
            platforms,
            platformImages: finalPlatformImages,
            isAd,
            adCost: isAd && adCost ? parseFloat(adCost) : undefined,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        };

        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Universal Configuration - Always Visible */}
            <div className="flex items-start gap-6">
                <Label className="text-sm font-medium w-20 pt-2 text-right">通用配置</Label>
                <div className="flex-1 grid md:grid-cols-2 gap-3">
                    <Card className="p-3">
                        <ImageUploadWithLink
                            label="中文版"
                            value={defaultChineseImage}
                            onChange={setDefaultChineseImage}
                        />
                    </Card>
                    <Card className="p-3">
                        <ImageUploadWithLink
                            label="英文版"
                            value={defaultEnglishImage}
                            onChange={setDefaultEnglishImage}
                        />
                    </Card>
                </div>
            </div>

            {/* Platform Selection */}
            <div className="flex items-start gap-6">
                <Label className="text-sm font-medium w-20 pt-2 text-right">投放平台</Label>
                <div className="flex-1">
                    <PlatformSelector selectedPlatforms={platforms} onChange={setPlatforms} />
                    {platforms.length === 0 && (
                        <p className="text-xs text-red-500 mt-1">* 请至少选择一个平台</p>
                    )}
                </div>
            </div>

            {/* Platform-specific configuration options (only show when platforms are selected) */}
            {platforms.length > 0 && (
                <>
                    {/* Platform-specific configuration selector */}
                    <div className="flex items-start gap-6">
                        <Label className="text-sm font-medium w-20 pt-2 text-right">是否使用通用配置</Label>
                        <div className="flex-1 flex flex-wrap gap-4">
                            {platforms.map((platform) => (
                                <div key={platform} className="flex items-center gap-2">
                                    <Switch
                                        id={`use-default-${platform}`}
                                        checked={platformsUsingDefault.has(platform)}
                                        onCheckedChange={() => togglePlatformUsingDefault(platform)}
                                        className="data-[state=checked]:bg-green-600"
                                    />
                                    <Label
                                        htmlFor={`use-default-${platform}`}
                                        className="text-sm cursor-pointer font-normal"
                                    >
                                        {PLATFORM_LABELS[platform]}: {platformsUsingDefault.has(platform) ? 'ON' : 'OFF'}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Platform-specific configurations (only show for platforms not using default) */}
                    {platforms.filter(p => !platformsUsingDefault.has(p)).map((platform) => (
                        <div key={platform} className="flex items-start gap-6">
                            <Label className="text-sm font-medium w-20 pt-2 text-right">
                                {PLATFORM_LABELS[platform]}
                            </Label>
                            <div className="flex-1 grid md:grid-cols-2 gap-3">
                                <Card className="p-3">
                                    <ImageUploadWithLink
                                        label="中文版"
                                        value={platformImages[platform]?.chinese || createEmptyImageConfig()}
                                        onChange={(config) => updatePlatformImage(platform, 'chinese', config)}
                                    />
                                </Card>
                                <Card className="p-3">
                                    <ImageUploadWithLink
                                        label="英文版"
                                        value={platformImages[platform]?.english || createEmptyImageConfig()}
                                        onChange={(config) => updatePlatformImage(platform, 'english', config)}
                                    />
                                </Card>
                            </div>
                        </div>
                    ))}
                </>
            )}

            {/* Advertisement */}
            <div className="flex items-start gap-6">
                <Label className="text-sm font-medium w-20 pt-2 text-right">广告设置</Label>
                <div className="flex-1 space-y-2">
                    <div className="flex items-start gap-2">
                        <Checkbox
                            id="isAd"
                            checked={isAd}
                            onCheckedChange={(checked) => setIsAd(checked as boolean)}
                            className="mt-0.5"
                        />
                        <Label htmlFor="isAd" className="text-sm cursor-pointer font-normal leading-none">
                            这是一个广告横幅
                        </Label>
                    </div>

                    {isAd && (
                        <div className="relative max-w-xs">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                                id="adCost"
                                type="number"
                                value={adCost}
                                onChange={(e) => setAdCost(e.target.value)}
                                placeholder="广告费用"
                                step="0.01"
                                min="0"
                                className="pl-10"
                                required={isAd}
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Date Range */}
            <div className="flex items-start gap-6">
                <Label className="text-sm font-medium w-20 pt-2 text-right">生效日期</Label>
                <div className="flex-1 grid md:grid-cols-2 gap-3 max-w-lg">
                    <Input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        placeholder="开始日期"
                    />
                    <Input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate}
                        placeholder="结束日期"
                    />
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-6 pt-2">
                <div className="w-20"></div>
                <div className="flex-1 flex gap-3">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        取消
                    </Button>
                    <Button type="submit" disabled={platforms.length === 0}>
                        创建横幅
                    </Button>
                </div>
            </div>
        </form>
    );
}
