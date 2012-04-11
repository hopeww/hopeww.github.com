 // http://tapirgo.com/api/1/search.json?token=4f8586e03f61b06e0a00001c&query=toronto
 // http://txje.api.indextank.com/v1/indexes/HOPE_WorldWide_of_Canada/search?q=toronto
 $(document).ready(function() {
      $('form#search').button().submit(function() {
        // only do a search if user entered a keyword in the search box
        if($.trim($('input#query').val())!=""){
          search($('input#query').val());
        }
        return false;
      }); 
      $('#clear_search').click(function(){
        $('input#query').val("");
        $('div#results').empty();
      });
    });

    function create_heading(){
      $('div#results').empty();
      $('div#results').append("<div class='modal-header'><a class='close' data-dismiss='modal'>x</a><h1 id='results'>Search results</h1></div><div class='modal-body' id='results_body'>");
    }
    function create_footer(){
      $('div#results').append("<br /></div><div class='modal-footer'><a href='' class='btn' data-dismiss='modal' >Close</a></div>");
    }
    function search(query) {
      //var result = $.getJSON('http://hopewwc.api.houndsleuth.com/v1/indexes/HOPEWW/search?q=' + encodeURIComponent(query) + '&fetch=title&snippet=text&callback=?', function(data) {
      //var result = $.getJSON('http://txje.api.indextank.com/v1/indexes/HOPE_WorldWide_of_Canada/search?q=' + encodeURIComponent(query) + '&fetch=title&snippet=text&callback=?', function(data) {
      /*  
      var result = $.getJSON('http://tapirgo.com/api/1/search.json?token=4f8586e03f61b06e0a00001c?query=' + encodeURIComponent(query) + '&callback=?', function(data) {
        create_heading();
        var cnt = 0;
        var results_str = "";
        index tank
        $.each(data.results, function(index, result) {
          results_str += '<div id="result"><br /><p><a href="' + result.docid + '">' + result.docid + '</a><br/>' + result.snippet_text + '</p></div>';
          cnt +=1;
        });
        if(cnt==0){
          $('#results_body').append(" Found 0 results.");
        }else{
          $('#results_body').append(results_str);
        }
        create_footer();
        $("#results").modal({show:true});
      } //end call back function 
    ); //end var result
  */

    var url = 'http://tapirgo.com/api/1/search.json?token=4f8586e03f61b06e0a00001c?query=' + encodeURIComponent(query) + '&callback=?';
    var result =  $.getJSON(url, function(data){
      create_heading();
      var results_str = "";
      var cnt = 0;
      /*
      $.each(data, function(key, val) {
        results_str = '<div id="result"><h3><a href="' + val.link + '">' + val.title + '</a></h3><p>' + val.content + '</p></div>'
        cnt +=1;
      });
 */
       if(cnt==0){
          $('#results_body').append(" Found 0 results.");
        }else{
          $('#results_body').append(results_str);
        }
      create_footer();
      // $("#results").modal({show:true});
      alert (url);
    }); //end call back & end var result
  }