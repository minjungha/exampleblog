$(document).ready(function() {
  var timer = null;
  $('#title').on('keyup', function() {
    autoSave();
  });
  $('.summernote').summernote({
    lang: 'ko-KR',
    toolbar: [
      ['style', ['bold', 'italic', 'underline', 'clear']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['height', ['height']],
      ['table', ['table']],
      ['insert', ['link', 'picture', 'video']]
    ],
    onKeyup: function(e) {
      autoSave();
    },
    onImageUpload: function(files) {
      var editor = $(this);
      autoSave(function() {
        for (var i=0; i<files.length; i++) {
          sendFile(files[i], editor);
        }
      });
      // 업로드 하면서 tempPost에 이미지 위치를 디비에 올린다.(서버)
      // 만일 다른 사람이 절대 경로를 복사해서 가져간 경우
      // 글을 작성할때 아래와 같은 행동을 하면 된다.
      // Post.getImages 를 해서 나오는 이미지 리스트를 각각
      // image.getPosts 를 해서 포스트가 하나도 없으면 삭제한다.
    }
  });
  
  function sendFile(file, editor) {
    var data = new FormData();
    data.append('photo', file);
    console.log(file);
    $.ajax({
      data: data,
      method: 'POST',
      url: '/upload',
      contentType: false,
      processData: false,
    }).done(function(res) {
      editor.summernote('insertImage', res.url);
    });
  }

  function autoSave(done) {
    if (timer) {
      clearInterval(timer);
    }
    timer = setTimeout(function() {
      timer = null;
      savePost(done);
    }, 1000);
  }
  function savePost(done) {
  console.log(done);
    var title = $('#title').val();
    var content = $('.summernote').code();
    var images = $($('.summernote').code()).find('img').toArray().map(function() {
      return $(this).attr('src');
    });
    $.ajax({
      url: '/write',
      method: 'PUT',
      data: {
        title: title,
        content: content,
        images: images
        // image중 현재 서버에 올라간 파일을 찾아낸다.
        // domain을 검사하거나? 뭐 이건 내일 찾아본다.
        // 디비에 올린다.
      }
    }).done(function() {
      if (done) {
        done();
      }
    });
  }

  $('#post-form').submit(function() {
    $('#post-form [type=submit]').attr('disabled', 'disabled');
    $('#content').val($('.summernote').code());
    return true;
  });
});
