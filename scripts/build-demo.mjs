import { spawnSync } from 'node:child_process'
import path from 'node:path'

const cli = path.join(
  process.cwd(),
  'node_modules',
  '@dcloudio',
  'vite-plugin-uni',
  'bin',
  'uni.js',
)

const result = spawnSync(process.execPath, [cli, 'build', '-p', 'mp-weixin'], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    VITE_RESET_DEMO_ON_LAUNCH: 'true',
  },
  stdio: 'inherit',
})

if (result.error) throw result.error
process.exit(result.status ?? 1)
