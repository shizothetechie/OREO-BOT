import fs, { existsSync, watch } from 'fs';
import { join, resolve } from 'path';
import * as os from 'os';
import syntaxerror from 'syntax-error';
import importFile from './import.js';
import Helper from './helper.js';

const __dirname = Helper.__dirname(import.meta);
const rootDirectory = Helper.__dirname(join(__dirname, '../'));
const componentFolder = Helper.__dirname(join(__dirname, '../components'));
const componentFilter = filename => /\.(mc)?js$/.test(filename);
const ignoreList = ['node_modules', '.git'];
const shouldIgnore = path => {
  return ignoreList.some(ignore => path.includes(ignore));
};

let watcher = {},
    components = {},
    componentFolders = [];

async function loadComponentFiles(
  componentFolder = componentFolder,
  componentFilter = componentFilter,
  opts = { recursiveRead: false }
) {
  const folder = resolve(componentFolder);
  if (folder in watcher) return;
  componentFolders.push(folder);
  const paths = await fs.promises.readdir(componentFolder);
  await Promise.all(paths.map(async path => {
    const resolved = join(folder, path);
    if (shouldIgnore(resolved)) return;
    const dirname = Helper.__filename(resolved, true);
    const formatedFilename = formatFilename(resolved);
    try {
      const stats = await fs.promises.lstat(dirname);
      if (!stats.isFile()) {
        if (opts.recursiveRead) await loadComponentFiles(dirname, componentFilter, opts);
        return;
      }
      const filename = Helper.__filename(resolved);
      const isValidFile = componentFilter(filename);
      if (!isValidFile) return;
      const module = await importFile(filename);
      if (module) components[formatedFilename] = module;
    } catch (e) {
      opts.logger?.error(e, `error while requiring ${formatedFilename}`);
      delete components[formatedFilename];
    }
  }));
  const watching = watch(folder, reload.bind(null, {
    logger: opts.logger,
    componentFolder,
    componentFilter
  }));
  watching.on('close', () => deleteComponentFolder(folder, true));
  watcher[folder] = watching;
  return components = sortedComponents(components);
}
function deleteComponentFolder(folder, isAlreadyClosed = false) {
  const resolved = resolve(folder);
  if (!(resolved in watcher)) return;
  if (!isAlreadyClosed) watcher[resolved].close();
  delete watcher[resolved];
  componentFolders.splice(componentFolders.indexOf(resolved), 1);
}
async function reload({
  logger,
  componentFolder = componentFolder,
  componentFilter = componentFilter
}, _ev, filename) {
  const file = Helper.__filename(join(componentFolder, filename), true);
  if (shouldIgnore(file)) return;
  const formatedFilename = formatFilename(file);
  if (componentFilter(filename)) {
    if (formatedFilename in components) {
      if (existsSync(file)) logger?.info(`updated component - '${formatedFilename}'`);
      else {
        logger?.warn(`deleted component - '${formatedFilename}'`);
        return delete components[formatedFilename];
      }
    } else logger?.info(`new component - '${formatedFilename}'`);
    const src = await fs.promises.readFile(file);
    let err = syntaxerror(src, filename, {
      sourceType: 'module',
      allowAwaitOutsideFunction: true
    });
    if (err) logger?.error(err, `syntax error while loading '${formatedFilename}'`);
    else try {
      const module = await importFile(file);
      if (module) components[formatedFilename] = module;
    } catch (e) {
      logger?.error(e, `error require component '${formatedFilename}'`);
      delete components[formatedFilename];
    } finally {
      components = sortedComponents(components);
    }
  }
}
function formatFilename(filename) {
  let dir = join(rootDirectory, './');
  if (os.platform() === 'win32') dir = dir.replace(/\\/g, '\\\\');
  const regex = new RegExp(`^${dir}`);
  const formated = filename.replace(regex, '');
  return formated;
}
function sortedComponents(components) {
  return Object.fromEntries(Object.entries(components).sort(([a], [b]) => a.localeCompare(b)));
}

export {
  componentFolder,
  componentFilter,
  components,
  watcher,
  componentFolders,
  loadComponentFiles,
  deleteComponentFolder,
  reload
};