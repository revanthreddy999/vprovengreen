import { apiRequest } from "./client";
import type { PropertyItem } from "../../types/property";

export async function getProperties(): Promise<PropertyItem[]> {
  return apiRequest<PropertyItem[]>("/admin/properties");
}