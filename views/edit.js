var docu = {};
var quill_edit;
$.getJSON("/api/get/"+$("#documentid").html(), function(doc){

var example = {
    "_id": {
        "$oid": "5c031f6299d1daa6e2942346"
    },
    "doc": {
        "original": "{\n  \"ops\": [\n    {\n      \"insert\": \"Ur mom is ur dad\\n\"\n    }\n  ]\n}"
    },
    "id": "8beefa90-f5c4-11e8-bb3e-5f3a9134a9c0",
    "userSubmitted": "110938820128449068434",
    "reviewedAmount": 0,
    "level": "english",
    "__v": 0
}

docu = doc;
console.log(JSON.stringify(doc));

/*var quill_diff = new Quill('#diff', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'  // or 'bubble'
});
quill_diff.setContents(JSON.parse(doc.doc.original));*/

quill_edit = new Quill('#edit', {
  modules: {
    toolbar: [
      [{ header: [1, 2, false] }],
      ['bold', 'italic', 'underline'],
      ['image', 'code-block']
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow' //or 'bubble'
});
quill_edit.setContents(JSON.parse(doc.doc.original));
//quill_edit.enable(false);
//quill_edit.on('text-change', findDiff());




});

function sendData() {
    $.ajax({
        url: '/api/receiveedit/'+$("#documentid").html(),
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
            contents: JSON.stringify(quill_edit.getContents(), null, 2)
        }),
        dataType: 'json'
    });
    console.log(JSON.stringify(quill_edit.getContents(), null, 2));
    window.location.replace("../dashboard");
}

/*function findDiff() {
  var oldContent = quill_old.getContents();
  var editContent = quill_edit.getContents();
  var diff = oldContent.diff(editContent);
  // console.log('old', oldContent);
  // console.log('new', newContent);
  for (var i = 0; i < diff.ops.length; i++) {
    var op = diff.ops[i];
    // if the change was an insertion
    if (op.hasOwnProperty('insert')) {
      // color it green
      op.attributes = {
        background: "#cce8cc",
        color: "#003700"
      };
    }
    // if the change was a deletion 
    if (op.hasOwnProperty('delete')) {
      // keep the text
      op.retain = op.delete;
      delete op.delete;
      // but color it red and struckthrough
      op.attributes = {
        background: "#e8cccc",
        color: "#370000",
        strike: true
      };
    }
  }
  // console.log('diff', diff);
  var adjusted = oldContent.compose(diff);
  // console.log('adjusted', adjusted);
  
  // profit!
  quill_diff.setContents(adjusted);
}*/