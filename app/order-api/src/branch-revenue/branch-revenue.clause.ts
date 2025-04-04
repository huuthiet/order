export const getCurrentBranchRevenueClause = `
WITH PaymentSummary AS (
        SELECT 
            id_column AS payment_id,
            SUM(amount_column) AS totalPaymentAmount
        FROM order_db.payment_tbl
        WHERE status_code_column = 'completed'
        GROUP BY id_column
    ),
    OrderSummary AS (
        SELECT 
            id_column AS order_id,
            branch_column,
            payment_column,
            DATE(created_at_column) AS order_date,
            SUM(subtotal_column) AS totalFinalAmountOrder,
            SUM(original_subtotal_column) AS totalOriginalAmountOrder
        FROM order_db.order_tbl
        GROUP BY id_column, branch_column, payment_column, DATE(created_at_column)
    ),
    OrderItemSummary AS (
        SELECT 
            order_column AS order_id,
            SUM(original_subtotal_column) AS totalOriginalOrderItemAmount,
            SUM(subtotal_column) AS totalFinalOrderItemAmount
        FROM order_db.order_item_tbl
        GROUP BY order_column
    )
    SELECT 
        o.branch_column AS branchId,
        o.order_date AS date,
        SUM(p.totalPaymentAmount) AS totalAmount,
        SUM(o.totalFinalAmountOrder) AS totalFinalAmountOrder,
        SUM(o.totalOriginalAmountOrder) AS totalOriginalAmountOrder,
        SUM(oi.totalOriginalOrderItemAmount) AS totalOriginalOrderItemAmount,
        SUM(oi.totalFinalOrderItemAmount) AS totalFinalOrderItemAmount,
        COUNT(DISTINCT o.order_id) AS totalOrder
    FROM 
        OrderSummary AS o
    LEFT JOIN 
        PaymentSummary AS p ON o.payment_column = p.payment_id
    LEFT JOIN 
        OrderItemSummary AS oi ON o.order_id = oi.order_id
    WHERE 
        o.order_date >= CURRENT_DATE()
    AND 
        o.order_date < CURRENT_DATE() + INTERVAL 1 DAY
    GROUP BY 
        o.branch_column, o.order_date
    ORDER BY 
        o.branch_column, o.order_date ASC;
`;

export const getYesterdayBranchRevenueClause = `
    WITH PaymentSummary AS (
        SELECT 
            id_column AS payment_id,
            SUM(amount_column) AS totalPaymentAmount
        FROM order_db.payment_tbl
        WHERE status_code_column = 'completed'
        GROUP BY id_column
    ),
    OrderSummary AS (
        SELECT 
            id_column AS order_id,
            branch_column,
            payment_column,
            DATE(created_at_column) AS order_date,
            SUM(subtotal_column) AS totalFinalAmountOrder,
            SUM(original_subtotal_column) AS totalOriginalAmountOrder
        FROM order_db.order_tbl
        GROUP BY id_column, branch_column, payment_column, DATE(created_at_column)
    ),
    OrderItemSummary AS (
        SELECT 
            order_column AS order_id,
            SUM(original_subtotal_column) AS totalOriginalOrderItemAmount,
            SUM(subtotal_column) AS totalFinalOrderItemAmount
        FROM order_db.order_item_tbl
        GROUP BY order_column
    )
    SELECT 
        o.branch_column AS branchId,
        o.order_date AS date,
        SUM(p.totalPaymentAmount) AS totalAmount,
        SUM(o.totalFinalAmountOrder) AS totalFinalAmountOrder,
        SUM(o.totalOriginalAmountOrder) AS totalOriginalAmountOrder,
        SUM(oi.totalOriginalOrderItemAmount) AS totalOriginalOrderItemAmount,
        SUM(oi.totalFinalOrderItemAmount) AS totalFinalOrderItemAmount,
        COUNT(DISTINCT o.order_id) AS totalOrder
    FROM 
        OrderSummary AS o
    LEFT JOIN 
        PaymentSummary AS p ON o.payment_column = p.payment_id
    LEFT JOIN 
        OrderItemSummary AS oi ON o.order_id = oi.order_id
    WHERE 
        o.order_date >= CURRENT_DATE() - INTERVAL 1 DAY
    AND 
        o.order_date < CURRENT_DATE()
    GROUP BY 
        o.branch_column, o.order_date
    ORDER BY 
        o.branch_column, o.order_date ASC;
`;

export const getAllBranchRevenueClause = `
    WITH PaymentSummary AS (
        SELECT 
            id_column AS payment_id,
            SUM(amount_column) AS totalPaymentAmount
        FROM order_db.payment_tbl
        WHERE status_code_column = 'completed'
        GROUP BY id_column
    ),
    OrderSummary AS (
        SELECT 
            id_column AS order_id,
            branch_column,
            payment_column,
            DATE(created_at_column) AS order_date,
            SUM(subtotal_column) AS totalFinalAmountOrder,
            SUM(original_subtotal_column) AS totalOriginalAmountOrder
        FROM order_db.order_tbl
        GROUP BY id_column, branch_column, payment_column, DATE(created_at_column)
    ),
    OrderItemSummary AS (
        SELECT 
            order_column AS order_id,
            SUM(original_subtotal_column) AS totalOriginalOrderItemAmount,
            SUM(subtotal_column) AS totalFinalOrderItemAmount
        FROM order_db.order_item_tbl
        GROUP BY order_column
    )
    SELECT 
        o.branch_column AS branchId,
        o.order_date AS date,
        SUM(p.totalPaymentAmount) AS totalAmount,
        SUM(o.totalFinalAmountOrder) AS totalFinalAmountOrder,
        SUM(o.totalOriginalAmountOrder) AS totalOriginalAmountOrder,
        SUM(oi.totalOriginalOrderItemAmount) AS totalOriginalOrderItemAmount,
        SUM(oi.totalFinalOrderItemAmount) AS totalFinalOrderItemAmount,
        COUNT(DISTINCT o.order_id) AS totalOrder
    FROM 
        OrderSummary AS o
    LEFT JOIN 
        PaymentSummary AS p ON o.payment_column = p.payment_id
    LEFT JOIN 
        OrderItemSummary AS oi ON o.order_id = oi.order_id
    GROUP BY 
        o.branch_column, o.order_date
    ORDER BY 
        o.branch_column, o.order_date ASC;
`;

export const getSpecificRangeBranchRevenueClause = `
    WITH PaymentSummary AS (
        SELECT 
            id_column AS payment_id,
            SUM(amount_column) AS totalPaymentAmount
        FROM order_db.payment_tbl
        WHERE status_code_column = 'completed'
        GROUP BY id_column
    ),
    OrderSummary AS (
        SELECT 
            id_column AS order_id,
            branch_column,
            payment_column,
            DATE(created_at_column) AS order_date,
            SUM(subtotal_column) AS totalFinalAmountOrder,
            SUM(original_subtotal_column) AS totalOriginalAmountOrder
        FROM order_db.order_tbl
        GROUP BY id_column, branch_column, payment_column, DATE(created_at_column)
    ),
    OrderItemSummary AS (
        SELECT 
            order_column AS order_id,
            SUM(original_subtotal_column) AS totalOriginalOrderItemAmount,
            SUM(subtotal_column) AS totalFinalOrderItemAmount
        FROM order_db.order_item_tbl
        GROUP BY order_column
    )
    SELECT 
        o.branch_column AS branchId,
        o.order_date AS date,
        SUM(p.totalPaymentAmount) AS totalAmount,
        SUM(o.totalFinalAmountOrder) AS totalFinalAmountOrder,
        SUM(o.totalOriginalAmountOrder) AS totalOriginalAmountOrder,
        SUM(oi.totalOriginalOrderItemAmount) AS totalOriginalOrderItemAmount,
        SUM(oi.totalFinalOrderItemAmount) AS totalFinalOrderItemAmount,
        COUNT(DISTINCT o.order_id) AS totalOrder
    FROM 
        OrderSummary AS o
    LEFT JOIN 
        PaymentSummary AS p ON o.payment_column = p.payment_id
    LEFT JOIN 
        OrderItemSummary AS oi ON o.order_id = oi.order_id
    WHERE 
        o.order_date >= ?
    AND 
        o.order_date < ?
    GROUP BY 
        o.branch_column, o.order_date
    ORDER BY 
        o.branch_column, o.order_date ASC;
`;
