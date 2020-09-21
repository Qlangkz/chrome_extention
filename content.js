window.addEventListener("mouseup", wordSelected);
window.div = null;
div = document.createElement("div"); // make box
div.setAttribute("class", "rect");
div.style.display = "none";
document.body.appendChild(div); // finally append

var translate_api_url = "https://translate-api.qlang.kz";
function wordSelected(e) {
  //getting text selection and coordinates
  var selection = window.getSelection(),
    selectedText = selection.toString().trim(),
    range = selection.getRangeAt(0),
    rect = range.getBoundingClientRect();

  //if selectedText selected from tooltip break
  if (selectedText.length > 0) {
    gettranslations(selectedText);
  } else {
    closeRectDiv(e);
  }

  function gettranslations(text) {
    console.dir("gettranslations func");
    console.dir(text);
    if (text.length > 0) {
      //creating tooltip
      div.style.top = rect.top + pageYOffset + rect.height + 10 + "px"; // set coordinates
      div.style.left = rect.left + pageXOffset + "px";

      postTrans(text);

      function postTrans(text) {
        console.dir("postTrans func");
        console.dir(text);
        var audio_hash;
        text = text.toLowerCase();
        $.post(
          translate_api_url + "/translate.php",
          { posttext: text },
          function (data) {
            console.dir(data);
            if (rect.width > 0) {
              //tooltip body add
              div.innerHTML = "";

              //adding sound icon
              if (false && data.audio_hash) {
                div.innerHTML = "<div id='audio' title='Тыңдау'></div>";
                audio_hash = data.data.audio_hash;
              }

              //show translations
              if (typeof data.translation != "undefined") {
                div.innerHTML += data.phrase + "<hr>";
                div.innerHTML += data.translation;
              }

              //show suggestions
              if (
                typeof data.similar_phrases != "undefined" &&
                data.similar_phrases.length > 0
              ) {
                div.innerHTML += "<br>Мүмкін: ";

                if (Array.isArray(data.similar_phrases)) {
                  var str = [];

                  data.similar_phrases.forEach(function (obj) {
                    var span = '<span class="translation">' + obj + "</span>";
                    str.push(span);
                  });
                  str.join(",");
                } else {
                  var str =
                    '<span class="translation">' +
                    data.similar_phrases +
                    "</span>";
                }

                div.innerHTML += str;
              }

              //document.body.appendChild(div); // finally append
              div.style.display = "block";

              //suggestion click
              $(".translation").click(function (event) {
                //div.parentNode.removeChild(div);
                postTrans(event.target.innerText);
              });
            }
          }
        );
      }
    }
  }

  //close tooltip if mouseclicked outside
}

function closeRectDiv(e) {
  var container = $(".rect");
  if (!container.is(e.target) && container.has(e.target).length === 0) {
    div.style.display = "none";
    console.log("remove div");
  }
}
