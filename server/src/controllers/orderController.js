const Order = require("@/models/orderModel");
const MenuItem = require("@/models/menuItemModel");

// Get all orders (with optional filters)
const getOrders = async (req, res) => {
    try {
        const { restaurantId, userId, status, date } = req.query;

        // Build query object dynamically based on available filters
        const query = {};
        if (restaurantId) query.restaurant = restaurantId;
        if (userId) query.user = userId;
        if (status) query.orderStatus = status;
        if (date) query.createdAt = { $gte: new Date(date) };

        const orders = await Order.find(query).populate("user restaurant items.menuItem");

        return res.status(200).json({
            message: "Orders fetched successfully.",
            orders
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching orders." });
    }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId).populate("user restaurant items.menuItem");

        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        return res.status(200).json({
            message: "Order fetched successfully.",
            order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching order." });
    }
};

// Update an order (this will replace the items array entirely)
const updateOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const {
            items,
            totalPrice,
            discount,
            finalTotal,
            deliveryAddress,
            paymentMethod,
            paymentStatus,
            orderStatus,
            specialInstructions
        } = req.body;

        // Validate order existence
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: "Order not found." });
        }

        // Ensure order status update is logical (e.g., not moving backward)
        const validStatuses = ['Placed', 'Confirmed', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'];
        if (!validStatuses.includes(orderStatus)) {
            return res.status(400).json({ message: "Invalid order status." });
        }

        // Validate items (ensure items are valid)
        const validItems = [];
        for (let i = 0; i < items.length; i++) {
            const menuItem = await MenuItem.findById(items[i].menuItem);
            if (menuItem) {
                validItems.push({
                    ...items[i],
                    itemTotal: items[i].itemPrice * items[i].quantity
                });
            } else {
                return res.status(400).json({ message: `Invalid menu item for item ${i + 1}.` });
            }
        }

        // Calculate final total price
        const calculatedTotalPrice = validItems.reduce((total, item) => total + item.itemTotal, 0);
        const calculatedFinalTotal = calculatedTotalPrice - discount;

        // Update the order
        order.items = validItems;
        order.totalPrice = calculatedTotalPrice;
        order.discount = discount;
        order.finalTotal = calculatedFinalTotal;
        order.deliveryAddress = deliveryAddress;
        order.paymentMethod = paymentMethod;
        order.paymentStatus = paymentStatus || 'Pending';  // Default to Pending if not provided
        order.orderStatus = orderStatus || order.orderStatus;  // Only update if provided
        order.specialInstructions = specialInstructions || order.specialInstructions;

        // Save the updated order
        await order.save();

        return res.status(200).json({
            message: "Order updated successfully.",
            order
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error updating order." });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);

    if (!order) {
    return res.status(404).json({ message: "Order not found." });
    }

    // Delete the order
    await order.remove();

    return res.status(200).json({
    message: "Order deleted successfully."
    });
} catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting order." });
}
};

// Export all controller methods
module.exports = {
    getOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};