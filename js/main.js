$(function() {
  var $input = $("#input");
  var cleaned = "";

  var markItUpOpts = {
    nameSpace: "html",
    onShiftEnter: {
      keepDefault: false,
      replaceWith: "<br>"
    },
    onCtrlEnter: {
      keepDefault: false,
      openWith: "\n<p>",
      closeWith: "</p>\n"
    },
    onCtrl: {
      keepDefault: false
    },
    onTab: {
      keepDefault: false,
      openWith: "  "
    },
    markupSet: [
      {
        key: "1",
        openWith: "<h1>",
        closeWith: "</h1>",
        placeHolder: "Titre 1"
      },
      {
        key: "2",
        openWith: "<h2>",
        closeWith: "</h2>",
        placeHolder: "Titre 2"
      },
      {
        key: "3",
        openWith: "<h3>",
        closeWith: "</h3>",
        placeHolder: "Titre 3"
      },
      {
        key: "P",
        openWith: "<p>",
        closeWith: "</p>"
      },
      {
        key: "B",
        openWith: "<strong>",
        closeWith: "</strong>"
      },
      {
        key: "I",
        openWith: "<em>",
        closeWith: "</em>"
      },
      {
        key: "S",
        openWith: "<sup>",
        closeWith: "</sup>"
      },
      {
        key: "G",
        openWith: "« ",
        closeWith: " »"
      },
      {
        key: "L",
        replaceWith: function(h) {
          return h.selection.toLowerCase();
        }
      },
      {
        key: "U",
        replaceWith: function(h) {
          return h.selection.toUpperCase();
        }
      },
      {
        key: "K",
        replaceWith: function(h) {
          return _.kebabCase(h.selection);
        }
      },
      {
        key: "Y",
        replaceWith: function(h) {
          return _(h.selection)
            .split(/(\s+|-)/)
            .map(d => _.capitalize(d))
            .join("");
        }
      },
      {
        key: " ",
        openWith: "&nbsp;"
      },
      {
        key: "6",
        openWith: " – "
      }
    ]
  };

  $input.countChar();

  $input.markItUp(markItUpOpts);
  $input.trigger("focus");

  // function spaceShow(str) {
  //   return str.replace(/ /g, "·");
  // }

  // function spaceHide(str) {
  //   return str.replace(/·/g, " ");
  // }

  // $(window).on("keyup", function (e) {
  //   if (e.which === 32) {
  //     $input.val(spaceShow($input.val()));
  //   }
  // });

  $input.on("focus", function(e) {
    $(window).one("keyup", function(e) {
      $("#autocopylabel").removeClass("done fail");
    });
  });

  $(".submit").on("click", function(e) {
    cleaned = cudm($input.val(), {
      autoNbsp: !!$("#auto_nbsp").prop("checked"),
      protect: {
        markdownLineBreaks: true
      }
    });

    $input.val(cleaned);
    window.setTimeout(function() {
      $input.trigger("focus");
    }, 150);

    if ($("#autocopy").prop("checked") && cleaned !== "") {
      copyTextToClipboard(cleaned)
        .then(function() {
          $("#autocopylabel").addClass("done");
        })
        .catch(function() {
          $("#autocopylabel").addClass("fail");
        });
    }
  });
});

function copyTextToClipboard(text) {
  // https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
  if (!navigator.clipboard) {
    fallbackCopyTextToClipboard(text);
    return true;
  } else {
    return navigator.clipboard.writeText(text);
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

/**
 * jQuery.countChar
 * Date: 2012-02-14
 * Requires : jQuery
 * @version 1.0
 * Counts the characters in a textarea (NB : element type not controlled)
 * Triggered by the focus and keyup events on the textarea + the related submit button
 */
(function($) {
  $.fn.countChar = function() {
    return this.each(function() {
      var textarea = this,
        label = $('<label class="bcount"><span>0</span> car.</label>')
          .insertBefore(this)
          .find("span");

      $(this)
        .parents("form")
        .find("input[type='submit']")
        .on("click", function(e) {
          count(e, textarea);
        });

      $(textarea).on("focus keyup", function(e) {
        count(e, textarea);
        $("#output").html($("#input").val());
      });

      function count(e, textarea) {
        e.preventDefault();
        label.text(textarea.value.replace(/\n/g, "").length);
      }
    });
  };
})(jQuery);
