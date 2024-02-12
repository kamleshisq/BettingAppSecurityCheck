[
  {
    _id: ObjectId('65bde5d4695242ecd1cd98a0'),
    child_id: ObjectId('65a8d1ce127961f1bbb0a314'),
    user_id: ObjectId('65a8d1ce127961f1bbb0a314'),
    parent_id: ObjectId('6492fd6cd09db28e00761691'),
    description: 'Chips credited to bigbullsdm(bigbullsdm) from parent user admin(admin)',
    creditDebitamount: 100000000,
    balance: 100000000,
    date: ISODate('2024-02-03T07:05:56.367Z'),
    userName: 'bigbullsdm',
    role_type: 2,
    Remark: 'Deposite ',
    __v: 0
  }
]


db.accountstatements.deleteMany({_id:{$ne: ObjectId('65bde5d4695242ecd1cd98a0')}, userName:'bigbullsdm'})