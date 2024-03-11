export default class ElementRelativeCursorPosition {
  constructor(el) {
    this.el = el;
  }
  getDocumentRelativeElementOffset(el) {
    var rootEl = this.getRootOfEl(el);
    var {
      left: docLeft,
      top: docTop
    } = rootEl.getBoundingClientRect();
    var {
      left: elLeft,
      top: elTop
    } = el.getBoundingClientRect();
    return {
      x: Math.abs(docLeft) + elLeft,
      y: Math.abs(docTop) + elTop
    };
  }
  getRootOfEl(el) {
    if (el.parentElement) {
      return this.getRootOfEl(el.parentElement);
    }
    return el;
  }
  getComputedElementRelativeCursorPosition(event, documentRelativeElementOffset) {
    this.lastEvent = event;
    var position = this.getDocumentRelativeCursorPosition(event);
    var {
      x: cursorX,
      y: cursorY
    } = position;
    var {
      x: offsetX,
      y: offsetY
    } = documentRelativeElementOffset;
    return {
      x: Math.round(cursorX - offsetX),
      y: Math.round(cursorY - offsetY)
    };
  }
  getDocumentRelativeCursorPosition(event) {
    return {
      x: event.pageX,
      y: event.pageY
    };
  }
  get documentRelativeElementOffset() {
    if (!this.elementOffset) {
      this.elementOffset = this.getDocumentRelativeElementOffset(this.el);
    }
    return this.elementOffset;
  }
  getCursorPosition(event) {
    return this.getComputedElementRelativeCursorPosition(event, this.documentRelativeElementOffset);
  }
}