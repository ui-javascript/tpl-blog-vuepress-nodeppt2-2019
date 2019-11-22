/**
 * vuepress-bar
 * https://github.com/ozum/vuepress-bar/blob/master/lib/index.js
 */

const sortBy = require("lodash.sortby");
const glob = require("glob");
const markdownIt = require("markdown-it");
const meta = require("markdown-it-meta");
const { lstatSync, readdirSync, readFileSync, existsSync } = require("fs");
const { join, normalize, sep } = require("path");
const startCase = require("lodash.startcase");
const escapeRegExp = require("lodash.escaperegexp");
const slugify = require("transliteration").slugify;

// 排除读取的目录
const excludeDirectory = [".vuepress", ".nodeppt", "node_modules", ".git", ".idea", ".vscode", "static", "public", "appendix"]
const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
    readdirSync(source).filter(name => !(excludeDirectory.includes(name)) && isDirectory(join(source, name)));

const hasReadme = source =>
    readdirSync(source).findIndex(name => name === "README.md" && !isDirectory(join(source, name))) > -1;

/**
 * Translate chinese to pinyin.
 * Compatible with vuepress-pluin-permalink-pinyin.
 * @param {Array} navArr
 */
function transliteratePinyin(navArr) {
    return navArr.map(nav => {
        const result = { ...nav };
        if (nav.link) {
            result.link = slugify(nav.link, { ignore: ["/", "."] });
        }
        if (nav.items) {
            result.items = transliteratePinyin(nav.items);
        }
        return result;
    });
}

/**
 * Returns name to be used in menus after removing navigation prefix, prefix numbers used for ordering and `.`, `-`, `_` and spaces.
 *
 * @param   {string}  path                  - File path to get name for.
 * @param   {Object}  options               - Options
 * @param   {Array}  options.navPrefixArr     - Navigation order prefix if present.
 * @param   {boolean} options.stripNumbers  - Whether to strip numbers.
 * @returns {string}                        - Name to be used in navigation.
 * @example
 * getName("/some/path/nav-01-how", { navPrefixArr: "nav", stripNumbers: true }); // how
 * getName("/some/path/nav.01.how", { navPrefixArr: "nav", stripNumbers: true }); // how
 */
function getName(path, { navPrefixArr, stripNumbers } = {}) {
    let name = path.split(sep).pop();
    const argsIndex = name.lastIndexOf("--");
    if (argsIndex > -1) {
        name = name.substring(0, argsIndex);
    }


    navPrefixArr.forEach(item => {
        // "nav.001.xyz" or "nav-001.xyz" or "nav_001.xyz" or "nav 001.xyz" -> "nav"
        const pattern = new RegExp(`^${escapeRegExp(item)}[.\-_]`);
        name = name.replace(pattern, "");
    })

    if (stripNumbers) {
        // "001.guide" or "001-guide" or "001_guide" or "001 guide" -> "guide"
        name = name.replace(/^\d+[.\-_ ]?/, "");
    }

    return startCase(name);
}

// Load all MD files in a specified directory and order by metadata 'order' value
function getChildren(parent_path, dir, recursive = true, includeArticleSuffix) {
    // CREDITS: https://github.com/benjivm (from: https://github.com/vuejs/vuepress/issues/613#issuecomment-495751473)
    parent_path = normalize(parent_path);
    // Remove last / if exists.
    parent_path = parent_path.endsWith(sep) ? parent_path.slice(0, -1) : parent_path;

    const pattern = recursive ? `/**/*.md` : `/**.md`;
    const pattern_path  = parent_path + (dir ? `/${dir}` : "") + pattern

    // console.log('---------pattern_path')
    // console.log(pattern_path)

    const files = glob.sync(pattern_path).map(path => {
        // Instantiate MarkdownIt
        const md = new markdownIt();
        // Add markdown-it-meta
        md.use(meta);
        // Get the order value
        const file = readFileSync(path, "utf8");
        md.render(file);
        const order = md.meta.order;
        // Remove "parent_path" and ".md"
        path = path.slice(parent_path.length + 1, -3);
        // Remove "README", making it the de facto index page

        // console.log('-------------path')
        // console.log(path)

        if (path.endsWith("README")) {
            path = path.slice(0, -6);
        }

        return {
            path,
            // README is first if it hasn't order
            order: (path === "" && order === undefined) ? 0 : order
        };
    });

    // Return the ordered list of files, sort by 'order' then 'path'
    return sortBy(files, ["order", "path"]).map(file => file.path);
}

/**
 * Return sidebar config for given baseDir.
 *
 * @param   {String} baseDir        - Absolute path of directory to get sidebar config for.
 * @param   {Object} options        - Options
 * @param   {String} relativeDir    - Relative directory to add to baseDir
 * @param   {Number} currentLevel   - Current level of items.
 * @returns {Array.<String|Object>} - Recursion level
 */
function side(
    baseDir,
    { stripNumbers, maxLevel, navPrefixArr, skipEmptySidebar, mixDirectoriesAndFilesAlphabetically, includeArticleSuffix },
    relativeDir = "",
    currentLevel = 1
) {
    const fileLinks = getChildren(baseDir, relativeDir, currentLevel > maxLevel, includeArticleSuffix);

    if (currentLevel <= maxLevel) {
        getDirectories(join(baseDir, relativeDir))
            // 找到子目录中不是导航类型的
            .filter(subDir => !(navPrefixArr.some(item => {
                const pattern = new RegExp(`^${item}[\\d+|.|-|_]`)
                return subDir.match(pattern) != null
            })))
            .forEach(subDir => {
                const children = side(
                    baseDir,
                    { stripNumbers, maxLevel, navPrefixArr, skipEmptySidebar, includeArticleSuffix },
                    join(relativeDir, subDir),
                    currentLevel + 1
                );

                if (children.length > 0 || !skipEmptySidebar) {
                    // Where to put '02-folder' in ['01-file', { title: 'Folder-03', children: ['03-folder/file'] }]
                    // --> [
                    //  '01-file',
                    //  { title: 'Folder-02', children: ['02-folder/file'] },
                    //  { title: 'Other Folder', children: ['03-folder/file']}
                    // ]
                    const sortedFolderPosition = fileLinks.findIndex(
                        link => {
                            // console.log('---------link')
                            // console.log(subDir)
                            // console.log(link)
                            // @TODO 会报错, 一些目录没有写readme??
                            // return subDir < (link.children ? (link.children[0] || "").split(sep)[0] : link)
                            return subDir < (link.children ? "": link)
                        }
                    );

                    // console.log('----------sortedFolderPosition')
                    // console.log(sortedFolderPosition)

                    const insertPosition =
                        mixDirectoriesAndFilesAlphabetically && (sortedFolderPosition > -1 ? sortedFolderPosition : fileLinks.length);

                    // 合适位置插入分组信息
                    fileLinks.splice(insertPosition, 0, {
                        title: getName(subDir, { stripNumbers, navPrefixArr }),
                        // 获取collaspe等参数
                        ...parseSidebarParameters(subDir),
                        children
                    });
                }
            });
    }

    // console.log('--------fileLinks')
    // console.log(JSON.stringify(fileLinks))

    return fileLinks;
}

/**
 * Gets sidebar parameters from directory name. Arguments are given after double dash `--` and separated by comma.
 * - `nc` sets collapsable to `false`.
 * - `dX` sets sidebarDepth to `X`.
 *
 * @param   {String} dirname  - Name of the directory.
 * @returns {Object}          - sidebar parameters.
 * @example
 * parseSidebarParameters("docs/api--nc,d2"); { collapsable: false, sidebarDepth: 2 }
 */
function parseSidebarParameters(dirname) {
    const index = dirname.lastIndexOf("--");
    if (index === -1) {
        return {};
    }

    const args = dirname.substring(index + 2).split(",");
    const parameters = {};

    args.forEach(arg => {
        if (arg === "nc") {
            parameters.collapsable = false;
        } else if (arg.match(/d\d+/)) {
            parameters.sidebarDepth = Number(arg.substring(1));
        }
    });

    return parameters;
}

/**
 * Returns navbar configuration for given path.
 * @param   {String}          rootDir           - Path of the directory to get navbar configuration for.
 * @param   {OBject}          options           - Options
 * @param   {String}          relativeDir       - (Used internally for recursion) Relative directory to `rootDir` to get navconfig for.
 * @param   {Number}          currentNavLevel   - (Used internally for recursion) Recursion level.
 * @returns {Array.<Object>}
 */
function nav(rootDir, { navPrefixArr, stripNumbers, skipEmptyNavbar }, relativeDir = "/", currentNavLevel = 1) {
    const baseDir = join(rootDir, relativeDir);
    // @fix findIndex --> some 防止目录名 eg. 'nav.01.xxxxxnav-ch'
    const childrenDirs = getDirectories(baseDir).filter(subDir => navPrefixArr.some(item => {
        const pattern = new RegExp(`^${item}[\\d+|.|-|_]`)
        return subDir.match(pattern) != null
    }));

    // console.log('-----childrenDirs')
    // console.log(childrenDirs)
    const options = { navPrefixArr, stripNumbers, skipEmptyNavbar };
    let result;

    if (currentNavLevel > 1 && childrenDirs.length === 0) {
        // 跳过没有README的
        if (!hasReadme(baseDir)) {
            if (skipEmptyNavbar) {
                return;
            } else {
                throw new Error(`README.md file cannot be found in ${baseDir}. VuePress would return 404 for that NavBar link.`);
            }
        }

        result = {
            text: getName(baseDir, { stripNumbers, navPrefixArr }),
            // 路径分隔符替换 \\ -> /
            link: relativeDir.replace(/\\/g, "/") + "/"
        };

        // console.log('--------relativeDir')
        // console.log(relativeDir)
        // console.log(after)
        // console.log('--------result')
        // console.log(result)

    } else if (childrenDirs.length > 0) {
        const items = childrenDirs
            .map(subDir => nav(rootDir, options, join(relativeDir, subDir), currentNavLevel + 1))
            .filter(Boolean);

        if (hasReadme(baseDir)) {

        }

        // console.log('----------nav-items')
        // console.log(JSON.stringify(items))

        result = (currentNavLevel === 1) ? items : {
            text: getName(baseDir, { stripNumbers, navPrefixArr }),
            items
        };
    }

    return result;
}

/**
 * Returns multiple sidebars for given directory.
 * @param {String}    rootDir       - Directory to get navbars for.
 * @param {Object}    nav           - Navigation configuration (Used for calculating sidebars' roots.)
 * @param {Object}    options       - Options
 * @param {Number}    currentLevel  - Recursion level.
 * @returns {Object}                - Multiple navbars.
 */
function multiSide(rootDir, nav, options, currentLevel = 1) {
    const sideBar = {};

    nav.forEach(navItem => {
        if (navItem.link) {
            sideBar[navItem.link] = side(join(rootDir, navItem.link), options);
        } else {
            Object.assign(sideBar, multiSide(rootDir, navItem.items, options), currentLevel + 1);
        }
    });

    if (options.skipEmptySidebar) {
        Object.keys(sideBar).forEach(key => {
            if (sideBar[key].length === 0) {
                delete sideBar[key];
            }
        });
    }

    // @FIXME 回退页面的位置好像会影响sidebar的正常显示
    // if (currentLevel === 1) {
    //     const fallBackSide = side(rootDir, options);
    //     if (!options.skipEmptySidebar || fallBackSide.length > 0) {
    //         sideBar["/"] = side(rootDir, options);
    //     }
    // }

    return sideBar;
}

/**
 * Returns `nav` and `sidebar` configuration for VuePress calculated using structrue of directory and files in given path.
 * @param   {String}    rootDir   - Directory to get configuration for.
 * @param   {Object}    options   - Options
 * @returns {Object}              - { nav: ..., sidebar: ... } configuration.
 */
function getConfig(
    rootDir,
    {
        stripNumbers = true,
        maxLevel = 2,
        // nav前缀
        navPrefixArr = ['nav'],
        // 收录文章的标记
        includeArticleSuffix = "@nice",
        // @TODO 附录
        appendixFolder= [],
        skipEmptySidebar = true,
        skipEmptyNavbar = true,
        multipleSideBar = true,
        mixDirectoriesAndFilesAlphabetically = true,
        pinyinNav
    } = {}
) {
    rootDir = normalize(rootDir);
    rootDir = rootDir.endsWith(sep) ? rootDir.slice(0, -1) : rootDir; // Remove last / if exists.
    const options = {
        stripNumbers,
        maxLevel,
        navPrefixArr,
        skipEmptySidebar,
        skipEmptyNavbar,
        multipleSideBar,
        includeArticleSuffix,
        mixDirectoriesAndFilesAlphabetically,
        pinyinNav
    };

    const navItems = nav(rootDir, options);

    const result = {
        nav: navItems || [],
        sidebar: (multipleSideBar && navItems) ? multiSide(rootDir, navItems, options) : side(rootDir, options)
    };

    if (options.pinyinNav && nav.length) {
        result.nav = transliteratePinyin(result.nav);
    }

    return result;
}

module.exports = getConfig;
