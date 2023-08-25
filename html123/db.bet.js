db.bet.aggregate([
  // Match bets with the specified _id and betType 'Open'
  {
    $match: {
      _id: betId,
      betType: 'Open'
    }
  },
  // Lookup user details based on userId
  {
    $lookup: {
      from: 'user',
      localField: 'userId',
      foreignField: '_id',
      as: 'user'
    }
  },
  // Unwind the user array created by the lookup
  {
    $unwind: '$user'
  },
  // Lookup parent user details based on parentUserId
  {
    $lookup: {
      from: 'user',
      localField: 'user.parentUserId',
      foreignField: '_id',
      as: 'parentUser'
    }
  },
  // Unwind the parentUser array created by the lookup
  {
    $unwind: '$parentUser'
  },
  // Lookup settlement details based on parentUserId
  {
    $lookup: {
      from: 'settlement',
      localField: 'parentUser._id',
      foreignField: 'userId',
      as: 'settlement'
    }
  },
  // Unwind the settlement array created by the lookup
  {
    $unwind: '$settlement'
  },
  // Match only if settlement is open
  {
    $match: {
      'settlement.isOpen': true
    }
  }
]);