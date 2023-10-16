socket.on("chartMain", async(data) => {
        const currentDate = new Date();
        const tenDaysAgo = new Date();
        tenDaysAgo.setDate(currentDate.getDate() - 10);
    
        const dateSequence = [];
        for (let i = 0; i < 10; i++) {
        const currentDate = new Date(tenDaysAgo);
        currentDate.setDate(tenDaysAgo.getDate() + i);
        dateSequence.push(currentDate.toDateString());
        }

        let accountForGraph = await AccModel.aggregate([
            {
                $match: {
                  userName: data.LOGINUSER.userName,
                  date: {
                    $gte: tenDaysAgo,
                  },
                },
              },
              {
                $group: {
                  _id: {
                    year: { $year: '$date' },
                    month: { $month: '$date' },
                    day: { $dayOfMonth: '$date' },
                  },
                  totalIncome: {
                    $sum: '$creditDebitamount',
                  },
                  totalIncome2: {
                    $sum: { $abs: '$creditDebitamount' }
                  }
                },
              },
          ]);
          const dataArray = accountForGraph;
          const dates = dataArray.map(item => new Date(item._id.year, item._id.month - 1, item._id.day));
          const startDate = new Date(Math.min(...dates));
          const endDate = new Date(Math.max(...dates));
          
          // Step 3: Fill in missing dates with zero values
          const newDataArray = [];
          const currentDate1 = new Date(startDate);
          while (currentDate1 <= endDate) {
            const matchingData = dataArray.find(item =>
              item._id.year === currentDate1.getFullYear() &&
              item._id.month === currentDate1.getMonth() + 1 &&
              item._id.day === currentDate1.getDate()
            );
          
            if (matchingData) {
              newDataArray.push(matchingData);
            } else {
              newDataArray.push({
                _id: {
                  year: currentDate1.getFullYear(),
                  month: currentDate1.getMonth() + 1,
                  day: currentDate1.getDate()
                },
                totalIncome: 0,
                totalIncome2: 0
              });
            }
          
            currentDate1.setDate(currentDate1.getDate() + 1);
          }
        const Income = newDataArray.map(item => item.totalIncome);
        const Revanue = newDataArray.map(item => item.totalIncome2);
        socket.emit("chartMain", {Income, Revanue})
        
    })