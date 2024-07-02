/** @type {import('@maizzle/framework').Config} */

/*
|-------------------------------------------------------------------------------
| Production config                       https://maizzle.com/docs/environments
|-------------------------------------------------------------------------------
|
| This is where you define settings that optimize your emails for production.
| These will be merged on top of the base config.js, so you only need to
| specify the options that are changing.
|
*/

module.exports = {
  build: {
    templates: {
      destination: {
        path: './../assets/html-templates/maizzle-generated',
      },
    },
  },
  inlineCSS: true,
  removeUnusedCSS: {
    whitelist: [
    '.alarm-minor', 
    '.alarm-major', 
    '.alarm-critical', 
    '.alarm-resolved',
    '.bg-table-even-row',
    '.bg-table-odd-row',
  ],
  },
  shorthandCSS: true,
  prettify: true,
  events: {
    afterTransformers(html, config) {
      // After applying posthtml-safe-class-names, maizzle replaces our @{{ object.value }} with {{object_value}}
      // Let's fix it and replace them back
      const processedHtml = html.replace(/{{(.*?)_(.*?)}}/g, (match, p1, p2) => `{{${p1}.${p2}}}`);
      return processedHtml;
    }
  },
}
