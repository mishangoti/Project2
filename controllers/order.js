var get_order_slot = function(user_id){
    let get_order_slot_sql = "SELECT DISTINCT order_slot, user_id FROM `order_slot_` WHERE user_id = '"+user_id+"'";
    console.log(get_order_slot_sql);
    db.query(get_order_slot_sql, function(err, get_order_slot_sql_results){
        return get_order_slot_sql_results;
    });
}

var order_entry = function(){
    let get_order_slot_sql = "SELECT DISTINCT order_slot, user_id FROM `order_slot_` WHERE user_id = '"+user_id+"'";
    console.log(get_order_slot_sql);
    db.query(get_order_slot_sql, function(err, get_order_slot_sql_results){
        // console.log(get_order_slot_sql_results);
        // add orders
        get_order_slot_sql_results.forEach(element => {
            let order_slot_num = element.order_slot;
            let order_user_id = element.user_id;
            
            let get_payable_sql = "SELECT c.quantity, p.price FROM order_slot_ as os LEFT JOIN cart as c ON os.cart_id = c.id LEFT JOIN products as p ON c.product_id = p.id WHERE os.order_slot = '"+order_slot_num+"'";
            db.query(get_payable_sql, function(err, get_payable_sql_result){
                let total_quantity = 0;
                let total_amount = 0;
                let pro_amount = 0;
                get_payable_sql_result.forEach(item => {
                    console.log(item);
                    let quantity = item.quantity;
                    let price = item.price;
                    total_quantity = total_quantity + quantity;
                    console.log(address_id);
                    pro_amount = price * quantity;
                    total_amount = total_amount + pro_amount;
                    console.log(total_amount);                                    
                });
                console.log('inside the foreach');
                console.log(order_slot_num);
                console.log(order_user_id);
                console.log(address_id);
                console.log(total_quantity);
                console.log(total_amount);
            });
            console.log('outside the foreach');
            console.log(order_slot_num);
            console.log(order_user_id);
            console.log(address_id);
            console.log(total_quantity);
            console.log(total_amount);
        });
    });
}

exports.order_entry = order_entry;
exports.get_order_slot = get_order_slot;