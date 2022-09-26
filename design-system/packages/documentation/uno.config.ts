import { presetCore, presetThemeDefault } from '@picker-ui/core'
import {
  defineConfig,
  presetIcons,
  presetUno,
  transformerDirectives,
  transformerVariantGroup,
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({
      scale: 1.2,
      unit: 'em',
      extraProperties: {
        'height': '1.2em',
        'width': '1.2em',

        // ℹ️ We are experimenting with `vertical-align` align property at the moment
        // ℹ️ We also have to find a way to inject this without this config. (e.g. [class^=i-])
        'vertical-align': 'bottom',
        'flex-shrink': '0',
        'display': 'inline-block',

        // We need to center the icon
        'margin-block': '0.15em',
      },
    }),

    // anu-vue presets
    presetCore(),
    presetThemeDefault(),
  ],
  transformers: [
    transformerVariantGroup(),
    transformerDirectives(),
  ],
  configDeps: ['../ui/src/presets/theme-default/index.ts'],
  include: [/.*\/picker-ui\.js(.*)?$/, './**/*.vue', './**/*.md'],
}) as any
