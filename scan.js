/***
 * Recursively scan docs. For each directory, generate README.md containing router link to each entry in the directory.
 * Convert source code file (.proto) to markdown with code block, so that it could be recognized by VuePress.
 */

const fs = require('fs');
const path = require('path');
const insertLine = require('insert-line')
const { isBinary } = require('istextorbinary');
function scanAndGen(dirname) {
    const dirents = fs.readdirSync(dirname, { withFileTypes: true });
    const direntsName = dirents.map(dirent => dirent.name);
    const direntsNameSet = new Set(direntsName);

    const dirs = dirents.filter(dirent => dirent.isDirectory()).map(dirent => dirent.name);

    const files = dirents.filter(dirent => dirent.isFile()).map(dirent => dirent.name);
    const binaryFiles = files.filter(file => {
        const filepath = path.resolve(dirname, file);
        return isBinary(filepath, fs.readFileSync(filepath));
    })
    const binaryFilesSet = new Set(binaryFiles);
    const textFiles = files.filter(file => !binaryFilesSet.has(file));

    for (const dir of dirs) {
        scanAndGen(path.resolve(dirname, dir))
    }
    for (const file of textFiles) {
        const oldPath = path.resolve(dirname, file);
        const extname = path.extname(file);
        switch (extname) {
            case '.md':
            case '.svg':
                break;
            case '.proto':
                insertLine(oldPath).prependSync(`> ${file}\n\n\`\`\`protobuf`);
                insertLine(oldPath).appendSync('```');
                fs.renameSync(oldPath, path.resolve(dirname, file + '.md'));
                break;
            default:
                insertLine(oldPath).prependSync(`> ${file}\n\n\`\`\`${extname.substring(1)}`);
                insertLine(oldPath).appendSync('```');
                fs.renameSync(oldPath, path.resolve(dirname, file + '.md'));
                break;
        }
    }
    if (direntsNameSet.has('README.md')) {
        return;
    }
    let content = "";
    if (direntsNameSet.has('readme.md')) {
        const mdPath = path.resolve(dirname, 'readme.md');
        content = fs.readFileSync(mdPath, { encoding: 'utf-8' }) + '\n\n';
        fs.unlinkSync(mdPath);
    }

    content += direntsName.filter(direntName => !binaryFilesSet.has(direntName))
        .filter(name => name !== 'readme.md')
        .map(file =>
            `[${path.basename(file)}](${file})`
        ).join('\n\n');

    try {
        fs.writeFileSync(path.resolve(dirname, 'README.md'), content)
        console.log(path.resolve(dirname, 'README.md'));
    } catch (err) {
        console.error(err)
    }

}
const baseAddress = path.resolve(__dirname, 'docs');
const dirs = fs.readdirSync(baseAddress, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)
    .filter(name => !(['node_modules', '.vuepress', '.git'].includes(name)));

for (const dir of dirs) {
    scanAndGen(path.resolve(baseAddress, dir))
}