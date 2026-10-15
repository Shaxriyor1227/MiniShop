const Order = require('../model/orderSchema');
const Product = require('../model/productSchema');
const User = require('../model/userSchema');

/**
 * GET /admin/stats
 * Complete dashboard analytics aggregation
 */
const getStats = async (req, res) => {
  try {
    const revenueStatuses = ['paid', 'shipped', 'delivered'];

    // 1. Overall counts & revenue
    const [totalUsers, totalProducts, totalOrders, revenueResult] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { status: { $in: revenueStatuses } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ])
    ]);

    const totalRevenue = revenueResult[0]?.total || 0;

    // 2. Orders grouped by status
    const statusAggregation = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const ordersByStatus = {
      pending: 0,
      paid: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0
    };
    statusAggregation.forEach((item) => {
      if (item._id) ordersByStatus[item._id] = item.count;
    });

    // 3. Helper for daily sales aggregation
    const getDailySales = async (days) => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (days - 1));
      startDate.setHours(0, 0, 0, 0);

      const sales = await Order.aggregate([
        {
          $match: {
            createdAt: { $gte: startDate },
            status: { $in: revenueStatuses }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            revenue: { $sum: '$total' },
            ordersCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const salesMap = {};
      sales.forEach((s) => {
        salesMap[s._id] = s;
      });

      // Fill in any gap days with 0
      const result = [];
      for (let i = days - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        result.push({
          date: dateStr,
          revenue: salesMap[dateStr]?.revenue || 0,
          orders: salesMap[dateStr]?.ordersCount || 0
        });
      }
      return result;
    };

    const [dailySales7, dailySales30] = await Promise.all([
      getDailySales(7),
      getDailySales(30)
    ]);

    // 4. Top 5 selling products
    const topSellingProducts = await Order.aggregate([
      { $match: { status: { $in: revenueStatuses } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product_id',
          soldCount: { $sum: '$items.quantity' },
          totalSales: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
        }
      },
      { $sort: { soldCount: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          soldCount: 1,
          totalSales: 1,
          name: { $ifNull: ['$product.name', 'O\'chirilgan mahsulot'] },
          price: { $ifNull: ['$product.price', 0] },
          images: { $ifNull: ['$product.images', []] },
          stock: { $ifNull: ['$product.stock', 0] }
        }
      }
    ]);

    // 5. Products with low stock (< 5)
    const lowStockProducts = await Product.find({ stock: { $lt: 5 } })
      .populate('category_id', 'name')
      .populate('brand_id', 'name')
      .sort({ stock: 1 })
      .limit(10);

    // 6. Recent 5 orders
    const recentOrders = await Order.find()
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    // 7. Recent 5 users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    return res.status(200).json({
      success: true,
      message: 'Admin statistikasi muvaffaqiyatli olindi',
      innerData: {
        summary: {
          totalRevenue,
          totalOrders,
          totalUsers,
          totalProducts,
          lowStockCount: lowStockProducts.length
        },
        ordersByStatus,
        dailySales: {
          last7Days: dailySales7,
          last30Days: dailySales30
        },
        topSellingProducts,
        lowStockProducts,
        recentOrders,
        recentUsers
      }
    });
  } catch (error) {
    console.error('[Admin Stats Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Server xatosi: ' + error.message,
      innerData: null
    });
  }
};

module.exports = {
  getStats
};
