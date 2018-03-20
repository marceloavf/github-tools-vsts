import test from 'ava'
import bytesToSize from '../Common/Node/bytesToSize'

test.serial('Should return n/a', async t => {
  const size = await bytesToSize(0)

  t.deepEqual(size, 'n/a')
})

test.serial('Should convert bytes', async t => {
  const size = await bytesToSize('512')

  t.deepEqual(size, '512 Bytes')
})

test.serial('Should convert bytes to KB', async t => {
  const size = await bytesToSize('512000')

  t.deepEqual(size, '500.0 KB')
})

test.serial('Should convert bytes to MB', async t => {
  const size = await bytesToSize('512000000')

  t.deepEqual(size, '488.3 MB')
})

test.serial('Should convert bytes to GB', async t => {
  const size = await bytesToSize('512000000000')

  t.deepEqual(size, '476.8 GB')
})

test.serial('Should convert bytes to TB', async t => {
  const size = await bytesToSize('512000000000000')

  t.deepEqual(size, '465.7 TB')
})
