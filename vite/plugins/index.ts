import type { PluginOption } from 'vite'
// import createComponents from './components'
import createAutoImport from './auto-import'
import uni from "@dcloudio/vite-plugin-uni";
import commonjs from 'rollup-plugin-commonjs';
import viteCompression from 'vite-plugin-compression'

export default function createVitePlugins() {
  const vitePlugins: (PluginOption | PluginOption[])[] = [commonjs() as any,uni()]
  
  // vitePlugins.push(createComponents())
  vitePlugins.push(createAutoImport())
  vitePlugins.push(viteCompression({
    threshold: 1024 // 对大于 1mb 的文件进行压缩
  }))
 
  return vitePlugins
}
