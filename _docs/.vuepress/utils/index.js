/**
 * 路口读取
 */

const fs = require("fs")
const getConfig = require("./utils");
const barConfig = getConfig(`${__dirname}/../..`, {
    navPrefixArr: ['nav', 'ch'],
    maxLevel: 3,
    includeArticleSuffix: '@nice',
    // skipEmptyNavbar: false,
    // pinyinNav: false,
})

// 读取测试json ====
// const barConfig = JSON.parse(fs.readFileSync('./test-readme-fix.json', "utf-8"))

// console.log('----------barConfig')
// console.log(JSON.stringify(barConfig)
//     .replace(/},/g, '},\n')
//     .replace(/],/g, '],\n'))

console.log('----------vuepress-nav')
console.log(JSON.stringify(barConfig.nav).replace(/},/g, '},\n'))
console.log('----------vuepress-sidebar')
console.log(JSON.stringify(barConfig.sidebar).replace(/],/g, '],\n'))

module.exports = barConfig