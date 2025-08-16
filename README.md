# cria git commit com uuid
git commit -a -m $(uuidgen)

# auto update versao no package.json e autocria git tag
npm version minor 

# cria/update git tag named latest
git tag latest --force

# push git tags
git push origin --tags --force

# push normal pro branch default
git push origin dev 

# exemplo de instalacao em um projeto
npm install direct (via ssh)

    pnpm install @ropsoft/rsp-libcore.js@ssh://github.com:rop7/rsp-libcore.js.git#latest --save
                 @NAMESPACE/PKGNAME@ssh://github.com:OWNER/PKGNAME.git#latest --save
    
    pnpm install @ropsoft/rsp-libcore.js@https://github.com/OWNER/PKGNAME.git#latest --save
                 @NAMESPACE/PKGNAME@https://github.com/OWNER/PKGNAME.git#latest --save


# Exemplo de abstração:

    pkgman install rsp-libcore.js
    
        - pega default namespace from "git config get --global npm.namespace"
    
