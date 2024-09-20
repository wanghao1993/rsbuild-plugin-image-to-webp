import { defineConfig } from '@rsbuild/core';
import { RsPluginImageToWebp } from '../src';

export default defineConfig({
  html: {
    template: './index.html',
  },
  plugins: [
    RsPluginImageToWebp({
      exclude: ['src'],
    }),
  ],
});
