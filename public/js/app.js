function loadDisqus(hash) {
  if (typeof loadDisqus.didLoad === 'undefined') {
    loadDisqus.didLoad = true;
    var disqus_shortname = 'lighthouse';
    var disqus_identifier = hash;
    var disqus_url = 'http://52.69.148.5:3000/' + hash;
    var dsq = document.createElement('script');
    dsq.type = 'text/javascript';
    dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    $('body').append('<div id="disqus_thread" style="display:none;"></div>');
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    //dsq.src = '//' + disqus_shortname + '.disqus.com/count.js';
    //(document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);

  } else {
    DISQUS.reset({
      reload: true,
      config: function() {
        this.page.identifier = hash;
        this.page.url = 'http://52.69.148.5:3000/' + hash;
      }
    });
  
  
  
  }
} 

function resize() {
  $('iframe').each(function() {
    var h = $(this).width() * 9 / 16;
    $(this).height(h);
  });
}

$(document).ready(function() {
  resize();
  $(document).on('click', '.comments', function(e) {
    e.preventDefault();
    $('#disqus_thread').remove();
    $(this).append('<div id="disqus_thread"></div>');
    if (loadDisqus.didLoad) {
      loadDisqus($(this).attr('hash'));
    }
  });
  loadDisqus();
});
$(window).resize(function() {
  resize();
});


