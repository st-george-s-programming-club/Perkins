

$.getJSON("/api/get/"+$("#documentid").html(), function(doc){

var quill_old = new Quill('#old', {
  modules: {
    toolbar: [
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'  // or 'bubble'
});
quill_old.setContents(JSON.parse(doc.doc.original));
quill_old.enable(false);

var quill_new = new Quill('#new', {
  modules: {
    toolbar: [
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'  // or 'bubble'
});
console.log(doc.doc.edited);
console.log(doc.doc.original);
quill_new.setContents(JSON.parse(doc.doc.edited));
quill_new.enable(false);

var quill_diff = new Quill('#diff', {
  modules: {
    toolbar: [
    ]
  },
  placeholder: 'Compose an epic...',
  theme: 'snow'  // or 'bubble'
});
quill_diff.enable(false);

function findDiff() {
  var oldContent = quill_old.getContents();
  var newContent = quill_new.getContents();
  var diff = oldContent.diff(newContent);
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
}
findDiff();
});