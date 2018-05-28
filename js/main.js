$(function() {
  var $input = $("#input");
  var cleaned = "";

  var markItUpOpts = {
    nameSpace: "html",
    onShiftEnter: { keepDefault: false, replaceWith: "<br>" },
    onCtrlEnter: { keepDefault: false, openWith: "\n<p>", closeWith: "</p>\n" },
    onTab: { keepDefault: false, openWith: "  " },
    markupSet: [
      { key: "1", openWith: "<h1>", closeWith: "</h1>", placeHolder: "Titre de niveau 1" },
      { key: "2", openWith: "<h2>", closeWith: "</h2>", placeHolder: "Titre de niveau 2" },
      { key: "3", openWith: "<h3>", closeWith: "</h3>", placeHolder: "Titre de niveau 3" },
      { key: "P", openWith: "<p>", closeWith: "</p>" },
      { key: "B", openWith: "<strong>", closeWith: "</strong>" },
      { key: "I", openWith: "<em>", closeWith: "</em>" },
      { key: "G", openWith: "« ", closeWith: " »" },
      { key: "L", replaceWith: function(h) { return h.selection.toLowerCase(); } },
      { key: "U", replaceWith: function(h) { return h.selection.toUpperCase(); } },
      { key: " ", openWith: "&nbsp;" },
      { key: "6", openWith: " – " }
    ]
  };

  $input.markItUp(markItUpOpts).trigger("focus");

  $(".submit").on("click", function(e) {
    cleaned = cudm($input.val());

    $input.val(cleaned);

    if ($("#autocopy").prop("checked")) {
      copyTextToClipboard(cleaned);
    }
  });
});

function copyTextToClipboard(text) {
  // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return;
  }
}

function fallbackCopyTextToClipboard(text) {
  var textArea = document.createElement("textarea");
  textArea.value = text;
  document.body.appendChild(textArea);
  cursorFocus(textArea);
  textArea.select();

  try {
    var successful = document.execCommand("copy");
    var msg = successful ? "successful" : "unsuccessful";
  } catch (err) {}

  document.body.removeChild(textArea);
}

var cursorFocus = function(elem) {
  // https://stackoverflow.com/questions/4963053/focus-to-input-without-scrolling
  var x = window.scrollX,
    y = window.scrollY;
  elem.focus();
  window.scrollTo(x, y);
};
