import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import JavaScriptObfuscator from 'javascript-obfuscator';
import CleanCSS from 'clean-css';

const require = createRequire(import.meta.url);
const { CSP_POLICY } = require('./csp-policy.js');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mapsDir = path.join(__dirname, 'maps');

const obfuscatorOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: false,
  disableConsoleOutput: false,
  identifierNamesGenerator: 'hexadecimal',
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  splitStrings: true,
  splitStringsChunkLength: 5,
  stringArray: true,
  stringArrayCallsTransform: true,
  stringArrayEncoding: ['base64'],
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
  sourceMap: true,
  sourceMapMode: 'separate',
  sourceMapSourcesMode: 'sources-content',
};

function ensureMapsDir() {
  if (!fs.existsSync(mapsDir)) {
    fs.mkdirSync(mapsDir, { recursive: true });
  }
}

function stripSourceMapComment(code) {
  return code.replace(/\n?\/\/# sourceMappingURL=.*$/m, '').trimEnd() + '\n';
}

function ensureStrictMode(source) {
  if (/^\s*(?:'use strict'|"use strict")\s*;/.test(source)) {
    return source;
  }
  return `'use strict';\n\n${source}`;
}

function buildJavaScript() {
  const inputPath = path.join(__dirname, 'script.js');
  const outputPath = path.join(__dirname, 'script.min.js');
  const mapPath = path.join(mapsDir, 'script.min.js.map');

  const source = ensureStrictMode(fs.readFileSync(inputPath, 'utf8'));
  const result = JavaScriptObfuscator.obfuscate(source, {
    ...obfuscatorOptions,
    inputFileName: 'script.js',
    sourceMapFileName: path.basename(mapPath),
  });

  const obfuscatedCode = result.getObfuscatedCode();
  const sourceMap = result.getSourceMap();

  fs.writeFileSync(mapPath, sourceMap, 'utf8');
  fs.writeFileSync(outputPath, stripSourceMapComment(obfuscatedCode), 'utf8');

  console.log('Built script.min.js');
  console.log('Source map: maps/script.min.js.map');
}

function buildStylesheet() {
  const inputPath = path.join(__dirname, 'style.css');
  const outputPath = path.join(__dirname, 'style.min.css');
  const mapPath = path.join(mapsDir, 'style.min.css.map');

  const source = fs.readFileSync(inputPath, 'utf8');
  const result = new CleanCSS({
    level: 2,
    sourceMap: true,
    sourceMapInlineSources: true,
  }).minify(source);

  if (result.errors.length) {
    throw new Error(`CSS minify failed: ${result.errors.join(', ')}`);
  }

  const mapPayload = typeof result.sourceMap === 'string'
    ? result.sourceMap
    : JSON.stringify(result.sourceMap);

  fs.writeFileSync(mapPath, mapPayload, 'utf8');
  fs.writeFileSync(outputPath, `${result.styles}\n`, 'utf8');

  console.log('Built style.min.css');
  console.log('Source map: maps/style.min.css.map');
}

function syncCsp() {
  const headersPath = path.join(__dirname, '_headers');
  const indexPath = path.join(__dirname, 'index.html');

  const headersContent =
    '/*\n' +
    `  Content-Security-Policy: ${CSP_POLICY}\n` +
    '  X-Frame-Options: DENY\n' +
    '  X-Content-Type-Options: nosniff\n' +
    '  Referrer-Policy: no-referrer-when-downgrade\n';

  fs.writeFileSync(headersPath, headersContent, 'utf8');

  const indexHtml = fs.readFileSync(indexPath, 'utf8');
  const updatedIndex = indexHtml.replace(
    /<meta http-equiv="Content-Security-Policy" content="[^"]*" \/>/,
    `<meta http-equiv="Content-Security-Policy" content="${CSP_POLICY}" />`
  );
  fs.writeFileSync(indexPath, updatedIndex, 'utf8');

  console.log('Synced CSP to index.html and _headers');
}

ensureMapsDir();
buildJavaScript();
buildStylesheet();
syncCsp();
console.log('Build complete.');
