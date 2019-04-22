// product list
var list = (req, res) => {
    let get_all_pro_sql = `SELECT * FROM products `;
    // console.log(get_all_pro_sql);
    db.query(get_all_pro_sql, (err, get_all_pro_result) => {
        res.json(get_all_pro_result);
    });
}

var single = (req, res) => {
    let id = req.params.id;
    // console.log(id);
    let get_single_pro_sql = `SELECT * FROM products WHERE id = ${id}`;
    // console.log(get_single_pro_sql);
    db.query(get_single_pro_sql, (err, get_single_pro_result) => {
        res.json(get_single_pro_result);
    });
}

exports.list = list;
exports.single = single;