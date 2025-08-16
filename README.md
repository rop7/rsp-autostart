git commit -a -m $(uuidgen)
npm version minor (auto update versao no package.json e autocria git tag )
git tag latest --force (cria/update git tag named latest)
git push origin --tags --force (push git tags)
git push origin dev (push normal pro branch default)

npm install direct (via ssh)

    pnpm install @ropsoft/rsp-libcore.js@ssh://github.com:rop7/rsp-libcore.js.git#latest --save
                 @NAMESPACE/PKGNAME@ssh://github.com:OWNER/PKGNAME.git#latest --save
    
    pnpm install @ropsoft/rsp-libcore.js@https://github.com/OWNER/PKGNAME.git#latest --save
                 @NAMESPACE/PKGNAME@https://github.com/OWNER/PKGNAME.git#latest --save

