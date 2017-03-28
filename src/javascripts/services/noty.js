angular
  .module('slim')
  .service('Noty', Noty);
  
function Noty() {
  let main = {};
  let panel = {};
  let dialog = {};

  this.main = (message, type) => {
    if (isOpen(dialog) && !main.inQueue) {
      closeAndBuild(dialog, main, build);
    }
    else if (isOpen(panel) && !main.inQueue) {
      closeAndBuild(panel, main, build);
    }
    else if (!main.closed && (main.shown || main.showing)) {
      setText(main, message);
      setType(main, type);
      return;
    }
    else if (!main.inQueue) {
      build();
    }

    function build() {
      main = $('#notes').noty({
        id: 'main',
        text: message,
        type: type,
        timeout: 3500,
        callback: {
          afterClose() {
            dispose(main);
          }
        }
      });
    }
  };

  this.panel = (message, type) => {
    if (isOpen(main) && !panel.inQueue) {
      closeAndBuild(main, panel, build);
    }
    else if (isOpen(dialog) && !panel.inQueue) {
      closeAndBuild(dialog, panel, build);
    }
    else if (!panel.closed && (panel.shown || panel.showing)) {
      setText(panel, message);
      setType(panel, type);
      return;
    }
    else if (!panel.inQueue){
      build();
    }

    function build() {
      panel = $('#side-notes').noty({
        id: 'panel',
        text: message,
        type: type,
        timeout: 3500,
        callback: {
          afterClose() {
            dispose(panel);
          }
        }
      });
    }
  };

  this.dialog = (message, confirmed, canceled) => {
    if (isOpen(main) && !dialog.inQueue) {
      closeAndBuild(main, dialog, build);
    }
    else if (isOpen(panel) && !dialog.inQueue) {
      closeAndBuild(panel, dialog, build);
    }
    else if (!dialog.closed && (dialog.shown || dialog.showing)) {
      return;
    }
    else if (!dialog.inQueue) {
      build();
    }

    function build() {
      dialog = $('#notes').noty({
        id: 'dialog',
        type: 'confirm',
        text: message,
        buttons: [
          {addClass: 'btn btn-sm btn-primary', text: 'Delete', onClick: $noty => {
              $noty.close();
              confirmed();
            }
          },
          {addClass: 'btn btn-sm btn-danger', text: 'Cancel', onClick: $noty => {
              $noty.close();
              canceled();
            }}
        ],
        callback: {
          afterClose() {
            dispose(dialog);
          }
        }
      });
    }
  };

  this.getShownId = () => {
    let id;

    angular.forEach($.noty.store, note => {
      if (note.shown || note.showing) {
        id = note.options.id;
      }
    });
    return id;
  };

  this.close = (note) => {
    if ($.noty.get(note)) {
      $.noty.get(note).close();
    }
  };

  this.closeAll = () => {
    $.noty.closeAll();
  };

  /**
   * Helpers function
   */

  function setText(note, text) {
    if (!note.closed) {
      note.options.text = text;
      note.$bar.find('.noty_text').html(text);
      note.dequeueClose.call(note);
      setTimeout(() => {
        note.queueClose.call(note, note.options.timeout + 10);
      }, 10);
    }
  }

  function setType(note, type) {
    if (!note.closed && note.options.type !== type) {
      note.options.type = type;
      note.options.theme.style.apply(note);
      note.options.theme.callback.onShow.apply(note);
    }
  }

  function dispose(note) {
    note.$bar.remove();
    note.$bar   = null;
    note.closed = true;
  }

  function isOpen(note) {
    return note && !note.closed && !note.closing && (note.shown || note.showing);
  }

  function closeAndBuild(currentNote, replaceNote, callback) {
    currentNote.closing = true;
    replaceNote.inQueue = true;
    currentNote.$bar.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', () => {
      callback();
      currentNote.closing = false;
      replaceNote.inQueue = false;
    })
    currentNote.close();
  }

  /**
   * Customising noty plugin
   */

  /** Default values */
  $.noty.defaults.dismissQueue = false;
  $.noty.defaults.theme = 'bootstrapTheme';
  $.noty.defaults.progressBar = true;
  $.noty.defaults.animation = {
    open: 'animated fadeInDown',
    close: 'animated fadeOutUp'
  };

  /** Layout */
  $.noty.layouts.inline = {
    name: 'inline',
    options: {},
    container: {
      object: '<ul class="noty_inline_layout_container" />',
      selector: 'ul.noty_inline_layout_container',
      style() {
        $(this).css({
          width: '100%',
          height: 'auto',
          margin: 0,
          padding: 0,
          listStyleType: 'none',
          zIndex: 9999
        });
      }
    },
    parent: {
      object: '<li />',
      selector: 'li',
      css: {}
    },
    css: {
      display: 'none'
    },
    addClass: ''
  };

  /** Theme */
  $.noty.themes.bootstrapTheme = {
    name: 'bootstrapTheme',
    modal: {
      css: {
        position: 'fixed',
        width: '100%',
        height: '100%',
        backgroundColor: '#000',
        zIndex: 9999,
        opacity: 0.6,
        display: 'none',
        left: 0,
        top: 0,
        wordBreak: 'break-all'
      }
    },
    style() {
      const containerSelector = this.options.layout.container.selector;
      $(containerSelector).addClass('list-group');

      this.$closeButton.append('<span aria-hidden="true">&times;</span><span class="sr-only">Close</span>');
      this.$closeButton.addClass('close');

      this.$bar.addClass('list-group-item').css('padding', '0px').css('position', 'relative').css('border-radius', '0px');

      this.$progressBar.css({
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 2,
        width: '100%',
        backgroundColor: 'rgba(0,0,0,0.2)'
      });

      switch (this.options.type) {
        case 'alert':
        case 'notification':
          forceClass(this.$bar, 'info');
          break;
        case 'warning':
          forceClass(this.$bar, 'warning');
          break;
        case 'error':
          forceClass(this.$bar, 'danger');
          break;
        case 'information':
          forceClass(this.$bar, 'info');
          break;
        case 'success':
          forceClass(this.$bar, 'success');
          break;
      }

      function forceClass(element, className) {
        const classNames = ['info', 'warning', 'danger', 'success'];

        angular.forEach(classNames, name => {
          if (element.hasClass(name)) {
            element.removeClass(name);
          }
        })
        element.addClass(className);
      } 

      this.$message.css({
        textAlign: 'center',
        padding: '8px 10px 9px',
        width: 'auto',
        position: 'relative'
      });
    },
    callback: {
      onShow : function () { },
      onClose: function () { }
    }
  };
};