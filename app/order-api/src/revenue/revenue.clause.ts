export const getCurrentRevenueClause = `
    SELECT 
        order_tbl.branch_column AS branchId,
        DATE(order_tbl.created_at_column) AS date,
        SUM(payment_tbl.amount_column) AS totalAmount,
        COUNT(order_tbl.id_column) AS totalOrder
    FROM 
        order_db.payment_tbl AS payment_tbl
    INNER JOIN 
        order_db.order_tbl AS order_tbl 
    ON 
        payment_tbl.id_column = order_tbl.payment_column
    WHERE 
        payment_tbl.status_code_column = 'completed'
    AND
        order_tbl.created_at_column >= CURRENT_DATE()
    AND
        order_tbl.created_at_column < CURRENT_DATE() + INTERVAL 1 DAY
    GROUP BY 
        order_tbl.branch_column,
        DATE(order_tbl.created_at_column)
`;

export const getAllRevenuesClause = `
    SELECT 
        order_tbl.branch_column AS branch_id_column,
        DATE(order_tbl.created_at_column) AS date_column,
        SUM(payment_tbl.amount_column) AS total_amount_column,
        COUNT(order_tbl.id_column) AS total_order_column
    FROM 
        order_db.payment_tbl AS payment_tbl
    INNER JOIN 
        order_db.order_tbl AS order_tbl 
    ON 
        payment_tbl.id_column = order_tbl.payment_column
    WHERE 
        payment_tbl.status_code_column = 'completed'
    AND
        order_tbl.created_at_column >= CURRENT_DATE()
    AND
        order_tbl.created_at_column < CURRENT_DATE() + INTERVAL 1 DAY
    GROUP BY 
        order_tbl.branch_column,
        DATE(order_tbl.created_at_column)
`;
