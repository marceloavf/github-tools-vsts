import path from 'path'
import test from 'ava'
import ttm from '../Src/GithubReleasePublish/node_modules/vsts-task-lib/mock-test'

test.serial('Should run', async t => {
  let tp = path.join(__dirname, 'githubReleasePublishTask.js')
  let tr = new ttm.MockTestRunner(tp)
  tr.run()
  t.deepEqual(tr, true) // See output
  t.deepEqual(tr.succeeded, true)
})
