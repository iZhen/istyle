process.env.NODE_ENV = 'production';

const postcss = require('postcss');
const glob = require('glob');
const path = require('path');
const fs = require('fs-extra');
const cssnano = require('cssnano');
const plugins = require('./plugins').concat([
  cssnano({
    preset: ['default', {
      discardComments: {
        removeAll: true,
      },
    }],
  }),
]);

const srcPath = path.join(__dirname, '../src/site');
const distPath = path.join(__dirname, '../dist');
const files = glob.sync('**/main.css', {
  cwd: srcPath,
});

fs.removeSync(distPath);
files.forEach((filepath) => {
  const output = `${path.dirname(filepath)}.css`;
  const full = {
    from: path.join(srcPath, filepath),
    to: path.join(distPath, output),
  };

  fs.readFile(full.from, 'utf8').then((css) => {
    postcss(plugins).process(css, full)
    .then(result => {
      process.stdout.write(` [\x1b[32m${'done'}\x1b[0m] \x1b[33m/${output}\x1b[0m\n`);
      fs.outputFile(full.to, result.css, () => true);
      if (result.map) {
        fs.outputFile(`${full.to}.map`, result.map, () => true);
      }
    });
  });
});
