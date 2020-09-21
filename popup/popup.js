var translate_api_url = "https://translate-api.qlang.kz";

document.addEventListener("DOMContentLoaded", function () {
  var currentFocus;

  $("#text").on("input", function (e) {
    currentFocus = -1;

    document.getElementById("result").innerHTML = "";
    $.post(
      translate_api_url + "/suggest.php",
      { posttext: e.target.value },
      function (data) {
        console.log(data);
        //console.log(data.data.suggests);
        document.getElementById("suggestions").innerHTML = "";
        for (var i = 0; i < data.suggests.length; i++) {
          document.getElementById("suggestions").innerHTML +=
            '<li class="suggestionsList">' + data.suggests[i] + "</li>";
        }
      }
    );

    $("#suggestions")
      .unbind()
      .on("click", ".suggestionsList", function (event) {
        $("#text").val(event.target.innerText);
        document.getElementById("suggestions").innerHTML = "";
        displayTranslation(event.target.innerText);
      });
  });

  $("#text").on("keydown", function (event) {
    var x = document.getElementById("suggestions");
    if (x) x = x.getElementsByTagName("li");
    if (event.keyCode == 38) {
      event.preventDefault();
      currentFocus--;
      addActive(x);
    } else if (event.keyCode == 40) {
      currentFocus++;
      addActive(x);
    } else if (event.keyCode == 13) {
      event.preventDefault();
      if (currentFocus > -1) {
        if (x) x[currentFocus].click();
      } else if (currentFocus == -1) {
        document.getElementById("suggestions").innerHTML = "";
        var text = $("#text").val();
        if (text == "") document.getElementById("result").innerHTML = "";
        displayTranslation(text);
      }
    }
  });

  function addActive(x) {
    if (!x) return false;
    removeActive(x);
    if (currentFocus >= x.length) currentFocus = 0;
    if (currentFocus < 0) currentFocus = x.length - 1;
    x[currentFocus].classList.add("autocomplete-active");
  }
  function removeActive(x) {
    for (var i = 0; i < x.length; i++) {
      x[i].classList.remove("autocomplete-active");
    }
  }

  function displayTranslation(text) {
    $.post(translate_api_url + "/translate.php", { posttext: text }, function (
      data
    ) {
      document.getElementById("result").innerHTML = "";

      //adding sound icon
      if (false && data.audio_hash) {
        document.getElementById("result").innerHTML =
          "<div id='audio' title='Тыңдау'></div>";
        audio_hash = data.audio_hash;
      }

      // show transaltes
      if (typeof data.translation != "undefined")
        document.getElementById("result").innerHTML += data.translation;

      if (
        typeof data.similar_phrases != "undefined" &&
        data.similar_phrases.length > 0
      ) {
        document.getElementById("result").innerHTML += "Мүмкін: ";

        var str = [];
        data.similar_phrases.forEach(function (obj) {
          var span = '<span class="translation">' + obj + "</span>";
          str.push(span);
        });
        str.join(",");

        document.getElementById("result").innerHTML += str;
      }

      //suggestion click
      $(".translation").click(function (event) {
        $("#text").val(event.target.innerText);
        displayTranslation(event.target.innerText);
      });
    });
  }
});
