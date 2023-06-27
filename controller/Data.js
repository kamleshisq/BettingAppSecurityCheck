Data.aggregate([
    {
      $group: {
        _id: '$marketId',
        secIds: { $push: '$secId' },
        totalStake: { $push: '$Stake' }
      }
    }
  ])
    .then(result => {
      const formattedResult = result.map(item => ({
        _id: item._id,
        secIds: item.secIds,
        totalStake: item.totalStake
      }));
      res.json(formattedResult);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'An error occurred' });
    });