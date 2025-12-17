'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageConfig, LinkType } from '@/types/banner';
import { Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ImageUploadWithLinkProps {
    id: string; // 唯一标识，用于区分不同的配置模块
    label: string;
    value: ImageConfig;
    onChange: (config: ImageConfig) => void;
}

export default function ImageUploadWithLink({
    id,
    label,
    value,
    onChange,
}: ImageUploadWithLinkProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleFileSelect = (file: File | null) => {
        if (!file) {
            onChange({
                ...value,
                file: null,
                preview: null,
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            onChange({
                ...value,
                file,
                preview: reader.result as string,
            });
        };
        reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleFileSelect(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    return (
        <div className="space-y-3">
            <Label className="text-sm font-medium">{label}</Label>

            {/* Image Upload */}
            <div
                onDrop={handleDrop}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                className={cn(
                    'relative border-2 border-dashed rounded-lg transition-colors cursor-pointer overflow-hidden',
                    isDragging ? 'drop-zone-active' : 'border-gray-200 hover:border-gray-300',
                    value.preview ? 'aspect-video' : 'h-32'
                )}
            >
                {value.preview ? (
                    <div className="relative w-full h-full group">
                        <img
                            src={value.preview}
                            alt={label}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleFileSelect(null);
                                }}
                            >
                                <X className="w-4 h-4 mr-1" />
                                移除
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center h-full cursor-pointer">
                        <Upload className={cn('w-6 h-6 mb-1', isDragging ? 'text-primary' : 'text-gray-400')} />
                        <p className="text-xs text-gray-600">
                            {isDragging ? '松开上传' : '点击或拖拽上传'}
                        </p>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleInputChange}
                            className="hidden"
                        />
                    </label>
                )}
            </div>

            {value.file && (
                <p className="text-xs text-muted-foreground">
                    {value.file.name} ({(value.file.size / 1024).toFixed(2)} KB)
                </p>
            )}

            {/* Link Configuration - Compact Design */}
            <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">跳转链接</Label>

                {/* Link Type - Radio Buttons */}
                <div className="flex items-center gap-4 text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name={`link-type-${id}`}
                            checked={value.linkType === LinkType.INTERNAL}
                            onChange={() => onChange({ ...value, linkType: LinkType.INTERNAL })}
                            className="w-4 h-4 text-primary"
                        />
                        <span className={value.linkType === LinkType.INTERNAL ? 'font-medium' : 'text-muted-foreground'}>
                            内部链接
                        </span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="radio"
                            name={`link-type-${id}`}
                            checked={value.linkType === LinkType.EXTERNAL}
                            onChange={() => onChange({ ...value, linkType: LinkType.EXTERNAL })}
                            className="w-4 h-4 text-primary"
                        />
                        <span className={value.linkType === LinkType.EXTERNAL ? 'font-medium' : 'text-muted-foreground'}>
                            外部链接
                        </span>
                    </label>
                </div>

                <Input
                    type="text"
                    placeholder={
                        value.linkType === LinkType.INTERNAL
                            ? '例如: /products/123'
                            : '例如: https://example.com'
                    }
                    value={value.linkUrl}
                    onChange={(e) =>
                        onChange({ ...value, linkUrl: e.target.value })
                    }
                    className="text-sm"
                />
            </div>
        </div>
    );
}
