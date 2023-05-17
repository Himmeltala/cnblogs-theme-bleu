import request from "./use-axios";
import { strToDOM, AlbumnTransform, MarkListTransform } from "@/transform";

/**
 * 获取所有标签列表
 */
export async function getMarkList() {
  const { data } = await request.get(`/tag`);
  return MarkListTransform.toMarkList(strToDOM(data));
}

/**
 * 获取相册照片
 *
 * @param id 相册照片 ID
 */
export async function getAlbumnItem(id: string) {
  const { data } = await request.get(`/gallery/image/${id}.html`);
  return AlbumnTransform.toAlbumnItem(strToDOM(data));
}

/**
 * 获取相册下的所有照片
 */
export async function getAlbumn(id: string) {
  const { data } = await request.get(`/gallery/${id}.html`);
  return AlbumnTransform.toAlbumn(strToDOM(data));
}
