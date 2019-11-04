import fs from 'fs'
import { resolve } from 'path'

const PKG_PREFIX = '@d-ts/'
const PRIMARY_PKG = PKG_PREFIX + 'bin'

const link = (dtsDir: string, pkgName: string) => {
  if (PKG_PREFIX + pkgName === PRIMARY_PKG) {
    return
  }

  const srcPkg = resolve(dtsDir, pkgName)
  const paths = [srcPkg, resolve(dtsDir, '../@types', pkgName)] as const

  try {
    fs.linkSync(...paths)
  } catch (e) {
    fs.symlinkSync(...(paths.concat('dir') as [string, string, 'dir']))
  }
}

export default (dtsDir: string) => {
  if (!fs.existsSync(dtsDir)) {
    console.warn('no `@d-ts` packages found')
    return
  }
  const linkDts = link.bind(null, dtsDir)
  fs.readdirSync(dtsDir).forEach(linkDts)
}