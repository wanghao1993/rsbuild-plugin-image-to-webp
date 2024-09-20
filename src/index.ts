import type { RsbuildPlugin } from '@rsbuild/core';
import {
  convertImageToWebp,
  findUsedImages,
  replaceImagePathsInFiles,
} from './help.ts';
export interface ConvertToWebPPluginOptions {
  quality: number;
  exclude: string[];
  reg: RegExp;
}

const defaultOption = {
  quality: 80,
  exclude: ['node_modules'],
  reg: /['"(](.*?\.(png|jpg|jpeg))['")]/gi,
};

export const RsPluginImageToWebp = (
  options: Partial<ConvertToWebPPluginOptions> = defaultOption,
): RsbuildPlugin => {
  const mergedOptions = Object.assign(defaultOption, options);

  return {
    name: 'rsbuild-plugin-image-to-webp',

    setup(api) {
      api.onAfterBuild(async () => {
        const usedImagePath = await findUsedImages(
          api.context.distPath,
          mergedOptions,
        );
        // biome-ignore lint/complexity/noForEach: <explanation>
        usedImagePath.forEach((img) => {
          convertImageToWebp(img, mergedOptions);
        });

        // await replaceImagePathsInFiles(api.context.distPath, mergedOptions);
      });
    },
  };
};
