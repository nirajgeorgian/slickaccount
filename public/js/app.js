$(function() {
  if(document.getElementById("message")) {
    var simplemde = new SimpleMDE({ element: document.getElementById("message")});
  }
  if(document.getElementById("MyID")) {
    var simplemde2 = new SimpleMDE({element: document.getElementById("MyID")})
  }
  if(document.getElementById("messageMail")) {
    var simplemde3 = new SimpleMDE({
      forceSync: true,
      element: document.getElementById("messageMail"),
      promptURLs: true,
      spellChecker: false,
    });
  }
})
// Handling the click event
var tag = document.getElementById('tag')
if(tag) {
  tag.addEventListener('keyup', function(event) {
    event.preventDefault()
    if(event.keyCode == 13) {
      tag.click()
    }
  })
}

var tagA = document.getElementById('tagsAdd')
if (tagA) {
  tag.addEventListener('keyup', function(event) {
    event.preventDefault()
    if(event.keyCode == 13) {
      tag.click()
    }
  })
}

$(function() {
  var date_input = $('input[name="date"]')
  var container = $('.bootstrap-iso form').length > 0 ? $('.bootstrap-iso form').parent() : "body";
  var options = {
    autoclose: true,
    format: 'yyyy/mm/dd',
    container: container,
    todayHighlight: true
  }
  date_input.datepicker(options)

$('#send_immediately').on('click',  function(e) {
  e.preventDefault()
  $('form[name="sendImmediatelyMail"]').attr('action', '/admin/send/immediately')
  $(this.form).submit()
})

  $('#addnote').on('click', function(e) {
    e.preventDefault()
    $('form[name="userForm"]').attr('action', '/user/addnote')
    $(this.form).submit()
  })
  $('#sendmail').on('click', function(e) {
    e.preventDefault()
    $('form[name="userForm"]').attr('action', '/user/sendmail')
    $(this.form).submit()
  })
})

$(function() {
  $('#tagSearch').keyup(function() {
    $('#tagSearchForm').submit(function(e) {
      e.preventDefault()
    })
    var tagsearch = $(this).val()
    if (tagsearch == "") {
      location.reload();
    }
    $.ajax({
      method: 'POST',
      url: '/search/tags',
      data: {
        tagsearch
      },
      dataType: 'json',
      success: function(json) {
        $('#searchResult').empty()
        if(json.length != undefined) {
          var html = ""
          html += '<tr>';
          html += '<td> 1 </td>';
          html += '<td>' + json[0].tag_name +'</td>'
          html += '<td><a type="button" name="edit" class="btn btn-default" href="/tags/edit/' + json[0].tag_name + '">Edit</a></td>'
          html += '<td><a type="button" name="Delete" class="btn btn-danger" href="/tags/delete/'+ json[0].tag_name + '">Delete</a></td>'
          html += '</tr>'
          $('#searchResult').append(html)
          console.log(json[0]);
        } else {
          // var html += ""
          // html += '<h2>'
        }
      },
      error: function(error) {
        console.log(error)
      }
    })
  })
})

$(function() {
  $('.taskForm').on("change", "input:checkbox",function() {
    $(this.form).submit();
  })
})

$(function() {
  $('#sendto').keyup(function(e) {
    $.getJSON("/api/tags", function(data) {
      var onlyTags = data.map(function(tags) {
        return tags.tag_name
      })
      $('#sendto').autocomplete({
        source: onlyTags
      })
    })
  })
})

$(function() {
  $('#notsendto').keyup(function(e) {
    $.getJSON("/api/tags", function(data) {
      var onlyTags = data.map(function(tags) {
        return tags.tag_name
      })
      $('#notsendto').autocomplete({
        source: onlyTags
      })
    })
  })
})
$(function() {
  $('.tagAdd').keyup(function(e) {
    console.log("clicked on tag adding box")
    $.getJSON("/api/tags", function(data) {
      var onlyTags = data.map(function(tags) {
        return tags.tag_name
      })
      $('.tagAdd').autocomplete({
        source: onlyTags
      })
    })
  })
})

// function validateText(id) {
//   if ($('#'+id).val() == null || $('#'+id).val() == "") {
//     var div = $("#"+id).closest('div');
//     div.addClass("has-error")
//     return false;
//   } else {
//     var div = $("#"+id).closest('div');
//     div.removeClass("has-error")
//     return true
//   }
// }
//
// $(document).ready(function() {
//   $('#submitBtn').click(function() {
//     if(!validateText("email")) {
//       return false;
//     }
//     $('form#emailForm').submit()
//   })
// })


$(function() {
  $(".stages_edit")
    .on("mouseenter", function() {
      var el1 = $(this).find("input")
      var val1 = el1.val()
      var formFind = $(this).find('form[name="stageForm"]').attr('action', '/admin/stage/edit/:' + encodeURI(val1))
      el1.removeAttr("disabled")
      el1.attr("name", "stage")
      $(el1).keydown(function(e) {
        if(e.keyCode == 13) {
          var data = {}
          data.stagename = val1
          data.stageData = el1.val()
          $("#stageForm").submit(function(e) {
            e.preventDefault()
              $.ajax({
                method: 'POST',
                url: '/admin/stage/edit/:' + val1,
                data: data,
                dataType: 'json',
                success: function(json) {
                  console.log(json);
                }
            })

          })
        }
      })
    })
    .on("mouseleave", function() {
      var el1 = $(this).find("input")
      el1.attr("disabled", "disabled")
      el1.removeAttr("name")
      $(this).siblings("input").removeAttr("name")
    })
})

$(function() {
  $('.stage_delete').on('click', function(e) {
    // e.preventDefault()
    confirm("Do you really want to delete ?")
  })
})

$(function() {
  $('.upload-btn').on('click', function() {
    $('#upload-input').click()
    $('.progress-bar').text('0%');
    $('.progress-bar').width('0%');
    $('#upload-input').on('change', function() {
      var files = $(this).get(0).files
      if (files.length > 0) {
        var formData = new FormData()
        for(var i = 0; i < files.length; i++) {
          var file = files[i]
          formData.append('uploads', file, file.name)
        }
        $.ajax({
          url: "/upload",
          type: "POST",
          data: formData,
          processData: false,
          contentType: false,
          success: function(data) {
            console.log('upload successful');
          },
          xhr: function() {
          // create an XMLHttpRequest
          var xhr = new XMLHttpRequest();

          // listen to the 'progress' event
          xhr.upload.addEventListener('progress', function(evt) {

            if (evt.lengthComputable) {
              // calculate the percentage of upload completed
              var percentComplete = evt.loaded / evt.total;
              percentComplete = parseInt(percentComplete * 100);

              // update the Bootstrap progress bar with the new percentage
              $('.progress-bar').text(percentComplete + '%');
              $('.progress-bar').width(percentComplete + '%');

              // once the upload reaches 100%, set the progress bar text to done
              if (percentComplete === 100) {
                $('.progress-bar').html('Done');
              }

            }

          }, false);

          return xhr;
        }
        })
      }
    })
  })
})



























// comment just to have some space








//
