const Mock = require('mockjs')

const data = Mock.mock({
  'items|50': [{
    id: '@id',
    name: '@cfirst@clast',
    'gender|1': [0, 1],
    phone: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
    address: '@county(true)'
  }]
})

module.exports = [
  {
    url: '/vue-admin-template/table/list',
    type: 'get',
    response: config => {
      const { page, pageSize, gender, name, address } = config.query
      let items = data.items
      if (gender) {
        items = items.filter(item => item.gender === Number(gender))
      }
      if (name) {
        items = items.filter(item => item.name.indexOf(name) !== -1)
      }
      if (address) {
        items = items.filter(item => item.address.indexOf(address) !== -1)
      }

      return {
        code: 20000,
        data: {
          total: items.length,
          items: items.slice(pageSize * (page - 1), pageSize * page)
        }
      }
    }
  }
]
