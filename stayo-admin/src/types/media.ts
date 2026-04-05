export interface MediaFile {
  id: string;
  label: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  isPrimary?: boolean;
  url: string;
}
