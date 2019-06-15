// Grab the articles as a json
$.getJSON("/articles", function(data) {
    for (var i = 0; i < data.length; i++) {
      $("#articles").append("<p id='headline' data-id='" + data[i]._id + "'>" + data[i].title + "</h3>" + "</p>");
      $("#articles").append("<div id='desc' data-id='" + data[i]._id + "'>" + data[i].desc + "</div>");
      $("#articles").append("<a id='link' data-id='" + data[i]._id + "'" + "href='" + data[i].link + "'>" + data[i].link + "</a>");
    }
  });
  
  $(document).on("click", "p", function() {
    $("#notes").empty();
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "GET",
      url: "/articles/" + thisId
    })
      .then(function(data) {
        console.log(data);
        $("#notes").append("<h2>" + data.title + "</h2>");
        $("#notes").append("<input id='titleinput' name='title' >");
        $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");
  
        if (data.note) {
          $("#titleinput").val(data.note.title);
          $("#bodyinput").val(data.note.body);
        }
      });
  });

  $(document).on("click", "#savenote", function() {
    var thisId = $(this).attr("data-id");
  
    $.ajax({
      method: "POST",
      url: "/articles/" + thisId,
      data: {
        title: $("#titleinput").val(),
        body: $("#bodyinput").val()
      }
    })
      .then(function(data) {
        console.log(data);
        $("#notes").empty();
      });
  
    $("#titleinput").val("");
    $("#bodyinput").val("");
  });

  $("#refresh").on("click", function(){
      $.ajax({
        method: "GET",
        url: "/scrape/"
      })
      .then(function(){
          window.location.reload()
      })
  })
  $("#comments").on("click", function(){
    $.ajax({
      method: "GET",
      url: "/notes/"
    })
    .then(function(){
        window.location.reload()
    })
})
  