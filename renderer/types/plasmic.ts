export interface ImageMeta {
  width: number;
  height: number;
}

export interface Asset {
  url: string;
  name: string;
  size: number;
  mimetype: string;
  imageMeta: ImageMeta;
}

export interface SharedMeta {
  id: string;
  createdAt: string;
  updatedAt: string;
  identifier: string | null;
}
