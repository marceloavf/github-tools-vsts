import test from 'ava'
import readManifest from '../Common/Node/readManifest'

test.serial('Should read manifest file', async t => {
  const manifest = await readManifest('./Tests/fixtures/manifest.json')

  t.deepEqual(manifest, {owner: 'owner', repo: 'repo', version: '2.0.0'})
})

test.serial('Should return false if not json file', async t => {
  const manifest = await readManifest('./Tests/readManifest.test.js')

  t.deepEqual(manifest, false)
})
