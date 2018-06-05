$(function() {
  var $input = $("#input");
  var cleaned = "";

  var markItUpOpts = {
    nameSpace: "html",
    onShiftEnter: { keepDefault: false, replaceWith: "<br>" },
    onCtrlEnter: { keepDefault: false, openWith: "\n<p>", closeWith: "</p>\n" },
    onCtrl: { keepDefault: false },
    onTab: { keepDefault: false, openWith: "  " },
    markupSet: [
      { key: "1", openWith: "<h1>", closeWith: "</h1>", placeHolder: "Titre 1" },
      { key: "2", openWith: "<h2>", closeWith: "</h2>", placeHolder: "Titre 2" },
      { key: "3", openWith: "<h3>", closeWith: "</h3>", placeHolder: "Titre 3" },
      { key: "P", openWith: "<p>", closeWith: "</p>" },
      { key: "B", openWith: "<strong>", closeWith: "</strong>" },
      { key: "I", openWith: "<em>", closeWith: "</em>" },
      { key: "S", openWith: "<sup>", closeWith: "</sup>" },
      { key: "G", openWith: "« ", closeWith: " »" },
      { key: "L", replaceWith: function(h) { return h.selection.toLowerCase(); } },
      { key: "U", replaceWith: function(h) { return h.selection.toUpperCase(); } },
      { key: "K", replaceWith: function(h) { return _.kebabCase(h.selection); } },
      { key: "Y", replaceWith: function(h) { return _.startCase(h.selection.toLowerCase()); } },
      { key: " ", openWith: "&nbsp;" },
      { key: "6", openWith: " – " }
    ]
  };

  $input.markItUp(markItUpOpts);
  $input.trigger("focus");

  $input.on("focus", function (e) {
    $(window).one("keyup", function (e) {
      $("#autocopylabel").removeClass("done");
    });
  });

  $(".submit").on("click", function(e) {

    cleaned = cudm($input.val(), { protect: { markdownLineBreaks: false } });

    $input.val(cleaned);
    window.setTimeout(function () { $input.trigger("focus"); }, 150);

    if ($("#autocopy").prop("checked") && cleaned !== "") {
      copyTextToClipboard(cleaned);
      $("#autocopylabel").addClass("done");
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
