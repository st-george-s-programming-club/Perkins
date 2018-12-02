//Initialize Quill Editor


var quill = new Quill('#editor-container', {
  theme: 'snow',
  placeholder: 'Hello! Please submit your piece to be reviewed here.'
});
//var container = document.querySelector('#delta-container');
//quill.on('text-change', update);
//update();

//Update Delta's
/*
function update(delta) {
  var contents = quill.getContents();
  console.log('contents', contents);
  var html = "contents = " + JSON.stringify(contents, null, 2);

  container.innerHTML = html;
}
*/
//Document/Text Submission
var subject = document.querySelector("#subject");
var title = document.querySelector("#title");
function sendData() {
    $.ajax({
        url: '/api/receive',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            subject: subject.value,
            title: title.value,
            contents: JSON.stringify(quill.getContents(), null, 2),
        }),
        dataType: 'json'
    }).always(function(xyz){
       window.location.assign("./dashboard"); 
    });
    console.log(subject.value);
    console.log(JSON.stringify(quill.getContents(), null, 2));
}