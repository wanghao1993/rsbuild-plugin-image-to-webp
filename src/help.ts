import fs from 'fs-extra';
import { glob } from 'glob';

import path from 'node:path';
import sharp from 'sharp';
import type { ConvertToWebPPluginOptions } from './index.ts';
/**
 * 将指定路径下的图片转换为 WebP 格式
 * @param path 要转换的图片的路径，支持使用 glob 模式匹配多个文件
 * @throws {Error} 如果指定的路径不存在，则抛出错误
 * @returns {Promise<void>} 转换完成后的 Promise
 */
export async function convertImageToWebp(
  path: string,
  options: ConvertToWebPPluginOptions,
): Promise<void> {
  // 查找所有 PNG、JPG 和 JPEG 图片
  const imgPath = glob.sync(`${path}`);
  if (imgPath.length) {
    const webpPath = imgPath[0].replace(options.reg, '.webp');

    // 转换图片为 WebP
    await sharp(imgPath[0])
      .toFormat('webp')
      .webp({ quality: options.quality || 80 })
      .toFile(webpPath);

    console.log(`Converted: ${imgPath[0]} -> ${webpPath}`);
  } else {
    throw Error('path is not exist');
  }
}

// 1. 查找 HTML/CSS/JS 中引用的图片路径
export async function findUsedImages(
  dir: string,
  options: ConvertToWebPPluginOptions,
): Promise<string[]> {
  const textFiles = glob.sync(`${dir}/**/*.{html,css,js}`, {
    ignore: options.exclude,
  });

  const imgSet = new Set<string>();

  const imgRegex = options.reg;

  for (const filePath of textFiles) {
    const content = await fs.readFile(filePath, 'utf8');

    const match = imgRegex.exec(content);
    while (match !== null) {
      const imgPath = match[1];
      imgSet.add(path.join(dir, imgPath));
    }
  }

  return Array.from(imgSet);
}
// 3. 替换项目中的图片路径
export async function replaceImagePathsInFiles(
  dir: string,
  options: ConvertToWebPPluginOptions,
) {
  const textFiles = glob.sync(`${dir}/**/*.{html,css,js}`);

  console.log(textFiles, 'xxxx');
  for (const filePath of textFiles) {
    let content = await fs.readFile(filePath, 'utf8');

    // 替换图片路径为 .webp
    content = content.replace(options.reg, '.webp');

    await fs.writeFile(filePath, content, 'utf8');
    console.log(`Updated image paths in: ${filePath}`);
  }
}
