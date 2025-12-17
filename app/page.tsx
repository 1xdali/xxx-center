'use client';

import { useState } from 'react';
import { Banner, BannerFormData } from '@/types/banner';
import BannerForm from '@/components/BannerForm';
import BannerList from '@/components/BannerList';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, LayoutDashboard } from 'lucide-react';

export default function Home() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [showForm, setShowForm] = useState(false);

  const handleCreateBanner = (formData: BannerFormData) => {
    const newBanner: Banner = {
      id: Date.now().toString(),
      platforms: formData.platforms,
      platformImages: {},
      platformStatuses: {},
      isPinned: false, // 默认不固定
      isAd: formData.isAd,
      adCost: formData.adCost,
      startDate: formData.startDate || new Date(),
      endDate: formData.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    };

    // 处理每个平台的图片和状态
    formData.platforms.forEach((platform) => {
      const images = formData.platformImages[platform];
      if (images) {
        newBanner.platformImages[platform] = {
          chinese: {
            file: images.chinese.file,
            preview: images.chinese.preview,
            linkType: images.chinese.linkType,
            linkUrl: images.chinese.linkUrl,
          },
          english: {
            file: images.english.file,
            preview: images.english.preview,
            linkType: images.english.linkType,
            linkUrl: images.english.linkUrl,
          },
        };
        // 初始化平台状态：默认展示
        newBanner.platformStatuses[platform] = {
          isDisplayed: true,
        };
      }
    });

    setBanners([newBanner, ...banners]);
    setShowForm(false);
  };

  const handleUpdateBanner = (updatedBanner: Banner) => {
    setBanners(banners.map(b => b.id === updatedBanner.id ? updatedBanner : b));
  };

  const handleEditBanner = (banner: Banner) => {
    console.log('Edit banner:', banner);
    alert('编辑功能演示中（Demo模式）');
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm('确定要删除这个横幅吗？')) {
      setBanners(banners.filter((b) => b.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold">横幅管理系统</h1>
                <p className="text-xs text-muted-foreground">
                  多平台横幅投放管理
                </p>
              </div>
            </div>
            {!showForm && (
              <Button onClick={() => setShowForm(true)}>
                <Plus className="w-4 h-4 mr-1" />
                创建新横幅
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">总横幅数</p>
              <p className="text-3xl font-bold">{banners.length}</p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">广告横幅</p>
              <p className="text-3xl font-bold text-amber-600">
                {banners.filter((b) => b.isAd).length}
              </p>
            </div>
          </Card>
          <Card className="p-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">广告总费用</p>
              <p className="text-3xl font-bold text-green-600">
                ¥
                {banners
                  .filter((b) => b.isAd && b.adCost)
                  .reduce((sum, b) => sum + (b.adCost || 0), 0)
                  .toFixed(2)}
              </p>
            </div>
          </Card>
        </div>

        {/* Form or List */}
        {showForm ? (
          <Card className="p-8">
            <BannerForm
              onSubmit={handleCreateBanner}
              onCancel={() => setShowForm(false)}
            />
          </Card>
        ) : (
          <BannerList
            banners={banners}
            onEdit={handleEditBanner}
            onDelete={handleDeleteBanner}
            onUpdateBanner={handleUpdateBanner}
          />
        )}
      </main>
    </div>
  );
}
