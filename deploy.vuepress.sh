#!/usr/bin/env sh
# abort on errors
set -e

# build
npm run build:nodeppt

# navigate into the build output directory
cd _docs/.vuepress/dist

# if you are deploying to a custom domain
#echo 'xxx.yyy.com' > CNAME

git init
git add -A
git commit -m 'vuepress机械发布'

# if you are deploying to https://<USERNAME>.github.io/<REPO>
git push -f git@github.com:ui-javascript/note.git master:gh-pages

cd -
