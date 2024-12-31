export const getAllProductAnalysisClause = `
    SELECT
        b.id_column AS branchId,
        DATE(o.created_at_column) AS orderDate,
        v.product_column AS productId,
        COUNT(v.product_column) AS totalProducts
    FROM 
        order_db.variant_tbl AS v
    INNER JOIN order_db.order_item_tbl AS oi
        ON v.id_column = oi.variant_column
    INNER JOIN order_db.order_tbl AS o
        ON oi.order_column = o.id_column
    INNER JOIN order_db.branch_tbl AS b
        ON o.branch_column = b.id_column
    GROUP BY
        b.id_column,
        DATE(o.created_at_column),
        v.product_column
`;
