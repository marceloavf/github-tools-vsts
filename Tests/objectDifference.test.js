import test from 'ava'
import objectDifference from '../Common/Node/objectDifference'

test.serial('Should return updated reference', async t => {
  const difference = await objectDifference({
    'old': 'oldItem'
  }, {
    'old': 'newItem'
  })

  t.deepEqual(difference, `{
  added: {

  },
  deleted: {

  },
  updated: {
    old: "newItem"
  }
}
`)
})

test.serial('Should return deleted (undefined) reference', async t => {
  const difference = await objectDifference({
    'old': 'oldItem'
  }, {})

  t.deepEqual(difference, `{
  added: {

  },
  deleted: {
    old: undefined
  },
  updated: {

  }
}
`)
})

test.serial('Should return added and deleted (undefined) reference', async t => {
  const difference = await objectDifference({
    'old': 'oldItem'
  }, {
    'new': 'newItem'
  })

  t.deepEqual(difference, `{
  added: {
    new: "newItem"
  },
  deleted: {
    old: undefined
  },
  updated: {

  }
}
`)
})

test.serial('Should return added, deleted (undefined) and updated reference', async t => {
  const difference = await objectDifference({
    'old': 'oldItem',
    'update': 'updateItem'
  }, {
    'new': 'newItem',
    'update': 'updatedItem'
  })

  t.deepEqual(difference, `{
  added: {
    new: "newItem"
  },
  deleted: {
    old: undefined
  },
  updated: {
    update: "updatedItem"
  }
}
`)
})
