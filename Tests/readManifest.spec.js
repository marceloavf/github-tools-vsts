import test from 'ava'
import readManifest from '../Common/Node/readManifest'

test.serial('Should read manifest file', async t => {
  const manifest = await readManifest('./Tests/readManifest/manifest.json')

  t.deepEqual(manifest, {owner: 'owner', repo: 'repo', version: '2.0.0'})
})
