var db_name = 'prox';
var mongodb_connection_string = 'mongodb://127.0.0.1:27017/' + db_name;
if (process.env.OPENSHIFT_MONGODB_DB_URL) {
   var mongodb_connection_string = process.env.OPENSHIFT_MONGODB_DB_URL + db_name;
}
module.exports = {
   'mongo_url': mongodb_connection_string,
   'super_user': {
      'code': 'super_user_1',
      'name': 'super',
      'username': 'super',
      'password': 'super123',
      'role': 'super'
   }
};
