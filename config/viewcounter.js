
var viewcount = function(){
    let views = "SELECT * FROM views";
    db.query(views, function(err, store_view){
        // res.render('pages/customers/index.ejs', { results });
        store_view.forEach(element => {
            let curr_view = element.store
            let updated_view = curr_view+1;
            let update_view = "UPDATE `views` SET store='"+updated_view+"' WHERE id = 1";
            // console.log(update_view);
            db.query(update_view, function(err, results){
                
            });
        }); 
    });
}
exports.viewcount = viewcount;
