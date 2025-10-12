import adminModel from "../models/admin.model.js";
import validateAdmin from "../validator/admin.validator.js";
import orderModel from "../models/order.model.js"
import Customer from "../models/customer.model.js"
import Product from "../models/product.model.js"

export const adminRegister = async (req, res) => {
  try {
    const admin = await adminModel.find()
    if (admin.length > 0) return res.status(401).send("Failed : Admin Already Exists.")
    const {
      fullname,
      username,
      email,
      password,
      phone,
      gender,
      profilepicture,
    } = req.body;
    const { error } = validateAdmin(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const hasshedpassword = await adminModel.passwordhashkaro(password)
    await adminModel.create({
      fullname,
      username,
      email,
      password: hasshedpassword,
      phone,
      gender,
      profilepicture,
    });
    res.status(201).send("Admin Created Successfully.");
  } catch (error) {
    res.status(500).send(error.errorResponse);
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("username or password required.")
    const admin = await adminModel.findOne({ username: username }).select('+password')
    if (!admin) return res.status(404).send("username or password not valid.")
    const ismatch = await admin.passwordcomparekaro(password)
    if (!ismatch) return res.status(404).send("p n c.")
    const token = admin.generateToken()
    res.cookie("token", token, {
      httpOnly: true,      // JS se access na ho
      secure: process.env.NODE_ENV === "production", // HTTPS only in production
      sameSite: "strict",  // CSRF protection
      maxAge: 24 * 60 * 60 * 1000 // 1 din
    });
    res.json({ message: 'Logged in successfully' });
  } catch (error) {
    console.log(error)
    res.status(500).send("Internal server error")
  }
}
export const adminDashboard = (req, res) => {
  try {
    const { admin } = req;
    if (!admin) return res.status(401).send("Not LoggedIn / Unauthorized")
    res.send(admin)
  } catch (error) {
    res.send(error)
  }
}
export const adminLogout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    res.status(500).send(error.message);
  }
};
export const readOrders = async (req, res) => {
  try {
    const totalOrders = await orderModel.countDocuments();
    const allOrders = await orderModel.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: totalOrders,
      total: allOrders
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};
export const allCustomers = async (req, res) => {
  try {
    const totalCustomers = await Customer.countDocuments();
    const allUsers = await Customer.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: totalCustomers,
      total: allUsers
    });
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};
export const allOrdersOfCustomer = async (req, res) => {
  const { userId } = req.params;
  try {
    const customer = await Customer.findById(userId).populate("ordersHistory").sort({ createdAt: -1 });
    res.status(200).send(customer);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message
    });
  }
};
export const getOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  try {
    const order = await orderModel.findById(orderId).populate([
      { path: "shippingAddress" },
      { path: "items.product" },
    ]);
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const editOrderDetails = async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await orderModel.findById(orderId)
    if (!order) return res.status(400).send("Order Details not Founded.")
    order.status = status
    await order.save()
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getAdminDashboardStats = async (req, res) => {
  try {
    // 📌 Current Week Dates
    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Sunday
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date();
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Saturday
    endOfWeek.setHours(23, 59, 59, 999);

    // ✅ Run multiple queries in parallel
    const [totalRevenue, totalOrders, totalCustomers, totalProducts, recentOrders, orderStatus, thisWeekRevenue,
      topProducts, recentCustomers] = await Promise.all([
        // Total Revenue
        orderModel.aggregate([{ $group: { _id: null, revenue: { $sum: "$totalAmount" } } }]),
        // Total Orders
        orderModel.countDocuments(),
        // Total Customers
        Customer.countDocuments(),
        // Total Products
        Product.countDocuments(),

        // Recent 5 Orders
        orderModel.find().sort({ createdAt: -1 }).limit(5).populate({ path: "customer", select: "fullname" }),

        // Orders status counts
        orderModel.aggregate([{ $group: { _id: "$status", count: { $sum: 1 } } }]),

        // This Week Revenue
        orderModel.aggregate([
          {
            $match: { createdAt: { $gte: startOfWeek, $lte: endOfWeek } }
          },
          {
            $group: { _id: null, revenue: { $sum: "$totalAmount" } }
          }
        ]),

        // Top 5 Selling Products
        orderModel.aggregate([
          { $unwind: "$items" },
          {
            $group: {
              _id: "$items.product",
              totalSold: { $sum: "$items.quantity" }
            }
          },
          { $sort: { totalSold: -1 } },
          { $limit: 5 },
          {
            $lookup: {
              from: "products",
              localField: "_id",
              foreignField: "_id",
              as: "product"
            }
          },
          { $unwind: "$product" }
        ]),

        // Last recent 5 customers
        // customer.totalSpend += order.totalAmount;  // industy standrad hai. order create ya update par ye karna hota hai.
        // await customer.save();

        Customer.aggregate([
          // 1. Join orders
          {
            $lookup: {
              from: "orders",              // orders collection
              localField: "ordersHistory", // customer ke andar ka array
              foreignField: "_id",
              as: "orders"
            }
          },
          // 2. Total spend nikalna
          { $addFields: { totalSpend: { $sum: "$orders.totalAmount" } } },
          { $sort: { createdAt: -1 } },
          { $limit: 5 }
        ])

      ]);

    res.json({
      totals: { revenue: totalRevenue[0]?.revenue || 0, orders: totalOrders, customers: totalCustomers, products: totalProducts },
      orderStatus, thisWeekRevenue: thisWeekRevenue[0]?.revenue || 0, topProducts, recentCustomers, recentOrders
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({ message: "Error fetching dashboard stats", error: error.message });
  }
};
export const getAnalyticsData = async (req, res) => {
  try {
    const [dailyOrders, categorySales, statusSummary, topProducts] = await Promise.all([

      // 1️⃣ Orders aggregation per day
      orderModel.aggregate([
        {
          $group: {
            _id: { $dateToString: { format: "%b %d", date: "$createdAt" } },
            totalRevenue: { $sum: "$totalAmount" },
            totalOrders: { $sum: 1 },
            customersSet: { $addToSet: "$customer" } // unique customers per day
          }
        },
        {
          $project: {
            _id: 0,
            date: "$_id",
            revenue: "$totalRevenue",
            orders: "$totalOrders",
            customers: { $size: "$customersSet" }
          }
        },
        { $sort: { date: 1 } } // oldest to newest
      ]),

      orderModel.aggregate([
        { $unwind: "$items" }, // har product item nikalo
        {
          $lookup: {
            from: "products",                // Product collection
            localField: "items.product",     // order.items.product
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" }, // single product object nikalo
        {
          $group: {
            _id: "$product.category", // category ke hisaab se group
            totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
            totalOrders: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: null,
            categories: {
              $push: {
                name: "$_id",
                value: "$totalRevenue",
                orders: "$totalOrders"
              }
            },
            grandTotal: { $sum: "$totalRevenue" }
          }
        },
        { $unwind: "$categories" },
        {
          $project: {
            _id: 0,
            name: "$categories.name",
            value: "$categories.value",
            orders: "$categories.orders",
            percentage: {
              $round: [
                { $multiply: [{ $divide: ["$categories.value", "$grandTotal"] }, 100] },
                2
              ]
            }
          }
        },
        { $sort: { value: -1 } }
      ]),

      orderModel.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        },
        {
          $project: {
            _id: 0,
            status: "$_id",
            count: 1,
            // 🎨 color mapping (customize as per UI theme)
            color: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id", "pending"] }, then: "#fbbf24" },
                  { case: { $eq: ["$_id", "confirmed"] }, then: '#4cd964' },
                  { case: { $eq: ["$_id", "processing"] }, then: '#b33aff' },
                  { case: { $eq: ["$_id", "out for delivery"] }, then: '#ff35dd' },
                  { case: { $eq: ["$_id", "shipped"] }, then: "#3b82f6" },
                  { case: { $eq: ["$_id", "delivered"] }, then: "#22c55e" },
                  { case: { $eq: ["$_id", "cancelled"] }, then: "#ef4444" },
                ],
                default: "#9ca3af" // gray
              }
            }
          }
        },
        { $sort: { count: -1 } }
      ]),

      orderModel.aggregate([
        { $unwind: "$items" }, // order.items ko tod ke individual bana do
        {
          $group: {
            _id: "$items.product", // product ke basis par group
            units: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
          }
        },
        { $sort: { units: -1 } }, // sabse zyada units beche gaye
        { $limit: 5 },
        {
          $lookup: {
            from: "products",          // products collection
            localField: "_id",
            foreignField: "_id",
            as: "product"
          }
        },
        { $unwind: "$product" }, // ek product obj nikalo
        {
          $project: {
            _id: 0,
            product: "$product.title",
            units: 1,
            revenue: 1
          }
        }
      ])

    ])

    res.json({ dailyOrders, categorySales, statusSummary, topProducts });
  } catch (error) {
    console.error("Analytics Error:", error);
    res.status(500).json({ message: "Error fetching Analytics Data", error: error.message });
  }
}