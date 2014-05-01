//delete confirm popup
function delete_user( id ){
  var answer = confirm('Are you sure you want to delete this record?');
  if ( answer ){ //if user clicked ok
  //redirect to url with id to the record to be deleted
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open('DELETE', '/delete/:' + id, true);
  xmlhttp.send();
  }
}