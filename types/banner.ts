export enum BannerPlatform {
  OLD_MOBILE = 'old_mobile', // 老版移动端 (Android & iOS & H5)
  PC = 'pc',
  NEW_ANDROID = 'new_android',
  NEW_IOS = 'new_ios',
  NEW_H5 = 'new_h5',
}

export enum LinkType {
  INTERNAL = 'internal',
  EXTERNAL = 'external',
}

export interface ImageConfig {
  file: File | null;
  preview: string | null;
  linkType: LinkType;
  linkUrl: string;
}

export interface PlatformImages {
  chinese: ImageConfig;
  english: ImageConfig;
}

export interface PlatformStatus {
  isDisplayed: boolean; // 该平台是否展示此横幅
}

export interface Banner {
  id: string;
  platforms: BannerPlatform[];
  // 通用配置（用于 BannerList 显示）
  defaultImages: PlatformImages;
  // 每个平台可能有不同的图片配置
  platformImages: {
    [BannerPlatform.OLD_MOBILE]?: PlatformImages;
    [BannerPlatform.PC]?: PlatformImages;
    [BannerPlatform.NEW_ANDROID]?: PlatformImages;
    [BannerPlatform.NEW_IOS]?: PlatformImages;
    [BannerPlatform.NEW_H5]?: PlatformImages;
  };
  // 每个平台的展示状态
  platformStatuses: {
    [BannerPlatform.OLD_MOBILE]?: PlatformStatus;
    [BannerPlatform.PC]?: PlatformStatus;
    [BannerPlatform.NEW_ANDROID]?: PlatformStatus;
    [BannerPlatform.NEW_IOS]?: PlatformStatus;
    [BannerPlatform.NEW_H5]?: PlatformStatus;
  };
  isPinned: boolean; // 整个横幅是否固定
  isAd: boolean;
  adCost?: number;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
}

export interface BannerFormData {
  platforms: BannerPlatform[];
  platformImages: {
    [key in BannerPlatform]?: PlatformImages;
  };
  isAd: boolean;
  adCost?: number;
  startDate: Date | null;
  endDate: Date | null;
}

export const PLATFORM_LABELS: Record<BannerPlatform, string> = {
  [BannerPlatform.OLD_MOBILE]: '老版移动端(Android & iOS & H5)',
  [BannerPlatform.PC]: '新 PC',
  [BannerPlatform.NEW_ANDROID]: '新 Android',
  [BannerPlatform.NEW_IOS]: '新 iOS',
  [BannerPlatform.NEW_H5]: '新 H5',
};

export const PLATFORM_SUBABELS: Record<BannerPlatform, string> = {
  [BannerPlatform.OLD_MOBILE]: 'Android & iOS & H5',
  [BannerPlatform.PC]: '桌面网页',
  [BannerPlatform.NEW_ANDROID]: 'Android 新版',
  [BannerPlatform.NEW_IOS]: 'iOS 新版',
  [BannerPlatform.NEW_H5]: 'H5 新版',
};
