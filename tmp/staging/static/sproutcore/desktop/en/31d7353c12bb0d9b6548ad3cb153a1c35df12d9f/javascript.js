/* >>>>>>>>>> BEGIN source/core.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/**
  If set to `NO`, then pressing backspace will NOT navigate to the previous
  page in the browser history, which is the default behavior in most browsers.
  
  Usually it is best to leave this property set to `NO` in order to prevent the
  user from inadvertently losing data by pressing the backspace key.

  @static
  @type Boolean
  @default NO
*/
SC.allowsBackspaceToPreviousPage = NO;

/**
  @type String
  @static
  @constant
*/
SC.HORIZONTAL_ORIENTATION = 'horizontal';

/**
  @type String
  @static
  @constant
*/
SC.VERTICAL_ORIENTATION = 'vertical' ;

/* >>>>>>>>>> BEGIN source/mixins/collection_row_delegate.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/** 
  @namespace
  
  `CollectionRowDelegate`s are consulted by `SC.ListView` and `SC.TableView` to
  control the height of rows, including specifying custom heights for
  specific rows.
  
  You can implement a custom row height in one of two ways.
*/
SC.CollectionRowDelegate = {

  /**
    Walk like a duck.
  
    @type Boolean
    @default YES
  */
  isCollectionRowDelegate: YES,
  
  /**
    Size of an item without spacing or padding.
    Unless you implement some custom row height
    support, this row height will be used for all items.
    
    @type Number
    @default 18
  */
  itemHeight: 24,
  
  /**
    This inserts empty space between rows that you can use for borders.
    
    @type Number
    @default 0
  */
  rowSpacing: 0,
  
  /**
    This is useful if you are using a custom item view that needs to be padded.
    This value is added to the top and bottom of the `itemHeight`.
    
    @type Number
    @default 0
  */
  rowPadding: 0,
  
  /**
    Total row height used for calculation. Equal to `itemHeight + (2 * rowPadding)`.
    
    @type Number
  */
  rowHeight: function(key, value) {
    var rowPadding = this.get('rowPadding');
    var itemHeight = this.get('itemHeight');

    if (value !== undefined) {
      this.set('itemHeight', value-rowPadding*2);
      return value;
    }

    return itemHeight + rowPadding * 2;
  }.property('itemHeight', 'rowPadding'),

  /**
    Index set of rows that should have a custom row height. If you need
    certain rows to have a custom row height, then set this property to a
    non-null value.  Otherwise leave it blank to disable custom row heights.
    
    @type SC.IndexSet
  */
  customRowHeightIndexes: null,
  
  /**
    Called for each index in the `customRowHeightIndexes` set to get the
    actual row height for the index.  This method should return the default
    rowHeight if you don't want the row to have a custom height.
    
    The default implementation just returns the default rowHeight.
    
    @param {SC.CollectionView} view the calling view
    @param {Object} content the content array
    @param {Number} contentIndex the index 
    @returns {Number} row height
  */
  contentIndexRowHeight: function(view, content, contentIndex) {
    return this.get('rowHeight');
  }

};

/* >>>>>>>>>> BEGIN source/mixins/collection_view_delegate.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @namespace

  A Collection View Delegate is consulted by a `SC.CollectionView` to make
  policy decisions about certain behaviors such as selection control and
  drag and drop.  If you need to control other aspects of your data, you may
  also want to add the `SC.CollectionContent` mixin.
  
  To act as a Collection Delegate, just apply this mixin to your class.  You
  must then set the "delegate" property on the CollectionView to your object.
  
  Alternatively, if no delegate is set on a CollectionView, but the content 
  implements this mixin, the content object will be used as the delegate 
  instead.
  
  If you set an ArrayController or its arrangedObjects property as the content
  of a CollectionView, the ArrayController will automatically act as the 
  delegate for the view.
  
  @since SproutCore 1.0
*/
SC.CollectionViewDelegate = {

  /**
    Walk like a duck. Used to detect the mixin by SC.CollectionView.
    
    @type Boolean
    @default YES
    @constant
  */
  isCollectionViewDelegate: YES,


  // ..........................................................
  // SELECTION
  // 

  /**
    This method will be called anytime the collection view is about to
    change the selection in response to user mouse clicks or keyboard events.
    
    You can use this method to adjust the proposed selection, eliminating any
    selected objects that cannot be selected.  The default implementation of
    this method simply returns the proposed selection.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.IndexSet} sel Proposed array of selected objects.
    @returns {SC.IndexSet} Actual allow selection index set
  */
  collectionViewSelectionForProposedSelection: function(view, sel) {
    return sel;
  },

  /**
    Called by the collection when attempting to select an item.  Return the
    actual indexes you want to allow to be selected.  Return null to disallow
    the change.  The default allows all selection.
    
    @param {SC.CollectionView} view the view collection view
    @param {SC.IndexSet} indexes the indexes to be selected
    @param {Boolean} extend YES if the indexes will extend existing sel
    @returns {SC.IndexSet} allowed index set
  */
  collectionViewShouldSelectIndexes: function (view, indexes, extend) {
    return indexes;
  },

  /**
    Called by the collection when attempting to deselect an item.  Return the
    actual indexes you want to allow to be deselected.  Return `null` to
    disallow the change.  The default allows all selection.
    
    Note that you should not modify the passed in IndexSet.  clone it instead.
    
    @param {SC.CollectionView} view the view collection view
    @param {SC.IndexSet} indexes the indexes to be selected
    @returns {SC.IndexSet} allowed index set
  */
  collectionViewShouldDeselectIndexes: function (view, indexes) {
    return indexes;
  },


  // ..........................................................
  // EDIT OPERATIONS
  // 

  /**
    Called by the collection view whenever the `deleteSelection()` method is
    called.  You can implement this method to get fine-grained control over
    which items can be deleted.  To prevent deletion, return null.
    
    This method is only called if canDeleteContent is `YES` on the collection
    view.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.IndexSet} indexes proposed index set of items to delete.
    @returns {SC.IndexSet} index set allowed to delete or null.
  */
  collectionViewShouldDeleteIndexes: function(view, indexes) {
    return indexes;
  },

  /**
    Called by the collection view to actually delete the selected items.
    
    The default behavior will use standard array operators to delete the
    indexes from the array. You can implement this method to provide your own
    deletion method.
    
    If you simply want to control the items to be deleted, you should instead
    implement `collectionViewShouldDeleteItems()`. This method will only be
    called if canDeleteContent is `YES` and `collectionViewShouldDeleteIndexes()`
    returns a non-empty index set
    
    @param {SC.CollectionView} view collection view
    @param {SC.IndexSet} indexes the items to delete
    @returns {Boolean} YES if the deletion was a success.
  */
  collectionViewDeleteContent: function(view, content, indexes) {
    if (!content) return NO ;

    if (SC.typeOf(content.destroyAt) === SC.T_FUNCTION) {
      content.destroyAt(indexes);
      view.selectPreviousItem(NO, 1);
      return YES ;
    } else if (SC.typeOf(content.removeAt) === SC.T_FUNCTION) {
      content.removeAt(indexes);
      view.selectPreviousItem(NO, 1);
      return YES;
    } else {
      return NO;
    }
  },


  // ..........................................................
  // DRAGGING
  // 
  
  /**
    Called by the collection view just before it starts a drag to give you
    an opportunity to decide if the drag should be allowed.
    
    You can use this method to implement fine-grained control over when a
    drag will be allowed and when it will not be allowed. For example, you
    may enable content reordering but then implement this method to prevent
    reordering of certain items in the view.
    
    The default implementation always returns `YES`.
    
    @param {SC.CollectionView} view the collection view
    @returns {Boolean} YES to allow, NO to prevent it
  */
  collectionViewShouldBeginDrag: function(view) {
    return YES;
  },

  /**
    Called by the collection view just before it starts a drag so that
    you can provide the data types you would like to support in the data.
    
    You can implement this method to return an array of the data types you
    will provide for the drag data.
    
    If you return `null` or an empty array, can you have set `canReorderContent`
    to `YES` on the CollectionView, then the drag will go ahead but only
    reordering will be allowed.  If `canReorderContent` is `NO`, then the drag
    will not be allowed to start.
    
    If you simply want to control whether a drag is allowed or not, you
    should instead implement `collectionViewShouldBeginDrag()`.
    
    The default returns an empty array.
    
    @param {SC.CollectionView} view the collection view to begin dragging.
    @returns {Array} array of supported data types.
  */
  collectionViewDragDataTypes: function(view) {
    return [];
  },

  /**
    Called by a collection view when a drag concludes to give you the option
    to provide the drag data for the drop.
    
    This method should be implemented essentially as you would implement the
    `dragDataForType()` if you were a drag data source.  You will never be asked
    to provide drag data for a reorder event, only for other types of data.
    
    The default implementation returns null.
    
    @param view {SC.CollectionView} the collection view that initiated the drag
    @param dataType {String} the data type to provide
    @param drag {SC.Drag} the drag object
    @returns {Object} the data object or null if the data could not be provided.
  */
  collectionViewDragDataForType: function(view, drag, dataType) {
    return null;
  },

  /**
    Called once during a drag the first time view is entered. Return all
    possible drag operations OR'd together.
    
    @param {SC.CollectionView} view the collection view that initiated the drag
    @param {SC.Drag} drag the drag object
    @param {Number} proposedDragOperations proposed logical OR of allowed drag operations.
    @returns {Number} the allowed drag operations. Defaults to op
  */
  collectionViewComputeDragOperations: function(view, drag, proposedDragOperations) {
    return proposedDragOperations;
  },

  /**
    Called by the collection view during a drag to let you determine the
    kind and location of a drop you might want to accept.
    
    You can override this method to implement fine-grained control over how
    and when a dragged item is allowed to be dropped into a collection view.
    
    This method will be called by the collection view both to determine in
    general which operations you might support and specifically the operations
    you would support if the user dropped an item over a specific location.
    
    If the `proposedDropOperation` parameter is `SC.DROP_ON` or `SC.DROP_BEFORE`,
    then the `proposedInsertionPoint` will be a non-negative value and you
    should determine the specific operations you will support if the user
    dropped the drag item at that point.
    
    If you do not like the proposed drop operation or insertion point, you
    can override these properties as well by setting the `proposedDropOperation`
    and `proposedInsertionIndex` properties on the collection view during this
    method. These properties are ignored all other times.
    
    @param {SC.CollectionView} view the collection view
    @param {SC.Drag} drag the current drag object
    @param {Number} op proposed logical OR of allowed drag operations.
    @param {Number} proposedInsertionIndex an index into the content array representing the proposed insertion point.
    @param {String} proposedDropOperation the proposed drop operation. Will be one of SC.DROP_ON, SC.DROP_BEFORE, or SC.DROP_ANY.
    @returns the allowed drag operation. Defaults to op
  */
  collectionViewValidateDragOperation: function(view, drag, op, proposedInsertionIndex, proposedDropOperation) {
    // don't allow dropping on by default
    return (proposedDropOperation & SC.DROP_ON) ? SC.DRAG_NONE : op ;
  },
  
  /**
    Called by the collection view to actually accept a drop.  This method will
    only be invoked AFTER your `validateDrop method has been called to
    determine if you want to even allow the drag operation to go through.
    
    You should actually make changes to the data model if needed here and
    then return the actual drag operation that was performed. If you return
    `SC.DRAG_NONE` and the dragOperation was `SC.DRAG_REORDER`, then the default
    reorder behavior will be provided by the collection view.
    
    @param {SC.CollectionView} view
    @param {SC.Drag} drag the current drag object
    @param {Number} op proposed logical OR of allowed drag operations.
    @param {Number} proposedInsertionIndex an index into the content array representing the proposed insertion point.
    @param {String} proposedDropOperation the proposed drop operation.  Will be one of SC.DROP_ON, SC.DROP_BEFORE, or SC.DROP_ANY.
    @returns the allowed drag operation. Defaults to proposedDragOperation
  */
  collectionViewPerformDragOperation: function(view, drag, op, proposedInsertionIndex, proposedDropOperation) {
    return SC.DRAG_NONE;
  },
  
  /**
    Renders a drag view for the passed content indexes. If you return null
    from this, then a default drag view will be generated for you.
    
    The default implementation returns null.
    
    @param {SC.CollectionView} view
    @param {SC.IndexSet} dragContent
    @returns {SC.View} view or null
  */
  collectionViewDragViewFor: function(view, dragContent) {
    return null;
  },

  /**
    Allows the ghost view created in `collectionViewDragViewFor` to be displayed
    like a cursor instead of the default implementation. This sets the view 
    origin to be the location of the mouse cursor.
    
    @type Boolean
    @default NO
  */
  ghostActsLikeCursor: NO
  
};

/* >>>>>>>>>> BEGIN source/panes/modal.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/** @class

  A modal pane is used to capture mouse events inside a pane that is modal.
  You normally will not work with modal panes directly, though you may set
  the modalPane property to a subclass of this pane when designing custom
  panes.

  A modal pane is automatically appended when a pane with isModal set to
  `YES` is made visible and removed when the same pane is hidden.  The only
  purpose of the `ModalPane` is to absorb mouse events so that they cannot
  filter through to the underlying content.

  @extends SC.Pane
  @since SproutCore 1.0
*/
SC.ModalPane = SC.Pane.extend(
/** @scope SC.ModalPane.prototype */{

  /**
    @type Array
    @default ['sc-modal']
    @see SC.View#classNames
  */
  classNames: 'sc-modal',

  /** @private */
  _openPaneCount: 0,

  /** @private
    Called by a pane just before it appends itself.   The modal pane can
    make itself visible first if needed.

    @param {SC.Pane} pane the pane
    @returns {SC.ModalPane} receiver
  */
  paneWillAppend: function(pane) {
    var _tmpPane;
    this._openPaneCount++;
    if (!this.get('isVisibleInWindow')) this.append();
    var panes = SC.RootResponder.responder.panes;
    for(var i=0, iLen=panes.length; i<iLen; i++ ){
      _tmpPane = panes[i];
      if(_tmpPane!==pane) {
        //_tmpPane.set('ariaHidden', YES);
        this._hideShowTextfields(_tmpPane, NO);
      }
    }
    return this ;
  },

  /** @private
    Called by a pane just after it removes itself.  The modal pane can remove
    itself if needed.   Modal panes only remove themselves when an equal
    number of `paneWillAppend()` and `paneDidRemove()` calls are received.

    @param {SC.Pane} pane the pane
    @returns {SC.ModalPane} receiver
  */
  paneDidRemove: function(pane) {
    var _tmpPane;
    this._openPaneCount--;
    var panes = SC.RootResponder.responder.panes;
    for(var i=0, iLen=panes.length; i<iLen; i++ ){
      _tmpPane = panes[i];
      if(_tmpPane!==pane) {
        //_tmpPane.set('ariaHidden', NO);
        this._hideShowTextfields(_tmpPane, YES);
      }
    }
    if (this._openPaneCount <= 0) {
      this._openPaneCount = 0 ;
      if (this.get('isVisibleInWindow')) this.remove();
    }
  },

  /** @private
    If `focusable` is NO all SC.TextFieldViews not belonging to the given
    pane will have isBrowserFocusable set to NO.  If `focusable` is YES, then
    all SC.TextFieldViews not belonging to the given pane will have
    isBrowserFocusable set to YES, unless they previously had it set explictly
    to NO.
  */
  _hideShowTextfields: function(pane, focusable){
    var view;
    for(view in SC.View.views){
      view = SC.View.views[view];
      if (view!==pane && view.get('pane')===pane && view.get('isTextField')){
        if (focusable) {
          // Setting isBrowserFocusable back to YES. If we cached the previous
          // value, use that instead.
          if (view._scmp_isBrowserFocusable !== undefined) {
            focusable = view._scmp_isBrowserFocusable;

            // Clean up entirely.
            delete view._scmp_isBrowserFocusable;
          }
        } else {
          // Cache the value of isBrowserFocusable. If the text field
          // already had isBrowserFocusable: NO, we don't want to
          // set it back to YES.
          view._scmp_isBrowserFocusable = view.get('isBrowserFocusable');
        }
        view.set('isBrowserFocusable', focusable);
      }
    }
  },

  /** @private */
  mouseDown: function(evt) {
    var owner = this.get('owner');
    if (owner && owner.modalPaneDidClick) owner.modalPaneDidClick(evt);
  },

  /** @private */
  touchStart: function(evt) {
    this.mouseDown(evt);
  }
});

/* >>>>>>>>>> BEGIN source/panes/panel.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('panes/modal');

/** @class

  Most SproutCore applications need modal panels. The default way to use the 
  panel pane is to simply add it to your page like this:
  
      SC.PanelPane.create({
        layout: { width: 400, height: 200, centerX: 0, centerY: 0 },
        contentView: SC.View.extend({
        })
      }).append();
  
  This will cause your panel to display.  The default layout for a Panel 
  is to cover the entire document window with a semi-opaque background, and to 
  resize with the window.
  
  @extends SC.Pane
  @author Erich Ocean
  @since SproutCore 1.0
*/
SC.PanelPane = SC.Pane.extend(
/** @scope SC.PanelPane.prototype */ {

  /**
    Walk like a duck.
    @type {Boolean}
  */
  isPanelPane: YES,

  /**
    @type Array
    @default ['sc-panel']
    @see SC.View#classNames
  */
  classNames: ['sc-panel'],
  
  /**
    @type Boolean
    @default YES
    @see SC.Pane#acceptsKeyPane
  */
  acceptsKeyPane: YES,

  /**
    The WAI-ARIA role for panel pane.

    @type String
    @default 'dialog'
    @constant
  */
  ariaRole: 'dialog',

  /**
    The WAI-ARIA label for the panel. Screen readers will use this to tell
    the user a name for the panel.

    @type String
  */
  ariaLabel: null,

  /**
    The WAI-ARIA labelledby for the panel. Screen readers will use this to tell
    the header or name of your panel if there is no label. This should be an id
    to an element inside the panel.

    @type String
  */
  ariaLabelledBy: null,

  /**
    The WAI-ARIA describedby text. Screen readers will use this to speak the description
    of the panel. This should be an id to an element inside the panel.

    @type String
  */
  ariaDescribedBy: null,

  /**
    Indicates that a pane is modal and should not allow clicks to pass
    though to panes underneath it. This will usually cause the pane to show
    the modalPane underneath it.
    
    @type Boolean
    @default YES
  */
  isModal: YES,

  /**
    The modal pane to place behind this pane if this pane is modal. This
    must be a subclass or an instance of SC.ModalPane.
  */
  modalPane: SC.ModalPane.extend({
    classNames: 'for-sc-panel'
  }),
  
  // ..........................................................
  // CONTENT VIEW
  // 
  
  /**
    Set this to the view you want to act as the content within the panel.
    
    @type SC.View
    @default null
  */
  contentView: null,
  contentViewBindingDefault: SC.Binding.single(),
  
  /**
    @param {SC.View} newContent
  */
  replaceContent: function(newContent) {
    this.removeAllChildren() ;
    if (newContent) this.appendChild(newContent);
  },

  /** @private */
  createChildViews: function() {
    // if contentView is defined, then create the content
    var view = this.contentView ;
    if (view) {
      view = this.contentView = this.createChildView(view) ;
      this.childViews = [view] ;
    }
  },

  
  /**
    Invoked whenever the content property changes. This method will simply
    call replaceContent. Override replaceContent to change how the view is
    swapped out.
  */
  contentViewDidChange: function() {
    this.replaceContent(this.get('contentView'));
  }.observes('contentView'),

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /**
    The name of the theme's `SC.PanelPane` render delegate.

    @type String
    @default 'panelRenderDelegate'
  */
  renderDelegateName: 'panelRenderDelegate',

  // get the modal pane. 
  _modalPane: function() {
    var pane = this.get('modalPane');
    
    // instantiate if needed
    if (pane && pane.isClass) {
      pane = pane.create({ owner: this });
      this.set('modalPane', pane); 
    }
    
    return pane ;
  },
  
  /** @private - whenever showing on screen, deal with modal pane as well */
  appendTo: function(elem) {
    var pane ;
    if (!this.get('isVisibleInWindow') && this.get('isModal') && (pane = this._modalPane())) {
      this._isShowingModal = YES;
      pane.paneWillAppend(this);
    }
    return arguments.callee.base.apply(this,arguments);
  },
  
  /** @private - when removing from screen, deal with modal pane as well. */
  remove: function() {
    var pane, ret = arguments.callee.base.apply(this,arguments);
    
    if (this._isShowingModal) {
      this._isShowingModal = NO ;
      if (pane = this._modalPane()) pane.paneDidRemove(this);
    }
    return ret ;
  },

  destroy: function() {
    var modal = this.get('modalPane');
    if (modal && !modal.isClass) {
      modal.destroy();
    }

    arguments.callee.base.apply(this,arguments);
  },
  
  /** @private - if isModal state changes, update pane state if needed. */
  _isModalDidChange: function() {
    var pane, isModal = this.get('isModal');
    if (isModal) {
       if (!this._isShowingModal && this.get('isVisibleInWindow') && (pane = this._modalPane())) {
         this._isShowingModal = YES;
         pane.paneWillAppend(this);
       }
       
    } else {
      if (this._isShowingModal && (pane = this._modalPane())) {
        this._isShowingModal = NO ;
        pane.paneDidRemove(this); 
      }
    }
  }.observes('isModal'),
  
  /** @private - extends SC.Pane's method - make panel keyPane when shown */
  paneDidAttach: function() {
    var ret = arguments.callee.base.apply(this,arguments);
    this.becomeKeyPane();
    return ret ;
  },

  displayProperties: ['ariaLabel', 'ariaLabelledBy', 'ariaDescribedBy']
});

/* >>>>>>>>>> BEGIN source/panes/palette.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('panes/panel');

/** @class
  Displays a non-modal, default positioned, drag&drop-able palette pane.

  The default way to use the palette pane is to simply add it to your page like this:
  
      SC.PalettePane.create({
        layout: { width: 400, height: 200, right: 0, top: 0 },
        contentView: SC.View.extend({
        })
      }).append();
  
  This will cause your palette pane to display.
  
  Palette pane is a simple way to provide non-modal messaging that won't 
  blocks the user's interaction with your application.  Palette panes are 
  useful for showing important detail information with flexible position.
  They provide a better user experience than modal panel.
  
  @extends SC.PanelPane
  @since SproutCore 1.0
*/
SC.PalettePane = SC.PanelPane.extend(
/** @scope SC.PalettePane.prototype */ {
  
  /**
    @type Array
    @default ['sc-palette']
    @see SC.View#classNames
  */
  classNames: ['sc-palette'],
  
  /**
    Palettes are not modal by default
    
    @type Boolean
    @default NO
  */
  isModal: NO,
  
  /**
    @type SC.View
    @default SC.ModalPane
  */
  modalPane: SC.ModalPane,
  
  /**
    @type Boolean
    @default NO
  */
  isAnchored: NO,
  
  /** @private */
  _mouseOffsetX: null,

  /** @private */
  _mouseOffsetY: null,

  /** @private
    Drag & drop palette to new position.
  */
  mouseDown: function(evt) {
    var f=this.get('frame');
    this._mouseOffsetX = f ? (f.x - evt.pageX) : 0;
    this._mouseOffsetY = f ? (f.y - evt.pageY) : 0;
    return YES;
  },

  /** @private */
  mouseDragged: function(evt) {
    if(!this.isAnchored) {
      this.set('layout', { width: this.layout.width, height: this.layout.height, left: this._mouseOffsetX + evt.pageX, top: this._mouseOffsetY + evt.pageY });
      this.updateLayout();
    }
    return YES;
  },
  
  /** @private */
  touchStart: function(evt){
    return this.mouseDown(evt);
  },
  
  /** @private */
  touchesDragged: function(evt){
    return this.mouseDragged(evt);
  }

});

/* >>>>>>>>>> BEGIN source/render_delegates/button.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/**
  Renders and updates the HTML representation of a button.
*/
SC.BaseTheme.buttonRenderDelegate = SC.RenderDelegate.create({
  className: 'button',

  //
  // SIZE DEFINITIONS
  //
  'sc-small-size': {
    height: 18,
    autoResizePadding: { width: 15, height: 0 }
  },

  'sc-regular-size': {
    height: 24,
    autoResizePadding: { width: 20, height: 0 }
  },

  'sc-huge-size': {
    height: 30,
    autoResizePadding: { width: 30, height: 0 }
  },

  'sc-jumbo-size': {
    height: 44,
    autoResizePadding: { width: 50, height: 0 }
  },


  //
  // RENDERING LOGIC
  //

  /**
    Called when we need to create the HTML that represents the button.

    @param {SC.Object} dataSource the object containing the information on how to render the button
    @param {SC.RenderContext} context the render context instance
  */
  render: function(dataSource, context) {
    this.addSizeClassName(dataSource, context);
    
    var labelContent,
        toolTip     = dataSource.get('toolTip'),
        isSelected  = dataSource.get('isSelected') || NO,
        isActive    = dataSource.get('isActive') || NO,
        isDefault   = dataSource.get('isDefault') || NO,
        isCancel    = dataSource.get('isCancel') || NO,
        isToggle    = (dataSource.get('buttonBehavior') === SC.TOGGLE_BEHAVIOR),
        labelId     = SC.guidFor(dataSource) + '-label';

    context.setClass({
      'icon': !!dataSource.get('icon'),
      'def':  isDefault,
      'cancel': isCancel && !isDefault,
      'active': isActive,
      'sel': isSelected
    });

    if (toolTip) {
      context.attr('title', toolTip);
      context.attr('alt', toolTip);
    }
    
    this.includeSlices(dataSource, context, SC.THREE_SLICE);
    // accessibility
    if(dataSource.get('isSegment')){
      context.attr('aria-selected', isSelected.toString());
    }else if(isToggle) {
      context.attr('aria-pressed', isActive.toString());
    } 
    
    context.attr('aria-labelledby', labelId);

    // Create the inner label element that contains the text and, optionally,
    // an icon.
    context = context.begin('label').addClass('sc-button-label').id(labelId);
    dataSource.get('theme').labelRenderDelegate.render(dataSource, context);
    context = context.end();

    if (dataSource.get('supportFocusRing')) {
      context = context.begin('div').addClass('focus-ring');
      this.includeSlices(dataSource, context, SC.THREE_SLICE);
      context = context.end();
    }
  },

  /**
    Called when one or more display properties have changed and we need to
    update the HTML representation with the new values.

    @param {SC.Object} dataSource the object containing the information on how to render the button
    @param {SC.RenderContext} jquery the jQuery object representing the HTML representation of the button
  */
  update: function(dataSource, jquery) {
    var isToggle = (dataSource.get('buttonBehavior')===SC.TOGGLE_BEHAVIOR);
    
    this.updateSizeClassName(dataSource, jquery);

    if (dataSource.get('isActive')) {
      jquery.addClass('active');
    }


    var isDefault = dataSource.get('isDefault'),
        isCancel = dataSource.get('isCancel');if(dataSource.get('isSegment')){
      jquery.attr('aria-selected', dataSource.get('isSelected').toString());
    }else if(isToggle){
      jquery.attr('aria-pressed', dataSource.get('isActive').toString());
    }
    
    jquery.attr('title', dataSource.get('toolTip'));

    jquery.setClass('icon', !!dataSource.get('icon'));
    jquery.setClass('def', !!isDefault);
    jquery.setClass('cancel', !!isCancel && !isDefault);

    dataSource.get('theme').labelRenderDelegate.update(dataSource, jquery.find('label'));
  },
  
  /**
    Returns the layer to be used for auto resizing.
  */
  getRenderedAutoResizeLayer: function(dataSource, jq) {
    return jq.find('.sc-button-label')[0];
  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/collection.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


// collections don't need their own rendering; however, in future, constants
// like the row height will likely be specified on the render delegate.
SC.BaseTheme.collectionRenderDelegate = SC.RenderDelegate.create({
  className: 'collection',
  
  render: function(dataSource, context) {
    context.setClass('focus', dataSource.get('hasFirstResponder'));
    context.setClass('disabled', !dataSource.get('isEnabled'));
    context.setClass('active', dataSource.get('isActive'));
  },
  
  update: function(dataSource, jquery) {
    jquery.setClass('focus', dataSource.get('hasFirstResponder'));
    jquery.setClass('disabled', !dataSource.get('isEnabled'));
    jquery.setClass('active', dataSource.get('isActive'));
  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/helpers/slicing.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


SC.THREE_SLICE = ['left', 'middle', 'right'];

SC.NINE_SLICE = [
  'top-left', 'top', 'top-right', 
  'left', 'middle', 'right', 
  'bottom-left', 'bottom', 'bottom-right'
];

SC.RenderDelegate.reopen({
  /*@scope SC.RenderDelegate.prototype*/
  
  /**
    Use this to render slices that you can match in CSS. This matches with the
    Chance @include slices directive, so that you can automatically do 
    multi-slice images for controls.

    @param {SC.Object} dataSource The data source for rendering information.
    @param {SC.RenderContext} context the render context instance
    @param {Slice Configuration} slices Instructions on how to slice. Can be a constant
    like SC.THREE_SLICE or SC.NINE_SLICE, or an array of slice names.
  */
  includeSlices: function(dataSource, context, slices) {
    for (var idx = 0, len = slices.length; idx < len; idx++) {
      context.push('<div class="' + slices[idx] + '"></div>');
    }
  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/image_button.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


SC.BaseTheme.imageButtonRenderDelegate = SC.RenderDelegate.create({
  className: 'image-button',

  render: function(dataSource, context) {
    var image = dataSource.get('image'),
        toolTip = dataSource.get('toolTip');

    // render controlSize
    this.addSizeClassName(dataSource, context);

    context.addClass('no-min-width');

    if (toolTip) {
      context.attr('title', toolTip);
      context.attr('alt', toolTip);
    }

    if (image) {
      context.push("<div class='img "+image+"'></div>");
    } else {
      context.push("<div class='img'></div>");
    }
  },

  update: function(dataSource, $) {
    var image, toolTip;

    this.updateSizeClassName(dataSource, $);

    if (dataSource.didChangeFor('imageButtonRenderDelegate', 'toolTip')) {
      toolTip = dataSource.get('toolTip');

      $.attr('title', toolTip);
      $.attr('alt', toolTip);
    }

    image = dataSource.get('image');

    if (image && dataSource.didChangeFor('imageButtonRenderDelegate', 'image')) {
      $.children()[0].className = 'img '+image;
    }
  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/panel.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


SC.BaseTheme.panelRenderDelegate = SC.RenderDelegate.create({
  className: 'panel',
  
  render: function(dataSource, context) {
    context = context.begin('div').addClass('panel-background');
    this.includeSlices(dataSource, context, SC.NINE_SLICE);
    context = context.end();

    var ariaLabel = dataSource.get('ariaLabel'),
        ariaLabelledBy = dataSource.get('ariaLabelledBy'),
        ariaDescribedBy = dataSource.get('ariaDescribedBy');
    
    if(ariaLabel) context.attr('aria-label', ariaLabel);
    if (ariaLabelledBy) context.attr('aria-labelledby', ariaLabelledBy);
    if (ariaDescribedBy) context.attr('aria-describedby', ariaDescribedBy);
  },

  update: function(dataSource, jQuery) {
    // the label for the panel could change...
    var ariaLabel = dataSource.get('ariaLabel'),
        ariaLabelledBy = dataSource.get('ariaLabelledBy'),
        ariaDescribedBy = dataSource.get('ariaDescribedBy');
    
    if(ariaLabel) jQuery.attr('aria-label', ariaLabel);
    if(ariaLabelledBy) jQuery.attr('aria-labelledby', ariaLabelledBy);
    if(ariaDescribedBy) jQuery.attr('aria-describedby', ariaDescribedBy);
  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/segment.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/**
  Renders and updates the HTML representation of a segment child view within
  SC.SegmentedView.
*/
SC.BaseTheme.segmentRenderDelegate = SC.RenderDelegate.create({
  className: 'segment',

  render: function(dataSource, context) {
    var theme = dataSource.get('theme'),
        buttonDelegate,
        classes;

    // Segment specific additions
    classes = {
      'sc-first-segment': dataSource.get('isFirstSegment'),
      'sc-middle-segment': dataSource.get('isMiddleSegment'),
      'sc-last-segment': dataSource.get('isLastSegment'),
      'sc-overflow-segment': dataSource.get('isOverflowSegment'),
      'vertical': dataSource.get('layoutDirection') !== SC.LAYOUT_HORIZONTAL 
    };

    if (!SC.none(dataSource.get('index'))) classes['sc-segment-' + dataSource.get('index')] = YES;
    context.setClass(classes);

    // Use the SC.ButtonView render delegate for the current theme to render the segment as a button
    buttonDelegate = theme.buttonRenderDelegate;
    buttonDelegate.render(dataSource, context);
  },

  update: function(dataSource, jquery) {
    var theme = dataSource.get('theme'),
        buttonDelegate,
        classes = {};

    // Segment specific additions
    classes = {
      'sc-first-segment': dataSource.get('isFirstSegment'),
      'sc-middle-segment': dataSource.get('isMiddleSegment'),
      'sc-last-segment': dataSource.get('isLastSegment'),
      'sc-overflow-segment': dataSource.get('isOverflowSegment') || NO,
      'vertical': dataSource.get('layoutDirection') !== SC.LAYOUT_HORIZONTAL
    };
    if (!SC.none(dataSource.get('index'))) classes['sc-segment-' + dataSource.get('index')] = YES;
    jquery.setClass(classes);

    // Use the SC.ButtonView render delegate for the current theme to update the segment as a button
    buttonDelegate = theme['buttonRenderDelegate'];
    buttonDelegate.update(dataSource, jquery);
  }

});

/* >>>>>>>>>> BEGIN source/render_delegates/segmented.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Renders and updates the HTML representation of SC.SegmentedView.
*/
SC.BaseTheme.segmentedRenderDelegate = SC.RenderDelegate.create({
  className: 'segmented',

  /*
    We render everything external to the segments and let each segment use it's own render
    delegate to render its contents.

    */
  render: function(dataSource, context) {
    // Use text-align to align the segments
    this.addSizeClassName(dataSource, context);
    context.addStyle('text-align', dataSource.get('align'));
  },

  update: function(dataSource, jquery) {
    this.updateSizeClassName(dataSource, jquery);
    jquery.css('text-align', dataSource.get('align'));
  }

});

/* >>>>>>>>>> BEGIN source/render_delegates/toolbar.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.BaseTheme.toolbarRenderDelegate = SC.RenderDelegate.create({
  className: 'toolbar',

  render: function(dataSource, context) {
    // toolbar has nothing in it
  },
  
  update: function() {
    // toolbar has nothing to update
  }
});

/* >>>>>>>>>> BEGIN source/render_delegates/well.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

SC.BaseTheme.wellRenderDelegate = SC.RenderDelegate.create({
  className: 'well',
  render: function(dataSource, context) {
    this.includeSlices(dataSource, context, SC.NINE_SLICE);
  },
  
  update: function() {

  }
});

/* >>>>>>>>>> BEGIN source/system/drag.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/**
  @static
*/
SC.DRAG_LINK = 0x0004;

/**
  @static
*/
SC.DRAG_COPY = 0x0001;

/**
  @static
*/
SC.DRAG_MOVE = 0x0002;

/**
  @static
*/
SC.DRAG_NONE = 0x0000;

/**
  @static
*/
SC.DRAG_ANY = 0x000F;

/**
  @static
*/
SC.DRAG_DATA = 0x0008; // includes SC.DRAG_REORDER

/**
  @static
*/
SC.DRAG_AUTOSCROLL_ZONE_THICKNESS = 20;

SC.View.reopen(
  /** @scope SC.View.prototype */ {

  /** @private */
  init: function(original) {
    original();

    // register for drags
    if (this.get('isDropTarget')) { SC.Drag.addDropTarget(this) ; }

    // register scroll views for autoscroll during drags
    if (this.get('isScrollable')) { SC.Drag.addScrollableView(this) ; }
  }.enhance(),

  /** @private */
  destroy: function(original) {
    // unregister for drags
    if (this.get('isDropTarget')) { SC.Drag.removeDropTarget(this) ; }

    // unregister for autoscroll during drags
    if (this.get('isScrollable')) { SC.Drag.removeScrollableView(this) ; }

    return original();
  }.enhance()
});

/**
  @class
  
  An instance of this object is created whenever a drag occurs.  The instance
  manages the mouse/touch events and coordinating with droppable targets until the
  user releases the mouse button. 
  
  To initiate a drag, you should call `SC.Drag.start()` with the options below
  specified in a hash. Pass the ones you need to get the drag you want:
  
    - `event` -- *(req)* The mouse event/touch that triggered the drag.  This will be used
      to position the element.
  
    - `source` -- *(req)* The drag source object that should be consulted during
      the drag operations. This is usually the container view that initiated 
      the drag.
  
    - `dragView` -- Optional view that will be used as the source image for the
      drag. The drag operation will clone the DOM elements for this view and
      parent them under the drag pane, which has the class name `sc-ghost-view`.
      The drag view is not moved from its original location during a drag.
      If the dragView is not provided, the source is used as dragView.
  
    - `ghost` -- `YES` | `NO`  If `NO`, the drag view image will show, but the source
      `dragView` will not be hidden.  Set to `YES` to make it appear that the
      `dragView` itself is being dragged around.
  
    - `slideBack` -- `YES` | `NO`  If `YES` and the drag operation is cancelled, the
      `dragView` will slide back to its source origin.
  
    - `origin` --  If passed, this will be used as the origin point for the
      ghostView when it slides back.  You normally do not need to pass this 
      unless the ghost view does not appear in the main UI.
  
    - `data` -- Optional hash of data types and values.  You can use this to pass
      a static set of data instead of providing a dataSource.  If you provide
      a dataSource, it will be used instead.
  
    - `dataSource` --  Optional object that will provide the data for the drag to
      be consumed by the drop target.  If you do not pass this parameter or the 
      data hash, then the source object will be used if it implements the 
      SC.DragDataSource protocol.
  
    - `anchorView` -- if you pass this optional view, then the drag will only be
      allowed to happen within this view.  The ghostView will actually be added 
      as a child of this view during the drag.  Normally the anchorView is the 
      window.
  
  @extends SC.Object
*/
SC.Drag = SC.Object.extend(
/** @scope SC.Drag.prototype */ {
  
  /**
    The source object used to coordinate this drag.
    
    @readOnly
    @type SC.DragSource
  */
  source: null,
  
  /**
    The view actually dragged around the screen. This is created automatically
    from the dragView.
    
    @readOnly
    @type SC.View
  */
  ghostView: null,
  
  /**
    If `YES`, then the `ghostView` will acts like a cursor and attach directly
    to the mouse/touch location.
    
    @readOnly
    @type Boolean
  */
  ghostActsLikeCursor: NO,
  
  /**  
    The view that was used as the source of the `ghostView`.
    
    The drag view is not moved from its original location during a drag.
    Instead, the DOM content of the view is cloned and managed by the 
    ghostView.  If you want to visually indicate that the view is being 
    moved, you should set ghost to `YES`.
    If dragView is not provided the source is used instead.
    
    @readOnly
    @type SC.View
  */
  dragView: null,
  
  /**
    If `YES`, the `dragView` is automatically hidden while dragging around the
    ghost.
    
    @readOnly
    @type Boolean
  */
  ghost: YES,

  /**
    If `NO`, the source will not be copied, clone, no ghost view will get created,
    and it won't be moved.

    @type Boolean
  */
	sourceIsDraggable: YES,
  
  /**
    If `YES`, then the `ghostView` will slide back to its original location if
    drag is cancelled.
    
    @type Boolean
  */
  slideBack: YES,

  /**
    The origin to slide back to in the coordinate of the `dragView`'s
    containerView.
    
    @type Point
  */
  ghostOffset: { x: 0, y: 0 },
  
  /**
    The current location of the mouse pointer in window coordinates. This is 
    updated as long as the mouse button is pressed or touch is active. Drop targets are 
    encouraged to update this property in their `dragUpdated()` method
    implementations.
    
    The ghostView will be positioned at this location.
    
    @type Point
  */
  location: {},
  
  // ..........................................
  // DRAG DATA
  //
  
  /**
    Data types supported by this drag operation.
    
    Returns an array of data types supported by the drag source.  This may be 
    generated dynamically depending on the data source.
    
    If you are implementing a drag source, you will need to provide these data
    types so that drop targets can detect if they can accept your drag data.
    
    If you are implementing a drop target, you should inspect this property
    on your `dragEntered()` and `prepareForDragOperation()` methods to determine
    if you can handle any of the data types offered up by the drag source.
    
    @type Array
  */
  dataTypes: function() {
    // first try to use the data source.
    if (this.dataSource) return this.dataSource.get('dragDataTypes') || [] ;
    
    // if that fails, get the keys from the data hash.
    var hash = this.data ;
    if (hash) {
      var ret = [];
      for (var key in hash) {
        if (hash.hasOwnProperty(key)) ret.push(key) ;
      }
      return ret ;
    }    
    
    // if that fails, then check to see if the source object is a dataSource.
    var source = this.get('source') ;
    if (source && source.dragDataTypes) return source.get('dragDataTypes') || [] ;
    
    // no data types found. :(
    return [] ; 
  }.property().cacheable(),
  
  /**
    Checks for a named data type in the drag.
    
    @param {String} dataType the data type
    @returns {Boolean} YES if data type is present in dataTypes array.
  */
  hasDataType: function(dataType) {
    return (this.get('dataTypes').indexOf(dataType) >= 0) ;
  },
  
  /**
    Retrieve the data for the specified `dataType` from the drag source.
    
    Drop targets can use this method during their `performDragOperation()`
    method to retrieve the actual data provided by the drag data source.  This
    data may be generated dynamically depending on the data source.
    
    @param {Object} dataType data type you want to retrieve.  Should be one of
      the values returned in the dataTypes property
    @returns {Object} The generated data.
  */
  dataForType: function(dataType) {
    // first try to use the data Source.
    if (this.dataSource) {
      return this.dataSource.dragDataForType(this, dataType) ;
      
    // then try to use the data hash.
    } else if (this.data) {
      return this.data[dataType];
      
    // if all else fails, check to see if the source object is a data source.
    } else {
      var source = this.get('source') ;
      if (source && SC.typeOf(source.dragDataForType) === SC.T_FUNCTION) {
        return source.dragDataForType(this, dataType) ;
        
      // no data source found. :(
      } else return null ;
    }
  },
  
  /**
    Optional object used to provide the data for the drag.
    
    Drag source can designate a `dataSource` object to generate the data for
    a drag dynamically.  The data source can and often is the drag source 
    object itself.  
    
    Data Source objects must comply with the `SC.DragDataSource` interface.  If
    you do not want to implement this interface, you can provide the data 
    directly with the data property.
    
    If you are implementing a drop target, use the dataTypes property and 
    `dataForTypes()` method to access data instead of working directly with
    these properties.
    
    @readOnly
    @type SC.DragDataSource
  */
  dataSource: null,
  
  /**
    Optional hash of data.  Used if no dataSource was provided.
    
    Drag sources can provide a hash of data when the drag begins instead of 
    specifying an actual dataSource.  The data is stored in this property.
    If you are implementing a drop target, use the dataTypes property and 
    `dataForTypes()` method to access data instead of working directly with
    these properties.
    
    @readOnly
    @type Hash
  */
  data: null,
  
  /**
    Returns the currently allowed `dragOperations` for the drag.  This will be
    set just before any callbacks are invoked on a drop target.  The drag 
    source is given an opportunity to set these operations.
    
    @readOnly
    @type Number
  */
  allowedDragOperations: SC.DRAG_ANY,
  
  /** @private required by autoscroll */
  _dragInProgress: YES,

  /** @private
    Stores the initial visibility state of the dragView so it can be restored
    after the drag
  */
  _dragViewWasVisible: null,

  /** @private
    This will actually start the drag process. Called by SC.Drag.start().
  */
  startDrag: function() {
		if (this.get('sourceIsDraggable')) {
	    // create the ghost view
	    this._createGhostView() ;
		}
    
    var evt = this.event ;
    
    // compute the ghost offset from the original start location
    
    var loc = { x: evt.pageX, y: evt.pageY } ;
    this.set('location', loc) ;
    
		if (this.get('sourceIsDraggable')) {
	    var dv = this._getDragView() ;
	    var pv = dv.get('parentView') ;

	    // convert to global coordinates
	    var origin = pv ? pv.convertFrameToView(dv.get('frame'), null) : dv.get('frame') ;

	    if (this.get('ghost')) {
	      // Hide the dragView
	      this._dragViewWasVisible = dv.get('isVisible') ;
	      dv.set('isVisible', NO) ;
	    }

	    if (this.ghostActsLikeCursor) this.ghostOffset = { x: 14, y: 14 };
	    else this.ghostOffset = { x: (loc.x-origin.x), y: (loc.y-origin.y) } ;
    
	    // position the ghost view
	    if(!this._ghostViewHidden) this._positionGhostView(evt) ;
    
	    if (evt.makeTouchResponder) {
	      // Should use invokeLater if I can figure it out
	      var self = this;
	      SC.Timer.schedule({ 
	        target: evt, 
	        action: function() { 
	          if (!evt.hasEnded) evt.makeTouchResponder(self, YES);
	        }, 
	        interval: 1
	      });
	    } 
	    else {
	      // notify root responder that a drag is in process
	      this.ghostView.rootResponder.dragDidStart(this, evt) ;
	    }
		}
    
    var source = this.source ;
    if (source && source.dragDidBegin) source.dragDidBegin(this, loc) ;
    
    // let all drop targets know that a drag has started
    var ary = this._dropTargets() ;
    
    for (var idx=0, len=ary.length; idx<len; idx++) {
      ary[idx].tryToPerform('dragStarted', this, evt) ;
    }
  },

  /** @private
    Cancel the drag operation.

    This notifies the data source that the drag ended and removes the
    ghost view, but does not notify the drop target of a drop.

    This is called by RootResponder's keyup method when the user presses
    escape and a drag is in progress.
  */
  cancelDrag: function() {
    var target = this._lastTarget,
        loc = this.get('location');

    if (target && target.dragExited) target.dragExited(this, this._lastMouseDraggedEvent);

		if (this.get('sourceIsDraggable')) {
	    this._destroyGhostView();

	    if (this.get('ghost')) {
	      if (this._dragViewWasVisible) this._getDragView().set('isVisible', YES);
	      this._dragViewWasVisible = null;
	    }	
		}

    var source = this.source;
    if (source && source.dragDidEnd) source.dragDidEnd(this, loc, SC.DRAG_NONE);

    this._lastTarget = null;
    this._dragInProgress = NO;
  },
  
  // ..........................................
  // PRIVATE PROPERTIES AND METHODS
  //

  /** @private */
  touchStart: function(evt) {
    return YES;
  },

  /** @private
    This method is called repeatedly during a mouse drag.  It updates the
    position of the ghost image, then it looks for a current drop target and
    notifies it.
  */
  mouseDragged: function(evt) {
    var scrolled = this._autoscroll(evt) ;
    var loc = this.get('location') ;
    if (!scrolled && (evt.pageX === loc.x) && (evt.pageY === loc.y)) {
      return ; // quickly ignore duplicate calls
    } 

    // save the new location to avoid duplicate mouseDragged event processing
    loc = { x: evt.pageX, y: evt.pageY };
    this.set('location', loc) ;
    this._lastMouseDraggedEvent = evt;
    
    // STEP 1: Determine the deepest drop target that allows an operation.
    // if the drop target selected the last time this method was called 
    // differs from the deepest target found, then go up the chain until we 
    // either hit the last one or find one that will allow a drag operation
    var source = this.source ;
    var last = this._lastTarget ;
    var target = this._findDropTarget(evt) ; // deepest drop target
    var op = SC.DRAG_NONE ;
    
    while (target && (target !== last) && (op === SC.DRAG_NONE)) {
      // make sure the drag source will permit a drop operation on the named 
      // target
      if (target && source && source.dragSourceOperationMaskFor) {
        op = source.dragSourceOperationMaskFor(this, target) ;
      } else op = SC.DRAG_ANY ; // assume drops are allowed
      
      // now, let's see if the target will accept the drag
      if ((op !== SC.DRAG_NONE) && target && target.computeDragOperations) {
        op = op & target.computeDragOperations(this, evt, op) ;
      } else op = SC.DRAG_NONE ; // assume drops AREN'T allowed
      
      this.allowedDragOperations = op ;
      
      // if DRAG_NONE, then look for the next parent that is a drop zone
      if (op === SC.DRAG_NONE) target = this._findNextDropTarget(target) ;
    }
    
    // STEP 2: Refocus the drop target if needed
    if (target !== last) {
      if (last && last.dragExited) last.dragExited(this, evt) ;
      
      if (target) {
        if (target.dragEntered) target.dragEntered(this, evt) ;
        if (target.dragUpdated) target.dragUpdated(this, evt) ;
      }
      
      this._lastTarget = target ;
    } else {
      if (target && target.dragUpdated) target.dragUpdated(this, evt) ;
    }
     
    // notify source that the drag moved
    if (source && source.dragDidMove) source.dragDidMove(this, loc) ;
    
    // reposition the ghostView
    if(this.get('sourceIsDraggable') && !this._ghostViewHidden) this._positionGhostView(evt) ;
  },

  touchesDragged: function(evt){
    this.mouseDragged(evt);
  },

  /**
    @private
    
    Called when the mouse is released.  Performs any necessary cleanup and
    executes the drop target protocol to try to complete the drag operation.
  */
  mouseUp: function(evt) {
    var loc    = { x: evt.pageX, y: evt.pageY },
        target = this._lastTarget, 
        op     = this.allowedDragOperations;
    
    this.set('location', loc);
    
    // try to have the drop target perform the drop...
    try {
      if (target && target.acceptDragOperation && target.acceptDragOperation(this, op)) {
        op = target.performDragOperation ? target.performDragOperation(this, op) : SC.DRAG_NONE ;  
      } else {
        op = SC.DRAG_NONE;
      }
    } catch (e) {
      SC.Logger.error('Exception in SC.Drag.mouseUp(acceptDragOperation|performDragOperation): %@'.fmt(e)) ;
    }
    
    try {
      // notify last drop target that the drag exited, to allow it to cleanup
      if (target && target.dragExited) target.dragExited(this, evt) ;
    } catch (ex) {
      SC.Logger.error('Exception in SC.Drag.mouseUp(target.dragExited): %@'.fmt(ex)) ;
    }
    
    // notify all drop targets that the drag ended
    var ary = this._dropTargets() ;
    for (var idx=0, len=ary.length; idx<len; idx++) {
      try {
        ary[idx].tryToPerform('dragEnded', this, evt) ;
      } catch (ex2) {
        SC.Logger.error('Exception in SC.Drag.mouseUp(dragEnded on %@): %@'.fmt(ary[idx], ex2)) ;
      }
    }

		if (this.get('sourceIsDraggable')) {
	    // destroy the ghost view
	    this._destroyGhostView() ;

	    if (this.get('ghost')) {
	      // Show the dragView if it was visible
	      if (this._dragViewWasVisible) this._getDragView().set('isVisible', YES) ;
	      this._dragViewWasVisible = null;
	    }	
		}

    // notify the source that everything has completed
    var source = this.source ;
    if (source && source.dragDidEnd) source.dragDidEnd(this, loc, op) ;
    
    this._lastTarget = null ;
    this._dragInProgress = NO ; // required by autoscroll (invoked by a timer)
  },

  /** @private */
  touchEnd: function(evt){
    this.mouseUp(evt);
  },

  /** @private
    Returns the dragView. If it is not set, the source is returned.
  */
  _getDragView: function() {
    if (!this.dragView) {
      if (!this.source || !this.source.isView) throw "Source can't be used as dragView, because it's not a view.";
      this.dragView = this.source;
    }
    return this.dragView;
  },

  /** @private
    This will create the ghostView and add it to the document.
  */
  _createGhostView: function() {
    var that  = this,
        dragView = this._getDragView(),
        frame = dragView.get('frame'),
        view;
        
    view = this.ghostView = SC.Pane.create({
      classNames:['sc-ghost-view'],
      layout: { top: frame.y, left: frame.x, width: frame.width, height: frame.height },
      owner: this,
      didCreateLayer: function() {
        if (dragView) {
          var layer = dragView.get('layer') ;
          if (layer) {
            layer = layer.cloneNode(true) ;
            // Make sure the layer we put in the ghostView wrapper is not displaced.
            layer.style.top = "0px" ;
            layer.style.left = "0px" ;
            this.get('layer').appendChild(layer) ;
          }
        }
      }
    });
    
    view.append() ;  // add to window
  },
  
  /** @private
    Positions the ghost view underneath the mouse/touch with the initial offset
    recorded by when the drag started.
  */
  _positionGhostView: function(evt) {
    var loc = this.get('location') ;
    loc.x -= this.ghostOffset.x ;
    loc.y -= this.ghostOffset.y ;
    var gV = this.ghostView;
    if(gV) {
      gV.adjust({ top: loc.y, left: loc.x }) ;
      gV.invokeOnce('updateLayout') ;
    }
  },
  
  /** @private
    YES if the ghostView has been manually hidden.
    
    @type Boolean
    @default NO
  */
  _ghostViewHidden: NO,
  
  /**
    Hide the ghostView.
  */
  hideGhostView: function() {
    if(this.ghostView && !this._ghostViewHidden) {
      this.ghostView.remove();
      this._ghostViewHidden = YES;
    }
  },

  /**
    Unhide the ghostView.
  */
  unhideGhostView: function() {
    if(this._ghostViewHidden) {
      this._ghostViewHidden = NO;
      this._createGhostView();
    }
  },
  
  /** @private */
  _destroyGhostView: function() {
    if (this.ghostView) {
      this.ghostView.remove() ;
      this.ghostView = null ; // this will allow the GC to collect it.
      this._ghostViewHidden = NO;
    }
  },
  
  /** @private
    Return an array of drop targets, sorted with any nested drop targets
    at the top of the array.  The first time this method is called during
    a drag, it will reconstruct this array using the current set of 
    drop targets.  Afterwards it uses the cached set until the drop
    completes.
    
    This means that if you change the view hierarchy of your drop targets
    during a drag, it will probably be wrong.
  */
  _dropTargets: function() {
    if (this._cachedDropTargets) return this._cachedDropTargets ;
    
    // build array of drop targets
    var ret = [] ;
    var hash = SC.Drag._dropTargets ;
    for (var key in hash) {
      if (hash.hasOwnProperty(key)) ret.push(hash[key]) ;
    }
    
    // views must be sorted so that drop targets with the deepest nesting 
    // levels appear first in the array.  The getDepthFor().
    var depth = {} ;
    var dropTargets = SC.Drag._dropTargets ;
    var getDepthFor = function(x) {
      if (!x) return 0 ;
      var guid = SC.guidFor(x);
      var ret = depth[guid];
      if (!ret) {
        ret = 1 ;
        while (x = x.get('parentView')) {
          if (dropTargets[SC.guidFor(x)] !== undefined) ret = ret+1 ;
          if(x.isPane && x.isMainPane) ret = ret+10000; // Arbitrary value always have the main pain on top
        }
        depth[guid] = ret ;
      }
      return ret ;
    } ;
    
    // sort array of drop targets
    ret.sort(function(a,b) {
      if (a===b) return 0;
      a = getDepthFor(a) ;
      b = getDepthFor(b) ;
      return (a > b) ? -1 : 1 ;
    }) ;
    
    this._cachedDropTargets = ret ;
    return ret ;
  },
  
  /** @private
    This will search through the drop targets, looking for one in the target 
    area.
  */
  _findDropTarget: function(evt) {
    var loc = { x: evt.pageX, y: evt.pageY } ;
    
    var target, frame ;
    var ary = this._dropTargets() ;
    for (var idx=0, len=ary.length; idx<len; idx++) {
      target = ary[idx] ;
      
      // If the target is not visible, it is not valid.
      if (!target.get('isVisibleInWindow')) continue ;
      
      // get clippingFrame, converted to the pane.
      frame = target.convertFrameToView(target.get('clippingFrame'), null) ;
      
      // check to see if loc is inside.  If so, then make this the drop target
      // unless there is a drop target and the current one is not deeper.
      if (SC.pointInRect(loc, frame)) return target;
    } 
    return null ;
  },
  
  /** @private
    Search the parent nodes of the target to find another view matching the 
    drop target.  Returns null if no matching target is found.
  */
  _findNextDropTarget: function(target) {
    var dropTargets = SC.Drag._dropTargets ;
    while (target = target.get('parentView')) {
      if (dropTargets[SC.guidFor(target)]) return target ;
    }
    return null ;
  },
  
  // ............................................
  // AUTOSCROLLING
  //
  
  /** @private
    Performs auto-scrolling for the drag.  This will only do anything if
    the user keeps the mouse/touch within a few pixels of one location for a little
    while.
    
    Returns YES if a scroll was performed.
  */
  _autoscroll: function(evt) {
    if (!evt) evt = this._lastAutoscrollEvent ;
    
    // If drag has ended, exit
    if (!this._dragInProgress) return NO;
    
    // STEP 1: Find the first view that we can actually scroll.  This view 
    // must be:
    // - scrollable
    // - the mouse pointer or touch must be within a scrolling hot zone
    // - there must be room left to scroll in that direction. 
    
    // NOTE: an event is passed only when called from mouseDragged
    var loc  = evt ? { x: evt.pageX, y: evt.pageY } : this.get('location'),
        view = this._findScrollableView(loc),
        scrollableView = null, // become final view when found
        vscroll, hscroll, min, max, edge, container, f;
    
    // hscroll and vscroll will become either 1 or -1 to indicate scroll 
    // direction or 0 for no scroll.
    
    while (view && !scrollableView) {
      
      // quick check...can we scroll this view right now?
      vscroll = view.get('canScrollVertical') ? 1 : 0;
      hscroll = view.get('canScrollHorizontal') ? 1 : 0;

      // at least one direction might be scrollable.  Collect frame info
      if (vscroll || hscroll) {
        container = view.get('containerView');
        if (container) {
          f = view.convertFrameToView(container.get('frame'),null);
        } else {
          vscroll = hscroll = 0 ; // can't autoscroll this mother
        }
      }

      // handle vertical direction
      if (vscroll) {
        
        // bottom hotzone?
        max = SC.maxY(f); 
        min = max - SC.DRAG_AUTOSCROLL_ZONE_THICKNESS ; 
        if (loc.y >= min && loc.y <= max) vscroll = 1 ;
        else {
          // how about top
          min = SC.minY(f); 
          max = min + SC.DRAG_AUTOSCROLL_ZONE_THICKNESS ;
          if (loc.y >= min && loc.y <= max) vscroll = -1 ;
          else vscroll = 0 ; // can't scroll vertical
        }
      }

      // handle horizontal direction
      if (hscroll) {
        
        // bottom hotzone?
        max = SC.maxX(f); 
        min = max - SC.DRAG_AUTOSCROLL_ZONE_THICKNESS ; 
        if (loc.x >= min && loc.x <= max) hscroll = 1 ;
        else {
          // how about top
          min = SC.minX(f); 
          max = min + SC.DRAG_AUTOSCROLL_ZONE_THICKNESS ;
          if (loc.x >= min && loc.x <= max) hscroll = -1 ;
          else hscroll = 0 ; // can't scroll vertical
        }
      }
      
      // if we can scroll, then set this.
      if (vscroll || hscroll) scrollableView = view ;
      else view = this._findNextScrollableView(view) ;
    }
    
    // STEP 2: Only scroll if the user remains within the hot-zone for a 
    // period of time
    if (scrollableView && (this._lastScrollableView === scrollableView)) {
      if ((Date.now() - this._hotzoneStartTime) > 100) {
        this._horizontalScrollAmount *= 1.05 ;
        this._verticalScrollAmount *= 1.05 ; // accelerate scroll
      }
      
    // otherwise, reset everything and disallow scroll
    } else {
      this._lastScrollableView = scrollableView ;
      this._horizontalScrollAmount = 15 ;
      this._verticalScrollAmount = 15 ;
      this._hotzoneStartTime = (scrollableView) ? Date.now() : null ;
      hscroll = vscroll = 0 ;
    }
    
    // STEP 3: Scroll!
    if (scrollableView && (hscroll || vscroll)) {
      var scroll = { 
        x: hscroll * this._horizontalScrollAmount,
        y: vscroll * this._verticalScrollAmount 
      } ;
      scrollableView.scrollBy(scroll) ;
    }
    
    // If a scrollable view was found, then check later
    if (scrollableView) {
      if (evt) {
        this._lastAutoscrollEvent = { pageX: evt.pageX, pageY: evt.pageY };
      }
      this.invokeLater(this._autoscroll, 100, null);
      return YES ;
    } else {
      this._lastAutoscrollEvent = null;
      return NO ;
    }
  },
  
  /** @private
    Returns an array of scrollable views, sorted with nested scrollable views 
    at the top of the array.  The first time this method is called during a 
    drag, it will reconstruct this array using the current state of scrollable 
    views.  Afterwards it uses the cached set until the drop completes.
  */
  _scrollableViews: function() {
    if (this._cachedScrollableView) return this._cachedScrollableView ;
    
    // build array of scrollable views
    var ret = [] ;
    var hash = SC.Drag._scrollableViews ;
    for (var key in hash) {
      if (hash.hasOwnProperty(key)) ret.push(hash[key]) ;
    }
    
    // now resort.  This custom function will sort nested scrollable views
    // at the start of the list.
    ret = ret.sort(function(a,b) {
      var view = a;
      while (view = view.get('parentView')) {
        if (b === view) return -1 ;
      }
      return 1; 
    }) ;
    
    this._cachedScrollableView = ret ;
    return ret ;
  },
  
  /** @private
    This will search through the scrollable views, looking for one in the 
    target area.
  */
  _findScrollableView: function(loc) {
    var ary = this._scrollableViews(),
        len = ary ? ary.length : 0,
        target, frame, idx;
        
    for (idx=0; idx<len; idx++) {
      target = ary[idx] ;
      
      if (!target.get('isVisibleInWindow')) continue ;
      
      // get clippingFrame, converted to the pane
      frame = target.convertFrameToView(target.get('clippingFrame'), null) ;
      
      // check to see if loc is inside
      if (SC.pointInRect(loc, frame)) return target;
    } 
    return null ;
  },
  
  /** @private
    Search the parent nodes of the target to find another scrollable view.
    return null if none is found.
  */
  _findNextScrollableView: function(view) {
    var scrollableViews = SC.Drag._scrollableViews ;
    while (view = view.get('parentView')) {
      if (scrollableViews[SC.guidFor(view)]) return view ;
    }
    return null ;
  }  
  
});

SC.Drag.mixin(
/** @scope SC.Drag */ {
   
  /**  
   This is the method you use to initiate a new drag.  See class documentation
   for more info on the options taken by this method.
   
   @params {Hash} ops a hash of options.  See documentation above.
  */
  start: function(ops) {
    var ret = this.create(ops) ;
    ret.startDrag() ;
    return ret ;
  },
  
  /** @private */
  _dropTargets: {},
  
  /** @private */
  _scrollableViews: {},
  
  /**
    Register the view object as a drop target.
    
    This method is called automatically whenever a view is created with the
    isDropTarget property set to `YES`.  You generally will not need to call it
    yourself.
    
    @param {SC.View} target a view implementing the SC.DropTarget protocol
  */
  addDropTarget: function(target) {
    this._dropTargets[SC.guidFor(target)] = target;
  },
  
  /**
    Unregister the view object as a drop target.
    
    This method is called automatically whenever a view is removed from the 
    hierarchy.  You generally will not need to call it yourself.
    
    @param {SC.View} target A previously registered drop target
  */
  removeDropTarget: function(target) {
    delete this._dropTargets[SC.guidFor(target)];
  },
  
  /**
    Register the view object as a scrollable view.  These views will 
    auto-scroll during a drag.
    
    @param {SC.View} target The view that should be auto-scrolled
  */
  addScrollableView: function(target) {
    this._scrollableViews[SC.guidFor(target)] = target;
  },
  
  /**
    Remove the view object as a scrollable view.  These views will auto-scroll
    during a drag.
    
    @param {SC.View} target A previously registered scrollable view
  */
  removeScrollableView: function(target) {
    delete this._scrollableViews[SC.guidFor(target)];
  }
  
});

/* >>>>>>>>>> BEGIN source/views/button.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  @static
  @constant
  @type String
*/
SC.TOGGLE_BEHAVIOR = 'toggle';

/**
  @static
  @constant
  @type String
*/
SC.PUSH_BEHAVIOR =   'push';

/**
  @static
  @constant
  @type String
*/
SC.TOGGLE_ON_BEHAVIOR = 'on';

/**
  @static
  @constant
  @type String
*/
SC.TOGGLE_OFF_BEHAVIOR = 'off';

/**
  @static
  @constant
  @type String
*/
SC.HOLD_BEHAVIOR = 'hold';

/** @class

  Implements a push-button-style button.  This class is used to implement
  both standard push buttons and tab-style controls.  See also SC.CheckboxView
  and SC.RadioView which are implemented as field views, but can also be
  treated as buttons.

  By default, a button uses the SC.Control mixin which will apply CSS
  classnames when the state of the button changes:

   - `active` -- when button is active
   - `sel` -- when button is toggled to a selected state

  @extends SC.View
  @extends SC.Control
  @since SproutCore 1.0
*/
SC.ButtonView = SC.View.extend(SC.Control,
/** @scope SC.ButtonView.prototype */ {

  /**
    Tied to the isEnabled state

    @type Boolean
    @default YES
  */
  acceptsFirstResponder: function() {
    if (SC.FOCUS_ALL_CONTROLS) { return this.get('isEnabled'); }
    return NO;
  }.property('isEnabled'),

  /**
    @type Array
    @default ['sc-button-view']
    @see SC.View#classNames
  */
  classNames: ['sc-button-view'],

  /**
    The theme to apply to the button. By default, a subtheme with the name of
    'square' is created for backwards-compatibility.

    @type String
    @default 'square'
  */
  themeName: 'square',


  // ..........................................................
  // Value Handling
  //

  /**
    Used to automatically update the state of the button view for toggle style
    buttons.

    For toggle style buttons, you can set the value and it will be used to
    update the isSelected state of the button view.  The value will also
    change as the user selects or deselects.  You can control which values
    the button will treat as `isSelected` by setting the `toggleOnValue` and
    `toggleOffValue`.  Alternatively, if you leave these properties set to
    `YES` or `NO`, the button will do its best to convert a value to an
    appropriate state:

     - `null`, `false`, `0` -- `isSelected = false`
     - any other single value -- `isSelected = true`
     - array -- if all values are the same state, that state; otherwise `MIXED`.

    @type Object
    @default null
  */
  value: null,

  /**
    Value of a selected toggle button.

    For a toggle button, set this to any object value you want. The button
    will be selected if the value property equals the targetValue. If the
    value is an array of multiple items that contains the targetValue, then
    the button will be set to a mixed state.

    default is YES

    @type Boolean|Object
    @default YES
  */
  toggleOnValue: YES,

  /**
    Value of an unselected toggle button.

    For a toggle button, set this to any object value you want.  When the
    user toggle's the button off, the value of the button will be set to this
    value.

    @type Boolean|Object
    @default NO
  */
  toggleOffValue: NO,


  // ..........................................................
  // Title Handling
  //

  /**
    If YES, then the title will be localized.

    @type Boolean
    @default NO
  */
  localize: NO,

  /** @private */
  localizeBindingDefault: SC.Binding.bool(),

  /**
    The button title.  If localize is `YES`, then this should be the
    localization key to display.  Otherwise, this will be the actual string
    displayed in the title.  This property is observable and bindable.

    @type String
    @default ""
  */
  title: "",

  tooltip: "",

  /**
    If set, the title property will be updated automatically
    from the content using the key you specify.

    @type String
    @default null
  */
  contentTitleKey: null,

  /**
    The button icon. Set this to either a URL or a CSS class name (for
    spriting). Note that if you pass a URL, it must contain at
    least one slash to be detected as such.

    @type String
    @default null
  */
  icon: null,

  /**
    If you set this property, the icon will be updated automatically from the
    content using the key you specify.

    @type String
    @default null
  */
  contentIconKey: null,

  /**
    If YES, button will attempt to display an ellipsis if the title cannot
    fit inside of the visible area. This feature is not available on all
    browsers.

    @type Boolean
    @default YES
  */
  needsEllipsis: YES,

  /**
    This is generated by localizing the title property if necessary.

    @type String
    @observes 'title'
    @observes 'localize'
  */
  displayTitle: function() {
    var ret = this.get('title');
    return (ret && this.get('localize')) ? SC.String.loc(ret) : (ret || '');
  }.property('title','localize').cacheable(),

  /**
    The key equivalent that should trigger this button on the page.

    @type String
    @default null
  */
  keyEquivalent: null,


  // ..........................................................
  // BEHAVIOR
  //

  /**
    The behavioral mode of this button.

    Possible values are:

     - `SC.PUSH_BEHAVIOR` -- Pressing the button will trigger an action tied to the
       button. Does not change the value of the button.
     - `SC.TOGGLE_BEHAVIOR` -- Pressing the button will invert the current value of
       the button. If the button has a mixed value, it will be set to true.
     - `SC.TOGGLE_ON_BEHAVIOR` -- Pressing the button will set the current state to
       true no matter the previous value.
     - `SC.TOGGLE_OFF_BEHAVIOR` -- Pressing the button will set the current state to
       false no matter the previous value.
     - `SC.HOLD_BEHAVIOR` -- Pressing the button will cause the action to repeat at a
       regular interval specified by 'holdInterval'

    @type String
    @default SC.PUSH_BEHAVIOR
  */
  buttonBehavior: SC.PUSH_BEHAVIOR,

  /*
    If buttonBehavior is `SC.HOLD_BEHAVIOR`, this specifies, in milliseconds,
    how often to trigger the action. Ignored for other behaviors.

    @type Number
    @default 100
  */
  holdInterval: 100,

  /**
    If YES, then this button will be triggered when you hit return.

    This is the same as setting the `keyEquivalent` to 'return'.  This will also
    apply the "def" classname to the button.

    @type Boolean
    @default NO
  */
  isDefault: NO,
  isDefaultBindingDefault: SC.Binding.oneWay().bool(),

  /**
    If YES, then this button will be triggered when you hit escape.
    This is the same as setting the keyEquivalent to 'escape'.

    @type Boolean
    @default NO
  */
  isCancel: NO,
  isCancelBindingDefault: SC.Binding.oneWay().bool(),

  /**
    The name of the action you want triggered when the button is pressed.

    This property is used in conjunction with the target property to execute
    a method when a regular button is pressed.  These properties are not
    relevant when the button is used in toggle mode.

    If you do not set a target, then pressing a button will cause the
    responder chain to search for a view that implements the action you name
    here.  If you set a target, then the button will try to call the method
    on the target itself.

    For legacy support, you can also set the action property to a function.
    Doing so will cause the function itself to be called when the button is
    clicked.  It is generally better to use the target/action approach and
    to implement your code in a controller of some type.

    @type String
    @default null
  */
  action: null,

  /**
    The target object to invoke the action on when the button is pressed.

    If you set this target, the action will be called on the target object
    directly when the button is clicked.  If you leave this property set to
    null, then the button will search the responder chain for a view that
    implements the action when the button is pressed instead.

    @type Object
    @default null
  */
  target: null,

  /*
    TODO When is this property ever changed? Is this redundant with
    render delegates since it can now be turned on on a theme-by-theme
    basis? --TD
  */
  /**
    If YES, use a focus ring.

    @type Boolean
    @default NO
  */
  supportFocusRing: NO,

  // ..........................................................
  // Auto Resize Support
  //
  //
  // These properties are provided so that SC.AutoResize can be mixed in
  // to enable automatic resizing of the button.
  //

  /** @private */
  supportsAutoResize: YES,

  /*
    TODO get this from the render delegate so other elements may be used.
  */
  /** @private */
  autoResizeLayer: function() {
    var ret = this.invokeRenderDelegateMethod('getRenderedAutoResizeLayer', this.$());
    return ret || this.get('layer');
  }.property('layer').cacheable(),

  /** @private */
  autoResizeText: function() {
    return this.get('displayTitle');
  }.property('displayTitle').cacheable(),

  /**
    The padding to add to the measured size of the text to arrive at the measured
    size for the view.

    `SC.ButtonView` gets this from its render delegate, but if not supplied, defaults
    to 10.

    @default 10
    @type Number
  */
  autoResizePadding: SC.propertyFromRenderDelegate('autoResizePadding', 10),


  // TODO: What the hell is this? --TD
  _labelMinWidthIE7: 0,

  /**
    Called when the user presses a shortcut key, such as return or cancel,
    associated with this button.

    Highlights the button to show that it is being triggered, then, after a
    delay, performs the button's action.

    Does nothing if the button is disabled.

    @param {Event} evt
    @returns {Boolean} YES if successful, NO otherwise
  */
  triggerActionAfterDelay: function(evt) {
    // If this button is disabled, we have nothing to do
    if (!this.get('isEnabled')) return NO;

    // Set active state of the button so it appears highlighted
    this.set('isActive', YES);

    // Invoke the actual action method after a small delay to give the user a
    // chance to see the highlight. This is especially important if the button
    // closes a pane, for example.
    this.invokeLater('triggerAction', 200, evt);
    return YES;
  },

  /** @private
    Called by triggerActionAfterDelay; this method actually
    performs the action and restores the button's state.

    @param {Event} evt
  */
  triggerAction: function(evt) {
    this._action(evt, YES);
    this.didTriggerAction();
    this.set('isActive', NO);
  },

  /**
    Callback called anytime the button's action is triggered.  You can
    implement this method in your own subclass to perform any cleanup needed
    after an action is performed.
  */
  didTriggerAction: function() {},


  // ................................................................
  // INTERNAL SUPPORT
  //

  /** @private - save keyEquivalent for later use */
  init: function() {
    arguments.callee.base.apply(this,arguments);

    var keyEquivalent = this.get('keyEquivalent');
    // Cache the key equivalent. The key equivalent is saved so that if,
    // for example, isDefault is changed from YES to NO, the old key
    // equivalent can be restored.
    if (keyEquivalent) {
      this._defaultKeyEquivalent = keyEquivalent;
    }

    // if value is not null, update isSelected to match value.  If value is
    // null, we assume you may be using isSelected only.
    if (!SC.none(this.get('value'))) this._button_valueDidChange();
  },

  /**
    The WAI-ARIA role of the button.

    @type String
    @default 'button'
    @readOnly
  */
  ariaRole: 'button',

  // display properties that should automatically cause a refresh.
  // isCancel and isDefault also cause a refresh but this is implemented as
  // a separate observer (see below)

  /**
    The following properties affect how `SC.ButtonView` is rendered, and will
    cause the view to be rerendered if they change.

    @type Array
    @default [
      'icon', 'displayTitle', 'value', 'displayToolTip', 'isDefault', 'isCancel',
      'escapeHTML', 'needsEllipsis', 'tooltip', 'supportFocusRing'
    ]
  */
  displayProperties: [
    'icon', 'displayTitle', 'value', 'displayToolTip', 'isDefault', 'isCancel',
    'escapeHTML', 'needsEllipsis', 'tooltip', 'supportFocusRing',
    'buttonBehavior'
  ],

  /**
    The name of the render delegate in the theme that should be used to
    render the button.

    In this case, the 'button' property will be retrieved from the theme and
    set to the render delegate of this view.

    @type String
    @default 'buttonRenderDelegate'
  */
  renderDelegateName: 'buttonRenderDelegate',

   contentKeys: {
     'contentValueKey': 'value',
     'contentTitleKey': 'title',
     'contentIconKey': 'icon'
   },

  /** @private - when title changes, dirty display. */
  _button_displayObserver: function() {
    this.displayDidChange();
  }.observes('title', 'icon', 'value'),

  /**
    Handle a key equivalent if set.  Trigger the default action for the
    button.  Depending on the implementation this may vary.

    @param {String} keystring
    @param {SC.Event} evt
    @returns {Boolean}  YES if handled, NO otherwise
  */
  performKeyEquivalent: function(keystring, evt) {
    //If this is not visible
    if (!this.get('isVisibleInWindow')) return NO;

    if (!this.get('isEnabled')) return NO;
    var equiv = this.get('keyEquivalent');

    // button has defined a keyEquivalent and it matches!
    // if triggering succeeded, true will be returned and the operation will
    // be handled (i.e performKeyEquivalent will cease crawling the view
    // tree)
    if (equiv) {
      if (equiv === keystring) return this.triggerAction(evt);

    // should fire if isDefault OR isCancel.  This way if isDefault AND
    // isCancel, responds to both return and escape
    } else if ((this.get('isDefault') && (keystring === 'return')) ||
        (this.get('isCancel') && (keystring === 'escape'))) {
          return this.triggerAction(evt);
    }

    return NO; // did not handle it; keep searching
  },

  // ..........................................................
  // VALUE <-> isSelected STATE MANAGEMENT
  //

  /**
    This is the standard logic to compute a proposed isSelected state for a
    new value.  This takes into account the `toggleOnValue`/`toggleOffValue`
    properties, among other things.  It may return `YES`, `NO`, or
    `SC.MIXED_STATE`.

    @param {Object} value
    @returns {Boolean} return state
  */
  computeIsSelectedForValue: function(value) {
    var targetValue = this.get('toggleOnValue'), state, next ;

    if (SC.typeOf(value) === SC.T_ARRAY) {

      // treat a single item array like a single value
      if (value.length === 1) {
        state = (value[0] == targetValue) ;

      // for a multiple item array, check the states of all items.
      } else {
        state = null;
        value.find(function(x) {
          next = (x == targetValue) ;
          if (state === null) {
            state = next ;
          } else if (next !== state) state = SC.MIXED_STATE ;
          return state === SC.MIXED_STATE ; // stop when we hit a mixed state.
        });
      }

    // for single values, just compare to the toggleOnValue...use truthiness
    } else {
      if(value === SC.MIXED_STATE) state = SC.MIXED_STATE;
      else state = (value === targetValue) ;
    }
    return state ;
  },

  /** @private
    Whenever the button value changes, update the selected state to match.
  */
  _button_valueDidChange: function() {
    var value = this.get('value'),
        state = this.computeIsSelectedForValue(value);
    this.set('isSelected', state) ; // set new state...
  }.observes('value'),

  /** @private
    Whenever the selected state is changed, make sure the button value is
    also updated.  Note that this may be called because the value has just
    changed.  In that case this should do nothing.
  */
  _button_isSelectedDidChange: function() {
    var newState = this.get('isSelected'),
        curState = this.computeIsSelectedForValue(this.get('value'));

    // fix up the value, but only if computed state does not match.
    // never fix up value if isSelected is set to MIXED_STATE since this can
    // only come from the value.
    if ((newState !== SC.MIXED_STATE) && (curState !== newState)) {
      var valueKey = (newState) ? 'toggleOnValue' : 'toggleOffValue' ;
      this.set('value', this.get(valueKey));
    }
  }.observes('isSelected'),


  /** @private
    Used to store the keyboard equivalent.

    Setting the isDefault property to YES, for example, will cause the
    `keyEquivalent` property to 'return'. This cached value is used to restore
    the `keyEquivalent` property if isDefault is set back to NO.

    @type String
  */
  _defaultKeyEquivalent: null,

  /** @private

    Whenever the isDefault or isCancel property changes, re-render and change
    the keyEquivalent property so that we respond to the return or escape key.
  */
  _isDefaultOrCancelDidChange: function() {
    var isDefault = !!this.get('isDefault'),
        isCancel = !isDefault && this.get('isCancel') ;

    if (isDefault) {
      this.set('keyEquivalent', 'return'); // change the key equivalent
    } else if (isCancel) {
      this.set('keyEquivalent', 'escape') ;
    } else {
      // Restore the default key equivalent
      this.set('keyEquivalent', this._defaultKeyEquivalent);
    }
  }.observes('isDefault', 'isCancel'),

  /** @private
    On mouse down, set active only if enabled.
  */
  mouseDown: function(evt) {
    var buttonBehavior = this.get('buttonBehavior');

    if (!this.get('isEnabled')) return YES ; // handled event, but do nothing
    this.set('isActive', YES);
    this._isMouseDown = YES;

    if (buttonBehavior === SC.HOLD_BEHAVIOR) {
      this._action(evt);
    } else if (!this._isFocused && (buttonBehavior!==SC.PUSH_BEHAVIOR)) {
      this._isFocused = YES ;
      this.becomeFirstResponder();
    }

    return YES;
  },

  /** @private
    Remove the active class on mouseExited if mouse is down.
  */
  mouseExited: function(evt) {
    if (this._isMouseDown) {
      this.set('isActive', NO);
    }
    return YES;
  },

  /** @private
    If mouse was down and we renter the button area, set the active state again.
  */
  mouseEntered: function(evt) {
    if (this._isMouseDown) {
      this.set('isActive', YES);
    }
    return YES;
  },

  /** @private
    ON mouse up, trigger the action only if we are enabled and the mouse was released inside of the view.
  */
  mouseUp: function(evt) {
    if (this._isMouseDown) this.set('isActive', NO); // track independently in case isEnabled has changed
    this._isMouseDown = false;

    if (this.get('buttonBehavior') !== SC.HOLD_BEHAVIOR) {
      var inside = this.$().within(evt.target);
      if (inside && this.get('isEnabled')) this._action(evt) ;
    }

    return YES ;
  },

  /** @private */
  touchStart: function(touch){
    var buttonBehavior = this.get('buttonBehavior');

    if (!this.get('isEnabled')) return YES ; // handled event, but do nothing
    this.set('isActive', YES);

    if (buttonBehavior === SC.HOLD_BEHAVIOR) {
      this._action(touch);
    } else if (!this._isFocused && (buttonBehavior!==SC.PUSH_BEHAVIOR)) {
      this._isFocused = YES ;
      this.becomeFirstResponder();
    }

    // don't want to do whatever default is...
    touch.preventDefault();

    return YES;
  },

  /** @private */
  touchesDragged: function(evt, touches) {
    if (!this.touchIsInBoundary(evt)) {
      if (!this._touch_exited) this.set('isActive', NO);
      this._touch_exited = YES;
    } else {
      if (this._touch_exited) this.set('isActive', YES);
      this._touch_exited = NO;
    }

    evt.preventDefault();
    return YES;
  },

  /** @private */
  touchEnd: function(touch){
    this._touch_exited = NO;
    this.set('isActive', NO); // track independently in case isEnabled has changed

    if (this.get('buttonBehavior') !== SC.HOLD_BEHAVIOR) {
      if (this.touchIsInBoundary(touch) && this.get('isEnabled')) {
        this._action();
      }
    }

    touch.preventDefault();
    return YES ;
  },

  /** @private */
  keyDown: function(evt) {
    // handle tab key
     if(!this.get('isEnabled')) return YES;
    if (evt.which === 9 || evt.keyCode === 9) {
      var view = evt.shiftKey ? this.get('previousValidKeyView') : this.get('nextValidKeyView');
      if(view) view.becomeFirstResponder();
      else evt.allowDefault();
      return YES ; // handled
    }
    if (evt.which === 13 || evt.which === 32) {
      this.triggerActionAfterDelay(evt);
      return YES ; // handled
    }

    // let other keys through to browser
    evt.allowDefault();

    return NO;
  },

  /** @private
    Perform an action based on the behavior of the button.

     - toggle behavior: switch to on/off state
     - on behavior: turn on.
     - off behavior: turn off.
     - otherwise: invoke target/action
  */
  _action: function(evt, skipHoldRepeat) {
    switch(this.get('buttonBehavior')) {

    // When toggling, try to invert like values. i.e. 1 => 0, etc.
    case SC.TOGGLE_BEHAVIOR:
      var sel = this.get('isSelected') ;
      if (sel) {
        this.set('value', this.get('toggleOffValue')) ;
      } else {
        this.set('value', this.get('toggleOnValue')) ;
      }
      break ;

    // set value to on.  change 0 => 1.
    case SC.TOGGLE_ON_BEHAVIOR:
      this.set('value', this.get('toggleOnValue')) ;
      break ;

    // set the value to false. change 1 => 0
    case SC.TOGGLE_OFF_BEHAVIOR:
      this.set('value', this.get('toggleOffValue')) ;
      break ;

    case SC.HOLD_BEHAVIOR:
      this._runHoldAction(evt, skipHoldRepeat);
      break ;

    // otherwise, just trigger an action if there is one.
    default:
      //if (this.action) this.action(evt);
      this._runAction(evt);
    }
  },

  /** @private */
  _runAction: function(evt) {
    var action = this.get('action'),
        target = this.get('target') || null,
        rootResponder;

    if (action) {
      if (action && (SC.typeOf(action) === SC.T_FUNCTION)) {
        this.action(evt);
        return;
      } else {
        rootResponder = this.getPath('pane.rootResponder');
        if (rootResponder) {
          // newer action method + optional target syntax...
          rootResponder.sendAction(action, target, this, this.get('pane'), null, this);
        }
      }
    }
  },

  /** @private */
  _runHoldAction: function(evt, skipRepeat) {
    if (this.get('isActive')) {
      this._runAction();

      if (!skipRepeat) {
        // This run loop appears to only be necessary for testing
        SC.RunLoop.begin();
        this.invokeLater('_runHoldAction', this.get('holdInterval'), evt);
        SC.RunLoop.end();
      }
    }
  },


  /** @private */
  didBecomeKeyResponderFrom: function(keyView) {
    // focus the text field.
    if (!this._isFocused) {
      this._isFocused = YES ;
      this.becomeFirstResponder();
      if (this.get('isVisibleInWindow')) {
        this.$().focus();
      }
    }
  },

  /** @private */
  willLoseKeyResponderTo: function(responder) {
    if (this._isFocused) this._isFocused = NO ;
  },

  /** @private */
  didAppendToDocument: function() {
    if(SC.browser.isIE &&
        SC.browser.compare(SC.browser.engineVersion, '7') === 0 &&
        this.get('useStaticLayout')){
      var layout = this.get('layout'),
          elem = this.$(), w=0;
      if(elem && elem[0] && (w=elem[0].clientWidth) && w!==0 && this._labelMinWidthIE7===0){
        var label = this.$('.sc-button-label'),
            paddingRight = parseInt(label.css('paddingRight'),0),
            paddingLeft = parseInt(label.css('paddingLeft'),0),
            marginRight = parseInt(label.css('marginRight'),0),
            marginLeft = parseInt(label.css('marginLeft'),0);
        if(marginRight=='auto') SC.Logger.log(marginRight+","+marginLeft+","+paddingRight+","+paddingLeft);
        if(!paddingRight && isNaN(paddingRight)) paddingRight = 0;
        if(!paddingLeft && isNaN(paddingLeft)) paddingLeft = 0;
        if(!marginRight && isNaN(marginRight)) marginRight = 0;
        if(!marginLeft && isNaN(marginLeft)) marginLeft = 0;

        this._labelMinWidthIE7 = w-(paddingRight + paddingLeft)-(marginRight + marginLeft);
        label.css('minWidth', this._labelMinWidthIE7+'px');
      }else{
        this.invokeLater(this.didAppendToDocument, 1);
      }
    }
  }

}) ;



/**
  The delay after which "click" behavior should transition to "click and hold"
  behavior. This is used by subclasses such as PopupButtonView and
  SelectButtonView.

  @constant
  @type Number
*/
SC.ButtonView.CLICK_AND_HOLD_DELAY = SC.browser.isIE ? 600 : 300;

SC.REGULAR_BUTTON_HEIGHT=24;



/* >>>>>>>>>> BEGIN source/views/list_item.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================


/**
  @static
  @constant
*/
SC.LIST_ITEM_ACTION_CANCEL = 'sc-list-item-cancel-action';

/**
  @static
  @constant
*/
SC.LIST_ITEM_ACTION_REFRESH = 'sc-list-item-cancel-refresh';

/**
  @static
  @constant
*/
SC.LIST_ITEM_ACTION_EJECT = 'sc-list-item-cancel-eject';

/**
  @class

  Many times list items need to display a lot more than just a label of text.
  You often need to include checkboxes, icons, right icons, extra counts and
  an action or warning icon to the far right.

  A ListItemView can implement all of this for you in a more efficient way
  than you might get if you simply put together a list item on your own using
  views.

  @extends SC.View
  @extends SC.Control
  @extends SC.InlineEditable
  @extends SC.StaticLayout
  @since SproutCore 1.0
*/
SC.ListItemView = SC.View.extend(SC.InlineEditable, SC.Control,
/** @scope SC.ListItemView.prototype */ {

  /**
    @type Array
    @default ['sc-list-item-view']
    @see SC.View#classNames
  */
  classNames: ['sc-list-item-view'],

  /**
    @type Array
    @default ['disclosureState', 'escapeHTML']
    @see SC.View#displayProperties
  */
  displayProperties: ['disclosureState', 'escapeHTML', 'isDropTarget'],


  // ..........................................................
  // KEY PROPERTIES
  //

  /**
    The content object the list item will display.

    @type SC.Object
    @default null
  */
  content: null,

  /**
    The index of the content object in the ListView to which this
    ListItemView belongs.

    For example, if this ListItemView represents the first object
    in a ListView, this property would be 0.

    @type Number
    @default null
    @readOnly
  */
  contentIndex: null,

  /**
    (displayDelegate) True if you want the item view to display an icon.

    If false, the icon on the list item view will be hidden.  Otherwise,
    space will be left for the icon next to the list item view.

    @type Boolean
    @default NO
  */
  hasContentIcon: NO,

  /**
    (displayDelegate) True if you want the item view to display a right icon.

    If false, the icon on the list item view will be hidden.  Otherwise,
    space will be left for the icon next to the list item view.

    @type Boolean
    @default NO
  */
  hasContentRightIcon: NO,

  /**
    (displayDelegate) True if you want space to be allocated for a branch
    arrow.

    If false, the space for the branch arrow will be collapsed.

    @type Boolean
    @default NO
  */
  hasContentBranch: NO,

  /**
    (displayDelegate) The name of the property used for the checkbox value.

    The checkbox will only be visible if this key is not null.

    @type String
    @default null
  */
  contentCheckboxKey: null,

  /**
    The URL or CSS class name to use for the icon. This is only used if
    contentIconKey is null, or returns null from the delegate.

    @type String
    @default null
  */
  icon: null,

  /**
    Whether this item is the drop target of a drag operation.

    If the list view supports the SC.DROP_ON operation, it will set this
    property on whichever list item view is the current target of the drop.

    When true, the 'drop-target' class is added to the element.

    @type Boolean
    @default false
  */
  isDropTarget: NO,

  /**
    (displayDelegate) Property key to use for the icon url

    This property will be checked on the content object to determine the
    icon to display.  It must return either a URL or a CSS class name.

    @type String
    @default NO
  */
  contentIconKey: null,

  /**
    The URL or CSS class name to use for the right icon. This is only used if
    contentRightIconKey is null, or returns null from the delegate.

    @type String
    @default null
  */
  rightIcon: null,

  /**
    (displayDelegate) Property key to use for the right icon url

    This property will be checked on the content object to determine the
    icon to display.  It must return either a URL or a CSS class name.

    @type String
    @default null
  */
  contentRightIconKey: null,

  /**
    (displayDelegate) The name of the property used for label itself

    If null, then the content object itself will be used..

    @type String
    @default null
  */
  contentValueKey: null,

  /**
    IF true, the label value will be escaped to avoid HTML injection attacks.
    You should only disable this option if you are sure you will only
    display content that is already escaped and you need the added
    performance gain.

    @type Boolean
    @default YES
  */
  escapeHTML: YES,

  /**
    (displayDelegate) The name of the property used to find the count of
    unread items.

    The count will only be visible if this property is not null and the
    returned value is not 0.

    @type String
    @default null
  */
  contentUnreadCountKey: null,

  /**
    (displayDelegate) The name of the property used to determine if the item
    is a branch or leaf (i.e. if the branch icon should be displayed to the
    right edge.)

    If this is null, then the branch view will be completely hidden.
    Otherwise space will be allocated for it.

    @type String
    @default null
  */
  contentIsBranchKey: null,

  /**
    Indent to use when rendering a list item with an outline level > 0.  The
    left edge of the list item will be indented by this amount for each
    outline level.

    @type Number
    @default 16
  */
  outlineIndent: 16,

  /**
    Outline level for this list item.  Usually set by the collection view.

    @type Number
    @default 0
  */
  outlineLevel: 0,

  /**
    Disclosure state for this list item.  Usually set by the collection view
    when the list item is created. Possible values:

      - SC.LEAF_NODE
      - SC.BRANCH_OPEN
      - SC.BRANCH_CLOSED

    @type String
    @default SC.LEAF_NODE
  */
  disclosureState: SC.LEAF_NODE,

  /**
    The validator to use for the inline text field created when the list item
    is edited.
  */
  validator: null,

  contentKeys: {
    contentValueKey: 'title',
    contentCheckboxKey: 'checkbox',
    contentIconKey:  'icon',
    contentRightIconKey: 'rightIcon',
    contentUnreadCountKey: 'count',
    contentIsBranchKey: 'branch'
  },

  /** @private */
  contentPropertyDidChange: function() {
    //if (this.get('isEditing')) this.discardEditing() ;
    if (this.get('contentIsEditable') !== this.contentIsEditable()) {
      this.notifyPropertyChange('contentIsEditable');
    }

    this.displayDidChange();
  },

  /**
    Determines if content is editable or not. Checkboxes and other related
    components will render disabled if an item is not editable.

    @field
    @type Boolean
    @observes content
  */
  contentIsEditable: function() {
    var content = this.get('content');
    return content && (content.get ? content.get('isEditable')!==NO : NO);
  }.property('content').cacheable(),

  /**
    @type Object
    @default SC.InlineTextFieldDelegate
  */
  inlineEditorDelegate: SC.InlineTextFieldDelegate,

  /**
    Finds and retrieves the element containing the label.  This is used
    for inline editing.  The default implementation returns a CoreQuery
    selecting any label elements.   If you override renderLabel() you
    probably need to override this as well.

    @returns {jQuery} jQuery object selecting label elements
  */
  $label: function() {
    return this.$('label');
  },

  /** @private
    Determines if the event occurred inside an element with the specified
    classname or not.
  */
  _isInsideElementWithClassName: function(className, evt) {
    var layer = this.get('layer');
    if (!layer) return NO ; // no layer yet -- nothing to do

    var el = SC.$(evt.target) ;
    var ret = NO;
    while(!ret && el.length>0 && (el[0] !== layer)) {
      if (el.hasClass(className)) ret = YES ;
      el = el.parent() ;
    }
    el = layer = null; //avoid memory leaks
    return ret ;
  },

  /** @private
    Returns YES if the list item has a checkbox and the event occurred
    inside of it.
  */
  _isInsideCheckbox: function(evt) {
    var del = this.displayDelegate ;
    var checkboxKey = this.getDelegateProperty('contentCheckboxKey', del) ;
    return checkboxKey && this._isInsideElementWithClassName('sc-checkbox-view', evt);
  },

  /** @private
    Returns YES if the list item has a disclosure triangle and the event
    occurred inside of it.
  */
  _isInsideDisclosure: function(evt) {
    if (this.get('disclosureState')===SC.LEAF_NODE) return NO;
    return this._isInsideElementWithClassName('sc-disclosure-view', evt);
  },

  /** @private
    Returns YES if the list item has a right icon and the event
    occurred inside of it.
  */
  _isInsideRightIcon: function(evt) {
    var del = this.displayDelegate ;
    var rightIconKey = this.getDelegateProperty('hasContentRightIcon', del) || !SC.none(this.rightIcon);
    return rightIconKey && this._isInsideElementWithClassName('right-icon', evt);
  },

  /** @private
    mouseDown is handled only for clicks on the checkbox view or or action
    button.
  */
  mouseDown: function(evt) {
    // if content is not editable, then always let collection view handle the
    // event.
    if (!this.get('contentIsEditable')) return NO ;

    // if occurred inside checkbox, item view should handle the event.
    if (this._isInsideCheckbox(evt)) {
      this._addCheckboxActiveState() ;
      this._isMouseDownOnCheckbox = YES ;
      this._isMouseInsideCheckbox = YES ;
      return YES ; // listItem should handle this event

    } else if (this._isInsideDisclosure(evt)) {
      this._addDisclosureActiveState();
      this._isMouseDownOnDisclosure = YES;
      this._isMouseInsideDisclosure = YES ;
      return YES;
    } else if (this._isInsideRightIcon(evt)) {
      this._addRightIconActiveState();
      this._isMouseDownOnRightIcon = YES;
      this._isMouseInsideRightIcon = YES ;
      return YES;
    }

    return NO ; // let the collection view handle this event
  },

  /** @private */
  mouseUp: function(evt) {
    var ret= NO, del, checkboxKey, content, state, idx, set;

    // if mouse was down in checkbox -- then handle mouse up, otherwise
    // allow parent view to handle event.
    if (this._isMouseDownOnCheckbox) {

      // update only if mouse inside on mouse up...
      if (this._isInsideCheckbox(evt)) {
        del = this.displayDelegate ;
        checkboxKey = this.getDelegateProperty('contentCheckboxKey', del);
        content = this.get('content') ;
        if (content && content.get) {
          var value = content.get(checkboxKey) ;
          value = (value === SC.MIXED_STATE) ? YES : !value ;
          content.set(checkboxKey, value) ; // update content
          this.displayDidChange(); // repaint view...
        }
      }

      this._removeCheckboxActiveState() ;
      ret = YES ;

    // if mouse as down on disclosure -- handle mouse up.  otherwise pass on
    // to parent.
    } else if (this._isMouseDownOnDisclosure) {
      if (this._isInsideDisclosure(evt)) {
        state = this.get('disclosureState');
        idx   = this.get('contentIndex');
        set   = (!SC.none(idx)) ? SC.IndexSet.create(idx) : null;
        del = this.get('displayDelegate');

        if (state === SC.BRANCH_OPEN) {
          if (set && del && del.collapse) del.collapse(set);
          else this.set('disclosureState', SC.BRANCH_CLOSED);
          this.displayDidChange();

        } else if (state === SC.BRANCH_CLOSED) {
          if (set && del && del.expand) del.expand(set);
          else this.set('disclosureState', SC.BRANCH_OPEN);
          this.displayDidChange();
        }
      }

      this._removeDisclosureActiveState();
      ret = YES ;
    // if mouse was down in right icon -- then handle mouse up, otherwise
    // allow parent view to handle event.
    } else if (this._isMouseDownOnRightIcon) {
      this._removeRightIconActiveState() ;
      ret = YES ;
    }

    // clear cached info
    this._isMouseInsideCheckbox = this._isMouseDownOnCheckbox = NO ;
    this._isMouseDownOnDisclosure = this._isMouseInsideDisclosure = NO ;
    this._isMouseInsideRightIcon = this._isMouseDownOnRightIcon = NO ;
    return ret ;
  },

  /** @private */
  mouseMoved: function(evt) {
    if (this._isMouseDownOnCheckbox && this._isInsideCheckbox(evt)) {
      this._addCheckboxActiveState() ;
      this._isMouseInsideCheckbox = YES ;
    } else if (this._isMouseDownOnCheckbox) {
     this._removeCheckboxActiveState() ;
     this._isMouseInsideCheckbox = NO ;
    } else if (this._isMouseDownOnDisclosure && this._isInsideDisclosure(evt)) {
      this._addDisclosureActiveState();
      this._isMouseInsideDisclosure = YES;
   } else if (this._isMouseDownOnDisclosure) {
     this._removeDisclosureActiveState();
     this._isMouseInsideDisclosure = NO ;
    } else if (this._isMouseDownOnRightIcon && this._isInsideRightIcon(evt)) {
      this._addRightIconActiveState();
      this._isMouseInsideRightIcon = YES;
   } else if (this._isMouseDownOnRightIcon) {
     this._removeRightIconActiveState();
     this._isMouseInsideRightIcon = NO ;
   }
   return NO ;
  },

  /** @private */
  touchStart: function(evt){
    return this.mouseDown(evt);
  },

  /** @private */
  touchEnd: function(evt){
    return this.mouseUp(evt);
  },

  /** @private */
  touchEntered: function(evt){
    return this.mouseEntered(evt);
  },

  /** @private */
  touchExited: function(evt){
    return this.mouseExited(evt);
  },


  /** @private */
  _addCheckboxActiveState: function() {
    if (this.get('isEnabled')) {
      if (this._checkboxRenderDelegate) {
        var source = this._checkboxRenderSource;

        source.set('isActive', YES);

        this._checkboxRenderDelegate.update(source, this.$('.sc-checkbox-view'));
      } else {
        // for backwards-compatibility.
        this.$('.sc-checkbox-view').addClass('active');
      }
    }
  },

  /** @private */
  _removeCheckboxActiveState: function() {
    if (this._checkboxRenderer) {
      var source = this._checkboxRenderSource;

      source.set('isActive', NO);

      this._checkboxRenderDelegate.update(source, this.$('.sc-checkbox-view'));
    } else {
      // for backwards-compatibility.
      this.$('.sc-checkbox-view').removeClass('active');
    }
  },

  /** @private */
  _addDisclosureActiveState: function() {
    if (this.get('isEnabled')) {
      if (this._disclosureRenderDelegate) {
        var source = this._disclosureRenderSource;
        source.set('isActive', YES);

        this._disclosureRenderDelegate.update(source, this.$('.sc-disclosure-view'));
      } else {
        // for backwards-compatibility.
        this.$('.sc-disclosure-view').addClass('active');
      }

    }
  },

  /** @private */
  _removeDisclosureActiveState: function() {
    if (this._disclosureRenderer) {
      var source = this._disclosureRenderSource;
      source.set('isActive', NO);

      this._disclosureRenderDelegate.update(source, this.$('.sc-disclosure-view'));
    } else {
      // for backwards-compatibility.
      this.$('.sc-disclosure-view').addClass('active');
    }
  },

  /** @private */
  _addRightIconActiveState: function() {
   this.$('img.right-icon').setClass('active', YES);
  },

  /** @private */
  _removeRightIconActiveState: function() {
   this.$('img.right-icon').removeClass('active');
  },

  /** @private
    Returns true if a click is on the label text itself to enable editing.

    Note that if you override renderLabel(), you probably need to override
    this as well, or just $label() if you only want to control the element
    returned.

    @param evt {Event} the mouseUp event.
    @returns {Boolean} YES if the mouse was on the content element itself.
  */
  contentHitTest: function(evt) {
   // if not content value is returned, not much to do.
   var del = this.displayDelegate ;
   var labelKey = this.getDelegateProperty('contentValueKey', del) ;
   if (!labelKey) return NO ;

   // get the element to check for.
   var el = this.$label()[0] ;
   if (!el) return NO ; // no label to check for.

   var cur = evt.target, layer = this.get('layer') ;
   while(cur && (cur !== layer) && (cur !== window)) {
     if (cur === el) return YES ;
     cur = cur.parentNode ;
   }

   return NO;
  },

  /*
    Edits the label portion of the list item. If scrollIfNeeded is YES, will
    scroll to the item before editing it.

    @params {Boolean} if the parent scroll view should be scrolled to this item
      before editing begins
    @returns {Boolean} YES if successful
  */
  beginEditing: function(original, scrollIfNeeded) {
    var el        = this.$label(),
        parent    = this.get('parentView');

    // if possible, find a nearby scroll view and scroll into view.
    // HACK: if we scrolled, then wait for a loop and get the item view again
    // and begin editing.  Right now collection view will regenerate the item
    // view too often.
    if (scrollIfNeeded && this.scrollToVisible()) {
      var collectionView = this.get('owner'), idx = this.get('contentIndex');
      this.invokeLast(function() {
        var item = collectionView.itemViewForContentIndex(idx);
        if (item && item.beginEditing) item.beginEditing(NO);
      });
      return YES; // let the scroll happen then begin editing...
    }

    else if (!parent || !el || el.get('length')===0) return NO ;

    else return original();
  }.enhance(),

  /*
    Configures the editor to overlay the label properly.
  */
  inlineEditorWillBeginEditing: function(editor, editable, value) {
    var content   = this.get('content'),
        del       = this.get('displayDelegate'),
        labelKey  = this.getDelegateProperty('contentValueKey', del),
        parent    = this.get('parentView'),
        el        = this.$label(),
        validator = this.get('validator'),
        f, v, offset, fontSize, top, lineHeight, escapeHTML,
        lineHeightShift, targetLineHeight, ret ;

    v = (labelKey && content) ? (content.get ? content.get(labelKey) : content[labelKey]) : content;

    f = this.computeFrameWithParentFrame(null);

    // if the label has a large line height, try to adjust it to something
    // more reasonable so that it looks right when we show the popup editor.
    lineHeight = this._oldLineHeight = el.css('lineHeight');
    fontSize = el.css('fontSize');
    top = this.$().css('top');

    if (top) top = parseInt(top.substring(0,top.length-2),0);
    else top =0;

    lineHeightShift = 0;

    if (fontSize && lineHeight) {
      targetLineHeight = fontSize * 1.5 ;
      if (targetLineHeight < lineHeight) {
        el.css({ lineHeight: '1.5' });
        lineHeightShift = (lineHeight - targetLineHeight) / 2;
      } else oldLineHeight = null ;
    }

    el = el[0];
    offset = SC.offset(el);

    f.x = offset.x;
    f.y = offset.y+top + lineHeightShift ;
    f.height = el.offsetHeight ;
    f.width = el.offsetWidth ;

    escapeHTML = this.get('escapeHTML');

    editor.set({
      value: v,
      exampleFrame: f,
      exampleElement: el,
      multiline: NO,
      isCollection: YES,
      validator: validator,
      escapeHTML: escapeHTML
    }) ;
  },

  /** @private
    Allow editing.
  */
  inlineEditorShouldBeginEditing: function(inlineEditor) {
    return YES;
  },

  /** @private
   Hide the label view while the inline editor covers it.
  */
  inlineEditorDidBeginEditing: function(original, inlineEditor, value, editable) {
    original(inlineEditor, value, editable);

    var el = this.$label() ;
    this._oldOpacity = el.css('opacity');
    el.css('opacity', 0.0) ;

    // restore old line height for original item if the old line height
    // was saved.
    if (this._oldLineHeight) el.css({ lineHeight: this._oldLineHeight }) ;
  }.enhance(),

  /** @private
   Update the field value and make it visible again.
  */
  inlineEditorDidCommitEditing: function(editor, finalValue, editable) {
    var content = this.get('content') ;
    var del = this.displayDelegate ;
    var labelKey = this.getDelegateProperty('contentValueKey', del) ;

    if(labelKey && content) {
      if(content.set) content.set(labelKey, finalValue);
      else content[labelKey] = finalValue;
    }

    else this.set('content', finalValue);

    this.displayDidChange();

    this._endEditing();
  },

  _endEditing: function(original) {
    this.$label().css('opacity', this._oldOpacity);

    original();
  }.enhance(),

  /** @private
    Fills the passed html-array with strings that can be joined to form the
    innerHTML of the receiver element.  Also populates an array of classNames
    to set on the outer element.

    @param {SC.RenderContext} context
    @param {Boolean} firstTime
    @returns {void}
  */
  render: function(context, firstTime) {
    var content = this.get('content'),
        del     = this.displayDelegate,
        level   = this.get('outlineLevel'),
        indent  = this.get('outlineIndent'),
        key, value, working, classArray = [];

    // add alternating row classes
    classArray.push((this.get('contentIndex')%2 === 0) ? 'even' : 'odd');
    context.setClass('disabled', !this.get('isEnabled'));
    context.setClass('drop-target', this.get('isDropTarget'));

    // outline level wrapper
    working = context.begin("div").addClass("sc-outline");
    if (level>=0 && indent>0) working.addStyle("left", indent*(level+1));

    // handle disclosure triangle
    value = this.get('disclosureState');
    if (value !== SC.LEAF_NODE) {
      this.renderDisclosure(working, value);
      classArray.push('has-disclosure');
    }


    // handle checkbox
    key = this.getDelegateProperty('contentCheckboxKey', del) ;
    if (key) {
      value = content ? (content.get ? content.get(key) : content[key]) : NO ;
      if (value !== null) {
        this.renderCheckbox(working, value);
        classArray.push('has-checkbox');
      }
    }

    // handle icon
    if (this.getDelegateProperty('hasContentIcon', del)) {
      key = this.getDelegateProperty('contentIconKey', del) ;
      value = (key && content) ? (content.get ? content.get(key) : content[key]) : null ;

      if (value) {
        this.renderIcon(working, value);
        classArray.push('has-icon');
      }
    } else if (this.get('icon')) {
      value = this.get('icon');
      this.renderIcon(working, value);
      classArray.push('has-icon');
    }

    // handle label -- always invoke
    key = this.getDelegateProperty('contentValueKey', del) ;
    value = (key && content) ? (content.get ? content.get(key) : content[key]) : content ;
    if (value && SC.typeOf(value) !== SC.T_STRING) value = value.toString();
    if (this.get('escapeHTML')) value = SC.RenderContext.escapeHTML(value);
    this.renderLabel(working, value);

    // handle right icon
    if (this.getDelegateProperty('hasContentRightIcon', del)) {
      key = this.getDelegateProperty('contentRightIconKey', del) ;
      value = (key && content) ? (content.get ? content.get(key) : content[key]) : null ;

      this.renderRightIcon(working, value);
      classArray.push('has-right-icon');
    }

    // handle unread count
    key = this.getDelegateProperty('contentUnreadCountKey', del) ;
    value = (key && content) ? (content.get ? content.get(key) : content[key]) : null ;
    if (!SC.none(value) && (value !== 0)) {
      this.renderCount(working, value) ;
      var digits = ['zero', 'one', 'two', 'three', 'four', 'five'];
      var valueLength = value.toString().length;
      var digitsLength = digits.length;
      var digit = (valueLength < digitsLength) ? digits[valueLength] : digits[digitsLength-1];
      classArray.push('has-count '+digit+'-digit');
    }

    // handle action
    key = this.getDelegateProperty('listItemActionProperty', del) ;
    value = (key && content) ? (content.get ? content.get(key) : content[key]) : null ;
    if (value) {
      this.renderAction(working, value);
      classArray.push('has-action');
    }

    // handle branch
    if (this.getDelegateProperty('hasContentBranch', del)) {
      key = this.getDelegateProperty('contentIsBranchKey', del);
      value = (key && content) ? (content.get ? content.get(key) : content[key]) : NO ;
      this.renderBranch(working, value);
      classArray.push('has-branch');
    }
    context.addClass(classArray);
    context = working.end();
  },

  /** @private
    Adds a disclosure triangle with the appropriate display to the content.
    This method will only be called if the disclosure state of the view is
    something other than SC.LEAF_NODE.

    @param {SC.RenderContext} context the render context
    @param {Boolean} state YES, NO or SC.MIXED_STATE
    @returns {void}
  */
  renderDisclosure: function(context, state) {
    var renderer = this.get('theme').disclosureRenderDelegate;

    context = context.begin('div')
      .addClass('sc-disclosure-view')
      .addClass('sc-regular-size')
      .addClass(this.get('theme').classNames)
      .addClass(renderer.get('className'));

    var source = this._disclosureRenderSource;
    if (!source) {
      this._disclosureRenderSource = source =
      SC.Object.create({ renderState: {}, theme: this.get('theme') });
    }

    source
      .set('isSelected', state === SC.BRANCH_OPEN)
      .set('isEnabled', this.get('isEnabled'))
      .set('title', '');

    renderer.render(source, context);

    context = context.end();
    this._disclosureRenderDelegate = renderer;
 },

  /** @private
    Adds a checkbox with the appropriate state to the content.  This method
    will only be called if the list item view is supposed to have a
    checkbox.

    @param {SC.RenderContext} context the render context
    @param {Boolean} state YES, NO or SC.MIXED_STATE
    @returns {void}
  */
  renderCheckbox: function(context, state) {
    var renderer = this.get('theme').checkboxRenderDelegate;

    // note: checkbox-view is really not the best thing to do here; we should do
    // sc-list-item-checkbox; however, themes expect something different, unfortunately.
    context = context.begin('div')
      .addClass('sc-checkbox-view')
      .addClass('sc-regular-size')
      .addClass(this.get('theme').classNames)
      .addClass(renderer.get('className'));

    var source = this._checkboxRenderSource;
    if (!source) {
      source = this._checkboxRenderSource =
      SC.Object.create({ renderState: {}, theme: this.get('theme') });
    }

    source
      .set('isSelected', state && (state !== SC.MIXED_STATE))
      .set('isEnabled', this.get('isEnabled') && this.get('contentIsEditable'))
      .set('isActive', this._checkboxIsActive)
      .set('title', '');

    renderer.render(source, context);
    context = context.end();

    this._checkboxRenderDelegate = renderer;
 },

  /** @private
    Generates an icon for the label based on the content.  This method will
    only be called if the list item view has icons enabled.  You can override
    this method to display your own type of icon if desired.

    @param {SC.RenderContext} context the render context
    @param {String} icon a URL or class name.
    @returns {void}
  */
  renderIcon: function(context, icon) {
    // get a class name and url to include if relevant
    var url = null, className = null , classArray=[];
    if (icon && SC.ImageView.valueIsUrl(icon)) {
      url = icon; className = '' ;
    } else {
      className = icon; url = SC.BLANK_IMAGE_URL ;
    }

    // generate the img element...
    classArray.push(className,'icon');
    context.begin('img')
            .addClass(classArray)
            .attr('src', url)
            .end();
  },

  /** @private
   Generates a label based on the content.  You can override this method to
   display your own type of icon if desired.

   @param {SC.RenderContext} context the render context
   @param {String} label the label to display, already HTML escaped.
   @returns {void}
  */
  renderLabel: function(context, label) {
    context.push('<label>', label || '', '</label>') ;
  },

  /** @private
    Generates a right icon for the label based on the content.  This method will
    only be called if the list item view has icons enabled.  You can override
    this method to display your own type of icon if desired.

    @param {SC.RenderContext} context the render context
    @param {String} icon a URL or class name.
    @returns {void}
  */
  renderRightIcon: function(context, icon) {
    // get a class name and url to include if relevant
    var url = null, className = null, classArray=[];
    if (icon && SC.ImageView.valueIsUrl(icon)) {
      url = icon; className = '' ;
    } else {
      className = icon; url = SC.BLANK_IMAGE_URL ;
    }

    // generate the img element...
    classArray.push('right-icon',className);
    context.begin('img')
      .addClass(classArray)
      .attr('src', url)
    .end();
  },

  /** @private
   Generates an unread or other count for the list item.  This method will
   only be called if the list item view has counts enabled.  You can
   override this method to display your own type of counts if desired.

   @param {SC.RenderContext} context the render context
   @param {Number} count the count
   @returns {void}
  */
  renderCount: function(context, count) {
    context.push('<span class="count"><span class="inner">',
                  count.toString(),'</span></span>') ;
  },

  /** @private
    Generates the html string used to represent the action item for your
    list item.  override this to return your own custom HTML

    @param {SC.RenderContext} context the render context
    @param {String} actionClassName the name of the action item
    @returns {void}
  */
  renderAction: function(context, actionClassName) {
    context.push('<img src="',SC.BLANK_IMAGE_URL,'" class="action" />');
  },

  /** @private
   Generates the string used to represent the branch arrow. override this to
   return your own custom HTML

   @param {SC.RenderContext} context the render context
   @param {Boolean} hasBranch YES if the item has a branch
   @returns {void}
  */
  renderBranch: function(context, hasBranch) {
    var classArray=[];
    classArray.push('branch',hasBranch ? 'branch-visible' : 'branch-hidden');
    context.begin('span')
          .addClass(classArray)
          .push('&nbsp;')
          .end();
  }

});

SC.ListItemView._deprecatedRenderWarningHasBeenIssued = false;

/* >>>>>>>>>> BEGIN source/views/collection.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('mixins/collection_view_delegate') ;
sc_require('views/list_item');

/**
  Special drag operation passed to delegate if the collection view proposes
  to perform a reorder event.

  @static
  @constant
*/
SC.DRAG_REORDER = 0x0010;

/**
  @static
  @static
  @default NO
*/
SC.BENCHMARK_RELOAD = NO;

/*
  TODO Document SC.CollectionView
*/

/**
  @class

  Renders a collection of views from a source array of model objects.

  The `CollectionView` is the root view class for rendering collections of
  views based on a source array of objects.  It can automatically create the
  and layout the views, including displaying them in groups.  It also
  handles event input for the entire collection.

  To use `CollectionView`, just create the view and set the 'content' property
  to an array of objects.  (Note that if you setup a binding, it will
  always transform content to an array.)  The view will create instances of
  exampleView to render the array.  You can also bind to the selection
  property if you want to monitor selection. (be sure to set the isEnabled
  property to allow selection.)

  @extends SC.View
  @extends SC.CollectionViewDelegate
  @extends SC.CollectionContent
  @since SproutCore 0.9
*/
SC.CollectionView = SC.View.extend(SC.CollectionViewDelegate, SC.CollectionContent,
/** @scope SC.CollectionView.prototype */ {

  /**
    @type Array
    @default ['sc-collection-view']
    @see SC.View#classNames
  */
  classNames: ['sc-collection-view'],

  /**
    @type Array
    @default ['hasFirstResponder', 'isEnabled', 'isActive']
  */
  displayProperties: ['hasFirstResponder', 'isEnabled', 'isActive'],

  /**
    @type String
    @default 'collectionRenderDelegate'
  */
  renderDelegateName: 'collectionRenderDelegate',

  /**
    @type Number
    @default 200
  */
  ACTION_DELAY: 200,

  // ......................................
  // PROPERTIES
  //

  /**
    If `YES`, uses the experimental fast `CollectionView` path.

    @type Boolean
    @default NO
  */
  useFastPath: NO,

  /**
    An array of content objects

    This array should contain the content objects you want the collection view
    to display.  An item view (based on the `exampleView` view class) will be
    created for each content object, in the order the content objects appear
    in this array.

    If you make the collection editable, the collection view will also modify
    this array using the observable array methods of `SC.Array`.

    Usually you will want to bind this property to a controller property
    that actually contains the array of objects you to display.

    @type SC.Array
    @default null
  */
  content: null,

  /** @private */
  contentBindingDefault: SC.Binding.multiple(),

  /**
    The current length of the content.

    @type Number
    @default 0
  */
  length: 0,

  /**
    The set of indexes that are currently tracked by the collection view.
    This property is used to determine the range of items the collection view
    should monitor for changes.

    The default implementation of this property returns an index set covering
    the entire range of the content.  It changes automatically whenever the
    length changes.

    Note that the returned index set for this property will always be frozen.
    To change the nowShowing index set, you must create a new index set and
    apply it.

    @field
    @type SC.IndexSet
    @observes length
    @observes clippingFrame
  */
  nowShowing: function() {
    return this.computeNowShowing();
  }.property('length', 'clippingFrame').cacheable(),

  /**
    Indexes of selected content objects.  This `SC.SelectionSet` is modified
    automatically by the collection view when the user changes the selection
    on the collection.

    Any item views representing content objects in this set will have their
    isSelected property set to `YES` automatically.

    @type SC.SelectionSet
    @default null
  */
  selection: null,

  /**
    Allow user to select content using the mouse and keyboard.

    Set this property to `NO` to disallow the user from selecting items. If you
    have items in your `selectedIndexes property, they will still be reflected
    visually.

    @type Boolean
    @default YES
  */
  isSelectable: YES,

  /** @private */
  isSelectableBindingDefault: SC.Binding.bool(),

  /**
    Enable or disable the view.

    The collection view will set the `isEnabled` property of its item views to
    reflect the same view of this property.  Whenever ``isEnabled` is false,
    the collection view will also be not selectable or editable, regardless of
    the settings for isEditable` & `isSelectable`.

    @type Boolean
    @default YES
  */
  isEnabled: YES,

  /** @private */
  isEnabledBindingDefault: SC.Binding.bool(),

  /**
    Allow user to edit content views.

    The collection view will set the `isEditable` property on its item views to
    reflect the same value of this property.  Whenever `isEditable` is false,
    the user will not be able to reorder, add, or delete items regardless of
    the `canReorderContent` and `canDeleteContent` and `isDropTarget`
    properties.

    @type Boolean
    @default YES
  */
  isEditable: YES,

  /** @private */
  isEditableBindingDefault: SC.Binding.bool(),

  /**
    Allow user to reorder items using drag and drop.

    If true, the user will can use drag and drop to reorder items in the list.
    If you also accept drops, this will allow the user to drop items into
    specific points in the list.  Otherwise items will be added to the end.

    @type Boolean
    @default NO
  */
  canReorderContent: NO,

  /** @private */
  canReorderContentBindingDefault: SC.Binding.bool(),

  /**
    Allow the user to delete items using the delete key

    If true the user will be allowed to delete selected items using the delete
    key.  Otherwise deletes will not be permitted.

    @type Boolean
    @default NO
  */
  canDeleteContent: NO,

  /** @private */
  canDeleteContentBindingDefault: SC.Binding.bool(),

  /**
    Allow user to edit the content by double clicking on it or hitting return.
    This will only work if isEditable is `YES` and the item view implements
    the `beginEditing()` method.

    @type Boolean
  */
  canEditContent: NO,

  /** @private */
  canEditContentBindingDefault: SC.Binding.bool(),

  /**
    Accept drops for data other than reordering.

    Setting this property to return true when the view is instantiated will
    cause it to be registered as a drop target, activating the other drop
    machinery.

    @type Boolean
    @default NO
  */
  isDropTarget: NO,

  /**
    Use toggle selection instead of normal click behavior.

    If set to true, then selection will use a toggle instead of the normal
    click behavior.  Command modifiers will be ignored and instead clicking
    once will select an item and clicking on it again will deselect it.

    @type Boolean
    @default NO
  */
  useToggleSelection: NO,

  /**
    Trigger the action method on a single click.

    Normally, clicking on an item view in a collection will select the content
    object and double clicking will trigger the action method on the
    collection view.

    If you set this property to `YES`, then clicking on a view will both select
    it (if `isSelected` is true) and trigger the action method.

    Use this if you are using the collection view as a menu of items.

    @type Boolean
    @default NO
  */
  actOnSelect: NO,


  /**
    Select an item immediately on mouse down

    Normally as soon as you begin a click the item will be selected.

    In some UI scenarios, you might want to prevent selection until
    the mouse is released, so you can perform, for instance, a drag operation
    without actually selecting the target item.

    @type Boolean
    @default YES
  */
  selectOnMouseDown: YES,

  /**
    The view class to use when creating new item views.

    The collection view will automatically create an instance of the view
    class you set here for each item in its content array.  You should provide
    your own subclass for this property to display the type of content you
    want.

    For best results, the view you set here should understand the following
    properties:

     - `content` -- The content object from the content array your view should display
     - `isEnabled` -- True if the view should appear enabled
     - `isSelected` -- True if the view should appear selected

    In general you do not want your child views to actually respond to mouse
    and keyboard events themselves.  It is better to let the collection view
    do that.

    If you do implement your own event handlers such as mouseDown or mouseUp,
    you should be sure to actually call the same method on the collection view
    to give it the chance to perform its own selection housekeeping.

    @type SC.View
    @default SC.ListItemView
  */
  exampleView: SC.ListItemView,

  /**
    If set, this key will be used to get the example view for a given
    content object.  The exampleView property will be ignored.

    @type String
    @default null
  */
  contentExampleViewKey: null,

  /**
    The view class to use when creating new group item views.

    The collection view will automatically create an instance of the view
    class you set here for each item in its content array.  You should provide
    your own subclass for this property to display the type of content you
    want.

    If you leave this set to null then the regular example view will be used
    with the isGroupView property set to YES on the item view.

    @type SC.View
    @default null
  */
  groupExampleView: null,

  /**
    If set, this key will be used to get the example view for a given
    content object.  The `groupExampleView` property will be ignored.

    @type String
    @default null
  */
  contentGroupExampleViewKey: null,

  /**
    Invoked when the user double clicks on an item (or single clicks of
    actOnSelect is true)

    Set this to the name of the action you want to send down the
    responder chain when the user double clicks on an item (or single clicks
    if `actOnSelect` is true).  You can optionally specify a specific target as
    well using the target property.

    If you do not specify an action, then the collection view will also try to
    invoke the action named on the target item view.

    Older versions of SproutCore expected the action property to contain an
    actual function that would be run.  This format is still supported but is
    deprecated for future use.  You should generally use the responder chain
    to handle your action for you.

    @type String
    @default null
  */
  action: null,

  /**
    Optional target to send the action to when the user double clicks.

    If you set the action property to the name of an action, you can
    optionally specify the target object you want the action to be sent to.
    This can be either an actual object or a property path that will resolve
    to an object at the time that the action is invoked.

    This property is ignored if you use the deprecated approach of making the
    action property a function.

    @type String|Object
    @default null
  */
  target: null,

  /**
    Property on content items to use for display.

    Built-in item views such as the `LabelView`s and `ImageView`s will use the
    value of this property as a key on the content object to determine the
    value they should display.

    For example, if you set `contentValueKey` to 'name' and set the
    exampleView to an `SC.LabelView`, then the label views created by the
    collection view will display the value of the content.name.

    If you are writing your own custom item view for a collection, you can
    get this behavior automatically by including the SC.Control mixin on your
    view.  You can also ignore this property if you like.  The collection view
    itself does not use this property to impact rendering.

    @type String
    @default null
  */
  contentValueKey: null,

  /**
    Enables keyboard-based navigate, deletion, etc. if set to true.

    @type Boolean
    @default NO
  */
  acceptsFirstResponder: NO,

  /**
    Changing this property value by default will cause the `CollectionView` to
    add/remove an 'active' class name to the root element.

    @type Boolean
    @default NO
  */
  isActive: NO,


  /**
    This property is used to store the calculated height to have
    a consistent scrolling behavior due to the issues generated by using top
    instead of `scrollTop`. We could look at the min-height set in the view, but
    to avoid performance hits we simply store it and the scrollView will use it if
    different than 0.

    @type Number
    @default 0
  */
  calculatedHeight: 0,

  /**
    This property is used to store the calculated width to have
    a consistent scrolling behavior due to the issues generated by using left
    instead of `scrollLeft`. We could look at the min-width set in the view, but
    to avoid performance hits we simply store it and the scrollView will use it if
    different than 0.

    @type Number
    @default 0
  */
  calculatedWidth: 0,


  // ..........................................................
  // SUBCLASS METHODS
  //

  /**
    Override to return the computed layout dimensions of the collection view.
    You can omit any dimensions you don't care about setting in your
    computed value.

    This layout is automatically applied whenever the content changes.

    If you don't care about computing the layout at all, you can return null.

    @returns {Hash} layout properties
  */
  computeLayout: function() {
    return null;
  },

  /**
    Override to compute the layout of the itemView for the content at the
    specified index.  This layout will be applied to the view just before it
    is rendered.

    @param {Number} contentIndex the index of content being rendered by
      itemView
    @returns {Hash} a view layout
  */
  layoutForContentIndex: function(contentIndex) {
    return null;
  },

  /**
    This computed property returns an index set selecting all content indexes.
    It will recompute anytime the length of the collection view changes.

    This is used by the default `contentIndexesInRect()` implementation.

    @field
    @type SC.IndexSet
    @observes length
  */
  allContentIndexes: function() {
    return SC.IndexSet.create(0, this.get('length')).freeze();
  }.property('length').cacheable(),

  /**
    Override to return an IndexSet with the indexes that are at least
    partially visible in the passed rectangle.  This method is used by the
    default implementation of `computeNowShowing()` to determine the new
    `nowShowing` range after a scroll.

    Override this method to implement incremental rendering.

    @param {Rect} rect the visible rect
    @returns {SC.IndexSet} now showing indexes
  */
  contentIndexesInRect: function(rect) {
    return null; // select all
  },

  /**
    Compute the nowShowing index set.  The default implementation simply
    returns the full range.  Override to implement incremental rendering.

    You should not normally call this method yourself.  Instead get the
    nowShowing property.

    @returns {SC.IndexSet} new now showing range
  */
  computeNowShowing: function() {
    var r = this.contentIndexesInRect(this.get('clippingFrame'));
    if (!r) r = this.get('allContentIndexes'); // default show all

    // make sure the index set doesn't contain any indexes greater than the
    // actual content.
    else {
      var len = this.get('length'),
          max = r.get('max');
      if (max > len) r = r.copy().remove(len, max-len).freeze();
    }

    return r;
  },

  /**
    Override to show the insertion point during a drag.

    Called during a drag to show the insertion point.  Passed value is the
    item view that you should display the insertion point before.  If the
    passed value is `null`, then you should show the insertion point *AFTER* that
    last item view returned by the itemViews property.

    Once this method is called, you are guaranteed to also receive a call to
    `hideInsertionPoint()` at some point in the future.

    The default implementation of this method does nothing.

    @param itemView {SC.ClassicView} view the insertion point should appear directly before. If null, show insertion point at end.
    @param dropOperation {Number} the drop operation.  will be SC.DROP_BEFORE, SC.DROP_AFTER, or SC.DROP_ON

    @returns {void}
  */
  showInsertionPoint: function(itemView, dropOperation) {},

  /**
    Override to hide the insertion point when a drag ends.

    Called during a drag to hide the insertion point.  This will be called
    when the user exits the view, cancels the drag or completes the drag.  It
    will not be called when the insertion point changes during a drag.

    You should expect to receive one or more calls to
    `showInsertionPointBefore()` during a drag followed by at least one call to
    this method at the end.  Your method should not raise an error if it is
    called more than once.

    @returns {void}
  */
  hideInsertionPoint: function() {},


  // ..........................................................
  // DELEGATE SUPPORT
  //


  /**
    Delegate used to implement fine-grained control over collection view
    behaviors.

    You can assign a delegate object to this property that will be consulted
    for various decisions regarding drag and drop, selection behavior, and
    even rendering.  The object you place here must implement some or all of
    the `SC.CollectionViewDelegate` mixin.

    If you do not supply a delegate but the content object you set implements
    the `SC.CollectionViewDelegate` mixin, then the content will be
    automatically set as the delegate.  Usually you will work with a
    `CollectionView` in this way rather than setting a delegate explicitly.

    @type SC.CollectionViewDelegate
    @default null
  */
  delegate: null,

  /**
    The delegate responsible for handling selection changes.  This property
    will be either the delegate, content, or the collection view itself,
    whichever implements the `SC.CollectionViewDelegate` mixin.

    @field
    @type Object
  */
  selectionDelegate: function() {
    var del = this.get('delegate'), content = this.get('content');
    return this.delegateFor('isCollectionViewDelegate', del, content);
  }.property('delegate', 'content').cacheable(),

  /**
    The delegate responsible for providing additional display information
    about the content.  If you bind a collection view to a controller, this
    the content will usually also be the content delegate, though you
    could implement your own delegate if you prefer.

    @field
    @type Object
  */
  contentDelegate: function() {
    var del = this.get('delegate'), content = this.get('content');
    return this.delegateFor('isCollectionContent', del, content);
  }.property('delegate', 'content').cacheable(),


  /** @private
    A cache of the `contentGroupIndexes` value returned by the delegate.  This
    is frequently accessed and usually involves creating an `SC.IndexSet`
    object, so it's worthwhile to cache.
  */
  _contentGroupIndexes: function() {
    return this.get('contentDelegate').contentGroupIndexes(this, this.get('content'));
  }.property('contentDelegate', 'content').cacheable(),


  // ..........................................................
  // CONTENT CHANGES
  //

  /**
    Called whenever the content array or an item in the content array or a
    property on an item in the content array changes.  Reloads the appropriate
    item view when the content array itself changes or calls
    `contentPropertyDidChange()` if a property changes.

    Normally you will not call this method directly though you may override
    it if you need to change the way changes to observed ranges are handled.

    @param {SC.Array} content the content array generating the change
    @param {Object} object the changed object
    @param {String} key the changed property or '[]' or an array change
    @param {SC.IndexSet} indexes affected indexes or null for all items
    @returns {void}
  */
  contentRangeDidChange: function(content, object, key, indexes) {
    if (!object && (key === '[]')) {
      this.notifyPropertyChange('_contentGroupIndexes');
      this.reload(indexes); // note: if indexes == null, reloads all
    } else {
      this.contentPropertyDidChange(object, key, indexes);
    }
  },

  /**
    Called whenever a property on an item in the content array changes.  This
    is only called if you have set `observesContentProperties` to `YES`.

    Override this property if you want to do some custom work whenever a
    property on a content object changes.

    The default implementation does nothing.

    @param {Object} target the object that changed
    @param {String} key the property that changed value
    @param {SC.IndexSet} indexes the indexes in the content array affected
    @returns {void}
  */
  contentPropertyDidChange: function(target, key, indexes) {},

  /**
    Called whenever the view needs to updates its `contentRangeObserver` to
    reflect the current nowShowing index set.  You will not usually call this
    method yourself but you may override it if you need to provide some
    custom range observer behavior.

    Note that if you do implement this method, you are expected to maintain
    the range observer object yourself.  If a range observer has not been
    created yet, this method should create it.  If an observer already exists
    this method should update it.

    When you create a new range observer, the observer must eventually call
    `contentRangeDidChange()` for the collection view to function properly.

    If you override this method you probably also need to override
    `destroyRangeObserver()` to cleanup any existing range observer.

    @returns {void}
  */
  updateContentRangeObserver: function() {
    var nowShowing = this.get('nowShowing'),
        observer   = this._cv_contentRangeObserver,
        content    = this.get('content');

    if (!content) return ; // nothing to do

    if (observer) {
      content.updateRangeObserver(observer, nowShowing);
    } else {
      var func = this.contentRangeDidChange;
      observer = content.addRangeObserver(nowShowing, this, func, null);
      this._cv_contentRangeObserver = observer ;
    }

  },

  /**
    Called whever the view needs to invalidate the current content range
    observer.  This is called whenever the content array changes.  You will
    not usually call this method yourself but you may override it if you
    provide your own range observer behavior.

    Note that if you override this method you should probably also override
    `updateRangeObserver()` to create or update a range observer as needed.

    @returns {void}
  */
  removeContentRangeObserver: function() {
    var content  = this.get('content'),
        observer = this._cv_contentRangeObserver ;

    if (observer) {
      if (content) content.removeRangeObserver(observer);
      this._cv_contentRangeObserver = null ;
    }
  },

  /**
    Called whenever the content length changes.  This will invalidate the
    length property of the view itself causing the nowShowing to recompute
    which will in turn update the UI accordingly.

    @returns {void}
  */
  contentLengthDidChange: function() {
    var content = this.get('content');
    this.set('length', content ? content.get('length') : 0);
    this.computeLayout();
  },

  /** @private
    Whenever content property changes to a new value:

      - remove any old observers
      - setup new observers (maybe wait until end of runloop to do this?)
      - recalc height/reload content
      - set content as delegate if delegate was old content
      - reset selection

    Whenever content array mutates:

      - possibly stop observing property changes on objects, observe new objs
      - reload effected item views
      - update layout for receiver
  */
  _cv_contentDidChange: function() {
    var content = this.get('content'),
        lfunc   = this.contentLengthDidChange ;

    if (content === this._content) return; // nothing to do

    // cleanup old content
    this.removeContentRangeObserver();
    if (this._content) {
      this._content.removeObserver('length', this, lfunc);
    }

    // cache
    this._content = content;

    // add new observers - range observer will be added lazily
    if (content) {
      content.addObserver('length', this, lfunc);
    }

    // notify all items changed
    this.contentLengthDidChange();
    this.contentRangeDidChange(content, null, '[]', null);

  }.observes('content'),

  // ..........................................................
  // ITEM VIEWS
  //

  /** @private
    The indexes that need to be reloaded.  Must be one of YES, NO, or an
    SC.IndexSet.
  */
  _invalidIndexes: NO,

  /**
    Regenerates the item views for the content items at the specified indexes.
    If you pass null instead of an index set, regenerates all item views.

    This method is called automatically whenever the content array changes in
    an observable way, but you can call its yourself also if you need to
    refresh the collection view for some reason.

    Note that if the length of the content is shorter than the child views
    and you call this method, then the child views will be removed no matter
    what the index.

    @param {SC.IndexSet} indexes
    @returns {SC.CollectionView} receiver
  */
  reload: function(indexes) {
    var invalid = this._invalidIndexes ;
    if (indexes && invalid !== YES) {
      if (invalid) invalid.add(indexes);
      else invalid = this._invalidIndexes = indexes.clone();

    }
    else {
      this._invalidIndexes = YES ; // force a total reload
    }

    if (this.get('isVisibleInWindow')) this.invokeOnce(this.reloadIfNeeded);

    return this ;
  },

  /**
    Invoked once per runloop to actually reload any needed item views.
    You can call this method at any time to actually force the reload to
    happen immediately if any item views need to be reloaded.

    Note that this method will also invoke two other callback methods if you
    define them on your subclass:

      - *willReload()* is called just before the items are reloaded
      - *didReload()* is called just after items are reloaded

    You can use these two methods to setup and teardown caching, which may
    reduce overall cost of a reload.  Each method will be passed an index set
    of items that are reloaded or null if all items are reloaded.

    @returns {SC.CollectionView} receiver
  */
  reloadIfNeeded: function() {
    var invalid = this._invalidIndexes;
    if (!invalid || !this.get('isVisibleInWindow')) return this ; // delay
    this._invalidIndexes = NO ;

    var content = this.get('content'),
        i, len, existing,
        layout  = this.computeLayout(),
        bench   = SC.BENCHMARK_RELOAD,
        nowShowing = this.get('nowShowing'),
        itemViews  = this._sc_itemViews,
        containerView = this.get('containerView') || this,
        exampleView, groupExampleView,
        shouldReuseViews, shouldReuseGroupViews, shouldReuse,
        viewsToRemove, viewsToRedraw, viewsToCreate,
        views, idx, view, layer, parentNode, viewPool,
        del, groupIndexes, isGroupView;

    // if the set is defined but it contains the entire nowShowing range, just
    // replace
    if (invalid.isIndexSet && invalid.contains(nowShowing)) invalid = YES ;
    if (this.willReload) this.willReload(invalid === YES ? null : invalid);


    // Up-front, figure out whether the view class (and, if applicable,
    // group view class) is re-usable.  If so, it's beneficial for us to
    // first return all no-longer-needed views to the pool before allocating
    // new ones, because that will maximize the potential for re-use.
    exampleView = this.get('exampleView');
    shouldReuseViews = exampleView ? exampleView.isReusableInCollections : NO;
    groupExampleView = this.get('groupExampleView');
    shouldReuseGroupViews = groupExampleView ? groupExampleView.isReusableInCollections : NO;

    // if an index set, just update indexes
    if (invalid.isIndexSet) {
      if (bench) {
        SC.Benchmark.start(bench="%@#reloadIfNeeded (Partial)".fmt(this),YES);
      }

      // Each of these arrays holds indexes.
      viewsToRemove = [];
      viewsToRedraw = [];
      viewsToCreate = [];

      invalid.forEach(function(idx) {
        // get the existing item view, if there is one
        existing = itemViews ? itemViews[idx] : null;

        // if nowShowing, then reload the item view.
        if (nowShowing.contains(idx)) {
          if (existing && existing.parentView === containerView) {
            viewsToRedraw.push(idx);

          } else {
            viewsToCreate.push(idx);
          }

        // if not nowShowing, then remove the item view if needed
        } else if (existing && existing.parentView === containerView) {
          viewsToRemove.push(idx);
        }
      },this);


      // Now that we know what operations we need to perform, let's perform
      // all the removals first…
      for (i = 0, len = viewsToRemove.length;  i < len;  ++i) {
        idx = viewsToRemove[i];
        existing = itemViews ? itemViews[idx] : null;
        delete itemViews[idx];

        // If this view class is reusable, then add it back to the pool.
        del = this.get('contentDelegate');
        groupIndexes = this.get('_contentGroupIndexes');
        isGroupView = groupIndexes && groupIndexes.contains(idx);
        if (isGroupView) isGroupView = del.contentIndexIsGroup(this, content, idx);
        shouldReuse = isGroupView ? shouldReuseGroupViews : shouldReuseViews;
        if (shouldReuse) {
          viewPool = isGroupView ? this._GROUP_VIEW_POOL : this._VIEW_POOL;

          viewPool.push(existing);

          // Because it's possible that we'll return this view to the pool
          // and then immediately re-use it, there's the potential that the
          // layer will not be correctly destroyed, because that support
          // (built into removeChild) is coalesced at the runloop, and we
          // will likely change the layerId when re-using the view.  So
          // we'll destroy the layer now.
          existing.destroyLayer();
        }

        // We don't want the old layer hanging around, even if we are going
        // to reuse it.
        // (Charles Jolley personally guarantees this code)
        layer = existing.get('layer');
        if (layer && layer.parentNode) layer.parentNode.removeChild(layer);

        containerView.removeChild(existing);
        if (!shouldReuse) existing.destroy();
      }

      // …then the redraws…
      for (i = 0, len = viewsToRedraw.length;  i < len;  ++i) {
        idx = viewsToRedraw[i];
        existing = itemViews ? itemViews[idx] : null;
        view = this.itemViewForContentIndex(idx, YES);

        // if the existing view has a layer, remove it immediately from
        // the parent.  This is necessary because the old and new views
        // will use the same layerId
        existing.destroyLayer();
        containerView.replaceChild(view, existing);
      }

      // …and finally the creations.
      for (i = 0, len = viewsToCreate.length;  i < len;  ++i) {
        idx = viewsToCreate[i];
        view = this.itemViewForContentIndex(idx, YES);
        containerView.insertBefore(view, null);   // Equivalent to 'append()', but avoids one more function call
      }


      if (bench) SC.Benchmark.end(bench);

    // if set is NOT defined, replace entire content with nowShowing
    } else {
      if (bench) {
        SC.Benchmark.start(bench="%@#reloadIfNeeded (Full)".fmt(this),YES);
      }

      // truncate cached item views since they will all be removed from the
      // container anyway.
      if (itemViews) itemViews.length = 0 ;

      views = containerView.get('childViews');
      if (views) views = views.copy();

      // below is an optimized version of:
      //this.replaceAllChildren(views);
      containerView.beginPropertyChanges();
      // views = containerView.get('views');
      if (this.willRemoveAllChildren) this.willRemoveAllChildren() ;
      containerView.destroyLayer().removeAllChildren();

      // For all previous views that can be re-used, return them to the pool.
      if (views) {
        for (i = 0, len = views.length;  i < len;  ++i) {
          view = views[i];
          isGroupView = view.get('isGroupView');
          shouldReuse = isGroupView ? shouldReuseGroupViews : shouldReuseViews;
          if (shouldReuse) {
            viewPool = isGroupView ? this._GROUP_VIEW_POOL : this._VIEW_POOL;

            viewPool.push(view);

            // Because it's possible that we'll return this view to the pool
            // and then immediately re-use it, there's the potential that the
            // layer will not be correctly destroyed, because that support
            // (built into removeChild) is coalesced at the runloop, and we
            // will likely change the layerId when re-using the view.  So
            // we'll destroy the layer now.
            view.destroyLayer();
          } else {
            view.destroy();
          }
        }
      }


      // Only after the children are removed should we create the new views.
      // We do this in order to maximize the change of re-use should the view
      // be marked as such.
      views = [];
      nowShowing.forEach(function(idx) {
        views.push(this.itemViewForContentIndex(idx, YES));
      }, this);


      containerView.set('childViews', views); // quick swap
      containerView.replaceLayer();
      containerView.endPropertyChanges();

      if (bench) SC.Benchmark.end(bench);

    }

    // adjust my own layout if computed
    if (layout) this.adjust(layout);
    if (this.didReload) this.didReload(invalid === YES ? null : invalid);

    return this ;
  },

  /** @private */
  _TMP_ATTRS: {},

  /** @private */
  _COLLECTION_CLASS_NAMES: ['sc-collection-item'],

  /** @private */
  _GROUP_COLLECTION_CLASS_NAMES: ['sc-collection-item', 'sc-group-item'],

  /** @private */
  _VIEW_POOL: null,

  /** @private */
  _GROUP_VIEW_POOL: null,

  /**
    Returns the item view for the content object at the specified index. Call
    this method instead of accessing child views directly whenever you need
    to get the view associated with a content index.

    Although this method take two parameters, you should almost always call
    it with just the content index.  The other two parameters are used
    internally by the CollectionView.

    If you need to change the way the collection view manages item views
    you can override this method as well.  If you just want to change the
    default options used when creating item views, override createItemView()
    instead.

    Note that if you override this method, then be sure to implement this
    method so that it uses a cache to return the same item view for a given
    index unless "force" is YES.  In that case, generate a new item view and
    replace the old item view in your cache with the new item view.

    @param {Number} idx the content index
    @param {Boolean} rebuild internal use only
    @returns {SC.View} instantiated view
  */
  itemViewForContentIndex: function(idx, rebuild) {
    var ret;

    // Use the cached view for this index, if we have it.  We'll do this up-
    // front to avoid
    var itemViews = this._sc_itemViews;
    if (!itemViews) {
      itemViews = this._sc_itemViews = [] ;
    }
    else if (!rebuild && (ret = itemViews[idx])) {
      return ret ;
    }

    // return from cache if possible
    var content   = this.get('content'),
        item = content.objectAt(idx),
        del  = this.get('contentDelegate'),
        groupIndexes = this.get('_contentGroupIndexes'),
        isGroupView = NO,
        key, E, layout, layerId,
        viewPoolKey, viewPool, reuseFunc, parentView, isEnabled, isSelected,
        outlineLevel, disclosureState, isVisibleInWindow;

    // otherwise generate...

    // first, determine the class to use
    isGroupView = groupIndexes && groupIndexes.contains(idx);
    if (isGroupView) isGroupView = del.contentIndexIsGroup(this, content,idx);
    if (isGroupView) {
      key  = this.get('contentGroupExampleViewKey');
      if (key && item) E = item.get(key);
      if (!E) E = this.get('groupExampleView') || this.get('exampleView');
      viewPoolKey = '_GROUP_VIEW_POOL';
    } else {
      key  = this.get('contentExampleViewKey');
      if (key && item) E = item.get(key);
      if (!E) E = this.get('exampleView');
      viewPoolKey = '_VIEW_POOL';
    }


    // Collect other state that we'll need whether we're re-using a previous
    // view or creating a new view.
    parentView        = this.get('containerView') || this;
    layerId           = this.layerIdFor(idx);
    isEnabled         = del.contentIndexIsEnabled(this, content, idx);
    isSelected        = del.contentIndexIsSelected(this, content, idx);
    outlineLevel      = del.contentIndexOutlineLevel(this, content, idx);
    disclosureState   = del.contentIndexDisclosureState(this, content, idx);
    isVisibleInWindow = this.isVisibleInWindow;
    layout            = this.layoutForContentIndex(idx);


    // If the view is reusable and there is an appropriate view inside the
    // pool, simply reuse it to avoid having to create a new view.
    if (E  &&  E.isReusableInCollections) {
      // Lazily create the view pool.
      viewPool = this[viewPoolKey];
      if (!viewPool) viewPool = this[viewPoolKey] = [];

      // Is there a view we can re-use?
      if (viewPool.length > 0) {
        ret = viewPool.pop();

        // Tell the view it's about to be re-used.
        reuseFunc = ret.prepareForReuse;
        if (reuseFunc) reuseFunc.call(ret);

        // Set the new state.  We'll set content last, because it's the most
        // likely to have observers.
        ret.beginPropertyChanges();
        ret.set('contentIndex', idx);
        ret.set('layerId', layerId);
        ret.set('isEnabled', isEnabled);
        ret.set('isSelected', isSelected);
        ret.set('outlineLevel', outlineLevel);
        ret.set('disclosureState', disclosureState);
        ret.set('isVisibleInWindow', isVisibleInWindow);

        // TODO:  In theory this shouldn't be needed, but without it, we
        //        sometimes get errors when doing a full reload, because
        //        'childViews' contains the view but the parent is not set.
        //        This implies a timing issue with the general flow of
        //        collection view.
        ret.set('parentView', parentView);

        // Since we re-use layerIds, we need to reset SproutCore's internal
        // mapping table.
        SC.View.views[layerId] = ret;

        if (layout) {
          ret.set('layout', layout);
        }
        else {
          ret.set('layout', E.prototype.layout);
        }
        ret.set('content', item);
        ret.endPropertyChanges();
      }
    }

    // If we weren't able to re-use a view, then create a new one.
    if (!ret) {
      // collect some other state
      var attrs = this._TMP_ATTRS;
      attrs.contentIndex      = idx;
      attrs.content           = item;
      attrs.owner             = attrs.displayDelegate = this;
      attrs.parentView        = parentView;   // Same here; shouldn't be needed
      attrs.page              = this.page;
      attrs.layerId           = layerId;
      attrs.isEnabled         = isEnabled;
      attrs.isSelected        = isSelected;
      attrs.outlineLevel      = outlineLevel;
      attrs.disclosureState   = disclosureState;
      attrs.isGroupView       = isGroupView;
      attrs.isVisibleInWindow = isVisibleInWindow;
      if (isGroupView) attrs.classNames = this._GROUP_COLLECTION_CLASS_NAMES;
      else attrs.classNames = this._COLLECTION_CLASS_NAMES;

      if (layout) {
        attrs.layout = layout;
      } else {
        delete attrs.layout ;
      }

      ret = this.createItemView(E, idx, attrs);
    }

    itemViews[idx] = ret ;
    return ret ;
  },

  /**
    Helper method for getting the item view of a specific content object

    @param {Object} object
  */
  itemViewForContentObject: function(object) {
    return this.itemViewForContentIndex(this.get('content').indexOf(object));
  },

  /** @private */
  _TMP_LAYERID: [],

  /**
    Primitive to instantiate an item view.  You will be passed the class
    and a content index.  You can override this method to perform any other
    one time setup.

    Note that item views may be created somewhat frequently so keep this fast.

    *IMPORTANT:* The attrs hash passed is reused each time this method is
    called.   If you add properties to this hash be sure to delete them before
    returning from this method.

    @param {Class} exampleClass example view class
    @param {Number} idx the content index
    @param {Hash} attrs expected attributes
    @returns {SC.View} item view instance
  */
  createItemView: function(exampleClass, idx, attrs) {
    return exampleClass.create(attrs);
  },

  /**
    Generates a layerId for the passed index and item.  Usually the default
    implementation is suitable.

    @param {Number} idx the content index
    @returns {String} layer id, must be suitable for use in HTML id attribute
  */
  layerIdFor: function(idx) {
    var ret = this._TMP_LAYERID;
    ret[0] = SC.guidFor(this);
    ret[1] = idx;
    return ret.join('-');
  },

  /**
    Extracts the content index from the passed layerID.  If the layer id does
    not belong to the receiver or if no value could be extracted, returns NO.

    @param {String} id the layer id
  */
  contentIndexForLayerId: function(id) {
    if (!id || !(id = id.toString())) return null ; // nothing to do

    var base = this._baseLayerId;
    if (!base) base = this._baseLayerId = SC.guidFor(this)+"-";

    // no match
    if ((id.length <= base.length) || (id.indexOf(base) !== 0)) return null ;
    var ret = Number(id.slice(id.lastIndexOf('-')+1));
    return isNaN(ret) ? null : ret ;
  },


  /**
    Find the first content item view for the passed event.

    This method will go up the view chain, starting with the view that was the
    target of the passed event, looking for a child item.  This will become
    the view that is selected by the mouse event.

    This method only works for mouseDown & mouseUp events.  mouseMoved events
    do not have a target.

    @param {SC.Event} evt An event
    @returns {SC.View} the item view or null
  */
  itemViewForEvent: function(evt) {
    var responder = this.getPath('pane.rootResponder') ;
    if (!responder) return null ; // fast path

    var base    = SC.guidFor(this) + '-',
        baseLen = base.length,
        element = evt.target,
        layer   = this.get('layer'),
        contentIndex = null,
        id, itemView, ret ;

    // walk up the element hierarchy until we find this or an element with an
    // id matching the base guid (i.e. a collection item)
    while (element && element !== document && element !== layer) {
      id = element ? SC.$(element).attr('id') : null ;
      if (id && (contentIndex = this.contentIndexForLayerId(id)) !== null) {
          break;
      }
      element = element.parentNode ;
    }

    // no matching element found?
    if (contentIndex===null || (element === layer)) {
      element = layer = null; // avoid memory leaks
      return null;
    }

    // okay, found the DOM node for the view, go ahead and create it
    // first, find the contentIndex
    if (contentIndex >= this.get('length')) {
      throw "layout for item view %@ was found when item view does not exist (%@)".fmt(id, this);
    }

    return this.itemViewForContentIndex(contentIndex);
  },

  // ..........................................................
  // DISCLOSURE SUPPORT
  //

  /**
    Expands any items in the passed selection array that have a disclosure
    state.

    @param {SC.IndexSet} indexes the indexes to expand
    @returns {SC.CollectionView} receiver
  */
  expand: function(indexes) {
    if (!indexes) return this; // nothing to do
    var del     = this.get('contentDelegate'),
        content = this.get('content');

    indexes.forEach(function(i) {
      var state = del.contentIndexDisclosureState(this, content, i);
      if (state === SC.BRANCH_CLOSED) del.contentIndexExpand(this,content,i);
    }, this);
    return this;
  },

  /**
    Collapses any items in the passed selection array that have a disclosure
    state.

    @param {SC.IndexSet} indexes the indexes to expand
    @returns {SC.CollectionView} receiver
  */
  collapse: function(indexes) {
    if (!indexes) return this; // nothing to do
    var del     = this.get('contentDelegate'),
        content = this.get('content');

    indexes.forEach(function(i) {
      var state = del.contentIndexDisclosureState(this, content, i);
      if (state === SC.BRANCH_OPEN) del.contentIndexCollapse(this,content,i);
    }, this);
    return this;
  },

  // ..........................................................
  // SELECTION SUPPORT
  //

  /** @private
    Called whenever the selection object is changed to a new value.  Begins
    observing the selection for changes.
  */
  _cv_selectionDidChange: function() {
    var sel  = this.get('selection'),
        last = this._cv_selection,
        func = this._cv_selectionContentDidChange;

    if (sel === last) return; // nothing to do
    if (last) last.removeObserver('[]', this, func);
    if (sel) sel.addObserver('[]', this, func);

    this._cv_selection = sel ;
    this._cv_selectionContentDidChange();
  }.observes('selection'),

  /** @private
    Called whenever the selection object or its content changes.  This will
    repaint any items that changed their selection state.
  */
  _cv_selectionContentDidChange: function() {
    var sel  = this.get('selection'),
        last = this._cv_selindexes, // clone of last known indexes
        content = this.get('content'),
        diff ;

    // save new last
    this._cv_selindexes = sel ? sel.frozenCopy() : null;

    // determine which indexes are now invalid
    if (last) last = last.indexSetForSource(content);
    if (sel) sel = sel.indexSetForSource(content);

    if (sel && last) diff = sel.without(last).add(last.without(sel));
    else diff = sel || last;

    if (diff && diff.get('length')>0) this.reloadSelectionIndexes(diff);
  },

  /** @private
    Contains the current item views that need their selection to be repainted.
    This may be either NO, YES, or an IndexSet.
  */
  _invalidSelection: NO,

  /**
    Called whenever the selection changes.  The passed index set will contain
    any affected indexes including those indexes that were previously
    selected and now should be deselected.

    Pass null to reload the selection state for all items.

    @param {SC.IndexSet} indexes affected indexes
    @returns {SC.CollectionView} receiver
  */
  reloadSelectionIndexes: function(indexes) {
    var invalid = this._invalidSelection ;
    if (indexes && (invalid !== YES)) {
      if (invalid) { invalid.add(indexes) ; }
      else { invalid = this._invalidSelection = indexes.copy(); }

    } else this._invalidSelection = YES ; // force a total reload

    if (this.get('isVisibleInWindow')) {
      this.invokeOnce(this.reloadSelectionIndexesIfNeeded);
    }

    return this ;
  },

  /**
    Reloads the selection state if needed on any dirty indexes.  Normally this
    will run once at the end of the runloop, but you can force the item views
    to reload their selection immediately by calling this method.

    You can also override this method if needed to change the way the
    selection is reloaded on item views.  The default behavior will simply
    find any item views in the nowShowing range that are affected and
    modify them.

    @returns {SC.CollectionView} receiver
  */
  reloadSelectionIndexesIfNeeded: function() {
    var invalid = this._invalidSelection;
    if (!invalid || !this.get('isVisibleInWindow')) return this ;

    var nowShowing = this.get('nowShowing'),
        reload     = this._invalidIndexes,
        content    = this.get('content'),
        sel        = this.get('selection');

    this._invalidSelection = NO; // reset invalid

    // fast path.  if we are going to reload everything anyway, just forget
    // about it.  Also if we don't have a nowShowing, nothing to do.
    if (reload === YES || !nowShowing) return this ;

    // if invalid is YES instead of index set, just reload everything
    if (invalid === YES) invalid = nowShowing;

    // if we will reload some items anyway, don't bother
    if (reload && reload.isIndexSet) invalid = invalid.without(reload);

    // iterate through each item and set the isSelected state.
    invalid.forEach(function(idx) {
      if (!nowShowing.contains(idx)) return; // not showing
      var view = this.itemViewForContentIndex(idx, NO);
      if (view) view.set('isSelected', sel ? sel.contains(content, idx) : NO);
    },this);

    return this ;
  },

  /**
    Selection primitive.  Selects the passed IndexSet of items, optionally
    extending the current selection.  If extend is NO or not passed then this
    will replace the selection with the passed value.  Otherwise the indexes
    will be added to the current selection.

    @param {Number|SC.IndexSet} indexes index or indexes to select
    @param extend {Boolean} optionally extend the selection
    @returns {SC.CollectionView} receiver
  */
  select: function(indexes, extend) {
    var content = this.get('content'),
        del     = this.get('selectionDelegate'),
        groupIndexes = this.get('_contentGroupIndexes'),
        sel;

    if(!this.get('isSelectable') || !this.get('isEnabled')) return this;

    // normalize
    if (SC.typeOf(indexes) === SC.T_NUMBER) {
      indexes = SC.IndexSet.create(indexes, 1);
    }

    // if we are passed an empty index set or null, clear the selection.
    if (indexes && indexes.get('length')>0) {

      // first remove any group indexes - these can never be selected
      if (groupIndexes && groupIndexes.get('length')>0) {
        indexes = indexes.copy().remove(groupIndexes);
      }

      // give the delegate a chance to alter the items
      indexes = del.collectionViewShouldSelectIndexes(this, indexes, extend);
      if (!indexes || indexes.get('length')===0) return this; // nothing to do

    } else indexes = null;

    // build the selection object, merging if needed
    if (extend && (sel = this.get('selection'))) sel = sel.copy();
    else sel = SC.SelectionSet.create();

    if (indexes && indexes.get('length')>0) {

      // when selecting only one item, always select by content
      if (indexes.get('length')===1) {
        sel.addObject(content.objectAt(indexes.get('firstObject')));

      // otherwise select an index range
      } else sel.add(content, indexes);

    }

    // give delegate one last chance
    sel = del.collectionViewSelectionForProposedSelection(this, sel);
    if (!sel) sel = SC.SelectionSet.create(); // empty

    // if we're not extending the selection, clear the selection anchor
    this._selectionAnchor = null ;
    this.set('selection', sel.freeze()) ;
    return this;
  },

  /**
    Primitive to remove the indexes from the selection.

    @param {Number|SC.IndexSet} indexes index or indexes to deselect
    @returns {SC.CollectionView} receiver
  */
  deselect: function(indexes) {
    var sel     = this.get('selection'),
        content = this.get('content'),
        del     = this.get('selectionDelegate');

    if(!this.get('isSelectable') || !this.get('isEnabled')) return this;
    if (!sel || sel.get('length')===0) return this; // nothing to do

    // normalize
    if (SC.typeOf(indexes) === SC.T_NUMBER) {
      indexes = SC.IndexSet.create(indexes, 1);
    }

    // give the delegate a chance to alter the items
    indexes = del.collectionViewShouldDeselectIndexes(this, indexes) ;
    if (!indexes || indexes.get('length')===0) return this; // nothing to do

    // now merge change - note we expect sel && indexes to not be null
    sel = sel.copy().remove(content, indexes);
    sel = del.collectionViewSelectionForProposedSelection(this, sel);
    if (!sel) sel = SC.SelectionSet.create(); // empty

    this.set('selection', sel.freeze()) ;
    return this ;
  },

  /** @private
   Finds the next selectable item, up to content length, by asking the
   delegate. If a non-selectable item is found, the index is skipped. If
   no item is found, selection index is returned unmodified.

   Return value will always be in the range of the bottom of the current
   selection index and the proposed index.

   @param {Number} proposedIndex the desired index to select
   @param {Number} bottom optional bottom of selection use as fallback
   @returns {Number} next selectable index.
  */
  _findNextSelectableItemFromIndex: function(proposedIndex, bottom) {
    var lim     = this.get('length'),
        range   = SC.IndexSet.create(),
        content = this.get('content'),
        del     = this.get('selectionDelegate'),
        groupIndexes = this.get('_contentGroupIndexes'),
        ret, sel ;

    // fast path
    if (!groupIndexes && (del.collectionViewShouldSelectIndexes === this.collectionViewShouldSelectIndexes)) {
      return proposedIndex;
    }

    // loop forwards looking for an index that is allowed by delegate
    // we could alternatively just pass the whole range but this might be
    // slow for the delegate
    while (proposedIndex < lim) {
      if (!groupIndexes || !groupIndexes.contains(proposedIndex)) {
        range.add(proposedIndex);
        ret = del.collectionViewShouldSelectIndexes(this, range);
        if (ret && ret.get('length') >= 1) return proposedIndex ;
        range.remove(proposedIndex);
      }
      proposedIndex++;
    }

    // if nothing was found, return top of selection
    if (bottom === undefined) {
      sel = this.get('selection');
      bottom = sel ? sel.get('max') : -1 ;
    }
    return bottom ;
  },

  /** @private
   Finds the previous selectable item, up to the first item, by asking the
   delegate. If a non-selectable item is found, the index is skipped. If
   no item is found, selection index is returned unmodified.

   @param {Integer} proposedIndex the desired index to select
   @returns {Integer} the previous selectable index. This will always be in the range of the top of the current selection index and the proposed index.
  */
  _findPreviousSelectableItemFromIndex: function(proposedIndex, top) {
    var range   = SC.IndexSet.create(),
        content = this.get('content'),
        del     = this.get('selectionDelegate'),
        groupIndexes = this.get('_contentGroupIndexes'),
        ret ;

    if (SC.none(proposedIndex)) proposedIndex = -1;

    // fast path
    if (!groupIndexes && (del.collectionViewShouldSelectIndexes === this.collectionViewShouldSelectIndexes)) {
      return proposedIndex;
    }

    // loop backwards looking for an index that is allowed by delegate
    // we could alternatively just pass the whole range but this might be
    // slow for the delegate
    while (proposedIndex >= 0) {
      if (!groupIndexes || !groupIndexes.contains(proposedIndex)) {
        range.add(proposedIndex);
        ret = del.collectionViewShouldSelectIndexes(this, range);
        if (ret && ret.get('length') >= 1) return proposedIndex ;
        range.remove(proposedIndex);
      }
      proposedIndex--;
    }

    // if nothing was found, return top of selection
    if (top === undefined) {
      var sel = this.get('selection');
      top = sel ? sel.get('min') : -1 ;
    }
    if (SC.none(top)) top = -1;
    return top ;
  },

  /**
    Select one or more items before the current selection, optionally
    extending the current selection.  Also scrolls the selected item into
    view.

    Selection does not wrap around.

    @param {Boolean} [extend] If true, the selection will be extended
      instead of replaced. Defaults to false.
    @param {Integer} [numberOfItems] The number of previous to be
      selected.  Defaults to 1
    @returns {SC.CollectionView} receiver
  */
  selectPreviousItem: function(extend, numberOfItems) {
    if (SC.none(numberOfItems)) numberOfItems = 1;
    if (SC.none(extend)) extend = false;

    var sel     = this.get('selection'),
        content = this.get('content');
    if (sel) sel = sel.indexSetForSource(content);

    var selTop    = sel ? sel.get('min') : -1,
        selBottom     = sel ? sel.get('max')-1 : -1,
        anchor        = this._selectionAnchor;
    if (SC.none(anchor)) anchor = selTop;

    // if extending, then we need to do some fun stuff to build the array
    if (extend) {

      // If the selBottom is after the anchor, then reduce the selection
      if (selBottom > anchor) {
        selBottom = selBottom - numberOfItems ;

      // otherwise, select the previous item from the top
      } else {
        selTop = this._findPreviousSelectableItemFromIndex(selTop - numberOfItems);
      }

      // Ensure we are not out of bounds
      if (SC.none(selTop) || (selTop < 0)) selTop = 0 ;
      if (!content.objectAt(selTop)) selTop = sel ? sel.get('min') : -1;
      if (selBottom < selTop) selBottom = selTop ;

    // if not extending, just select the item previous to the selTop
    } else {
      selTop = this._findPreviousSelectableItemFromIndex(selTop - numberOfItems);
      if (SC.none(selTop) || (selTop < 0)) selTop = 0 ;
      if (!content.objectAt(selTop)) selTop = sel ? sel.get('min') : -1;
      selBottom = selTop ;
      anchor = null ;
    }

    var scrollToIndex = selTop ;

    // now build new selection
    sel = SC.IndexSet.create(selTop, selBottom+1-selTop);

    // ensure that the item is visible and set the selection
    this.scrollToContentIndex(scrollToIndex) ;
    this.select(sel) ;
    this._selectionAnchor = anchor ;
    return this ;
  },

  /**
    Select one or more items following the current selection, optionally
    extending the current selection.  Also scrolls to selected item.

    Selection does not wrap around.

    @param {Boolean} [extend] If true, the selection will be extended
      instead of replaced. Defaults to false.
    @param {Integer} [numberOfItems] The number of items to be
      selected. Defaults to 1.
    @returns {SC.CollectionView} receiver
  */
  selectNextItem: function(extend, numberOfItems) {
    if (SC.none(numberOfItems)) numberOfItems = 1 ;
    if (SC.none(extend)) extend = false ;

    var sel     = this.get('selection'),
        content = this.get('content');
    if (sel) sel = sel.indexSetForSource(content);

    var selTop    = sel ? sel.get('min') : -1,
        selBottom = sel ? sel.get('max')-1 : -1,
        anchor    = this._selectionAnchor,
        lim       = this.get('length');

    if (SC.none(anchor)) anchor = selTop;

    // if extending, then we need to do some fun stuff to build the array
    if (extend) {

      // If the selTop is before the anchor, then reduce the selection
      if (selTop < anchor) {
        selTop = selTop + numberOfItems ;

      // otherwise, select the next item after the bottom
      } else {
        selBottom = this._findNextSelectableItemFromIndex(selBottom + numberOfItems, selBottom);
      }

      // Ensure we are not out of bounds
      if (selBottom >= lim) selBottom = lim-1;

      // we also need to check that the item exists
      if (!content.objectAt(selBottom)) selBottom = sel ? sel.get('max') - 1 : -1;

      // and if top has eclipsed bottom, handle that too.
      if (selTop > selBottom) selTop = selBottom ;

    // if not extending, just select the item next to the selBottom
    } else {
      selBottom = this._findNextSelectableItemFromIndex(selBottom + numberOfItems, selBottom);

      if (selBottom >= lim) selBottom = lim-1;
      if (!content.objectAt(selBottom)) selBottom = sel ? sel.get('max') - 1 : -1;
      selTop = selBottom ;
      anchor = null ;
    }

    var scrollToIndex = selBottom ;

    // now build new selection
    sel = SC.IndexSet.create(selTop, selBottom-selTop+1);

    // ensure that the item is visible and set the selection
    this.scrollToContentIndex(scrollToIndex) ;
    this.select(sel) ;
    this._selectionAnchor = anchor ;
    return this ;
  },

  /**
    Deletes the selected content if canDeleteContent is YES.  This will invoke
    delegate methods to provide fine-grained control.  Returns YES if the
    deletion was possible, even if none actually occurred.

    @returns {Boolean} YES if deletion is possible.
  */
  deleteSelection: function() {
    // perform some basic checks...
    if (!this.get('canDeleteContent')) return NO;

    var sel     = this.get('selection'),
        content = this.get('content'),
        del     = this.get('selectionDelegate'),
        indexes = sel&&content ? sel.indexSetForSource(content) : null;

    if (!content || !indexes || indexes.get('length') === 0) return NO ;

    // let the delegate decide what to actually delete.  If this returns an
    // empty index set or null, just do nothing.
    indexes = del.collectionViewShouldDeleteIndexes(this, indexes);
    if (!indexes || indexes.get('length') === 0) return NO ;

    // now have the delegate (or us) perform the deletion. The default
    // delegate implementation just uses standard SC.Array methods to do the
    // right thing.
    del.collectionViewDeleteContent(this, this.get('content'), indexes);

    return YES ;
  },

  // ..........................................................
  // SCROLLING
  //

  /**
    Scroll the rootElement (if needed) to ensure that the item is visible.

    @param {Number} contentIndex The index of the item to scroll to
    @returns {SC.CollectionView} receiver
  */
  scrollToContentIndex: function(contentIndex) {
    var itemView = this.itemViewForContentIndex(contentIndex) ;
    if (itemView) this.scrollToItemView(itemView) ;
    return this;
  },

  /**
    Scroll to the passed item view.  If the item view is not visible on screen
    this method will not work.

    @param {SC.View} view The item view to scroll to
    @returns {SC.CollectionView} receiver
  */
  scrollToItemView: function(view) {
    if (view) view.scrollToVisible();
    return this ;
  },

  // ..........................................................
  // KEYBOARD EVENTS
  //

  /** @private */
  keyDown: function(evt) {
    var ret = this.interpretKeyEvents(evt) ;
    return !ret ? NO : ret ;
  },

  /** @private */
  keyUp: function() { return true; },

  /** @private
    Handle space key event.  Do action
  */
  insertText: function(chr, evt) {
    if (chr === ' ') {
      var sel = this.get('selection');
      if (sel && sel.get('length')>0) {
        this.invokeLater(this._cv_action, 0, null, evt);
      }
      return YES ;
    } else return NO ;
  },

  /** @private
    Handle select all keyboard event.
  */
  selectAll: function(evt) {
    var content = this.get('content'),
        sel = content ? SC.IndexSet.create(0, content.get('length')) : null;
    this.select(sel, NO) ;
    return YES ;
  },

  /** @private
    Remove selection of any selected items.
  */
  deselectAll: function() {
    var content = this.get('content'),
        sel = content ? SC.IndexSet.create(0, content.get('length')) : null;
    this.deselect(sel, NO) ;
    return YES ;
  },

  /** @private
    Handle delete keyboard event.
  */
  deleteBackward: function(evt) {
    return this.deleteSelection() ;
  },

  /** @private
    Handle delete keyboard event.
  */
  deleteForward: function(evt) {
    return this.deleteSelection() ;
  },

  /** @private
    Selects the same item on the next row or moves down one if itemsPerRow = 1
  */
  moveDown: function(sender, evt) {
    this.selectNextItem(false, this.get('itemsPerRow') || 1) ;
    this._cv_performSelectAction(null, evt, this.ACTION_DELAY);
    return true ;
  },

  /** @private
    Selects the same item on the next row or moves up one if itemsPerRow = 1
  */
  moveUp: function(sender, evt) {
    this.selectPreviousItem(false, this.get('itemsPerRow') || 1) ;
    this._cv_performSelectAction(null, evt, this.ACTION_DELAY);
    return true ;
  },

  /** @private
    Selects the previous item if itemsPerRow > 1.  Otherwise does nothing.
    If item is expandable, will collapse.
  */
  moveLeft: function(evt) {
    // If the control key is down, this may be a browser shortcut and
    // we should not handle the arrow key.
    if (evt.ctrlKey || evt.metaKey) return NO;

    if ((this.get('itemsPerRow') || 1) > 1) {
      this.selectPreviousItem(false, 1);
      this._cv_performSelectAction(null, evt, this.ACTION_DELAY);

    } else {
      var sel     = this.get('selection'),
          content = this.get('content'),
          indexes = sel ? sel.indexSetForSource(content) : null;

      // Collapse the element if it is expanded.  However, if there is exactly
      // one item selected and the item is already collapsed or is a leaf
      // node, then select the (expanded) parent element instead as a
      // convenience to the user.
      if ( indexes ) {
        var del          = undefined,     // We'll load it lazily
            selectParent = false,
            index        = undefined;

        if ( indexes.get('length') === 1 ) {
          index = indexes.get('firstObject');
          del = this.get('contentDelegate');
          var state = del.contentIndexDisclosureState(this, content, index);
          if (state !== SC.BRANCH_OPEN) selectParent = true;
        }

        if ( selectParent ) {
          // TODO:  PERFORMANCE:  It would be great to have a function like
          //        SC.CollectionView.selectParentItem() or something similar
          //        for performance reasons.  But since we don't currently
          //        have such a function, let's just iterate through the
          //        previous items until we find the first one with a outline
          //        level of one less than the selected item.
          var desiredOutlineLevel = del.contentIndexOutlineLevel(this, content, index) - 1;
          if ( desiredOutlineLevel >= 0 ) {
            var parentIndex = -1;
            while ( parentIndex < 0 ) {
              var previousItemIndex = this._findPreviousSelectableItemFromIndex(index - 1);
              if (previousItemIndex < 0 ) return false;    // Sanity-check.
              index = previousItemIndex;
              var outlineLevel = del.contentIndexOutlineLevel(this, content, index);
              if ( outlineLevel === desiredOutlineLevel ) {
                parentIndex = previousItemIndex;
              }
            }

            // If we found the parent, select it now.
            if ( parentIndex !== -1 ) {
              this.select(index);
            }
          }
        }
        else {
          this.collapse(indexes);
        }
      }
    }

    return true ;
  },

  /** @private
    Selects the next item if itemsPerRow > 1.  Otherwise does nothing.
  */
  moveRight: function(evt) {
    // If the control key is down, this may be a browser shortcut and
    // we should not handle the arrow key.
    if (evt.ctrlKey || evt.metaKey) return NO;

    if ((this.get('itemsPerRow') || 1) > 1) {
      this.selectNextItem(false, 1) ;
      this._cv_performSelectAction(null, evt, this.ACTION_DELAY);
    } else {
      var sel     = this.get('selection'),
          content = this.get('content'),
          indexes = sel ? sel.indexSetForSource(content) : null;
      if (indexes) this.expand(indexes);
    }

    return true ;
  },

  /** @private */
  moveDownAndModifySelection: function(sender, evt) {
    this.selectNextItem(true, this.get('itemsPerRow') || 1) ;
    this._cv_performSelectAction(null, evt, this.ACTION_DELAY);
    return true ;
  },

  /** @private */
  moveUpAndModifySelection: function(sender, evt) {
    this.selectPreviousItem(true, this.get('itemsPerRow') || 1) ;
    this._cv_performSelectAction(null, evt, this.ACTION_DELAY);
    return true ;
  },

  /** @private
    Selects the previous item if itemsPerRow > 1.  Otherwise does nothing.
  */
  moveLeftAndModifySelection: function(sender, evt) {
    if ((this.get('itemsPerRow') || 1) > 1) {
      this.selectPreviousItem(true, 1) ;
      this._cv_performSelectAction(null, evt, this.ACTION_DELAY);
    }
    return true ;
  },

  /** @private
    Selects the next item if itemsPerRow > 1.  Otherwise does nothing.
  */
  moveRightAndModifySelection: function(sender, evt) {
    if ((this.get('itemsPerRow') || 1) > 1) {
      this.selectNextItem(true, 1) ;
      this._cv_performSelectAction(null, evt, this.ACTION_DELAY);
    }
    return true ;
  },

  /** @private
    if content value is editable and we have one item selected, then edit.
    otherwise, invoke action.
  */
  insertNewline: function(sender, evt) {
    var canEdit = this.get('isEditable') && this.get('canEditContent'),
        sel, content, set, idx, itemView;

    // first make sure we have a single item selected; get idx
    if (canEdit) {
      sel     = this.get('selection') ;
      content = this.get('content');
      if (sel && sel.get('length') === 1) {
        set = sel.indexSetForSource(content);
        idx = set ? set.get('min') : -1;
        canEdit = idx>=0;
      }
    }

    // next find itemView and ensure it supports editing
    if (canEdit) {
      itemView = this.itemViewForContentIndex(idx);
      canEdit = itemView && SC.typeOf(itemView.beginEditing)===SC.T_FUNCTION;
    }

    // ok, we can edit..
    if (canEdit) {
      this.scrollToContentIndex(idx);
      itemView = this.itemViewForContentIndex(idx); // just in case
      itemView.beginEditing();

    // invoke action
    } else {
      this.invokeLater(this._cv_action, 0, itemView, null) ;
    }

    return YES ; // always handle
  },

  insertTab: function(evt) {
    var view = this.get('nextValidKeyView');
    if (view) view.becomeFirstResponder();
    else evt.allowDefault();
    return YES ; // handled
  },

  insertBacktab: function(evt) {
    var view = this.get('previousValidKeyView');
    if (view) view.becomeFirstResponder();
    else evt.allowDefault();
    return YES ; // handled
  },

  // ..........................................................
  // MOUSE EVENTS
  //

  /** @private
    Handles mouse down events on the collection view or on any of its
    children.

    The default implementation of this method can handle a wide variety
    of user behaviors depending on how you have configured the various
    options for the collection view.

    @param ev {Event} the mouse down event
    @returns {Boolean} Usually YES.
  */
  mouseDown: function(ev) {
    var content = this.get('content');

    if (!content) return this.get('isSelectable');

    var itemView      = this.itemViewForEvent(ev),
        contentIndex  = itemView ? itemView.get('contentIndex') : -1,
        info, anchor, sel, isSelected, modifierKeyPressed, didSelect = NO,
        allowsMultipleSel = content.get('allowsMultipleSelection');

    if (!this.get('isEnabled')) return contentIndex > -1;

    if(!this.get('isSelectable')) return NO;

    // become first responder if possible.
    this.becomeFirstResponder() ;

    // Toggle the selection if selectOnMouseDown is true
    if (this.get('useToggleSelection')) {
      if (this.get('selectOnMouseDown')) {
        if (!itemView) return ; // do nothing when clicked outside of elements

        // determine if item is selected. If so, then go on.
        sel = this.get('selection') ;
        isSelected = sel && sel.containsObject(itemView.get('content')) ;

        if (isSelected) {
          this.deselect(contentIndex);
        } else if (!allowsMultipleSel) {
          this.select(contentIndex, NO);
          didSelect = YES;
        } else {
          this.select(contentIndex, YES);
          didSelect = YES;
        }

        if (didSelect && this.get('actOnSelect')) {
          // handle actions on editing
          this._cv_performSelectAction(itemView, ev);
        }
      }

      return YES;
    }

    // received a mouseDown on the collection element, but not on one of the
    // childItems... unless we do not allow empty selections, set it to empty.
    if (!itemView) {
      if (this.get('allowDeselectAll')) this.select(null, false);
      return YES ;
    }

    // collection some basic setup info
    sel = this.get('selection');
    if (sel) sel = sel.indexSetForSource(content);

    info = this.mouseDownInfo = {
      event:        ev,
      itemView:     itemView,
      contentIndex: contentIndex,
      at:           Date.now()
    };

    isSelected = sel ? sel.contains(contentIndex) : NO;
    info.modifierKeyPressed = modifierKeyPressed = ev.ctrlKey || ev.metaKey ;


    // holding down a modifier key while clicking a selected item should
    // deselect that item...deselect and bail.
    if (modifierKeyPressed && isSelected) {
      info.shouldDeselect = contentIndex >= 0;

    // if the shiftKey was pressed, then we want to extend the selection
    // from the last selected item
    } else if (ev.shiftKey && sel && sel.get('length') > 0 && allowsMultipleSel) {
      sel = this._findSelectionExtendedByShift(sel, contentIndex);
      anchor = this._selectionAnchor ;
      this.select(sel) ;
      this._selectionAnchor = anchor; //save the anchor

    // If no modifier key was pressed, then clicking on the selected item
    // should clear the selection and reselect only the clicked on item.
    } else if (!modifierKeyPressed && isSelected) {
      info.shouldReselect = contentIndex >= 0;

    // Otherwise, if selecting on mouse down,  simply select the clicked on
    // item, adding it to the current selection if a modifier key was pressed.
    } else {

      if((ev.shiftKey || modifierKeyPressed) && !allowsMultipleSel){
        this.select(null, false);
      }

      if (this.get("selectOnMouseDown")) {
        this.select(contentIndex, modifierKeyPressed);
      } else {
        info.shouldSelect = contentIndex >= 0 ;
      }
    }

    // saved for extend by shift ops.
    info.previousContentIndex = contentIndex;

    return YES;
  },

  /** @private */
  mouseUp: function(ev) {
    var view = this.itemViewForEvent(ev),
        info = this.mouseDownInfo,
        content = this.get('content'),
        contentIndex = view ? view.get('contentIndex') : -1,
        sel, isSelected, canEdit, itemView, idx,
        allowsMultipleSel = content.get('allowsMultipleSelection');

    if (!this.get('isEnabled')) return contentIndex > -1;

    if(!this.get('isSelectable')) return NO;

    if (this.get('useToggleSelection')) {
      // Return if clicked outside of elements or if toggle was handled by mouseDown
      if (!view || this.get('selectOnMouseDown')) return NO;

      // determine if item is selected. If so, then go on.
      sel = this.get('selection') ;
      isSelected = sel && sel.containsObject(view.get('content')) ;

      if (isSelected) {
        this.deselect(contentIndex) ;
      } else if (!allowsMultipleSel) {
        this.select(contentIndex, NO) ;
      } else {
        this.select(contentIndex, YES) ;
      }

    } else if(info) {
      idx = info.contentIndex;
      contentIndex = (view) ? view.get('contentIndex') : -1 ;

      // this will be set if the user simply clicked on an unselected item and
      // selectOnMouseDown was NO.
      if (info.shouldSelect) this.select(idx, info.modifierKeyPressed);

      // This is true if the user clicked on a selected item with a modifier
      // key pressed.
      if (info.shouldDeselect) this.deselect(idx);

      // This is true if the user clicked on a selected item without a
      // modifier-key pressed.  When this happens we try to begin editing
      // on the content.  If that is not allowed, then simply clear the
      // selection and reselect the clicked on item.
      if (info.shouldReselect) {

        // - contentValueIsEditable is true
        canEdit = this.get('isEditable') && this.get('canEditContent') ;

        // - the user clicked on an item that was already selected
        //   ^ this is the only way shouldReset is set to YES

        // - is the only item selected
        if (canEdit) {
          sel = this.get('selection') ;
          canEdit = sel && (sel.get('length') === 1);
        }

        // - the item view responds to contentHitTest() and returns YES.
        // - the item view responds to beginEditing and returns YES.
        if (canEdit) {
          itemView = this.itemViewForContentIndex(idx) ;
          canEdit = itemView && (!itemView.contentHitTest || itemView.contentHitTest(ev)) ;
          canEdit = (canEdit && itemView.beginEditing) ? itemView.beginEditing() : NO ;
        }

        // if cannot edit, schedule a reselect (but give doubleClick a chance)
        if (!canEdit) {
          if (this._cv_reselectTimer) this._cv_reselectTimer.invalidate() ;
          this._cv_reselectTimer = this.invokeLater(this.select, 300, idx, false) ;
        }
      }

      this._cleanupMouseDown() ;
    }

    // handle actions on editing
    this._cv_performSelectAction(view, ev, 0, ev.clickCount);

    return NO;  // bubble event to allow didDoubleClick to be called...
  },

  /** @private */
  _cleanupMouseDown: function() {

    // delete items explicitly to avoid leaks on IE
    var info = this.mouseDownInfo, key;
    if (info) {
      for(key in info) {
        if (!info.hasOwnProperty(key)) continue;
        delete info[key];
      }
    }
    this.mouseDownInfo = null;
  },

  /** @private */
  mouseMoved: function(ev) {
    var view = this.itemViewForEvent(ev),
        last = this._lastHoveredItem ;

    // handle hover events.
    if (view !== last) {
      if (last && last.mouseExited) last.mouseExited(ev);
      if (view && view.mouseEntered) view.mouseEntered(ev);
    }
    this._lastHoveredItem = view ;

    if (view && view.mouseMoved) view.mouseMoved(ev);
    return YES;
  },

  /** @private */
  mouseExited: function(ev) {
    var view = this._lastHoveredItem ;
    this._lastHoveredItem = null ;
    if (view && view.mouseExited) view.mouseExited(ev) ;
    return YES ;
  },

  // ..........................................................
  // TOUCH EVENTS
  //

  /** @private */
  touchStart: function(touch, evt) {
    var itemView = this.itemViewForEvent(touch),
        contentIndex = itemView ? itemView.get('contentIndex') : -1;

    if (!this.get('isEnabled')) return contentIndex > -1;

    // become first responder if possible.
    this.becomeFirstResponder() ;

    this._touchSelectedView = itemView;

    if (!this.get('useToggleSelection')) {
      // We're faking the selection visually here
      // Only track this if we added a selection so we can remove it later
      if (itemView && !itemView.get('isSelected')) {
        itemView.set('isSelected', YES);
      }
    }

    return YES;
  },

  /** @private */
  touchesDragged: function(evt, touches) {
    touches.forEach(function(touch){
      if (
        Math.abs(touch.pageX - touch.startX) > 5 ||
        Math.abs(touch.pageY - touch.startY) > 5
      ) {
        // This calls touchCancelled
        touch.makeTouchResponder(touch.nextTouchResponder);
      }
    }, this);

  },

  /** @private */
  touchEnd: function(touch) {
    /*
      TODO [CC] We should be using itemViewForEvent here, but because
            ListItemView re-renders itself once isSelected is called
            in touchStart, the elements attached to this event are
            getting orphaned and this event is basically a complete
            fail when using touch events.
    */
    // var itemView = this.itemViewForEvent(touch),
    var itemView = this._touchSelectedView,
        contentIndex = itemView ? itemView.get('contentIndex') : -1,
        isSelected = NO, sel;

    if (!this.get('isEnabled')) return contentIndex > -1;

    // Remove fake selection in case our contentIndex is -1, a select event will add it back
    if (itemView) { itemView.set('isSelected', NO); }

    if (contentIndex > -1) {
      if (this.get('useToggleSelection')) {
        sel = this.get('selection');
        isSelected = sel && sel.containsObject(itemView.get('content'));
      }

      if (isSelected) {
        this.deselect(contentIndex);
      } else {
        this.select(contentIndex, NO);

        // If actOnSelect is implemented, the action will be fired.
        this._cv_performSelectAction(itemView, touch, 0);
      }
    }

    this._touchSelectedView = null;
  },

  /** @private */
  touchCancelled: function(evt) {
    // Remove fake selection
    if (this._touchSelectedView) {
      this._touchSelectedView.set('isSelected', NO);
      this._touchSelectedView = null;
    }
  },

  /** @private */
  _findSelectionExtendedByShift: function(sel, contentIndex) {

    // fast path.  if we don't have a selection, just select index
    if (!sel || sel.get('length')===0) {
      return SC.IndexSet.create(contentIndex);
    }

    // if we do have a selection, then figure out how to extend it.
    var content = this.get('content'),
        lim     = content.get('length')-1,
        min     = sel.get('min'),
        max     = sel.get('max')-1,
        info    = this.mouseDownInfo,
        anchor  = this._selectionAnchor ;
    if (SC.none(anchor)) anchor = -1;

    // clicked before the current selection set... extend it's beginning...
    if (contentIndex < min) {
      min = contentIndex;
      if (anchor<0) this._selectionAnchor = anchor = max; //anchor at end

    // clicked after the current selection set... extend it's ending...
    } else if (contentIndex > max) {
      max = contentIndex;
      if (anchor<0) this._selectionAnchor = anchor = min; // anchor at start

    // clicked inside the selection set... need to determine where the last
    // selection was and use that as an anchor.
    } else if (contentIndex >= min && contentIndex <= max) {
      if (anchor<0) this._selectionAnchor = anchor = min; //anchor at start

      if (contentIndex === anchor) min = max = contentIndex ;
      else if (contentIndex > anchor) {
        min = anchor;
        max = contentIndex ;
      } else if (contentIndex < anchor) {
        min = contentIndex;
        max = anchor ;
      }
    }

    return SC.IndexSet.create(min, max - min + 1);
  },

  // ......................................
  // DRAG AND DROP SUPPORT
  //

  /**
    When reordering its content, the collection view will store its reorder
    data using this special data type.  The data type is unique to each
    collection view instance.  You can use this data type to detect reorders
    if necessary.

    @field
    @type String
  */
  reorderDataType: function() {
    return 'SC.CollectionView.Reorder.'+SC.guidFor(this) ;
  }.property().cacheable(),

  /**
    This property is set to the IndexSet of content objects that are the
    subject of a drag whenever a drag is initiated on the collection view.
    You can consult this property when implementing your collection view
    delegate  methods, but otherwise you should not use this property in your
    code.

    @type SC.IndexSet
    @default null
  */
  dragContent: null,

  /**
    This property is set to the proposed insertion index during a call to
    collectionViewValidateDragOperation().  Your delegate implementations can
    change the value of this property to enforce a drop some in some other
    location.

    @type Number
    @default null
  */
  proposedInsertionIndex: null,

  /**
    This property is set to the proposed drop operation during a call to
    collectionViewValidateDragOperation().  Your delegate implementations can
    change the value of this property to enforce a different type of drop
    operation.

    @type Number
    @default null
  */
  proposedDropOperation: null,

  /** @private
    mouseDragged event handler.  Initiates a drag if the following conditions
    are met:

    - collectionViewShouldBeginDrag() returns YES *OR*
    - the above method is not implemented and canReorderContent is true.
    - the dragDataTypes property returns a non-empty array
    - a mouse down event was saved by the mouseDown method.
  */
  mouseDragged: function(ev) {
    var del     = this.get('selectionDelegate'),
        content = this.get('content'),
        sel     = this.get('selection'),
        info    = this.mouseDownInfo,
        groupIndexes = this.get('_contentGroupIndexes'),
        dragContent, dragDataTypes, dragView;

    // if the mouse down event was cleared, there is nothing to do; return.
    if (!info || info.contentIndex<0) return YES ;

    // Don't do anything unless the user has been dragging for 123msec
    if ((Date.now() - info.at) < 123) return YES ;

    // OK, they must be serious, decide if a drag will be allowed.
    if (del.collectionViewShouldBeginDrag(this)) {

      // First, get the selection to drag.  Drag an array of selected
      // items appearing in this collection, in the order of the
      // collection.
      //
      // Compute the dragContent - the indexes we will be dragging.
      // if we don't select on mouse down, then the selection has not been
      // updated to whatever the user clicked.  Instead use
      // mouse down content.
      if (!this.get("selectOnMouseDown")) {
        dragContent = SC.IndexSet.create(info.contentIndex);
      } else dragContent = sel ? sel.indexSetForSource(content) : null;

      // remove any group indexes.  groups cannot be dragged.
      if (dragContent && groupIndexes && groupIndexes.get('length')>0) {
        dragContent = dragContent.copy().remove(groupIndexes);
        if (dragContent.get('length')===0) dragContent = null;
        else dragContent.freeze();
      }

      if (!dragContent) return YES; // nothing to drag
      else dragContent = dragContent.frozenCopy(); // so it doesn't change

      dragContent = { content: content, indexes: dragContent };
      this.set('dragContent', dragContent) ;

      // Get the set of data types supported by the delegate.  If this returns
      // a null or empty array and reordering content is not also supported
      // then do not start the drag.
      dragDataTypes = this.get('dragDataTypes');
      if (dragDataTypes && dragDataTypes.get('length') > 0) {

        // Build the drag view to use for the ghost drag.  This
        // should essentially contain any visible drag items.
        dragView = del.collectionViewDragViewFor(this, dragContent.indexes);
        if (!dragView) dragView = this._cv_dragViewFor(dragContent.indexes);

        // Make sure the dragView has created its layer.
        dragView.createLayer();

        // Initiate the drag
        SC.Drag.start({
          event: info.event,
          source: this,
          dragView: dragView,
          ghost: NO,
          ghostActsLikeCursor: del.ghostActsLikeCursor,
          slideBack: YES,
          dataSource: this
        });

        // Also use this opportunity to clean up since mouseUp won't
        // get called.
        this._cleanupMouseDown() ;
        this._lastInsertionIndex = null ;

      // Drag was not allowed by the delegate, so bail.
      } else this.set('dragContent', null) ;

      return YES ;
    }
  },

  /** @private
    Compute a default drag view by grabbing the raw layers and inserting them
    into a drag view.
  */
  _cv_dragViewFor: function(dragContent) {
    // find only the indexes that are in both dragContent and nowShowing.
    var indexes = this.get('nowShowing').without(dragContent),
        dragLayer = this.get('layer').cloneNode(false),
        view = SC.View.create({ layer: dragLayer, parentView: this }),
        height=0, layout;

    indexes = this.get('nowShowing').without(indexes);

    // cleanup weird stuff that might make the drag look out of place
    SC.$(dragLayer).css('backgroundColor', 'transparent')
      .css('border', 'none')
      .css('top', 0).css('left', 0);

    indexes.forEach(function(i) {
      var itemView = this.itemViewForContentIndex(i),
          isSelected, layer;

      // render item view without isSelected state.
      if (itemView) {
        isSelected = itemView.get('isSelected');
        itemView.set('isSelected', NO);

        itemView.updateLayerIfNeeded();
        layer = itemView.get('layer');
        if (layer) layer = layer.cloneNode(true);

        itemView.set('isSelected', isSelected);
        itemView.updateLayerIfNeeded();
      }

      if (layer) {
        dragLayer.appendChild(layer);
        layout = itemView.get('layout');
        if(layout.height+layout.top>height){
          height = layout.height+layout.top;
        }
      }
      layer = null;

    }, this);
    // we don't want to show the scrollbars, resize the dragview'
    view.set('layout', {height:height});

    dragLayer = null;
    return view ;
  },


  /**
    Implements the drag data source protocol for the collection view.  This
    property will consult the collection view delegate if one is provided. It
    will also do the right thing if you have set canReorderContent to YES.

    @field
    @type Array
  */
  dragDataTypes: function() {
    // consult delegate.
    var del = this.get('selectionDelegate'),
        ret = del.collectionViewDragDataTypes(this),
        key ;

    if (this.get('canReorderContent')) {
      ret = ret ? ret.copy() : [];
      key = this.get('reorderDataType');
      if (ret.indexOf(key) < 0) ret.push(key);
    }

    return ret ? ret : [];
  }.property(),

  /**
    Implements the drag data source protocol method. The implementation of
    this method will consult the collection view delegate if one has been
    provided.  It also respects the canReorderContent method.
  */
  dragDataForType: function(drag, dataType) {

    // if this is a reorder, then return drag content.
    if (this.get('canReorderContent')) {
      if (dataType === this.get('reorderDataType')) {
        return this.get('dragContent') ;
      }
    }

    // otherwise, just pass along to the delegate
    var del = this.get('selectionDelegate');
    return del.collectionViewDragDataForType(this, drag, dataType);
  },

  /**
    Implements the SC.DropTarget interface.  The default implementation will
    consult the collection view delegate, if you implement those methods.

    This method is called once when the drag enters the view area.  It's
    return value will be stored on the drag object as allowedDragOperations,
    possibly further constrained by the drag source.

    @param {SC.Drag} drag the drag object
    @param {SC.Event} evt the event triggering this change, if available
    @returns {Number} logical OR'd mask of allowed drag operations.
  */
  computeDragOperations: function(drag, evt) {
    // the proposed drag operation is DRAG_REORDER only if we can reorder
    // content and the drag contains reorder content.
    var op  = SC.DRAG_NONE,
        del = this.get('selectionDelegate');

    if (this.get('canReorderContent')) {
      if (drag.get('dataTypes').indexOf(this.get('reorderDataType')) >= 0) {
        op = SC.DRAG_REORDER ;
      }
    }

    // Now pass this onto the delegate.
    op = del.collectionViewComputeDragOperations(this, drag, op);
    if (op & SC.DRAG_REORDER) op = SC.DRAG_MOVE ;

    return op ;
  },

  /** @private
    Determines the allowed drop operation insertion point, operation type,
    and the drag operation to be performed.  Used by dragUpdated() and
    performDragOperation().

    @param {SC.Drag} drag the drag object
    @param {SC.Event} evt source of this request, if available
    @param {Number} dragOp allowed drag operation mask
    Returns three params: [drop index, drop operation, allowed drag ops]
  */
  _computeDropOperationState: function(drag, evt, dragOp) {
    // get the insertion index for this location.  This can be computed
    // by a subclass using whatever method.  This method is not expected to
    // do any data validation, just to map the location to an insertion
    // index.
    var loc    = this.convertFrameFromView(drag.get('location'), null),
        dropOp = SC.DROP_BEFORE,
        del    = this.get('selectionDelegate'),
        canReorder = this.get('canReorderContent'),
        objects, content, isPreviousInDrag, isNextInDrag, len, tmp;

    // STEP 1: Try with a DROP_ON option -- send straight to delegate if
    // supported by view.

    // get the computed insertion index and possibly drop operation.
    // prefer to drop ON.
    var idx = this.insertionIndexForLocation(loc, SC.DROP_ON) ;
    if (SC.typeOf(idx) === SC.T_ARRAY) {
      dropOp = idx[1] ; // order matters here
      idx = idx[0] ;
    }

    // if the return drop operation is DROP_ON, then just check it with the
    // delegate method.  If the delegate method does not support dropping on,
    // then it will return DRAG_NONE, in which case we will try again with
    // drop before.
    if (dropOp === SC.DROP_ON) {

      // Now save the insertion index and the dropOp.  This may be changed by
      // the collection delegate.
      this.set('proposedInsertionIndex', idx) ;
      this.set('proposedDropOperation', dropOp) ;
      tmp = del.collectionViewValidateDragOperation(this, drag, dragOp, idx, dropOp) ;
      idx = this.get('proposedInsertionIndex') ;
      dropOp = this.get('proposedDropOperation') ;
      this._dropInsertionIndex = this._dropOperation = null ;

      // The delegate is OK with a drop on also, so just return.
      if (tmp !== SC.DRAG_NONE) return [idx, dropOp, tmp] ;

      // The delegate is NOT OK with a drop on, try to get the insertion
      // index again, but this time prefer SC.DROP_BEFORE, then let the
      // rest of the method run...
      else {
        dropOp = SC.DROP_BEFORE ;
        idx = this.insertionIndexForLocation(loc, SC.DROP_BEFORE) ;
        if (SC.typeOf(idx) === SC.T_ARRAY) {
          dropOp = idx[1] ; // order matters here
          idx = idx[0] ;
        }
      }
    }

    // if this is a reorder drag, set the proposed op to SC.DRAG_REORDER and
    // validate the insertion point.  This only works if the insertion point
    // is DROP_BEFORE or DROP_AFTER.  DROP_ON is not handled by reordering
    // content.
    if ((idx >= 0) && canReorder && (dropOp !== SC.DROP_ON)) {

      objects = drag.dataForType(this.get('reorderDataType')) ;
      if (objects) {
        content = this.get('content') ;

        // if the insertion index is in between two items in the drag itself,
        // then this is not allowed.  Either use the last insertion index or
        // find the first index that is not in between selections.  Stop when
        // we get to the beginning.
        if (dropOp === SC.DROP_BEFORE) {
          isPreviousInDrag = objects.indexes.contains(idx-1);
          isNextInDrag     = objects.indexes.contains(idx);
        } else {
          isPreviousInDrag = objects.indexes.contains(idx);
          isNextInDrag     = objects.indexes.contains(idx-1);
        }

        if (isPreviousInDrag && isNextInDrag) {
          if (SC.none(this._lastInsertionIndex)) {
            if (dropOp === SC.DROP_BEFORE) {
              while ((idx >= 0) && objects.indexes.contains(idx)) idx--;
            } else {
              len = content ? content.get('length') : 0;
              while ((idx < len) && objects.indexes.contains(idx)) idx++;
            }
          } else idx = this._lastInsertionIndex ;
        }

        // If we found a valid insertion point to reorder at, then set the op
        // to custom DRAG_REORDER.
        if (idx >= 0) dragOp = SC.DRAG_REORDER ;
      }
    }

    // Now save the insertion index and the dropOp.  This may be changed by
    // the collection delegate.
    this.set('proposedInsertionIndex', idx) ;
    this.set('proposedDropOperation', dropOp) ;
    dragOp = del.collectionViewValidateDragOperation(this, drag, dragOp, idx, dropOp) ;
    idx = this.get('proposedInsertionIndex') ;
    dropOp = this.get('proposedDropOperation') ;
    this._dropInsertionIndex = this._dropOperation = null ;

    // return generated state
    return [idx, dropOp, dragOp] ;
  },

  /**
    Implements the SC.DropTarget interface.  The default implementation will
    determine the drop location and then consult the collection view delegate
    if you implement those methods.  Otherwise it will handle reordering
    content on its own.

    @param {SC.Drag} drag The drag that was updated
    @param {SC.Event} evt The event for the drag
  */
  dragUpdated: function(drag, evt) {
    var op     = drag.get('allowedDragOperations'),
        state  = this._computeDropOperationState(drag, evt, op),
        idx    = state[0], dropOp = state[1], dragOp = state[2];

    // if the insertion index or dropOp have changed, update the insertion
    // point
    if (dragOp !== SC.DRAG_NONE) {
      if ((this._lastInsertionIndex !== idx) || (this._lastDropOperation !== dropOp)) {
        var itemView = this.itemViewForContentIndex(idx) ;
        this.showInsertionPoint(itemView, dropOp) ;
      }

      this._lastInsertionIndex = idx ;
      this._lastDropOperation = dropOp ;
    } else {
      this.hideInsertionPoint() ;
      this._lastInsertionIndex = this._lastDropOperation = null ;
    }

    // Normalize drag operation to the standard kinds accepted by the drag
    // system.
    return (dragOp & SC.DRAG_REORDER) ? SC.DRAG_MOVE : dragOp;
  },

  /**
    Implements the SC.DropTarget protocol.  Hides any visible insertion
    point and clears some cached values.
  */
  dragExited: function() {
    this.hideInsertionPoint() ;
    this._lastInsertionIndex = this._lastDropOperation = null ;
  },

  /**
    Implements the SC.DropTarget protocol.

    @returns {Boolean} YES
  */
  acceptDragOperation: function(drag, op) {
    return YES;
  },

  /**
    Implements the SC.DropTarget protocol. Consults the collection view
    delegate to actually perform the operation unless the operation is
    reordering content.

    @param {SC.Drag} drag The drag to perform the operation on
    @param {Number} op The drag operation to perform
    @return {Number} The operation performed
  */
  performDragOperation: function(drag, op) {
    // Get the correct insertion point, drop operation, etc.
    var state = this._computeDropOperationState(drag, null, op),
        idx   = state[0], dropOp = state[1], dragOp = state[2],
        del   = this.get('selectionDelegate'),
        performed, objects, data, content, shift, indexes;

    // The dragOp is the kinds of ops allowed.  The drag operation must
    // be included in that set.
    if (dragOp & SC.DRAG_REORDER) {
      op = (op & SC.DRAG_MOVE) ? SC.DRAG_REORDER : SC.DRAG_NONE ;
    } else op = op & dragOp ;

    // If no allowed drag operation could be found, just return.
    if (op === SC.DRAG_NONE) return op;

    // Some operation is allowed through, give the delegate a chance to
    // handle it.
    performed = del.collectionViewPerformDragOperation(this, drag, op, idx, dropOp) ;

    // If the delegate did not handle the drag (i.e. returned SC.DRAG_NONE),
    // and the op type is REORDER, then do the reorder here.
    if ((performed === SC.DRAG_NONE) && (op & SC.DRAG_REORDER)) {

      data = drag.dataForType(this.get('reorderDataType')) ;
      if (!data) return SC.DRAG_NONE ;

      content = this.get('content') ;

      // check for special case - inserting BEFORE ourself...
      // in this case just pretend the move happened since it's a no-op
      // anyway
      indexes = data.indexes;
      if (indexes.get('length')===1) {
        if (((dropOp === SC.DROP_BEFORE) || (dropOp === SC.DROP_AFTER)) &&
            (indexes.get('min')===idx)) return SC.DRAG_MOVE;
      }

      content.beginPropertyChanges(); // suspend notifications

      // get each object, then remove it from the content. they will be
      // added again later.
      objects = [];
      shift = 0;
      data.indexes.forEach(function(i) {
        objects.push(content.objectAt(i-shift));
        content.removeAt(i-shift);
        shift++;
        if (i < idx) idx--;
      }, this);

      // now insert objects into new insertion location
      if (dropOp === SC.DROP_AFTER) idx++;
      content.replace(idx, 0, objects, dropOp);
      this.select(SC.IndexSet.create(idx, objects.length));
      content.endPropertyChanges(); // restart notifications

      // make the op into its actual value
      op = SC.DRAG_MOVE ;
    }

    return op;
  },

  /**
    Default delegate method implementation, returns YES if canReorderContent
    is also true.

    @param {SC.View} view
  */
  collectionViewShouldBeginDrag: function(view) {
    return this.get('canReorderContent');
  },


  // ..........................................................
  // INSERTION POINT
  //


  /**
    Get the preferred insertion point for the given location, including
    an insertion preference of before, after or on the named index.

    You can implement this method in a subclass if you like to perform a
    more efficient check.  The default implementation will loop through the
    item views looking for the first view to "switch sides" in the orientation
    you specify.

    This method should return an array with two values.  The first value is
    the insertion point index and the second value is the drop operation,
    which should be one of SC.DROP_BEFORE, SC.DROP_AFTER, or SC.DROP_ON.

    The preferred drop operation passed in should be used as a hint as to
    the type of operation the view would prefer to receive. If the
    dropOperation is SC.DROP_ON, then you should return a DROP_ON mode if
    possible.  Otherwise, you should never return DROP_ON.

    For compatibility, you can also return just the insertion index.  If you
    do this, then the collection view will assume the drop operation is
    SC.DROP_BEFORE.

    If an insertion is NOT allowed, you should return -1 as the insertion
    point.  In this case, the drop operation will be ignored.

    @param {Point} loc the mouse location.
    @param {DropOp} dropOperation the preferred drop operation.
    @returns {Array} format: [index, op]
  */
  insertionIndexForLocation: function(loc, dropOperation) {
    return -1;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private - when we become visible, reload if needed. */
  _cv_isVisibleInWindowDidChange: function() {
    if (this.get('isVisibleInWindow')) {
      if (this._invalidIndexes) this.invokeOnce(this.reloadIfNeeded);
      if (this._invalidSelection) {
        this.invokeOnce(this.reloadSelectionIndexesIfNeeded);
      }
    }
  }.observes('isVisibleInWindow'),


  /**
    Default delegate method implementation, returns YES if isSelectable
    is also true.
  */
  collectionViewShouldSelectItem: function(view, item) {
    return this.get('isSelectable') ;
  },

  /** @private */
  _TMP_DIFF1: SC.IndexSet.create(),

  /** @private */
  _TMP_DIFF2: SC.IndexSet.create(),

  /** @private

    Whenever the nowShowing range changes, update the range observer on the
    content item and instruct the view to reload any indexes that are not in
    the previous nowShowing range.

  */
  _cv_nowShowingDidChange: function() {
    var nowShowing  = this.get('nowShowing'),
        last        = this._sccv_lastNowShowing,
        diff, diff1, diff2;

    // find the differences between the two
    // NOTE: reuse a TMP IndexSet object to avoid creating lots of objects
    // during scrolling
    if (last !== nowShowing) {
      if (last && nowShowing) {
        diff1 = this._TMP_DIFF1.add(last).remove(nowShowing);
        diff2 = this._TMP_DIFF2.add(nowShowing).remove(last);
        diff = diff1.add(diff2);
      } else diff = last || nowShowing ;
    }

    // if nowShowing has actually changed, then update
    if (diff && diff.get('length') > 0) {
      this._sccv_lastNowShowing = nowShowing ? nowShowing.frozenCopy() : null;
      this.updateContentRangeObserver();
      this.reload(diff);
    }

    // cleanup tmp objects
    if (diff1) diff1.clear();
    if (diff2) diff2.clear();

  }.observes('nowShowing'),

  /** @private */
  init: function() {
     arguments.callee.base.apply(this,arguments);
     if (this.useFastPath) this.mixin(SC.CollectionFastPath);
     if (this.get('canReorderContent')) this._cv_canReorderContentDidChange();
     this._sccv_lastNowShowing = this.get('nowShowing').clone();
     if (this.content) this._cv_contentDidChange();
     if (this.selection) this._cv_selectionDidChange();
  },

  /** @private
    Become a drop target whenever reordering content is enabled.
  */
  _cv_canReorderContentDidChange: function() {
    if (this.get('canReorderContent')) {
      if (!this.get('isDropTarget')) this.set('isDropTarget', YES);
      SC.Drag.addDropTarget(this);
    }
  }.observes('canReorderContent'),

  /** @private
    Fires an action after a selection if enabled.

    if actOnSelect is YES, then try to invoke the action, passing the
    current selection (saved as a separate array so that a change in sel
    in the meantime will not be lost)
  */
  _cv_performSelectAction: function(view, ev, delay, clickCount) {
    var sel;
    if (delay === undefined) delay = 0 ;
    if (clickCount === undefined) clickCount = 1;
    if ((clickCount>1) || this.get('actOnSelect')) {
      if (this._cv_reselectTimer) this._cv_reselectTimer.invalidate() ;
      sel = this.get('selection');
      sel = sel ? sel.toArray() : [];
      if (this._cv_actionTimer) this._cv_actionTimer.invalidate();
      this._cv_actionTimer = this.invokeLater(this._cv_action, delay, view, ev, sel) ;
    }
  },

  /** @private
    Perform the action.  Supports legacy behavior as well as newer style
    action dispatch.
  */
  _cv_action: function(view, evt, context) {
    var action = this.get('action');
    var target = this.get('target') || null;

    this._cv_actionTimer = null;
    if (action) {
      // if the action is a function, just call it
      if (SC.typeOf(action) === SC.T_FUNCTION) return this.action(view, evt) ;

      // otherwise, use the new sendAction style
      var pane = this.get('pane') ;
      if (pane) {
        pane.rootResponder.sendAction(action, target, this, pane, context);
      }
      // SC.app.sendAction(action, target, this) ;

    // if no action is specified, then trigger the support action,
    // if supported.
    } else if (!view) {
      return ; // nothing to do

    // if the target view has its own internal action handler,
    // trigger that.
    } else if (SC.typeOf(view._action) == SC.T_FUNCTION) {
      return view._action(evt) ;

    // otherwise call the action method to support older styles.
    } else if (SC.typeOf(view.action) == SC.T_FUNCTION) {
      return view.action(evt) ;
    }
  }


});

/* >>>>>>>>>> BEGIN source/views/image_button.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/** @class

  Provides a button that displays an image instead of the standard button
  user interface.

  It behaves the same as an SC.ButtonView, but has an image property that
  should be set to a unique class name.

  For example:

      SC.ImageButtonView.create({
        action: 'imageButtonWasClicked',

        image: 'my-image-button-icon'
      });

  You could then add some CSS rule for a normal state:

      $theme.image-button .my-image-button-icon {
        @include slice('my-image-button-image.png');

        // and an active state:
        &.active {
          @include slice('my-image-button-image-active.png');
        }
      }

  Note: in addition to using SCSS and the Chance directives shown above, you
  can use normal CSS syntax and sc_static.

  @extends SC.View
  @extends SC.Control
  @extends SC.ButtonView
  @since SproutCore 1.5
*/
SC.ImageButtonView = SC.ButtonView.extend(
/** @scope SC.ImageButtonView.prototype */ {

  /**
    @type Array
    @default ['sc-image-button-view']
    @see SC.View#classNames
  */
  classNames: ['sc-image-button-view'],

  /**
    Unlike SC.ButtonView, SC.ImageButtonView does not have a default theme
    that needs to be applied for backwards compatibility.

    @type String
    @default null
  */
  themeName: null,

  /**
    @type String
    @default 'imageButtonRenderDelegate'
  */
  renderDelegateName: 'imageButtonRenderDelegate',
  
  /**
    @type Array
    @default ['image']
  */
  displayProperties: ['image'],

  /**
    A class name that will be applied to the img tag of the button.
    
    @type String
    @default null
  */
  image: null

}) ;

/* >>>>>>>>>> BEGIN source/views/list.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/collection');
sc_require('mixins/collection_row_delegate');

/** @class

  A list view renders vertical lists of items.  It is a specialized form of
  collection view that is simpler than the table view, but more refined than
  a generic collection.

  You can use a list view just like a collection view, except that often you
  also should provide a default rowHeight.  Setting this value will allow
  the ListView to optimize its rendering.

  ## Variable Row Heights

  Normally you set the row height through the rowHeight property.  You can
  also support custom row heights by implementing the
  contentCustomRowHeightIndexes property to return an index set.

  ## Using ListView with Very Large Data Sets

  ListView implements incremental rendering, which means it will only render
  HTML for the items that are current visible on the screen.  You can use it
  to efficiently render lists with 100K+ items very efficiently.

  If you need to work with very large lists of items, however, be aware that
  calculate variable rows heights can become very expensive since the list
  view will essentially have to iterate over every item in the collection to
  collect its row height.

  To work with very large lists, you should consider making your row heights
  uniform.  This will allow the list view to efficiently render content
  without worrying about the overall performance.

  Alternatively, you may want to consider overriding the
  offsetForRowAtContentIndex() and heightForRowAtContentIndex() methods to
  perform some faster calculations that do not require inspecting every
  item in the collection.

  Note that row heights and offsets are cached so once they are calculated
  the list view will be able to display very quickly.

  ## Dropping on an Item

  When the list view is configured to accept drags and drops onto its items, it
  will set the isDropTarget property on the target item accordingly.  This
  allows you to modify the appearance of the drop target list item accordingly
  (@see SC.ListItemView#isDropTarget).

  @extends SC.CollectionView
  @extends SC.CollectionRowDelegate
  @since SproutCore 1.0
*/
// (Can we also have an 'estimate row heights' property that will simply
// cheat for very long data sets to make rendering more efficient?)
SC.ListView = SC.CollectionView.extend(SC.CollectionRowDelegate,
/** @scope SC.ListView.prototype */ {

  /**
    @type Array
    @default ['sc-list-view']
    @see SC.View#classNames
  */
  classNames: ['sc-list-view'],

  /**
    @type Boolean
    @default YES
  */
  acceptsFirstResponder: YES,

  /**
    If set to YES, the default theme will show alternating rows
    for the views this ListView created through exampleView property.

    @type Boolean
    @default NO
  */
  showAlternatingRows: NO,


  // ..........................................................
  // METHODS
  //

  /** @private */
  render: function(context, firstTime) {
    context.setClass('alternating', this.get('showAlternatingRows'));

    return arguments.callee.base.apply(this,arguments);
  },


  // ..........................................................
  // COLLECTION ROW DELEGATE SUPPORT
  //

  /**
    @field
    @type Object
    @observes 'delegate'
    @observes 'content'
  */
  rowDelegate: function() {
    var del = this.delegate,
        content = this.get('content');

    return this.delegateFor('isCollectionRowDelegate', del, content);
  }.property('delegate', 'content').cacheable(),

  /** @private
    Whenever the rowDelegate changes, begin observing important properties
  */
  _sclv_rowDelegateDidChange: function() {
    var last = this._sclv_rowDelegate,
        del  = this.get('rowDelegate'),
        func = this._sclv_rowHeightDidChange,
        func2 = this._sclv_customRowHeightIndexesDidChange;

    if (last === del) return this; // nothing to do
    this._sclv_rowDelegate = del;

    // last may be null on a new object
    if (last) {
      last.removeObserver('rowHeight', this, func);
      last.removeObserver('customRowHeightIndexes', this, func2);
    }

    if (!del) {
      throw "Internal Inconsistancy: ListView must always have CollectionRowDelegate";
    }

    del.addObserver('rowHeight', this, func);
    del.addObserver('customRowHeightIndexes', this, func2);
    this._sclv_rowHeightDidChange()._sclv_customRowHeightIndexesDidChange();
    return this ;
  }.observes('rowDelegate'),

  /** @private
    called whenever the rowHeight changes.  If the property actually changed
    then invalidate all row heights.
  */
  _sclv_rowHeightDidChange: function() {
    var del = this.get('rowDelegate'),
        height = del.get('rowHeight'),
        indexes;

    if (height === this._sclv_rowHeight) return this; // nothing to do
    this._sclv_rowHeight = height;

    indexes = SC.IndexSet.create(0, this.get('length'));
    this.rowHeightDidChangeForIndexes(indexes);
    return this ;
  },

  /** @private
    called whenever the customRowHeightIndexes changes.  If the property
    actually changed then invalidate affected row heights.
  */
  _sclv_customRowHeightIndexesDidChange: function() {
    var del     = this.get('rowDelegate'),
        indexes = del.get('customRowHeightIndexes'),
        last    = this._sclv_customRowHeightIndexes,
        func    = this._sclv_customRowHeightIndexesContentDidChange;

    // nothing to do
    if ((indexes===last) || (last && last.isEqual(indexes))) return this;

    // if we were observing the last index set, then remove observer
    if (last && this._sclv_isObservingCustomRowHeightIndexes) {
      last.removeObserver('[]', this, func);
    }

    // only observe new index set if it exists and it is not frozen.
    if (this._sclv_isObservingCustomRowHeightIndexes = indexes && !indexes.get('isFrozen')) {
      indexes.addObserver('[]', this, func);
    }

    this._sclv_customRowHeightIndexesContentDidChange();
    return this ;
  },

  /** @private
    Called whenever the customRowHeightIndexes set is modified.
  */
  _sclv_customRowHeightIndexesContentDidChange: function() {
    var del     = this.get('rowDelegate'),
        indexes = del.get('customRowHeightIndexes'),
        last    = this._sclv_customRowHeightIndexes,
        changed;

    // compute the set to invalidate.  the union of cur and last set
    if (indexes && last) {
      changed = indexes.copy().add(last);
    } else changed = indexes || last ;
    this._sclv_customRowHeightIndexes = indexes ? indexes.frozenCopy() : null;

    // invalidate
    this.rowHeightDidChangeForIndexes(changed);
    return this ;
  },


  // ..........................................................
  // ROW PROPERTIES
  //

  /**
    Returns the top offset for the specified content index.  This will take
    into account any custom row heights and group views.

    @param {Number} idx the content index
    @returns {Number} the row offset
  */
  rowOffsetForContentIndex: function(idx) {
    if (idx === 0) return 0 ; // fastpath

    var del       = this.get('rowDelegate'),
        rowHeight = del.get('rowHeight'),
        rowSpacing, ret, custom, cache, delta, max, content ;

    ret = idx * rowHeight;

    rowSpacing = this.get('rowSpacing');
		if(rowSpacing){
      ret += idx * rowSpacing;
    }

    if (del.customRowHeightIndexes && (custom=del.get('customRowHeightIndexes'))) {

      // prefill the cache with custom rows.
      cache = this._sclv_offsetCache;
      if (!cache) {
        cache = [];
        delta = max = 0 ;
        custom.forEach(function(idx) {
          delta += this.rowHeightForContentIndex(idx)-rowHeight;
          cache[idx+1] = delta;
          max = idx ;
        }, this);
        this._sclv_max = max+1;
        // moved down so that the cache is not marked as initialized until it actually is
        this._sclv_offsetCache = cache;
      }

      // now just get the delta for the last custom row before the current
      // idx.
      delta = cache[idx];
      if (delta === undefined) {
        delta = cache[idx] = cache[idx-1];
        if (delta === undefined) {
          max = this._sclv_max;
          if (idx < max) max = custom.indexBefore(idx)+1;
          delta = cache[idx] = cache[max] || 0;
        }
      }

      ret += delta ;
    }

    return ret ;
  },

  /**
    Returns the row height for the specified content index.  This will take
    into account custom row heights and group rows.

    @param {Number} idx content index
    @returns {Number} the row height
  */
  rowHeightForContentIndex: function(idx) {
    var del = this.get('rowDelegate'),
        ret, cache, content, indexes;

    if (del.customRowHeightIndexes && (indexes=del.get('customRowHeightIndexes'))) {
      cache = this._sclv_heightCache ;
      if (!cache) {
        cache = [];
        content = this.get('content');
        indexes.forEach(function(idx) {
          cache[idx] = del.contentIndexRowHeight(this, content, idx);
        }, this);
        // moved down so that the cache is not marked as initialized until it actually is
        this._sclv_heightCache = cache;
      }

      ret = cache[idx];
      if (ret === undefined) ret = del.get('rowHeight');
    } else ret = del.get('rowHeight');

    return ret ;
  },

  /**
    Call this method whenever a row height has changed in one or more indexes.
    This will invalidate the row height cache and reload the content indexes.
    Pass either an index set or a single index number.

    This method is called automatically whenever you change the rowHeight
    or customRowHeightIndexes properties on the collectionRowDelegate.

    @param {SC.IndexSet|Number} indexes
    @returns {SC.ListView} receiver
  */
  rowHeightDidChangeForIndexes: function(indexes) {
    var len = this.get('length');

    // clear any cached offsets
    this._sclv_heightCache = this._sclv_offsetCache = null;

    // find the smallest index changed; invalidate everything past it
    if (indexes && indexes.isIndexSet) indexes = indexes.get('min');
    this.reload(SC.IndexSet.create(indexes, len-indexes));
    return this ;
  },

  /**
    @private
    When the length changes, so does the layout. CollectionView doesn't
    know to do this, because it only asks for layout when it reloads--which
    makes sense, as it is agnostic to any layout logic (for all it knows, the
    items in the collection are not in a completely random order relative to layout)
  */
  _sclv_lengthDidChange: function() {
    this.adjust(this.computeLayout());
  }.observes('length'),

  // ..........................................................
  // SUBCLASS IMPLEMENTATIONS
  //

  /**
    The layout for a ListView is computed from the total number of rows
    along with any custom row heights.
  */
  computeLayout: function() {
    // default layout
    var ret = this._sclv_layout;
    if (!ret) ret = this._sclv_layout = {};
    ret.minHeight = this.rowOffsetForContentIndex(this.get('length'));
    this.set('calculatedHeight',ret.minHeight);
    return ret ;
  },

  /**
    Computes the layout for a specific content index by combining the current
    row heights.

    @param {Number} contentIndex
    @returns {Hash} layout hash for the index provided
  */
  layoutForContentIndex: function(contentIndex) {
    var del = this.get('rowDelegate');

    return {
      top: this.rowOffsetForContentIndex(contentIndex),
      height: this.rowHeightForContentIndex(contentIndex) - del.get('rowPadding') * 2,
      left: 0,
      right: 0
    };
  },

  /**
    Override to return an IndexSet with the indexes that are at least
    partially visible in the passed rectangle.  This method is used by the
    default implementation of computeNowShowing() to determine the new
    nowShowing range after a scroll.

    Override this method to implement incremental rendering.

    The default simply returns the current content length.

    @param {Rect} rect the visible rect or a point
    @returns {SC.IndexSet} now showing indexes
  */
  contentIndexesInRect: function(rect) {
    var rowHeight = this.get('rowDelegate').get('rowHeight'),
        top       = SC.minY(rect),
        bottom    = SC.maxY(rect),
        height    = rect.height || 0,
        len       = this.get('length'),
        offset, start, end;

    // estimate the starting row and then get actual offsets until we are
    // right.
    start = (top - (top % rowHeight)) / rowHeight;
    offset = this.rowOffsetForContentIndex(start);

    // go backwards until top of row is before top edge
    while(start>0 && offset>top) {
      start--;
      offset -= this.rowHeightForContentIndex(start);
    }

    // go forwards until bottom of row is after top edge
    offset += this.rowHeightForContentIndex(start);
    while(start<len && offset<=top) {
      start++;
      offset += this.rowHeightForContentIndex(start);
    }
    if (start<0) start = 0;
    if (start>=len) start=len;


    // estimate the final row and then get the actual offsets until we are
    // right. - look at the offset of the _following_ row
    end = start + ((height - (height % rowHeight)) / rowHeight) ;
    if (end > len) end = len;
    offset = this.rowOffsetForContentIndex(end);

    // walk backwards until top of row is before or at bottom edge
    while(end>=start && offset>=bottom) {
      end--;
      offset -= this.rowHeightForContentIndex(end);
    }

    // go forwards until bottom of row is after bottom edge
    offset += this.rowHeightForContentIndex(end);
    while(end<len && offset<bottom) {
      end++;
      offset += this.rowHeightForContentIndex(end);
    }

    end++; // end should be after start

    if (end<start) end = start;
    if (end>len) end = len ;

    // convert to IndexSet and return
    return SC.IndexSet.create(start, end-start);
  },


  // ..........................................................
  // DRAG AND DROP SUPPORT
  //

  /**
    Default view class used to draw an insertion point.  The default
    view will show a vertical line.  Any view you create
    should expect an outlineLevel property set, which should impact your left
    offset.

    @field
    @type SC.View
  */
  insertionPointView: SC.View.extend({
    classNames: 'sc-list-insertion-point',

    /** @private */
    render: function(context, firstTime) {
      if (firstTime) context.push('<div class="anchor"></div>');
    }
  }),

  /**
    Default implementation will show an insertion point
    @see SC.CollectionView#showInsertionPoint
  */
  showInsertionPoint: function(itemView, dropOperation) {
    var view = this._insertionPointView;
    if (!view) {
      view = this._insertionPointView
           = this.get('insertionPointView').create();
    }

    var index  = itemView.get('contentIndex'),
        len    = this.get('length'),
        layout = SC.clone(itemView.get('layout')),
        level  = itemView.get('outlineLevel'),
        indent = itemView.get('outlineIndent') || 0,
        group;

    // show item indented if we are inserting at the end and the last item
    // is a group item.  This is a special case that should really be
    // converted into a more general protocol.
    if ((index >= len) && index>0) {
      group = this.itemViewForContentIndex(len-1);
      if (group.get('isGroupView')) {
        level = 1;
        indent = group.get('outlineIndent');
      }
    }

    if (SC.none(level)) level = -1;

    if (dropOperation & SC.DROP_ON) {
      if (itemView !== this._lastDropOnView) {
        this.hideInsertionPoint();

        // If the drag is supposed to drop onto an item, notify the item that it
        // is the current target of the drop.
        itemView.set('isDropTarget', YES);

        // Track the item so that we can clear isDropTarget when the drag changes;
        // versus having to clear it from all items.
        this._lastDropOnView = itemView;
      }
    } else {

      if (this._lastDropOnView) {
        // If there was an item that was the target of the drop previously, be
        // sure to clear it.
        this._lastDropOnView.set('isDropTarget', NO);
        this._lastDropOnView = null;
      }

      if (dropOperation & SC.DROP_AFTER) layout.top += layout.height;

      layout.height = 2;
      layout.right  = 0;
      layout.left   = ((level+1) * indent) + 12;
      delete layout.width;

      view.set('layout', layout);
      this.appendChild(view);
    }
  },

  /** @see SC.CollectionView#hideInsertionPoint */
  hideInsertionPoint: function() {
    // If there was an item that was the target of the drop previously, be
    // sure to clear it.
    if (this._lastDropOnView) {
      this._lastDropOnView.set('isDropTarget', NO);
      this._lastDropOnView = null;
    }

    var view = this._insertionPointView;
    if (view) view.removeFromParent().destroy();
    this._insertionPointView = null;
  },

  /**
    Compute the insertion index for the passed location.  The location is
    a point, relative to the top/left corner of the receiver view.  The return
    value is an index plus a dropOperation, which is computed as such:

      - if outlining is not used and you are within 5px of an edge, DROP_BEFORE
        the item after the edge.
      - if outlining is used and you are within 5px of an edge and the previous
        item has a different outline level then the next item, then DROP_AFTER
        the previous item if you are closer to that outline level.
      - if dropOperation = SC.DROP_ON and you are over the middle of a row, then
        use DROP_ON.

    @see SC.CollectionView.insertionIndexForLocation
  */
  insertionIndexForLocation: function(loc, dropOperation) {
    var locRect = {x:loc.x, y:loc.y, width:1, height:1},
        indexes = this.contentIndexesInRect(locRect),
        index   = indexes.get('min'),
        len     = this.get('length'),
        min, max, diff, clevel, cindent, plevel, pindent, itemView, pgroup;

    // if there are no indexes in the rect, then we need to either insert
    // before the top item or after the last item.  Figure that out by
    // computing both.
    if (SC.none(index) || index<0) {
      if ((len===0) || (loc.y <= this.rowOffsetForContentIndex(0))) index = 0;
      else if (loc.y >= this.rowOffsetForContentIndex(len)) index = len;
    }

    // figure the range of the row the location must be within.
    min = this.rowOffsetForContentIndex(index);
    max = min + this.rowHeightForContentIndex(index);

    // now we know which index we are in.  if dropOperation is DROP_ON, figure
    // if we can drop on or not.
    if (dropOperation == SC.DROP_ON) {
      // editable size - reduce height by a bit to handle dropping
      if (this.get('isEditable')) diff=Math.min(Math.floor((max-min)*0.2),5);
      else diff = 0;

      // if we're inside the range, then DROP_ON
      if (loc.y >= (min+diff) || loc.y <= (max+diff)) {
        return [index, SC.DROP_ON];
      }
    }

    // finally, let's decide if we want to actually insert before/after.  Only
    // matters if we are using outlining.
    if (index>0) {

      itemView = this.itemViewForContentIndex(index-1);
      pindent  = (itemView ? itemView.get('outlineIndent') : 0) || 0;
      plevel   = itemView ? itemView.get('outlineLevel') : 0;

      if (index<len) {
        itemView = this.itemViewForContentIndex(index);
        clevel   = itemView ? itemView.get('outlineLevel') : 0;
        cindent  = (itemView ? itemView.get('outlineIndent') : 0) || 0;
        cindent  *= clevel;
      } else {
        clevel = itemView.get('isGroupView') ? 1 : 0; // special case...
        cindent = pindent * clevel;
      }

      pindent  *= plevel;

      // if indent levels are different, then try to figure out which level
      // it should be on.
      if ((clevel !== plevel) && (cindent !== pindent)) {

        // use most inner indent as boundary
        if (pindent > cindent) {
          index--;
          dropOperation = SC.DROP_AFTER;
        }
      }
    }

    // we do not support dropping before a group item.  If dropping before
    // a group item, always try to instead drop after the previous item.  If
    // the previous item is also a group then, well, dropping is just not
    // allowed.  Note also that dropping at 0, first item must not be group
    // and dropping at length, last item must not be a group
    //
    if (dropOperation === SC.DROP_BEFORE) {
      itemView = (index<len) ? this.itemViewForContentIndex(index) : null;
      if (!itemView || itemView.get('isGroupView')) {
        if (index>0) {
          itemView = this.itemViewForContentIndex(index-1);

          // don't allow a drop if the previous item is a group view and we're
          // insert before the end.  For the end, allow the drop if the
          // previous item is a group view but OPEN.
          if (!itemView.get('isGroupView') || (itemView.get('disclosureState') === SC.BRANCH_OPEN)) {
            index = index-1;
            dropOperation = SC.DROP_AFTER;
          } else index = -1;

        } else index = -1;
      }

      if (index<0) dropOperation = SC.DRAG_NONE ;
    }

    // return whatever we came up with
    return [index, dropOperation];
  },

  /** @private */
  mouseWheel: function(evt) {
    // The following commits changes in a list item that is being edited,
    // if the list is scrolled.
    var inlineEditor = SC.InlineTextFieldView.editor;
    if(inlineEditor && inlineEditor.get('isEditing')){
      if(inlineEditor.get('delegate').get('displayDelegate')===this){
        SC.InlineTextFieldView.commitEditing();
      }
    }
    return NO ;
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private */
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this._sclv_rowDelegateDidChange();
  }

});

/* >>>>>>>>>> BEGIN source/views/scroller.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/** @class

  Displays a horizontal or vertical scroller.  You will not usually need to
  work with scroller views directly, but you may override this class to
  implement your own custom scrollers.

  Because the scroller uses the dimensions of its constituent elements to
  calculate layout, you may need to override the default display metrics.

  You can either create a subclass of ScrollerView with the new values, or
  provide your own in your theme:

      SC.mixin(SC.ScrollerView.prototype, {
        scrollbarThickness: 14,
        capLength: 18,
        capOverlap: 14,
        buttonOverlap: 11,
        buttonLength: 41
      });

  You can change whether scroll buttons are displayed by setting the
  hasButtons property.

  @extends SC.View
  @since SproutCore 1.0
*/
SC.ScrollerView = SC.View.extend(
/** @scope SC.ScrollerView.prototype */ {

  /**
    @type Array
    @default ['sc-scroller-view']
    @see SC.View#classNames
  */
  classNames: ['sc-scroller-view'],

  /**
    @type Array
    @default 'thumbPosition thumbLength isEnabled controlsHidden'.w()
    @see SC.View#displayProperties
  */
  displayProperties: ['thumbPosition', 'thumbLength', 'isEnabled', 'controlsHidden'],

  /**
    The WAI-ARIA role for scroller view.

    @type String
    @default 'scrollbar'
    @readOnly
  */
  ariaRole: 'scrollbar',


  // ..........................................................
  // PROPERTIES
  //

  /**
    If YES, a click on the track will cause the scrollbar to scroll to that position.
    Otherwise, a click on the track will cause a page down.

    In either case, alt-clicks will perform the opposite behavior.

    @type Boolean
    @default NO
  */
  shouldScrollToClick: NO,


  /** @private
    The in-touch-scroll value.
  */
  _touchScrollValue: NO,

  /**
    The value of the scroller.

    The value represents the position of the scroller's thumb.

    @field
    @type Number
    @observes maximum
    @observes minimum
  */
  value: function(key, val) {
    var minimum = this.get('minimum');
    if (val !== undefined) {
      this._scs_value = val;
    }

    val = this._scs_value || minimum; // default value is at top/left
    return Math.max(Math.min(val, this.get('maximum')), minimum) ;
  }.property('maximum', 'minimum').cacheable(),

  /**
    @type Number
    @observes value
  */
  displayValue: function() {
    var ret;
    if (this.get("_touchScrollValue")) ret = this.get("_touchScrollValue");
    else ret = this.get("value");
    return ret;
  }.property("value", "_touchScrollValue").cacheable(),

  /**
    The portion of the track that the thumb should fill. Usually the
    proportion will be the ratio of the size of the scroll view's content view
    to the size of the scroll view.

    Should be specified as a value between 0.0 (minimal size) and 1.0 (fills
    the slot). Note that if the proportion is 1.0 then the control will be
    disabled.

    @type Number
    @default 0.0
  */
  proportion: 0,

  /**
    The maximum offset value for the scroller.  This will be used to calculate
    the internal height/width of the scroller itself.

    When set less than the height of the scroller, the scroller is disabled.

    @type Number
    @default 100
  */
  maximum: 100,

  /**
    The minimum offset value for the scroller.  This will be used to calculate
    the internal height/width of the scroller itself.

    @type Number
    @default 0
  */
  minimum: 0,

  /**
    YES to enable scrollbar, NO to disable it.  Scrollbars will automatically
    disable if the maximum scroll width does not exceed their capacity.

    @field
    @type Boolean
    @default YES
    @observes proportion
  */
  isEnabled: function(key, value) {
    if (value !== undefined) {
      this._scsv_isEnabled = value;
    }

    if (this._scsv_isEnabled !== undefined) {
      return this._scsv_isEnabled;
    }

    return this.get('proportion') < 1;
  }.property('proportion').cacheable(),

  /** @private */
  _scsv_isEnabled: undefined,

  /**
    Determine the layout direction.  Determines whether the scrollbar should
    appear horizontal or vertical.  This must be set when the view is created.
    Changing this once the view has been created will have no effect. Possible
    values:

      - SC.LAYOUT_VERTICAL
      - SC.LAYOUT_HORIZONTAL

    @type String
    @default SC.LAYOUT_VERTICAL
  */
  layoutDirection: SC.LAYOUT_VERTICAL,

  /**
    Whether or not the scroller should display scroll buttons

    @type Boolean
    @default YES
  */
  hasButtons: YES,


  // ..........................................................
  // DISPLAY METRICS
  //

  /**
    The width (if vertical scroller) or height (if horizontal scroller) of the
    scrollbar.

    @type Number
    @default 14
  */
  scrollbarThickness: 14,

  /**
    The width or height of the cap that encloses the track.

    @type Number
    @default 18
  */
  capLength: 18,

  /**
    The amount by which the thumb overlaps the cap.

    @type Number
    @default 14
  */
  capOverlap: 14,

  /**
    The width or height of the up/down or left/right arrow buttons. If the
    scroller is not displaying arrows, this is the width or height of the end
    cap.

    @type Number
    @defaut 41
  */
  buttonLength: 41,

  /**
    The amount by which the thumb overlaps the arrow buttons. If the scroller
    is not displaying arrows, this is the amount by which the thumb overlaps
    the end cap.

    @type Number
    @default 11
  */
  buttonOverlap: 11,

  /**
    The minimium length that the thumb will be, regardless of how much content
    is in the scroll view.

    @type Number
    @default 20
  */
  minimumThumbLength: 20,

  // ..........................................................
  // INTERNAL SUPPORT
  //


  /** @private
    Generates the HTML that gets displayed to the user.

    The first time render is called, the HTML will be output to the DOM.
    Successive calls will reposition the thumb based on the value property.

    @param {SC.RenderContext} context the render context
    @param {Boolean} firstTime YES if this is creating a layer
    @private
  */
  render: function(context, firstTime) {
    var ariaOrientation = 'vertical',
        classNames = {},
        buttons = '',
        parentView = this.get('parentView'),
        layoutDirection = this.get('layoutDirection'),
        thumbPosition, thumbLength, thumbCenterLength, thumbElement,
        value, max, scrollerLength, length, pct;

    // We set a class name depending on the layout direction so that we can
    // style them differently using CSS.
    switch (layoutDirection) {
      case SC.LAYOUT_VERTICAL:
        classNames['sc-vertical'] = YES;
        break;
      case SC.LAYOUT_HORIZONTAL:
        classNames['sc-horizontal'] = YES;
        ariaOrientation = 'horizontal';
        break;
    }

    // The appearance of the scroller changes if disabled
    classNames['disabled'] = !this.get('isEnabled');
    // Whether to hide the thumb and buttons
    classNames['controls-hidden'] = this.get('controlsHidden');

    // Change the class names of the DOM element all at once to improve
    // performance
    context.setClass(classNames);

    // Calculate the position and size of the thumb
    thumbLength = this.get('thumbLength');
    thumbPosition = this.get('thumbPosition');

    // If this is the first time, generate the actual HTML
    if (firstTime) {
      context.push('<div class="track"></div>',
                    '<div class="cap"></div>');
      this.renderButtons(context, this.get('hasButtons'));
      this.renderThumb(context, layoutDirection, thumbLength, thumbPosition);

      //addressing accessibility
      context.attr('aria-orientation', ariaOrientation);

      //addressing accessibility
      context.attr('aria-valuemax', this.get('maximum'));
      context.attr('aria-valuemin', this.get('minimum'));
      context.attr('aria-valuenow', this.get('value'));
      context.attr('aria-controls' , parentView.getPath('contentView.layerId'));

    } else {
      // The HTML has already been generated, so all we have to do is
      // reposition and resize the thumb

      // If we aren't displaying controls don't bother
      if (this.get('controlsHidden')) return;

      thumbElement = this.$('.thumb');

      this.adjustThumb(thumbElement, thumbPosition, thumbLength);

      //addressing accessibility
      context.attr('aria-valuenow', this.get('value'));

    }
  },

  renderThumb: function(context, layoutDirection, thumbLength, thumbPosition) {
    var styleString;
    if(layoutDirection === SC.LAYOUT_HORIZONTAL) styleString = 'width: '+thumbLength+'px; left: ' + thumbPosition + 'px;';
    else styleString = 'height: '+thumbLength+'px; top: ' + thumbPosition + 'px;';

    context.push('<div class="thumb" style="%@">'.fmt(styleString),
                 '<div class="thumb-center"></div>',
                 '<div class="thumb-top"></div>',
                 '<div class="thumb-bottom"></div></div>');

  },

  renderButtons: function(context, hasButtons) {
    if (hasButtons) {
      context.push('<div class="button-bottom"></div><div class="button-top"></div>');
    } else {
      context.push('<div class="endcap"></div>');
    }
  },

  /** @private */
  touchScrollDidStart: function(value) {
    this.set("_touchScrollValue", value);
  },

  /** @private */
  touchScrollDidEnd: function(value) {
    this.set("_touchScrollValue", NO);
  },

  /** @private */
  touchScrollDidChange: function(value) {
    this.set("_touchScrollValue", value);
  },

  // ..........................................................
  // THUMB MANAGEMENT
  //

  /** @private
    Adjusts the thumb (for backwards-compatibility calls adjustThumbPosition+adjustThumbSize by default)
  */
  adjustThumb: function(thumb, position, length) {
    this.adjustThumbPosition(thumb, position);
    this.adjustThumbSize(thumb, length);
  },

  /** @private
    Updates the position of the thumb DOM element.

    @param {Number} position the position of the thumb in pixels
  */
  adjustThumbPosition: function(thumb, position) {
    // Don't touch the DOM if the position hasn't changed
    if (this._thumbPosition === position) return;

    switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        thumb.css('top', position);
        break;
      case SC.LAYOUT_HORIZONTAL:
        thumb.css('left', position);
        break;
    }

    this._thumbPosition = position;
  },

  /** @private */
  adjustThumbSize: function(thumb, size) {
    // Don't touch the DOM if the size hasn't changed
    if (this._thumbSize === size) return;

    switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        thumb.css('height', Math.max(size, this.get('minimumThumbLength')));
        break;
      case SC.LAYOUT_HORIZONTAL:
        thumb.css('width', Math.max(size, this.get('minimumThumbLength')));
        break;
    }

    this._thumbSize = size;
  },

  // ..........................................................
  // SCROLLER DIMENSION COMPUTED PROPERTIES
  //

  /** @private
    Returns the total length of the track in which the thumb sits.

    The length of the track is the height or width of the scroller, less the
    cap length and the button length. This property is used to calculate the
    position of the thumb relative to the view.

    @property
  */
  trackLength: function() {
    var scrollerLength = this.get('scrollerLength');

    // Subtract the size of the top/left cap
    scrollerLength -= this.capLength - this.capOverlap;
    // Subtract the size of the scroll buttons, or the end cap if they are
    // not shown.
    scrollerLength -= this.buttonLength - this.buttonOverlap;

    return scrollerLength;
  }.property('scrollerLength').cacheable(),

  /** @private
    Returns the height of the view if this is a vertical scroller or the width
    of the view if this is a horizontal scroller. This is used when scrolling
    up and down by page, as well as in various layout calculations.

    @type Number
  */
  scrollerLength: function() {
    switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        return this.get('frame').height;
      case SC.LAYOUT_HORIZONTAL:
        return this.get('frame').width;
    }

    return 0;
  }.property('frame').cacheable(),

  /** @private
    The total length of the thumb. The size of the thumb is the
    length of the track times the content proportion.

    @property
  */
  thumbLength: function() {
    var length;

    length = Math.floor(this.get('trackLength') * this.get('proportion'));
    length = isNaN(length) ? 0 : length;

    return Math.max(length, this.get('minimumThumbLength'));
  }.property('trackLength', 'proportion').cacheable(),

  /** @private
    The position of the thumb in the track.

    @type Number
    @isReadOnly
  */
  thumbPosition: function() {
    var value = this.get('displayValue'),
        max = this.get('maximum'),
        trackLength = this.get('trackLength'),
        thumbLength = this.get('thumbLength'),
        capLength = this.get('capLength'),
        capOverlap = this.get('capOverlap'), position;

    position = (value/max)*(trackLength-thumbLength);
    position += capLength - capOverlap; // account for the top/left cap

    return Math.floor(isNaN(position) ? 0 : position);
  }.property('displayValue', 'maximum', 'trackLength', 'thumbLength').cacheable(),

  /** @private
    YES if the maximum value exceeds the frame size of the scroller.  This
    will hide the thumb and buttons.

    @type Boolean
    @isReadOnly
  */
  controlsHidden: function() {
    return this.get('proportion') >= 1;
  }.property('proportion').cacheable(),


  // ..........................................................
  // MOUSE EVENTS
  //

  /** @private
    Returns the value for a position within the scroller's frame.
  */
  valueForPosition: function(pos) {
    var max = this.get('maximum'),
        trackLength = this.get('trackLength'),
        thumbLength = this.get('thumbLength'),
        capLength = this.get('capLength'),
        capOverlap = this.get('capOverlap'), value;

    value = pos - (capLength - capOverlap);
    value = value / (trackLength - thumbLength);
    value = value * max;
    return value;
  },

  /** @private
    Handles mouse down events and adjusts the value property depending where
    the user clicked.

    If the control is disabled, we ignore all mouse input.

    If the user clicks the thumb, we note the position of the mouse event but
    do not take further action until they begin to drag.

    If the user clicks the track, we adjust the value a page at a time, unless
    alt is pressed, in which case we scroll to that position.

    If the user clicks the buttons, we adjust the value by a fixed amount, unless
    alt is pressed, in which case we adjust by a page.

    If the user clicks and holds on either the track or buttons, those actions
    are repeated until they release the mouse button.

    @param evt {SC.Event} the mousedown event
  */
  mouseDown: function(evt) {
    if (!this.get('isEnabled')) return NO;

    // keep note of altIsDown for later.
    this._altIsDown = evt.altKey;
    this._shiftIsDown = evt.shiftKey;

    var target = evt.target,
        thumbPosition = this.get('thumbPosition'),
        value, clickLocation, clickOffset,
        scrollerLength = this.get('scrollerLength');

    // Determine the subcontrol that was clicked
    if (target.className.indexOf('thumb') >= 0) {
      // Convert the mouseDown coordinates to the view's coordinates
      clickLocation = this.convertFrameFromView({ x: evt.pageX, y: evt.pageY });

      clickLocation.x -= thumbPosition;
      clickLocation.y -= thumbPosition;

      // Store the starting state so we know how much to adjust the
      // thumb when the user drags
      this._thumbDragging = YES;
      this._thumbOffset = clickLocation;
      this._mouseDownLocation = { x: evt.pageX, y: evt.pageY };
      this._thumbPositionAtDragStart = this.get('thumbPosition');
      this._valueAtDragStart = this.get("value");
    } else if (target.className.indexOf('button-top') >= 0) {
      // User clicked the up/left button
      // Decrement the value by a fixed amount or page size
      this.decrementProperty('value', (this._altIsDown ? scrollerLength : 30));
      this.makeButtonActive('.button-top');
      // start a timer that will continue to fire until mouseUp is called
      this.startMouseDownTimer('scrollUp');
      this._isScrollingUp = YES;
    } else if (target.className.indexOf('button-bottom') >= 0) {
      // User clicked the down/right button
      // Increment the value by a fixed amount
      this.incrementProperty('value', (this._altIsDown ? scrollerLength : 30));
      this.makeButtonActive('.button-bottom');
      // start a timer that will continue to fire until mouseUp is called
      this.startMouseDownTimer('scrollDown');
      this._isScrollingDown = YES;
    } else {
      // User clicked in the track
      var scrollToClick = this.get("shouldScrollToClick");
      if (evt.altKey) scrollToClick = !scrollToClick;

      var trackLength = this.get('trackLength'),
          thumbLength = this.get('thumbLength'),
          frame = this.convertFrameFromView({ x: evt.pageX, y: evt.pageY }),
          mousePosition;

      switch (this.get('layoutDirection')) {
        case SC.LAYOUT_VERTICAL:
          this._mouseDownLocation = mousePosition = frame.y;
          break;
        case SC.LAYOUT_HORIZONTAL:
          this._mouseDownLocation = mousePosition = frame.x;
          break;
      }

      if (scrollToClick) {
        this.set('value', this.valueForPosition(mousePosition - (thumbLength / 2)));

        // and start a normal mouse down
        thumbPosition = this.get('thumbPosition');

        this._thumbDragging = YES;
        this._thumbOffset = {x: frame.x - thumbPosition, y: frame.y - thumbPosition };
        this._mouseDownLocation = {x:evt.pageX, y:evt.pageY};
        this._thumbPositionAtDragStart = thumbPosition;
        this._valueAtDragStart = this.get("value");
      } else {
        // Move the thumb up or down a page depending on whether the click
        // was above or below the thumb
        if (mousePosition < thumbPosition) {
          this.decrementProperty('value',scrollerLength);
          this.startMouseDownTimer('page');
        } else {
          this.incrementProperty('value', scrollerLength);
          this.startMouseDownTimer('page');
        }
      }

    }

    return YES;
  },

  /** @private
    When the user releases the mouse button, remove any active
    state from the button controls, and cancel any outstanding
    timers.

    @param evt {SC.Event} the mousedown event
  */
  mouseUp: function(evt) {
    var active = this._scs_buttonActive, ret = NO, timer;

    // If we have an element that was set as active in mouseDown,
    // remove its active state
    if (active) {
      active.removeClass('active');
      ret = YES;
    }

    // Stop firing repeating events after mouseup
    timer = this._mouseDownTimer;
    if (timer) {
      timer.invalidate();
      this._mouseDownTimer = null;
    }

    this._thumbDragging = NO;
    this._isScrollingDown = NO;
    this._isScrollingUp = NO;

    return ret;
  },

  /** @private
    If the user began the drag on the thumb, we calculate the difference
    between the mouse position at click and where it is now.  We then
    offset the thumb by that amount, within the bounds of the track.

    If the user began scrolling up/down using the buttons, this will track
    what component they are currently over, changing the scroll direction.

    @param evt {SC.Event} the mousedragged event
  */
  mouseDragged: function(evt) {
    var value, length, delta, thumbPosition,
        target = evt.target,
        thumbPositionAtDragStart = this._thumbPositionAtDragStart,
        isScrollingUp = this._isScrollingUp,
        isScrollingDown = this._isScrollingDown,
        active = this._scs_buttonActive,
        timer;

    // Only move the thumb if the user clicked on the thumb during mouseDown
    if (this._thumbDragging) {

      switch (this.get('layoutDirection')) {
        case SC.LAYOUT_VERTICAL:
          delta = (evt.pageY - this._mouseDownLocation.y);
          break;
        case SC.LAYOUT_HORIZONTAL:
          delta = (evt.pageX - this._mouseDownLocation.x);
          break;
      }

      // if we are in alt now, but were not before, update the old thumb position to the new one
      if (evt.altKey) {
        if (!this._altIsDown || (this._shiftIsDown !== evt.shiftKey)) {
          thumbPositionAtDragStart = this._thumbPositionAtDragStart = thumbPositionAtDragStart+delta;
          delta = 0;
          this._mouseDownLocation = { x: evt.pageX, y: evt.pageY };
          this._valueAtDragStart = this.get("value");
        }

        // because I feel like it. Probably almost no one will find this tiny, buried feature.
        // Too bad.
        if (evt.shiftKey) delta = -delta;

        this.set('value', Math.round(this._valueAtDragStart + delta * 2));
      } else {
        thumbPosition = thumbPositionAtDragStart + delta;
        length = this.get('trackLength') - this.get('thumbLength');
        this.set('value', Math.round( (thumbPosition/length) * this.get('maximum')));
      }

    } else if (isScrollingUp || isScrollingDown) {
      var nowScrollingUp = NO, nowScrollingDown = NO;

      var topButtonRect = this.$('.button-top')[0].getBoundingClientRect();
      var bottomButtonRect = this.$('.button-bottom')[0].getBoundingClientRect();

      switch (this.get('layoutDirection')) {
        case SC.LAYOUT_VERTICAL:
          if (evt.clientY < topButtonRect.bottom) nowScrollingUp = YES;
          else nowScrollingDown = YES;
          break;
        case SC.LAYOUT_HORIZONTAL:
          if (evt.clientX < topButtonRect.right) nowScrollingUp = YES;
          else nowScrollingDown = YES;
          break;
      }

      if ((nowScrollingUp || nowScrollingDown) && nowScrollingUp !== isScrollingUp){
        //
        // STOP OLD
        //

        // If we have an element that was set as active in mouseDown,
        // remove its active state
        if (active) {
         active.removeClass('active');
        }

        // Stop firing repeating events after mouseup
        this._mouseDownTimerAction = nowScrollingUp ? "scrollUp" : "scrollDown";

        if (nowScrollingUp) {
          this.makeButtonActive('.button-top');
        } else if (nowScrollingDown) {
          this.makeButtonActive('.button-bottom');
        }

         this._isScrollingUp = nowScrollingUp;
         this._isScrollingDown = nowScrollingDown;
      }
    }


    this._altIsDown = evt.altKey;
    this._shiftIsDown = evt.shiftKey;
    return YES;
  },

  /** @private
    Starts a timer that fires after 300ms.  This is called when the user
    clicks a button or inside the track to move a page at a time. If they
    continue holding the mouse button down, we want to repeat that action
    after a small delay.  This timer will be invalidated in mouseUp.

    Specify "immediate" as YES if it should not wait.
  */
  startMouseDownTimer: function(action, immediate) {
    var timer;

    this._mouseDownTimerAction = action;
    this._mouseDownTimer = SC.Timer.schedule({
      target: this, action: this.mouseDownTimerDidFire, interval: immediate ? 0 : 300
    });
  },

  /** @private
    Called by the mousedown timer.  This method determines the initial
    user action and repeats it until the timer is invalidated in mouseUp.
  */
  mouseDownTimerDidFire: function() {
    var scrollerLength = this.get('scrollerLength'),
        mouseLocation = SC.device.get('mouseLocation'),
        thumbPosition = this.get('thumbPosition'),
        thumbLength = this.get('thumbLength'),
        timerInterval = 50;

    switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        mouseLocation = this.convertFrameFromView(mouseLocation).y;
        break;
      case SC.LAYOUT_HORIZONTAL:
        mouseLocation = this.convertFrameFromView(mouseLocation).x;
        break;
    }

    switch (this._mouseDownTimerAction) {
      case 'scrollDown':
        this.incrementProperty('value', this._altIsDown ? scrollerLength : 30);
        break;
      case 'scrollUp':
        this.decrementProperty('value', this._altIsDown ? scrollerLength : 30);
        break;
      case 'page':
        timerInterval = 150;
        if (mouseLocation < thumbPosition) {
          this.decrementProperty('value', scrollerLength);
        } else if (mouseLocation > thumbPosition+thumbLength) {
          this.incrementProperty('value', scrollerLength);
        }
    }

    this._mouseDownTimer = SC.Timer.schedule({
      target: this, action: this.mouseDownTimerDidFire, interval: timerInterval
    });
  },

  /** @private
    Given a selector, finds the corresponding DOM element and adds
    the 'active' class name.  Also stores the returned element so that
    the 'active' class name can be removed during mouseup.

    @param {String} the selector to find
  */
  makeButtonActive: function(selector) {
    this._scs_buttonActive = this.$(selector).addClass('active');
  }
});

// TODO: Use render delegates to handle rendering.

/**
  @class
  @extends SC.ScrollerView
*/
SC.TouchScrollerView = SC.ScrollerView.extend(
/** @scope SC.TouchScrollerView.prototype */{

  /**
    @type Array
    @default ['sc-touch-scroller-view']
    @see SC.View#classNames
  */
  classNames: ['sc-touch-scroller-view'],

  /**
    @type Number
    @default 12
  */
  scrollbarThickness: 12,

  /**
    @type Number
    @default 5
  */
  capLength: 5,

  /**
    @type Number
    @default 0
  */
  capOverlap: 0,

  /**
    @type Boolean
    @default NO
  */
  hasButtons: NO,

  /**
    @type Number
    @default 36
  */
  buttonOverlap: 36,

  /** @private */
  adjustThumb: function(thumb, position, length) {
    var thumbInner = this.$('.thumb-inner');
    var max = this.get("scrollerLength") - this.capLength, min = this.get("minimum") + this.capLength;

    if (position + length > max) {
      position = Math.min(max - 20, position);
      length = max - position;
    }

    if (position < min) {
      length -= min - position;
      position = min;
    }

    switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        if (this._thumbPosition !== position) thumb.css('-webkit-transform', 'translate3d(0px,' + position + 'px,0px)');
        if (this._thumbSize !== length) {
          thumbInner.css('-webkit-transform', 'translate3d(0px,' + Math.round(length - 1044) + 'px,0px)');
        }
        break;
      case SC.LAYOUT_HORIZONTAL:
        if (this._thumbPosition !== position) thumb.css('-webkit-transform', 'translate3d(' + position + 'px,0px,0px)');
        if (this._thumbSize !== length) {
          thumbInner.css('-webkit-transform', 'translate3d(' + Math.round(length - 1044) + 'px,0px,0px)');
        }
        break;
    }

    this._thumbPosition = position;
    this._thumbSize = length;
  },

  /** @private */
  render: function(context, firstTime) {
    var classNames = [],
        thumbPosition, thumbLength, thumbCenterLength, thumbElement,
        value, max, scrollerLength, length, pct;

    // We set a class name depending on the layout direction so that we can
    // style them differently using CSS.
    switch (this.get('layoutDirection')) {
      case SC.LAYOUT_VERTICAL:
        classNames.push('sc-vertical');
        break;
      case SC.LAYOUT_HORIZONTAL:
        classNames.push('sc-horizontal');
        break;
    }

    // The appearance of the scroller changes if disabled
    if (!this.get('isEnabled')) classNames.push('disabled');
    // Whether to hide the thumb and buttons
    if (this.get('controlsHidden')) classNames.push('controls-hidden');

    // Change the class names of the DOM element all at once to improve
    // performance
    context.addClass(classNames);

    // Calculate the position and size of the thumb
    thumbLength = this.get('thumbLength');
    thumbPosition = this.get('thumbPosition');

    // If this is the first time, generate the actual HTML
    if (firstTime) {
      context.push('<div class="track"></div>'+
                    '<div class="cap"></div>');
      this.renderButtons(context, this.get('hasButtons'));
      this.renderThumb(context, this.get('layoutDirection'), thumbLength);
    }

    else {
      // The HTML has already been generated, so all we have to do is
      // reposition and resize the thumb

      // If we aren't displaying controls don't bother
      if (this.get('controlsHidden')) return;

      thumbElement = this.$('.thumb');

      this.adjustThumb(thumbElement, thumbPosition, thumbLength);
    }
  },

  renderThumb: function(context, layoutDirection, thumbLength) {
    // where is this magic number from?
    thumbLength -= 1044;
    layoutDirection = (layoutDirection === SC.LAYOUT_HORIZONTAL ? 'X' : 'Y');

    context.push('<div class="thumb">'+
                 '<div class="thumb-top"></div>'+
                 '<div class="thumb-clip">'+
                 '<div class="thumb-inner" style="-webkit-transform: translate%@(%@px);">'.fmt(layoutDirection, thumbLength)+
                 '<div class="thumb-center"></div>'+
                 '<div class="thumb-bottom"></div></div></div></div>');

  }
});

/* >>>>>>>>>> BEGIN source/views/scroll.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/scroller');

/**
  @static
  @type Number
  @default 0.95
*/
SC.NORMAL_SCROLL_DECELERATION = 0.95;

/**
  @static
  @type Number
  @default 0.85
*/
SC.FAST_SCROLL_DECELERATION = 0.85;

/** @class
  Implements a complete scroll view.  This class uses a manual implementation
  of scrollers in order to properly support clipping frames.

  Important Events:

    - contentView frame size changes (to autoshow/hide scrollbar - adjust scrollbar size)
    - horizontalScrollOffset change
    - verticalScrollOffsetChanges
    - scroll wheel events

  @extends SC.View
  @since SproutCore 1.0
*/
SC.ScrollView = SC.View.extend({
/** @scope SC.ScrollView.prototype */

  /**
    @type Array
    @default ['sc-scroll-view']
    @see SC.View#classNames
  */
  classNames: ['sc-scroll-view'],

  // ..........................................................
  // PROPERTIES
  //

  /**
    Walk like a duck

    @type Boolean
    @default YES
    @readOnly
  */
  isScrollable: YES,

  /**
    The content view you want the scroll view to manage. This will be assigned to the contentView of the clipView also.

    @type SC.View
    @default null
  */
  contentView: null,

  /**
    The horizontal alignment for non-filling content inside of the ScrollView. Possible values:

      - SC.ALIGN_LEFT
      - SC.ALIGN_RIGHT
      - SC.ALIGN_CENTER

    @type String
    @default SC.ALIGN_LEFT
  */
  horizontalAlign: SC.ALIGN_LEFT,

  /**
    The vertical alignment for non-filling content inside of the ScrollView. Possible values:

      - SC.ALIGN_TOP
      - SC.ALIGN_BOTTOM
      - SC.ALIGN_MIDDLE

    @type String
    @default SC.ALIGN_TOP
  */
  verticalAlign: SC.ALIGN_TOP,

  /**
    The current horizontal scroll offset. Changing this value will update both the contentView and the horizontal scroller, if there is one.

    @field
    @type Number
    @default 0
  */
  horizontalScrollOffset: function(key, value) {
    if (value !== undefined) {
      var minOffset = this.minimumHorizontalScrollOffset(),
          maxOffset = this.get('maximumHorizontalScrollOffset');
      this._scroll_horizontalScrollOffset = Math.max(minOffset,Math.min(maxOffset, value)) ;
    }

    return this._scroll_horizontalScrollOffset||0;
  }.property().cacheable(),

  /**
    The current vertical scroll offset.  Changing this value will update both the contentView and the vertical scroller, if there is one.

    @field
    @type Number
    @default 0
  */
  verticalScrollOffset: function(key, value) {
    if (value !== undefined) {
      var minOffset = this.get('minimumVerticalScrollOffset'),
          maxOffset = this.get('maximumVerticalScrollOffset');
      this._scroll_verticalScrollOffset = Math.max(minOffset,Math.min(maxOffset, value)) ;
    }

    return this._scroll_verticalScrollOffset||0;
  }.property().cacheable(),

  /** @private
    Calculates the maximum offset given content and container sizes, and the
    alignment.
  */
  maximumScrollOffset: function(contentSize, containerSize, align) {
    // if our content size is larger than or the same size as the container, it's quite
    // simple to calculate the answer. Otherwise, we need to do some fancy-pants
    // alignment logic (read: simple math)
    if (contentSize >= containerSize) return contentSize - containerSize;

    // alignment, yeah
    if (align === SC.ALIGN_LEFT || align === SC.ALIGN_TOP) {
      // if we left-align something, and it is smaller than the view, does that not mean
      // that it's maximum (and minimum) offset is 0, because it should be positioned at 0?
      return 0;
    } else if (align === SC.ALIGN_MIDDLE || align === SC.ALIGN_CENTER) {
      // middle align means the difference divided by two, because we want equal parts on each side.
      return 0 - Math.round((containerSize - contentSize) / 2);
    } else {
      // right align means the entire difference, because we want all that space on the left
      return 0 - (containerSize - contentSize);
    }
  },

  /** @private
    Calculates the minimum offset given content and container sizes, and the
    alignment.
  */
  minimumScrollOffset: function(contentSize, containerSize, align) {
    // if the content is larger than the container, we have no need to change the minimum
    // away from the natural 0 position.
    if (contentSize > containerSize) return 0;

    // alignment, yeah
    if (align === SC.ALIGN_LEFT || align === SC.ALIGN_TOP) {
      // if we left-align something, and it is smaller than the view, does that not mean
      // that it's maximum (and minimum) offset is 0, because it should be positioned at 0?
      return 0;
    } else if (align === SC.ALIGN_MIDDLE || align === SC.ALIGN_CENTER) {
      // middle align means the difference divided by two, because we want equal parts on each side.
      return 0 - Math.round((containerSize - contentSize) / 2);
    } else {
      // right align means the entire difference, because we want all that space on the left
      return 0 - (containerSize - contentSize);
    }
  },

  /**
    The maximum horizontal scroll offset allowed given the current contentView
    size and the size of the scroll view.  If horizontal scrolling is
    disabled, this will always return 0.

    @field
    @type Number
    @default 0
  */
  maximumHorizontalScrollOffset: function() {
    var view = this.get('contentView') ;
    var contentWidth = view ? view.get('frame').width : 0,
        calculatedWidth = view ? view.get('calculatedWidth') : 0;

    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if (calculatedWidth) {
      contentWidth = view.calculatedWidth;
    }
    contentWidth *= this._scale;

    var containerWidth = this.get('containerView').get('frame').width ;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollHorizontal')) contentWidth = Math.min(contentWidth, containerWidth);
    return this.maximumScrollOffset(contentWidth, containerWidth, this.get("horizontalAlign"));
  }.property(),

  /**
    The maximum vertical scroll offset allowed given the current contentView
    size and the size of the scroll view.  If vertical scrolling is disabled,
    this will always return 0 (or whatever alignment dictates).

    @field
    @type Number
    @default 0
  */
  maximumVerticalScrollOffset: function() {
    var view = this.get('contentView'),
        contentHeight = (view && view.get('frame')) ? view.get('frame').height : 0,
        calculatedHeight = view ? view.get('calculatedHeight') : 0;

    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if(calculatedHeight){
      contentHeight = calculatedHeight;
    }
    contentHeight *= this._scale;

    var containerHeight = this.get('containerView').get('frame').height ;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollVertical')) contentHeight = Math.min(contentHeight, containerHeight);
    return this.maximumScrollOffset(contentHeight, containerHeight, this.get("verticalAlign"));
  }.property(),


  /**
    The minimum horizontal scroll offset allowed given the current contentView
    size and the size of the scroll view.  If horizontal scrolling is
    disabled, this will always return 0 (or whatever alignment dictates).

    @field
    @type Number
    @default 0
  */
  minimumHorizontalScrollOffset: function() {
    var view = this.get('contentView') ;
    var contentWidth = view ? view.get('frame').width : 0,
        calculatedWidth = view ? view.get('calculatedWidth') : 0;
    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if(calculatedWidth){
      contentWidth = calculatedWidth;
    }
    contentWidth *= this._scale;

    var containerWidth = this.get('containerView').get('frame').width ;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollHorizontal')) contentWidth = Math.min(contentWidth, containerWidth);
    return this.minimumScrollOffset(contentWidth, containerWidth, this.get("horizontalAlign"));
  }.property(),

  /**
    The minimum vertical scroll offset allowed given the current contentView
    size and the size of the scroll view.  If vertical scrolling is disabled,
    this will always return 0 (or whatever alignment dictates).

    @field
    @type Number
    @default 0
  */
  minimumVerticalScrollOffset: function() {
    var view = this.get('contentView') ;
    var contentHeight = (view && view.get('frame')) ? view.get('frame').height : 0,
        calculatedHeight = view ? view.get('calculatedHeight') : 0;

    // The following code checks if there is a calculatedWidth (collections)
    // to avoid looking at the incorrect value calculated by frame.
    if(calculatedHeight){
      contentHeight = view.calculatedHeight;
    }
    contentHeight *= this._scale;

    var containerHeight = this.get('containerView').get('frame').height ;

    // we still must go through minimumScrollOffset even if we can't scroll
    // because we need to adjust for alignment. So, just make sure it won't allow scrolling.
    if (!this.get('canScrollVertical')) contentHeight = Math.min(contentHeight, containerHeight);
    return this.minimumScrollOffset(contentHeight, containerHeight, this.get("verticalAlign"));
  }.property(),


  /**
    Amount to scroll one vertical line.

    Used by the default implementation of scrollDownLine() and scrollUpLine().

    @type Number
    @default 20
  */
  verticalLineScroll: 20,

  /**
    Amount to scroll one horizontal line.

    Used by the default implementation of scrollLeftLine() and
    scrollRightLine().

    @type Number
    @default 20
  */
  horizontalLineScroll: 20,

  /**
    Amount to scroll one vertical page.

    Used by the default implementation of scrollUpPage() and scrollDownPage().

    @field
    @type Number
    @default value of frame.height
    @observes frame
  */
  verticalPageScroll: function() {
    return this.get('frame').height;
  }.property('frame'),

  /**
    Amount to scroll one horizontal page.

    Used by the default implementation of scrollLeftPage() and
    scrollRightPage().

    @field
    @type Number
    @default value of frame.width
    @observes frame
  */
  horizontalPageScroll: function() {
    return this.get('frame').width;
  }.property('frame'),


  // ..........................................................
  // SCROLLERS
  //

  /**
    YES if the view should maintain a horizontal scroller.   This property
    must be set when the view is created.

    @type Boolean
    @default YES
  */
  hasHorizontalScroller: YES,

  /**
    The horizontal scroller view class. This will be replaced with a view
    instance when the ScrollView is created unless hasHorizontalScroller is
    NO.

    @type SC.View
    @default SC.ScrollerView
  */
  horizontalScrollerView: SC.ScrollerView,

  /**
    The horizontal scroller view for touch. This will be replaced with a view
    instance when touch is enabled when the ScrollView is created unless
    hasHorizontalScroller is NO.

    @type SC.View
    @default SC.TouchScrollerView
  */
  horizontalTouchScrollerView: SC.TouchScrollerView,

  /**
    YES if the horizontal scroller should be visible.  You can change this
    property value anytime to show or hide the horizontal scroller.  If you
    do not want to use a horizontal scroller at all, you should instead set
    hasHorizontalScroller to NO to avoid creating a scroller view in the
    first place.

    @type Boolean
    @default YES
  */
  isHorizontalScrollerVisible: YES,

  /**
    Returns YES if the view both has a horizontal scroller, the scroller is
    visible.

    @field
    @type Boolean
    @default YES
  */
  canScrollHorizontal: function() {
    return !!(this.get('hasHorizontalScroller') &&
      this.get('horizontalScrollerView') &&
      this.get('isHorizontalScrollerVisible')) ;
  }.property('isHorizontalScrollerVisible').cacheable(),

  /**
    If YES, the horizontal scroller will autohide if the contentView is
    smaller than the visible area.  You must set hasHorizontalScroller to YES
    for this property to have any effect.

    @type Boolean
    @default YES
  */
  autohidesHorizontalScroller: YES,

  /**
    YES if the view should maintain a vertical scroller.   This property must
    be set when the view is created.

    @type Boolean
    @default YES
  */
  hasVerticalScroller: YES,

  /**
    The vertical scroller view class. This will be replaced with a view
    instance when the ScrollView is created unless hasVerticalScroller is NO.

    @type SC.View
    @default SC.ScrollerView
  */
  verticalScrollerView: SC.ScrollerView,

  /**
    The vertical touch scroller view class. This will be replaced with a view
    instance when the ScrollView is created.

    @type SC.View
    @default SC.TouchScrollerView
  */
  verticalTouchScrollerView: SC.TouchScrollerView,

  /**
    YES if the vertical scroller should be visible.  You can change this
    property value anytime to show or hide the vertical scroller.  If you do
    not want to use a vertical scroller at all, you should instead set
    hasVerticalScroller to NO to avoid creating a scroller view in the first
    place.

    @type Boolean
    @default YES
  */
  isVerticalScrollerVisible: YES,

  /**
    Returns YES if the view both has a horizontal scroller, the scroller is
    visible.

    @field
    @type Boolean
    @default YES
  */
  canScrollVertical: function() {
    return !!(this.get('hasVerticalScroller') &&
      this.get('verticalScrollerView') &&
      this.get('isVerticalScrollerVisible')) ;
  }.property('isVerticalScrollerVisible').cacheable(),

  /**
    If YES, the vertical scroller will autohide if the contentView is
    smaller than the visible area.  You must set hasVerticalScroller to YES
    for this property to have any effect.

    @type Boolean
    @default YES
  */
  autohidesVerticalScroller: YES,

  /**
    Use this property to set the 'bottom' offset of your vertical scroller,
    to make room for a thumb view or other accessory view. Default is 0.

    @type Number
    @default 0
  */
  verticalScrollerBottom: 0,

  /**
    Use this to overlay the vertical scroller.

    This ensures that the container frame will not resize to accommodate the
    vertical scroller, hence overlaying the scroller on top of
    the container.

    @field
    @type Boolean
    @default NO
  */
  verticalOverlay: function() {
    if (SC.platform.touch) return YES;
    return NO;
  }.property().cacheable(),

  /**
    Use this to overlay the horizontal scroller.

    This ensures that the container frame will not resize to accommodate the
    horizontal scroller, hence overlaying the scroller on top of
    the container

    @field
    @type Boolean
    @default NO
  */
  horizontalOverlay: function() {
    if (SC.platform.touch) return YES;
    return NO;
  }.property().cacheable(),

  /**
    Use to control the positioning of the vertical scroller.  If you do not
    set 'verticalOverlay' to YES, then the content view will be automatically
    sized to meet the left edge of the vertical scroller, wherever it may be.
    This allows you to easily, for example, have “one pixel higher and one
    pixel lower” scroll bars that blend into their parent views.

    If you do set 'verticalOverlay' to YES, then the scroller view will
    “float on top” of the content view.

    Example: { top: -1, bottom: -1, right: 0 }

    @type Hash
    @default null
  */
  verticalScrollerLayout: null,

  /**
    Use to control the positioning of the horizontal scroller.  If you do not
    set 'horizontalOverlay' to YES, then the content view will be
    automatically sized to meet the top edge of the horizontal scroller,
    wherever it may be.

    If you do set 'horizontalOverlay' to YES, then the scroller view will
    “float on top” of the content view.

    Example: { left: 0, bottom: 0, right: 0 }

    @type Hash
    @default null
  */
  horizontalScrollerLayout: null,

  // ..........................................................
  // CUSTOM VIEWS
  //

  /**
    The container view that will contain your main content view.  You can
    replace this property with your own custom subclass if you prefer.

    @type SC.ContainerView
    @default SC.ConainerView
  */
  containerView: SC.ContainerView.extend({}),


  // ..........................................................
  // METHODS
  //

  /**
    Scrolls the receiver to the specified x,y coordinate.  This should be the
    offset into the contentView you want to appear at the top-left corner of
    the scroll view.

    This method will contain the actual scroll based on whether the view
    can scroll in the named direction and the maximum distance it can
    scroll.

    If you only want to scroll in one direction, pass null for the other
    direction.  You can also optionally pass a Hash for the first parameter
    with x and y coordinates.

    @param {Number} x the x scroll location
    @param {Number} y the y scroll location
    @returns {SC.ScrollView} receiver
  */
  scrollTo: function(x,y) {
    // normalize params
    if (y===undefined && SC.typeOf(x) === SC.T_HASH) {
      y = x.y; x = x.x;
    }

    if (!SC.none(x)) {
      this.set('horizontalScrollOffset', x) ;
    }

    if (!SC.none(y)) {
      this.set('verticalScrollOffset', y) ;
    }

    return this ;
  },

  /**
    Scrolls the receiver in the horizontal and vertical directions by the
    amount specified, if allowed.  The actual scroll amount will be
    constrained by the current scroll view settings.

    If you only want to scroll in one direction, pass null or 0 for the other
    direction.  You can also optionally pass a Hash for the first parameter
    with x and y coordinates.

    @param {Number} x change in the x direction (or hash)
    @param {Number} y change in the y direction
    @returns {SC.ScrollView} receiver
  */
  scrollBy: function(x , y) {
    // normalize params
    if (y===undefined && SC.typeOf(x) === SC.T_HASH) {
      y = x.y; x = x.x;
    }

    // if null, undefined, or 0, pass null; otherwise just add current offset
    x = (x) ? this.get('horizontalScrollOffset')+x : null ;
    y = (y) ? this.get('verticalScrollOffset')+y : null ;
    return this.scrollTo(x,y) ;
  },

  /**
    Scroll the view to make the view's frame visible.  For this to make sense,
    the view should be a subview of the contentView.  Otherwise the results
    will be undefined.

    @param {SC.View} view view to scroll or null to scroll receiver visible
    @returns {Boolean} YES if scroll position was changed
  */
  scrollToVisible: function(view) {

    // if no view is passed, do default
    if (arguments.length === 0) return arguments.callee.base.apply(this,arguments);

    var contentView = this.get('contentView') ;
    if (!contentView) return NO; // nothing to do if no contentView.

    // get the frame for the view - should work even for views with static
    // layout, assuming it has been added to the screen.
    var vf = view.get('frame');
    if (!vf) return NO; // nothing to do

    // convert view's frame to an offset from the contentView origin.  This
    // will become the new scroll offset after some adjustment.
    vf = contentView.convertFrameFromView(vf, view.get('parentView')) ;

    return this.scrollToRect(vf);
  },

  /**
    Scroll to the supplied rectangle.
    @param {Rect} rect Rectangle to scroll to.
    @returns {Boolean} YES if scroll position was changed.
  */
  scrollToRect: function(rect) {
    // find current visible frame.
    var vo = SC.cloneRect(this.get('containerView').get('frame')) ;

    vo.x = this.get('horizontalScrollOffset') ;
    vo.y = this.get('verticalScrollOffset') ;

    var origX = vo.x, origY = vo.y;

    // if top edge is not visible, shift origin
    vo.y -= Math.max(0, SC.minY(vo) - SC.minY(rect)) ;
    vo.x -= Math.max(0, SC.minX(vo) - SC.minX(rect)) ;

    // if bottom edge is not visible, shift origin
    vo.y += Math.max(0, SC.maxY(rect) - SC.maxY(vo)) ;
    vo.x += Math.max(0, SC.maxX(rect) - SC.maxX(vo)) ;

    // scroll to that origin.
    if ((origX !== vo.x) || (origY !== vo.y)) {
      this.scrollTo(vo.x, vo.y);
      return YES ;
    } else return NO;
  },


  /**
    Scrolls the receiver down one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollDownLine: function(lines) {
    if (lines === undefined) lines = 1 ;
    return this.scrollBy(null, this.get('verticalLineScroll')*lines) ;
  },

  /**
    Scrolls the receiver up one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollUpLine: function(lines) {
    if (lines === undefined) lines = 1 ;
    return this.scrollBy(null, 0-this.get('verticalLineScroll')*lines) ;
  },

  /**
    Scrolls the receiver right one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollRightLine: function(lines) {
    if (lines === undefined) lines = 1 ;
    return this.scrollTo(this.get('horizontalLineScroll')*lines, null) ;
  },

  /**
    Scrolls the receiver left one or more lines if allowed.  If number of
    lines is not specified, scrolls one line.

    @param {Number} lines number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollLeftLine: function(lines) {
    if (lines === undefined) lines = 1 ;
    return this.scrollTo(0-this.get('horizontalLineScroll')*lines, null) ;
  },

  /**
    Scrolls the receiver down one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollDownPage: function(pages) {
    if (pages === undefined) pages = 1 ;
    return this.scrollBy(null, this.get('verticalPageScroll')*pages) ;
  },

  /**
    Scrolls the receiver up one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollUpPage: function(pages) {
    if (pages === undefined) pages = 1 ;
    return this.scrollBy(null, 0-(this.get('verticalPageScroll')*pages)) ;
  },

  /**
    Scrolls the receiver right one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollRightPage: function(pages) {
    if (pages === undefined) pages = 1 ;
    return this.scrollBy(this.get('horizontalPageScroll')*pages, null) ;
  },

  /**
    Scrolls the receiver left one or more page if allowed.  If number of
    pages is not specified, scrolls one page.  The page size is determined by
    the verticalPageScroll value.  By default this is the size of the current
    scrollable area.

    @param {Number} pages number of lines
    @returns {SC.ScrollView} receiver
  */
  scrollLeftPage: function(pages) {
    if (pages === undefined) pages = 1 ;
    return this.scrollBy(0-(this.get('horizontalPageScroll')*pages), null) ;
  },

  /** @private
    Adjusts the layout for the various internal views.  This method is called
    once when the scroll view is first configured and then anytime a scroller
    is shown or hidden.  You can call this method yourself as well to retile.

    You may also want to override this method to handle layout for any
    additional controls you have added to the view.
  */
  tile: function() {
    // get horizontal scroller/determine if we should have a scroller
    var hscroll = this.get('hasHorizontalScroller') ? this.get('horizontalScrollerView') : null ;
    var hasHorizontal = hscroll && this.get('isHorizontalScrollerVisible');

    // get vertical scroller/determine if we should have a scroller
    var vscroll = this.get('hasVerticalScroller') ? this.get('verticalScrollerView') : null ;
    var hasVertical = vscroll && this.get('isVerticalScrollerVisible') ;

    // get the containerView
    var clip = this.get('containerView') ;
    var clipLayout = { left: 0, top: 0 } ;
    var t, layout, vo, ho, vl, hl;

    var ht = ((hasHorizontal) ? hscroll.get('scrollbarThickness') : 0) ;
    var vt = (hasVertical) ?   vscroll.get('scrollbarThickness') : 0 ;

    if (hasHorizontal) {
      hl     = this.get('horizontalScrollerLayout');
      layout = {
        left: (hl ? hl.left : 0),
        bottom: (hl ? hl.bottom : 0),
        right: (hl ? hl.right + vt-1 : vt-1),
        height: ht
      };
      hscroll.set('layout', layout) ;
      ho = this.get('horizontalOverlay');
      clipLayout.bottom = ho ? 0 : (layout.bottom + ht) ;
    } else {
      clipLayout.bottom = 0 ;
    }
    if (hscroll) hscroll.set('isVisible', hasHorizontal) ;

    if (hasVertical) {
      ht     = ht + this.get('verticalScrollerBottom') ;
      vl     = this.get('verticalScrollerLayout');
      layout = {
        top: (vl ? vl.top : 0),
        bottom: (vl ? vl.bottom + ht : ht),
        right: (vl ? vl.right : 0),
        width: vt
      };
      vscroll.set('layout', layout) ;
      vo = this.get('verticalOverlay');
      clipLayout.right = vo ? 0 : (layout.right + vt) ;
    } else {
      clipLayout.right = 0 ;
    }
    if (vscroll) vscroll.set('isVisible', hasVertical) ;

    clip.adjust(clipLayout) ;
  },

  /** @private
    Called whenever a scroller visibility changes.  Calls the tile() method.
  */
  scrollerVisibilityDidChange: function() {
    this.tile();
  }.observes('isVerticalScrollerVisible', 'isHorizontalScrollerVisible'),

  // ..........................................................
  // SCROLL WHEEL SUPPORT
  //

  /** @private */
  _scroll_wheelDeltaX: 0,

  /** @private */
  _scroll_wheelDeltaY: 0,

  /** @private */
  mouseWheel: function(evt) {
    var horizontalScrollOffset = this.get('horizontalScrollOffset'),
        maximumHorizontalScrollOffset = this.get('maximumHorizontalScrollOffset'),
        maximumVerticalScrollOffset = this.get('maximumVerticalScrollOffset'),
        shouldScroll = NO,
        verticalScrollOffset = this.get('verticalScrollOffset');

    // Only attempt to scroll if we are allowed to scroll in the direction and
    // have room to scroll in the direction.  Otherwise, ignore the event so
    // that an outer ScrollView may capture it.
    shouldScroll = ((this.get('canScrollHorizontal') &&
        (evt.wheelDeltaX < 0 && horizontalScrollOffset > 0) ||
        (evt.wheelDeltaX > 0 && horizontalScrollOffset < maximumHorizontalScrollOffset)) ||
        (this.get('canScrollVertical') &&
        (evt.wheelDeltaY < 0 && verticalScrollOffset > 0) ||
        (evt.wheelDeltaY > 0 && verticalScrollOffset < maximumVerticalScrollOffset)));

    if (shouldScroll) {
      this._scroll_wheelDeltaX += evt.wheelDeltaX;
      this._scroll_wheelDeltaY += evt.wheelDeltaY;

      this.invokeLater(this._scroll_mouseWheel, 10);
    }

    return shouldScroll;
  },

  /** @private */
  _scroll_mouseWheel: function() {
    this.scrollBy(this._scroll_wheelDeltaX, this._scroll_wheelDeltaY);
    if (SC.WHEEL_MOMENTUM && this._scroll_wheelDeltaY > 0) {
      this._scroll_wheelDeltaY = Math.floor(this._scroll_wheelDeltaY*0.950);
      this._scroll_wheelDeltaY = Math.max(this._scroll_wheelDeltaY, 0);
      this.invokeLater(this._scroll_mouseWheel, 10) ;
    } else if (SC.WHEEL_MOMENTUM && this._scroll_wheelDeltaY < 0){
      this._scroll_wheelDeltaY = Math.ceil(this._scroll_wheelDeltaY*0.950);
      this._scroll_wheelDeltaY = Math.min(this._scroll_wheelDeltaY, 0);
      this.invokeLater(this._scroll_mouseWheel, 10) ;
    } else {
      this._scroll_wheelDeltaY = 0;
      this._scroll_wheelDeltaX = 0;
    }
  },

  /*..............................................
    SCALING SUPPORT
  */

  /**
    Determines whether scaling is allowed.

    @type Boolean
    @default NO
  */
  canScale: NO,

  /** @private
    The current scale.
  */
  _scale: 1.0,

  /**
    @field
    @type Number
    @default 1.0
  */
  scale: function(key, value) {
    if (value !== undefined) {
      this._scale = Math.min(Math.max(this.get("minimumScale"), value), this.get("maximumScale"));
    }
    return this._scale;
  }.property().cacheable(),

  /**
    The minimum scale.

    @type Number
    @default 0.25
  */
  minimumScale: 0.25,

  /**
    The maximum scale.

    @type Number
    @default 2.0
  */
  maximumScale: 2.0,

  /**
    Whether to automatically determine the scale range based on the size of the content.

    @type Boolean
    @default NO
  */
  autoScaleRange: NO,

  /** @private */
  _scale_css: "",

  /** @private */
  updateScale: function(scale) {
    var contentView = this.get("contentView");
    if (!contentView) return;

    if (contentView.isScalable) {
      this.get("contentView").applyScale(scale);
      this._scale_css = "";
    } else {
      this._scale_css = "scale3d(" + scale + ", " + scale + ", 1)";
    }
  },


  // ..........................................................
  // Touch Support
  //

  /**
    @type Boolean
    @default YES
    @readOnly
  */
  acceptsMultitouch: YES,

  /**
    The scroll deceleration rate.

    @type Number
    @default SC.NORMAL_SCROLL_DECELERATION
  */
  decelerationRate: SC.NORMAL_SCROLL_DECELERATION,

  /**
    If YES, bouncing will always be enabled in the horizontal direction, even if the content
    is smaller or the same size as the view.

    @type Boolean
    @default NO
  */
  alwaysBounceHorizontal: NO,

  /**
    If NO, bouncing will not be enabled in the vertical direction when the content is smaller
    or the same size as the scroll view.

    @type Boolean
    @default YES
  */
  alwaysBounceVertical: YES,

  /**
    Whether to delay touches from passing through to the content.

    @type Boolean
    @default YES
  */
  delaysContentTouches: YES,

  /** @private
    If the view supports it, this
  */
  _touchScrollDidChange: function() {
    if (this.get("contentView").touchScrollDidChange) {
      this.get("contentView").touchScrollDidChange(
        this._scroll_horizontalScrollOffset,
        this._scroll_verticalScrollOffset
      );
    }

    // tell scrollers
    if (this.verticalScrollerView && this.verticalScrollerView.touchScrollDidChange) {
      this.verticalScrollerView.touchScrollDidChange(this._scroll_verticalScrollOffset);
    }

    if (this.horizontalScrollerView && this.horizontalScrollerView.touchScrollDidChange) {
      this.horizontalScrollerView.touchScrollDidChange(this._scroll_horizontalScrollOffset);
    }
  },

  /** @private */
  _touchScrollDidStart: function() {
    if (this.get("contentView").touchScrollDidStart) {
      this.get("contentView").touchScrollDidStart(this._scroll_horizontalScrollOffset, this._scroll_verticalScrollOffset);
    }

    // tell scrollers
    if (this.verticalScrollerView && this.verticalScrollerView.touchScrollDidStart) {
      this.verticalScrollerView.touchScrollDidStart(this._touch_verticalScrollOffset);
    }
    if (this.horizontalScrollerView && this.horizontalScrollerView.touchScrollDidStart) {
      this.horizontalScrollerView.touchScrollDidStart(this._touch_horizontalScrollOffset);
    }
  },

  /** @private */
  _touchScrollDidEnd: function() {
    if (this.get("contentView").touchScrollDidEnd) {
      this.get("contentView").touchScrollDidEnd(this._scroll_horizontalScrollOffset, this._scroll_verticalScrollOffset);
    }

    // tell scrollers
    if (this.verticalScrollerView && this.verticalScrollerView.touchScrollDidEnd) {
      this.verticalScrollerView.touchScrollDidEnd(this._touch_verticalScrollOffset);
    }

    if (this.horizontalScrollerView && this.horizontalScrollerView.touchScrollDidEnd) {
      this.horizontalScrollerView.touchScrollDidEnd(this._touch_horizontalScrollOffset);
    }
  },

  /** @private */
  _applyCSSTransforms: function(layer) {
    var transform = "";
    this.updateScale(this._scale);
    transform += 'translate3d('+ -this._scroll_horizontalScrollOffset +'px, '+ -Math.round(this._scroll_verticalScrollOffset)+'px,0) ';
    transform += this._scale_css;
    if (layer) {
      var style = layer.style;
      style.webkitTransform = transform;
      style.webkitTransformOrigin = "top left";
    }
  },

  /** @private */
  captureTouch: function(touch) {
    return YES;
  },

  /** @private */
  touchGeneration: 0,

  /** @private */
  touchStart: function(touch) {
    var generation = ++this.touchGeneration;
    if (!this.tracking && this.get("delaysContentTouches")) {
      this.invokeLater(this.beginTouchesInContent, 150, generation);
    } else if (!this.tracking) {
      // NOTE: We still have to delay because we don't want to call touchStart
      // while touchStart is itself being called...
      this.invokeLater(this.beginTouchesInContent, 1, generation);
    }
    this.beginTouchTracking(touch, YES);
    return YES;
  },

  /** @private */
  beginTouchesInContent: function(gen) {
    if (gen !== this.touchGeneration) return;

    var touch = this.touch, itemView;

    // NOTE!  On iPad it is possible that the timer set in touchStart() will not have yet fired and that touchEnd() will
    // come in in the same Run Loop as the one that started with the call to touchStart().  The bad thing that happens is that
    // even though we cleared this.touch, occasionally if touchEnd() comes in right at the end of the Run Loop and
    // then the timer expires and starts a new Run Loop to call beginTouchesInContent(), that this.touch will STILL exist
    // here.  There's no explanation for it, and it's not 100% reproducible, but what happens is that if we try to capture
    // the touch that has already ended, assignTouch() in RootResponder will check touch.hasEnded and throw an exception.

    // Therefore, don't capture a touch if the touch still exists and hasEnded
    if (touch && this.tracking && !this.dragging && !touch.touch.scrollHasEnded && !touch.touch.hasEnded) {
      // try to capture the touch
      touch.touch.captureTouch(this, YES);

      if (!touch.touch.touchResponder) {
        // if it DIDN'T WORK!!!!!
        // then we need to take possession again.
        touch.touch.makeTouchResponder(this);
      } else {
        // Otherwise, it did work, and if we had a pending scroll end, we must do it now
        if (touch.needsScrollEnd) {
          this._touchScrollDidEnd();
        }
      }
    }
  },

  /** @private
    Initializes the start state of the gesture.

    We keep information about the initial location of the touch so we can
    disambiguate between a tap and a drag.

    @param {Event} evt
  */
  beginTouchTracking: function(touch, starting) {
    var avg = touch.averagedTouchesForView(this, starting);

    var verticalScrollOffset = this._scroll_verticalScrollOffset || 0,
        horizontalScrollOffset = this._scroll_horizontalScrollOffset || 0,
        startClipOffsetX = horizontalScrollOffset,
        startClipOffsetY = verticalScrollOffset,
        needsScrollEnd = NO,
        contentWidth = 0,
        contentHeight = 0,
        viewFrame,
        view;

    if (this.touch && this.touch.timeout) {
      // clear the timeout
      clearTimeout(this.touch.timeout);
      this.touch.timeout = null;

      // get the scroll offsets
      startClipOffsetX = this.touch.startClipOffset.x;
      startClipOffsetY = this.touch.startClipOffset.y;
      needsScrollEnd = YES;
    }

    // calculate container+content width/height
    view = this.get('contentView') ;

    if(view){
      viewFrame = view.get('frame');
      contentWidth = viewFrame.width;
      contentHeight = viewFrame.height;
    }

    if(view.calculatedWidth && view.calculatedWidth!==0) contentWidth = view.calculatedWidth;
    if (view.calculatedHeight && view.calculatedHeight !==0) contentHeight = view.calculatedHeight;

    var containerFrame = this.get('containerView').get('frame'),
        containerWidth = containerFrame.width,
        containerHeight = containerFrame.height;


    // calculate position in content
    var globalFrame = this.convertFrameToView(this.get("frame"), null),
        positionInContentX = (horizontalScrollOffset + (avg.x - globalFrame.x)) / this._scale,
        positionInContentY = (verticalScrollOffset + (avg.y - globalFrame.y)) / this._scale;

    this.touch = {
      startTime: touch.timeStamp,
      notCalculated: YES,

      enableScrolling: {
        x: contentWidth * this._scale > containerWidth || this.get("alwaysBounceHorizontal"),
        y: contentHeight * this._scale > containerHeight || this.get("alwaysBounceVertical")
      },
      scrolling: { x: NO, y: NO },

      enableBouncing: SC.platform.bounceOnScroll,

      // offsets and velocities
      startClipOffset: { x: startClipOffsetX, y: startClipOffsetY },
      lastScrollOffset: { x: horizontalScrollOffset, y: verticalScrollOffset },
      startTouchOffset: { x: avg.x, y: avg.y },
      scrollVelocity: { x: 0, y: 0 },

      startTouchOffsetInContent: { x: positionInContentX, y: positionInContentY },

      containerSize: { width: containerWidth, height: containerHeight },
      contentSize: { width: contentWidth, height: contentHeight },

      startScale: this._scale,
      startDistance: avg.d,
      canScale: this.get("canScale") && SC.platform.pinchToZoom,
      minimumScale: this.get("minimumScale"),
      maximumScale: this.get("maximumScale"),

      globalFrame: globalFrame,

      // cache some things
      layer: view.get('layer'), //contentView

      // some constants
      resistanceCoefficient: 0.998,
      resistanceAsymptote: 320,
      decelerationFromEdge: 0.05,
      accelerationToEdge: 0.1,

      // how much percent of the other drag direction you must drag to start dragging that direction too.
      scrollTolerance: { x: 15, y: 15 },
      scaleTolerance: 5,
      secondaryScrollTolerance: 30,
      scrollLock: 500,

      decelerationRate: this.get("decelerationRate"),

      // general status
      lastEventTime: touch.timeStamp,

      // the touch used
      touch: (starting ? touch : (this.touch ? this.touch.touch : null)),

      // needsScrollEnd will cause a scrollDidEnd even if this particular touch does not start a scroll.
      // the reason for this is because we don't want to say we've stopped scrolling just because we got
      // another touch, but simultaneously, we still need to send a touch end eventually.
      // there are two cases in which this will be used:
      //
      //    1. If the touch was sent to content touches (in which case we will not be scrolling)
      //    2. If the touch ends before scrolling starts (no scrolling then, either)
      needsScrollEnd: needsScrollEnd
    };

    if (!this.tracking) {
      this.tracking = YES;
      this.dragging = NO;
    }
  },

  /** @private */
  _adjustForEdgeResistance: function(offset, minOffset, maxOffset, resistanceCoefficient, asymptote) {
    var distanceFromEdge;

    // find distance from edge
    if (offset < minOffset) distanceFromEdge = offset - minOffset;
    else if (offset > maxOffset) distanceFromEdge = maxOffset - offset;
    else return offset;

    // manipulate logarithmically
    distanceFromEdge = Math.pow(resistanceCoefficient, Math.abs(distanceFromEdge)) * asymptote;

    // adjust mathematically
    if (offset < minOffset) distanceFromEdge = distanceFromEdge - asymptote;
    else distanceFromEdge = -distanceFromEdge + asymptote;

    // generate final value
    return Math.min(Math.max(minOffset, offset), maxOffset) + distanceFromEdge;
  },

  /** @private */
  touchesDragged: function(evt, touches) {
    var avg = evt.averagedTouchesForView(this);
    this.updateTouchScroll(avg.x, avg.y, avg.d, evt.timeStamp);
  },

  /** @private */
  updateTouchScroll: function(touchX, touchY, distance, timeStamp) {
    // get some vars
    var touch = this.touch,
        touchXInFrame = touchX - touch.globalFrame.x,
        touchYInFrame = touchY - touch.globalFrame.y,
        offsetY,
        maxOffsetY,
        offsetX,
        maxOffsetX,
        minOffsetX, minOffsetY,
        touchScroll = touch.scrolling,
        hAlign = this.get("horizontalAlign"),
        vAlign = this.get("verticalAlign");

    // calculate new position in content
    var positionInContentX = ((this._scroll_horizontalScrollOffset||0) + touchXInFrame) / this._scale,
        positionInContentY = ((this._scroll_verticalScrollOffset||0) + touchYInFrame) / this._scale;

    // calculate deltas
    var deltaX = positionInContentX - touch.startTouchOffsetInContent.x,
        deltaY = positionInContentY - touch.startTouchOffsetInContent.y;

    var isDragging = touch.dragging;
    if (!touchScroll.x && Math.abs(deltaX) > touch.scrollTolerance.x && touch.enableScrolling.x) {
      // say we are scrolling
      isDragging = YES;
      touchScroll.x = YES;
      touch.scrollTolerance.y = touch.secondaryScrollTolerance;

      // reset position
      touch.startTouchOffset.x = touchX;
      deltaX = 0;
    }
    if (!touchScroll.y && Math.abs(deltaY) > touch.scrollTolerance.y && touch.enableScrolling.y) {
      // say we are scrolling
      isDragging = YES;
      touchScroll.y = YES;
      touch.scrollTolerance.x = touch.secondaryScrollTolerance;

      // reset position
      touch.startTouchOffset.y = touchY;
      deltaY = 0;
    }

    // handle scroll start
    if (isDragging && !touch.dragging) {
      touch.dragging = YES;
      this.dragging = YES;
      this._touchScrollDidStart();
    }

    // calculate new offset
    if (!touchScroll.x && !touchScroll.y && !touch.canScale) return;
    if (touchScroll.x && !touchScroll.y) {
      if (deltaX > touch.scrollLock && !touchScroll.y) touch.enableScrolling.y = NO;
    }
    if (touchScroll.y && !touchScroll.x) {
      if (deltaY > touch.scrollLock && !touchScroll.x) touch.enableScrolling.x = NO;
    }

    // handle scaling through pinch gesture
    if (touch.canScale) {

      var startDistance = touch.startDistance, dd = distance - startDistance;
      if (Math.abs(dd) > touch.scaleTolerance) {
        touchScroll.y = YES; // if you scale, you can scroll.
        touchScroll.x = YES;

        // we want to say something that was the startDistance away from each other should now be
        // distance away. So, if we are twice as far away as we started...
        var scale = touch.startScale * (distance / Math.max(startDistance, 50));

        var newScale = this._adjustForEdgeResistance(scale, touch.minimumScale, touch.maximumScale, touch.resistanceCoefficient, touch.resistanceAsymptote);
        this.dragging = YES;
        this._scale = newScale;
        var newPositionInContentX = positionInContentX * this._scale,
            newPositionInContentY = positionInContentY * this._scale;
      }
    }

    // these do exactly what they sound like. So, this comment is just to
    // block off the code a bit
    // In english, these calculate the minimum X/Y offsets
    minOffsetX = this.minimumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, hAlign);
    minOffsetY = this.minimumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, vAlign);

    // and now, maximum...
    maxOffsetX = this.maximumScrollOffset(touch.contentSize.width * this._scale, touch.containerSize.width, hAlign);
    maxOffsetY = this.maximumScrollOffset(touch.contentSize.height * this._scale, touch.containerSize.height, vAlign);


    // So, the following is the completely written out algebra:
    // (offsetY + touchYInFrame) / this._scale = touch.startTouchOffsetInContent.y
    // offsetY + touchYInFrame = touch.startTouchOffsetInContent.y * this._scale;
    // offsetY = touch.startTouchOffset * this._scale - touchYInFrame

    // and the result applied:
    offsetX = touch.startTouchOffsetInContent.x * this._scale - touchXInFrame;
    offsetY = touch.startTouchOffsetInContent.y * this._scale - touchYInFrame;


    // we need to adjust for edge resistance, or, if bouncing is disabled, just stop flat.
    if (touch.enableBouncing) {
      offsetX = this._adjustForEdgeResistance(offsetX, minOffsetX, maxOffsetX, touch.resistanceCoefficient, touch.resistanceAsymptote);
      offsetY = this._adjustForEdgeResistance(offsetY, minOffsetY, maxOffsetY, touch.resistanceCoefficient, touch.resistanceAsymptote);
    } else {
      offsetX = Math.max(minOffsetX, Math.min(maxOffsetX, offsetX));
      offsetY = Math.max(minOffsetY, Math.min(maxOffsetY, offsetY));
    }

    // and now, _if_ scrolling is enabled, set the new coordinates
    if (touchScroll.x) this._scroll_horizontalScrollOffset = offsetX;
    if (touchScroll.y) this._scroll_verticalScrollOffset = offsetY;

    // and apply the CSS transforms.
    this._applyCSSTransforms(touch.layer);
    this._touchScrollDidChange();


    // now we must prepare for momentum scrolling by calculating the momentum.
    if (timeStamp - touch.lastEventTime >= 1 || touch.notCalculated) {
      touch.notCalculated = NO;
      var horizontalOffset = this._scroll_horizontalScrollOffset;
      var verticalOffset = this._scroll_verticalScrollOffset;

      touch.scrollVelocity.x = ((horizontalOffset - touch.lastScrollOffset.x) / Math.max(1, timeStamp - touch.lastEventTime)); // in px per ms
      touch.scrollVelocity.y = ((verticalOffset - touch.lastScrollOffset.y) / Math.max(1, timeStamp - touch.lastEventTime)); // in px per ms
      touch.lastScrollOffset.x = horizontalOffset;
      touch.lastScrollOffset.y = verticalOffset;
      touch.lastEventTime = timeStamp;
    }
  },

  /** @private */
  touchEnd: function(touch) {
    var touchStatus = this.touch,
        avg = touch.averagedTouchesForView(this);

    touch.scrollHasEnded = YES;
    if (avg.touchCount > 0) {
      this.beginTouchTracking(touch, NO);
    } else {
      if (this.dragging) {
        touchStatus.dragging = NO;

        // reset last event time
        touchStatus.lastEventTime = touch.timeStamp;

        this.startDecelerationAnimation();
      } else {
        // well. The scrolling stopped. Let us tell everyone if there was a pending one that this non-drag op interrupted.
        if (touchStatus.needsScrollEnd) this._touchScrollDidEnd();

        // this part looks weird, but it is actually quite simple.
        // First, we send the touch off for capture+starting again, but telling it to return to us
        // if nothing is found or if it is released.
        touch.captureTouch(this, YES);

        // if we went anywhere, did anything, etc., call end()
        if (touch.touchResponder && touch.touchResponder !== this) {
          touch.end();
        } else if (!touch.touchResponder || touch.touchResponder === this) {
          // if it was released to us or stayed with us the whole time, or is for some
          // wacky reason empty (in which case it is ours still). If so, and there is a next responder,
          // relay to that.

          if (touch.nextTouchResponder) touch.makeTouchResponder(touch.nextTouchResponder);
        } else {
          // in this case, the view that captured it and changed responder should have handled
          // everything for us.
        }

        this.touch = null;
      }

      this.tracking = NO;
      this.dragging = NO;
    }
  },

  /** @private */
  touchCancelled: function(touch) {
    var touchStatus = this.touch,
        avg = touch.averagedTouchesForView(this);

    // if we are decelerating, we don't want to stop that. That would be bad. Because there's no point.
    if (!this.touch || !this.touch.timeout) {
      this.beginPropertyChanges();
      this.set("scale", this._scale);
      this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
      this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
      this.endPropertyChanges();
      this.tracking = NO;

      if (this.dragging) {
        this._touchScrollDidEnd();
      }

      this.dragging = NO;
      this.touch = null;
    }
  },

  /** @private */
  startDecelerationAnimation: function(evt) {
    var touch = this.touch;
    touch.decelerationVelocity = {
      x: touch.scrollVelocity.x * 10,
      y: touch.scrollVelocity.y * 10
    };

    this.decelerateAnimation();
  },

  /** @private
    Does bounce calculations, adjusting velocity.

    Bouncing is fun. Functions that handle it should have fun names,
    don'tcha think?

    P.S.: should this be named "bouncityBounce" instead?
  */
  bouncyBounce: function(velocity, value, minValue, maxValue, de, ac, additionalAcceleration) {
    // we have 4 possible paths. On a higher level, we have two leaf paths that can be applied
    // for either of two super-paths.
    //
    // The first path is if we are decelerating past an edge: in this case, this function must
    // must enhance that deceleration. In this case, our math boils down to taking the amount
    // by which we are past the edge, multiplying it by our deceleration factor, and reducing
    // velocity by that amount.
    //
    // The second path is if we are not decelerating, but are still past the edge. In this case,
    // we must start acceleration back _to_ the edge. The math here takes the distance we are from
    // the edge, multiplies by the acceleration factor, and then performs two additional things:
    // First, it speeds up the acceleration artificially  with additionalAcceleration; this will
    // make the stop feel more sudden, as it will still have this additional acceleration when it reaches
    // the edge. Second, it ensures the result does not go past the final value, so we don't end up
    // bouncing back and forth all crazy-like.
    if (value < minValue) {
      if (velocity < 0) velocity = velocity + ((minValue - value) * de);
      else {
        velocity = Math.min((minValue-value) * ac + additionalAcceleration, minValue - value - 0.01);
      }
    } else if (value > maxValue) {
      if (velocity > 0) velocity = velocity - ((value - maxValue) * de);
      else {
        velocity = -Math.min((value - maxValue) * ac + additionalAcceleration, value - maxValue - 0.01);
      }
    }
    return velocity;
  },

  /** @private */
  decelerateAnimation: function() {
    // get a bunch of properties. They are named well, so not much explanation of what they are...
    // However, note maxOffsetX/Y takes into account the scale;
    // also, newX/Y adds in the current deceleration velocity (the deceleration velocity will
    // be changed later in this function).
    var touch = this.touch,
        scale = this._scale,
        touchDim = touch.contentSize,
        touchContainerDim = touch.containerSize,
        hAlign = this.get("horizontalAlign"),
        vAlign = this.get("verticalAlign"),
        minOffsetX = this.minimumScrollOffset(touchDim.width * this._scale, touchContainerDim.width, hAlign),
        minOffsetY = this.minimumScrollOffset(touchDim.height * this._scale, touchContainerDim.height, vAlign),
        maxOffsetX = this.maximumScrollOffset(touchDim.width * this._scale, touchContainerDim.width, hAlign),
        maxOffsetY = this.maximumScrollOffset(touchDim.height * this._scale, touchContainerDim.height, vAlign),

        now = Date.now(),
        t = Math.max(now - touch.lastEventTime, 1),

        newX = this._scroll_horizontalScrollOffset + touch.decelerationVelocity.x * (t/10),
        newY = this._scroll_verticalScrollOffset + touch.decelerationVelocity.y * (t/10);

    var de = touch.decelerationFromEdge, ac = touch.accelerationToEdge;

    // under a few circumstances, we may want to force a valid X/Y position.
    // For instance, if bouncing is disabled, or if position was okay before
    // adjusting scale.
    var forceValidXPosition = !touch.enableBouncing, forceValidYPosition = !touch.enableBouncing;

    // determine if position was okay before adjusting scale (which we do, in
    // a lovely, animated way, for the scaled out/in too far bounce-back).
    // if the position was okay, then we are going to make sure that we keep the
    // position okay when adjusting the scale.
    //
    // Position OKness, here, referring to if the position is valid (within
    // minimum and maximum scroll offsets)
    if (newX >= minOffsetX && newX <= maxOffsetX) forceValidXPosition = YES;
    if (newY >= minOffsetY && newY <= maxOffsetY) forceValidYPosition = YES;

    // We are going to change scale in a moment, but the position should stay the
    // same, if possible (unless it would be more jarring, as described above, in
    // the case of starting with a valid position and ending with an invalid one).
    //
    // Because we are changing the scale, we need to make the position scale-neutral.
    // we'll make it non-scale-neutral after applying scale.
    //
    // Question: might it be better to save the center position instead, so scaling
    // bounces back around the center of the screen?
    newX /= this._scale;
    newY /= this._scale;

    // scale velocity (amount to change) starts out at 0 each time, because
    // it is calculated by how far out of bounds it is, rather than by the
    // previous such velocity.
    var sv = 0;

    // do said calculation; we'll use the same bouncyBounce method used for everything
    // else, but our adjustor that gives a minimum amount to change by and (which, as we'll
    // discuss, is to make the stop feel slightly more like a stop), we'll leave at 0
    // (scale doesn't really need it as much; if you disagree, at least come up with
    // numbers more appropriate for scale than the ones for X/Y)
    sv = this.bouncyBounce(sv, scale, touch.minimumScale, touch.maximumScale, de, ac, 0);

    // add the amount to scale. This is linear, rather than multiplicative. If you think
    // it should be multiplicative (or however you say that), come up with a new formula.
    this._scale = scale = scale + sv;

    // now we can convert newX/Y back to scale-specific coordinates...
    newX *= this._scale;
    newY *= this._scale;

    // It looks very weird if the content started in-bounds, but the scale animation
    // made it not be in bounds; it causes the position to animate snapping back, and,
    // well, it looks very weird. It is more proper to just make sure it stays in a valid
    // position. So, we'll determine the new maximum/minimum offsets, and then, if it was
    // originally a valid position, we'll adjust the new position to a valid position as well.


    // determine new max offset
    minOffsetX = this.minimumScrollOffset(touchDim.width * this._scale, touchContainerDim.width, hAlign);
    minOffsetY = this.minimumScrollOffset(touchDim.height * this._scale, touchContainerDim.height, vAlign);
    maxOffsetX = this.maximumScrollOffset(touchDim.width * this._scale, touchContainerDim.width, hAlign);
    maxOffsetY = this.maximumScrollOffset(touchDim.height * this._scale, touchContainerDim.height, vAlign);

    // see if scaling messed up the X position (but ignore if 'tweren't right to begin with).
    if (forceValidXPosition && (newX < minOffsetX || newX > maxOffsetX)) {
      // Correct the position
      newX = Math.max(minOffsetX, Math.min(newX, maxOffsetX));

      // also, make the velocity be ZERO; it is obviously not needed...
      touch.decelerationVelocity.x = 0;
    }

    // now the y
    if (forceValidYPosition && (newY < minOffsetY || newY > maxOffsetY)) {
      // again, correct it...
      newY = Math.max(minOffsetY, Math.min(newY, maxOffsetY));

      // also, make the velocity be ZERO; it is obviously not needed...
      touch.decelerationVelocity.y = 0;
    }


    // now that we are done modifying the position, we may update the actual scroll
    this._scroll_horizontalScrollOffset = newX;
    this._scroll_verticalScrollOffset = newY;

    this._applyCSSTransforms(touch.layer); // <- Does what it sounds like.

    this._touchScrollDidChange();

    // Now we have to adjust the velocities. The velocities are simple x and y numbers that
    // get added to the scroll X/Y positions each frame.
    // The default decay rate is .950 per frame. To achieve some semblance of accuracy, we
    // make it to the power of the elapsed number of frames. This is not fully accurate,
    // as this is applying the elapsed time between this frame and the previous time to
    // modify the velocity for the next frame. My mind goes blank when I try to figure out
    // a way to fix this (given that we don't want to change the velocity on the first frame),
    // and as it seems to work great as-is, I'm just leaving it.
    var decay = touch.decelerationRate,
        decayXtime = Math.pow(decay, (t / 10));
    touch.decelerationVelocity.y *= decayXtime;
    touch.decelerationVelocity.x *= decayXtime;

    // We have a bouncyBounce method that adjusts the velocity for bounce. That is, if it is
    // out of range and still going, it will slow it down. This step is decelerationFromEdge.
    // If it is not moving (or has come to a stop from decelerating), but is still out of range,
    // it will start it moving back into range (accelerationToEdge)
    // we supply de and ac as these properties.
    // The .3 artificially increases the acceleration by .3; this is actually to make the final
    // stop a bit more abrupt.
    touch.decelerationVelocity.x = this.bouncyBounce(touch.decelerationVelocity.x, newX, minOffsetX, maxOffsetX, de, ac, 0.3);
    touch.decelerationVelocity.y = this.bouncyBounce(touch.decelerationVelocity.y, newY, minOffsetY, maxOffsetY, de, ac, 0.3);

    // if we ain't got no velocity... then we must be finished, as there is no where else to go.
    // to determine our velocity, we take the absolue value, and use that; if it is less than .01, we
    // must be done. Note that we check scale's most recent velocity, calculated above using bouncyBounce,
    // as well.
    var absXVelocity = Math.abs(touch.decelerationVelocity.x),
        absYVelocity = Math.abs(touch.decelerationVelocity.y);
    if (absYVelocity < 0.05 && absXVelocity < 0.05 && Math.abs(sv) < 0.05) {
      // we can reset the timeout, as it will no longer be required, and we don't want to re-cancel it later.
      touch.timeout = null;
      this.touch = null;

      // trigger scroll end
      this._touchScrollDidEnd();

      // set the scale, vertical, and horizontal offsets to what they technically already are,
      // but don't know they are yet. This will finally update things like, say, the clipping frame.
      this.beginPropertyChanges();
      this.set("scale", this._scale);
      this.set("verticalScrollOffset", this._scroll_verticalScrollOffset);
      this.set("horizontalScrollOffset", this._scroll_horizontalScrollOffset);
      this.endPropertyChanges();

      return;
    }

    // We now set up the next round. We are doing this as raw as we possibly can, not touching the
    // run loop at all. This speeds up performance drastically--keep in mind, we're on comparatively
    // slow devices, here. So, we'll just make a closure, saving "this" into "self" and calling
    // 10ms later (or however long it takes). Note also that we save both the last event time
    // (so we may calculate elapsed time) and the timeout we are creating, so we may cancel it in future.
    var self = this;
    touch.lastEventTime = Date.now();
    this.touch.timeout = setTimeout(function(){
      SC.run(self.decelerateAnimation(), self);
    }, 30);
  },

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private
    Instantiate scrollers & container views as needed.  Replace their classes
    in the regular properties.
  */
  createChildViews: function() {
    var childViews = [] , view;

    // create the containerView.  We must always have a container view.
    // also, setup the contentView as the child of the containerView...
    if (SC.none(view = this.containerView)) view = SC.ContainerView;

    childViews.push(this.containerView = this.createChildView(view, {
      contentView: this.contentView,
      isScrollContainer: YES
    }));

    // and replace our own contentView...
    this.contentView = this.containerView.get('contentView');

    // create a horizontal scroller view if needed...
    view = SC.platform.touch ? this.get("horizontalTouchScrollerView") : this.get("horizontalScrollerView");
    if (view) {
      if (this.get('hasHorizontalScroller')) {
        view = this.horizontalScrollerView = this.createChildView(view, {
          layoutDirection: SC.LAYOUT_HORIZONTAL,
          valueBinding: '*owner.horizontalScrollOffset'
        }) ;
        childViews.push(view);
      } else this.horizontalScrollerView = null ;
    }

    // create a vertical scroller view if needed...
    view = SC.platform.touch ? this.get("verticalTouchScrollerView") : this.get("verticalScrollerView");
    if (view) {
      if (this.get('hasVerticalScroller')) {
        view = this.verticalScrollerView = this.createChildView(view, {
          layoutDirection: SC.LAYOUT_VERTICAL,
          valueBinding: '*owner.verticalScrollOffset'
        }) ;
        childViews.push(view);
      } else this.verticalScrollerView = null ;
    }

    // set childViews array.
    this.childViews = childViews ;

    this.contentViewDidChange() ; // setup initial display...
    this.tile() ; // set up initial tiling
  },

  /** @private */
  init: function() {
    arguments.callee.base.apply(this,arguments);

    // start observing initial content view.  The content view's frame has
    // already been setup in prepareDisplay so we don't need to call
    // viewFrameDidChange...
    this._scroll_contentView = this.get('contentView') ;
    var contentView = this._scroll_contentView ;

    if (contentView) {
      contentView.addObserver('frame', this, this.contentViewFrameDidChange);
      contentView.addObserver('calculatedWidth', this, this.contentViewFrameDidChange);
      contentView.addObserver('calculatedHeight', this, this.contentViewFrameDidChange);
    }

    if (this.get('isVisibleInWindow')) this._scsv_registerAutoscroll() ;
  },

  /** @private
    Registers/deregisters view with SC.Drag for autoscrolling
  */
  _scsv_registerAutoscroll: function() {
    if (this.get('isVisibleInWindow')) SC.Drag.addScrollableView(this);
    else SC.Drag.removeScrollableView(this);
  }.observes('isVisibleInWindow'),

  /** @private
    Whenever the contentView is changed, we need to observe the content view's
    frame to be notified whenever it's size changes.
  */
  contentViewDidChange: function() {
    var newView = this.get('contentView'),
        oldView = this._scroll_contentView,
        frameObserver = this.contentViewFrameDidChange,
        layerObserver = this.contentViewLayerDidChange;

    if (newView !== oldView) {

      // stop observing old content view
      if (oldView) {
        oldView.removeObserver('calculatedWidth', this, this.contentViewFrameDidChange);
        oldView.removeObserver('calculatedHeight', this, this.contentViewFrameDidChange);
        oldView.removeObserver('frame', this, frameObserver);
        oldView.removeObserver('layer', this, layerObserver);
      }

      // update cache
      this._scroll_contentView = newView;
      if (newView) {
        newView.addObserver('frame', this, frameObserver);
        newView.addObserver('calculatedWidth', this, this.contentViewFrameDidChange);
        newView.addObserver('calculatedHeight', this, this.contentViewFrameDidChange);
        newView.addObserver('layer', this, layerObserver);
      }

      // replace container
      this.containerView.set('contentView', newView);

      this.contentViewFrameDidChange();
    }
  }.observes('contentView'),

  /** @private
    If we redraw after the initial render, we need to make sure that we reset
    the scrollTop/scrollLeft properties on the content view.  This ensures
    that, for example, the scroll views displays correctly when switching
    views out in a ContainerView.
  */
  render: function(context, firstTime) {
    this.invokeLast(this.adjustElementScroll);

    if (firstTime) {
      context.push('<div class="corner"></div>');
    }
    return arguments.callee.base.apply(this,arguments);
  },

  /** @private */
  oldMaxHOffset: 0,

  /** @private */
  oldMaxVOffset: 0,

  /** @private
    Invoked whenever the contentView's frame changes.  This will update the
    scroller maximum and optionally update the scroller visibility if the
    size of the contentView changes.  We don't care about the origin since
    that is tracked separately from the offset values.

    @param {Boolean} force (optional)  Re-calculate everything even if the contentView’s frame didn’t change size
  */
  contentViewFrameDidChange: function(force) {
    var view   = this.get('contentView'),
        f      = (view) ? view.get('frame') : null,
        scale  = this._scale,
        width  = 0,
        height = 0,
        dim, dimWidth, dimHeight, calculatedWidth, calculatedHeight;

    // If no view has been set yet, or it doesn't have a frame,
    // we can avoid doing any work.
    if (!view || !f) { return; }

    width = view.get('calculatedWidth') || f.width || 0;
    height = view.get('calculatedHeight') || f.height || 0;

    width *= scale;
    height *= scale;

    // cache out scroll settings...
    if (!force && (width === this._scroll_contentWidth) && (height === this._scroll_contentHeight)) return ;
    this._scroll_contentWidth  = width;
    this._scroll_contentHeight = height;

    dim       = this.getPath('containerView.frame');
    dimWidth  = dim.width;
    dimHeight = dim.height;

    if (this.get('hasHorizontalScroller') && (view = this.get('horizontalScrollerView'))) {
      // decide if it should be visible or not
      if (this.get('autohidesHorizontalScroller')) {
        this.set('isHorizontalScrollerVisible', width > dimWidth);
      }
      view.setIfChanged('maximum', width-dimWidth) ;
      view.setIfChanged('proportion', dimWidth/width);
    }

    if (this.get('hasVerticalScroller') && (view = this.get('verticalScrollerView'))) {
      // decide if it should be visible or not
      if (this.get('autohidesVerticalScroller')) {
        this.set('isVerticalScrollerVisible', height > dimHeight);
      }
      view.setIfChanged('maximum', height-dimHeight) ;
      view.setIfChanged('proportion', dimHeight/height);
    }

    // If there is no vertical scroller and auto hiding is on, make
    // sure we are at the top if not already there
    if (!this.get('isVerticalScrollerVisible') && (this.get('verticalScrollOffset') !== 0) &&
       this.get('autohidesVerticalScroller')) {
      this.set('verticalScrollOffset', 0);
    }

    // Same thing for horizontal scrolling.
    if (!this.get('isHorizontalScrollerVisible') && (this.get('horizontalScrollOffset') !== 0) &&
       this.get('autohidesHorizontalScroller')) {
      this.set('horizontalScrollOffset', 0);
    }

    // This forces to recalculate the height of the frame when is at the bottom
    // of the scroll and the content dimension are smaller that the previous one
    var mxVOffSet   = this.get('maximumVerticalScrollOffset'),
        vOffSet     = this.get('verticalScrollOffset'),
        mxHOffSet   = this.get('maximumHorizontalScrollOffset'),
        hOffSet     = this.get('horizontalScrollOffset'),
        forceHeight = mxVOffSet < vOffSet,
        forceWidth  = mxHOffSet < hOffSet;
    if (forceHeight || forceWidth) {
      this.forceDimensionsRecalculation(forceWidth, forceHeight, vOffSet, hOffSet);
    }

    // send change notifications since they don't invalidate automatically
    this.notifyPropertyChange('maximumVerticalScrollOffset');
    this.notifyPropertyChange('maximumHorizontalScrollOffset');
  },

  /** @private
    If our frame changes, then we need to re-calculate the visibility of our
    scrollers, etc.
  */
  frameDidChange: function() {
    this.contentViewFrameDidChange(YES);
  }.observes('frame'),

  /** @private
    If the layer of the content view changes, we need to readjust the
    scrollTop and scrollLeft properties on the new DOM element.
  */
  contentViewLayerDidChange: function() {
    // Invalidate these cached values, as they're no longer valid
    if (this._verticalScrollOffset !== 0) this._verticalScrollOffset = -1;
    if (this._horizontalScrollOffset !== 0) this._horizontalScrollOffset = -1;
    this.invokeLast(this.adjustElementScroll);
  },

  /** @private
    Whenever the horizontal scroll offset changes, update the scrollers and
    edit the location of the contentView.
  */
  _scroll_horizontalScrollOffsetDidChange: function() {
    this.invokeLast(this.adjustElementScroll);
  }.observes('horizontalScrollOffset'),

  /** @private
    Whenever the vertical scroll offset changes, update the scrollers and
    edit the location of the contentView.
  */
  _scroll_verticalScrollOffsetDidChange: function() {
    this.invokeLast(this.adjustElementScroll);
  }.observes('verticalScrollOffset'),

  /** @private
    Called at the end of the run loop to actually adjust the scrollTop
    and scrollLeft properties of the container view.
  */
  adjustElementScroll: function() {
    var container = this.get('containerView'),
        content = this.get('contentView'),
        verticalScrollOffset = this.get('verticalScrollOffset'),
        horizontalScrollOffset = this.get('horizontalScrollOffset');

    // We notify the content view that its frame property has changed
    // before we actually update the scrollTop/scrollLeft properties.
    // This gives views that use incremental rendering a chance to render
    // newly-appearing elements before they come into view.
    if (content) {
      // Use accelerated drawing if the browser supports it
      if (SC.platform.touch) {
        this._applyCSSTransforms(content.get('layer'));
      }

      if (content._viewFrameDidChange) { content._viewFrameDidChange(); }
    }

    if (container && !SC.platform.touch) {
      container = container.$()[0];

      if (container) {
        if (verticalScrollOffset !== this._verticalScrollOffset) {
          container.scrollTop = verticalScrollOffset;
          this._verticalScrollOffset = verticalScrollOffset;
        }

        if (horizontalScrollOffset !== this._horizontalScrollOffset) {
          container.scrollLeft = horizontalScrollOffset;
          this._horizontalScrollOffset = horizontalScrollOffset;
        }
      }
    }
  },

  /** @private */
  forceDimensionsRecalculation: function (forceWidth, forceHeight, vOffSet, hOffSet) {
    var oldScrollHOffset = hOffSet;
    var oldScrollVOffset = vOffSet;
    this.scrollTo(0,0);
    if(forceWidth && forceHeight){
      this.scrollTo(this.get('maximumHorizontalScrollOffset'), this.get('maximumVerticalScrollOffset'));
    }
    if(forceWidth && !forceHeight){
      this.scrollTo(this.get('maximumHorizontalScrollOffset'), oldScrollVOffset);
    }
    if(!forceWidth && forceHeight){
      this.scrollTo(oldScrollHOffset ,this.get('maximumVerticalScrollOffset'));
    }
  },

  /** @private */
  _scroll_verticalScrollOffset: 0,

  /** @private */
  _scroll_horizontalScrollOffset: 0

});

/* >>>>>>>>>> BEGIN source/views/segment.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================
/**
  @class

  SegmentViews are the views used and arranged by SC.SegmentedView and are very similar to a SC.ButtonView
  without any event handling.  The event handling is done by the parent view.

  @extends SC.View
  @since SproutCore 1.5
*/
SC.SegmentView = SC.View.extend(SC.Control,
/** @scope SC.SegmentView.prototype */{

  /**
    @type String
    @default 'tab'
    @readOnly
  */
  //ariaRole: 'tab',
  ariaRole: 'button', // workaround for <rdar://problem/10444670>; switch back to 'tab' later with <rdar://problem/10463928> (also see segmented.js)

  /**
    @type Boolean
    @default YES
    @readOnly
  */
  isSegment: YES,

  /**
    @type Array
    @default ['sc-segment-view']
    @see SC.View#classNames
  */
  classNames: ['sc-segment-view'],

  /**
    @type String
    @default null
    @see SC.View#toolTip
  */
  toolTip: null,

  /**
    @type Boolean
    @default YES
    @see SC.Control#isEnabled
  */
  isEnabled: YES,

  /**
    @type Boolean
    @default NO
    @see SC.Control#isActive
  */
  isActive: NO,

  /**
    @type Boolean
    @default NO
    @see SC.Control#isSelected
  */
  isSelected: NO,

  /**
    Change the layout direction to make this a vertical segment instead of horizontal ones. 
    Possible values:
    
      - SC.LAYOUT_HORIZONTAL
      - SC.LAYOUT_VERTICAL
    
    @type String
    @default SC.LAYOUT_HORIZONTAL
  */
  layoutDirection: SC.LAYOUT_HORIZONTAL,   

  /**
    @type String
    @default null
    @see SC.Control#controlSize
  */
  controlSize: null,

  /**
    @type Boolean
    @default NO
    @see SC.ButtonView#supportFocusRing
  */
  supportFocusRing: NO,

  // TODO: isDefault, isCancel, value not really used by render delegate
  displayProperties: ['icon', 'displayTitle', 'value', 'displayToolTip', 'isDefault', 'isCancel', 'width', 'isSegment','isFirstSegment', 'isMiddleSegment', 'isLastSegment', 'isOverflowSegment', 'index', 'layoutDirection'],

  /**
    @type String
    @default 'segmentRenderDelegate'
  */
  renderDelegateName: 'segmentRenderDelegate',

  /**
    @type Boolean
    @default YES
  */
  useStaticLayout: YES,


  // ..........................................................
  // Properties
  // 

  /**
    @type String
    @default ""
  */
  title: "",

  /**
    @type Object
    @default null
  */
  value: null,

  /**
    @type String
    @default null
  */
  icon: null,

  /**
    @type Boolean
    @default null
  */
  localize: NO,

  /**
    @type String
    @default null
  */
  keyEquivalent: null,

  // TODO: Modification currently unsupported in SegmentedView
  /**
    @type Boolean
    @default YES
  */
  escapeHTML: YES,

  // TODO: Modification currently unsupported in SegmentedView
  /**
    @type Boolean
    @default YES
  */
  needsEllipsis: YES,

  /**
    Localized title.
    
    @field
    @type String
    @default ""
  */
  displayTitle: function() {
    var ret = this.get('title');
    if (this.get('localize')) ret = SC.String.loc(ret);
    return ret;
  }.property('title', 'localize').cacheable(),

  /**
    @type Number
    @default null
  */
  width: null,

  /**
    The item represented by this view.

    @type Object
    @default null
  */
  localItem: null,

  /** @private
    Whenever the width property changes, adjust our layout accordingly.
  */
  widthDidChange: function() {
    this.adjust('width', this.get('width'));
  }.observes('width'),

  /** @private
    Update our properties according to our matching item.
  */
  updateItem: function(parentView, item) {
    var itemKeys = parentView.get('itemKeys'),
        itemKey,
        viewKeys = parentView.get('viewKeys'),
        viewKey,
        i;

    for (i = itemKeys.get('length') - 1; i >= 0; i--) {
      itemKey = parentView.get(itemKeys.objectAt(i));
      viewKey = viewKeys.objectAt(i);

      // Don't overwrite the default value if none exists in the item
      if (!SC.none(item.get(itemKey))) this.set(viewKey, item.get(itemKey));
    }

    this.set('localItem', item);
  }
});

/* >>>>>>>>>> BEGIN source/views/segmented.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/segment');

/**
  @class

  SegmentedView is a special type of button that can display multiple
  segments.  Each segment has a value assigned to it.  When the user clicks
  on the segment, the value of that segment will become the new value of
  the control.

  You can also optionally configure a target/action that will fire whenever
  the user clicks on an item.  This will give your code an opportunity to take
  some action depending on the new value.  (of course, you can always bind to
  the value as well, which is generally the preferred approach.)

  # Defining Your Segments

  You define your segments by providing a items array, much like you provide
  to a RadioView.  Your items array can be as simple as an array of strings
  or as complex as full model objects.  Based on how you configure your
  itemKey properties, the segmented view will read the properties it needs
  from the array and construct the button.

  You can define the following properties on objects you pass in:

    - *itemTitleKey* - the title of the button
    - *itemValueKey* - the value of the button
    - *itemWidthKey* - the preferred width. if omitted, it autodetects
    - *itemIconKey*  - an icon
    - *itemActionKey* - an optional action to fire when pressed
    - *itemTargetKey* - an optional target for the action
    - *itemLayerIdKey* - an optional target for the action
    - *segmentViewClass* - class to be used for creating segments

  @extends SC.View
  @extends SC.Control
  @since SproutCore 1.0
*/
SC.SegmentedView = SC.View.extend(SC.Control,
/** @scope SC.SegmentedView.prototype */ {

  /**
    @ field
    @type Boolean
    @default YES
  */
  acceptsFirstResponder: function() {
    if (SC.FOCUS_ALL_CONTROLS) { return this.get('isEnabled'); }
    return NO;
  }.property('isEnabled').cacheable(),

  /**
    @type String
    @default 'tablist'
    @readOnly
  */
  //ariaRole: 'tablist',
  ariaRole: 'group', // workaround for <rdar://problem/10444670>; switch back to 'tablist' later with <rdar://problem/10463928> (also see segment.js)

  /**
    @type Array
    @default ['sc-segmented-view']
    @see SC.View#classNames
  */
  classNames: ['sc-segmented-view'],

  /**
    @type String
    @default 'square'
    @see SC.ButtonView#theme
  */
  theme: 'square',

  /**
    The value of the segmented view.

    The SegmentedView's value will always be the value of the currently
    selected button.  Setting this value will change the selected button.
    If you set this value to something that has no matching button, then
    no buttons will be selected.

    @type Object
    @default null
  */
  value: null,

  /**
    @type Boolean
    @default YES
  */
  isEnabled: YES,

  /**
    If YES, clicking a selected button again will deselect it, setting the
    segmented views value to null.

    @type Boolean
    @default NO
  */
  allowsEmptySelection: NO,

  /**
    If YES, then clicking on a tab will not deselect the other segments, it
    will simply add or remove it from the selection.

    @type Boolean
    @default NO
  */
  allowsMultipleSelection: NO,

  /**
    If YES, it will set the segment value even if an action is defined.

    @type Boolean
    @default NO
  */
  selectSegmentWhenTriggeringAction: NO,

  /**
    @type Boolean
    @default YES
  */
  localize: YES,

  /**
    Aligns the segments of the segmented view within its frame horizontally.
    Possible values:

      - SC.ALIGN_LEFT
      - SC.ALIGN_RIGHT
      - SC.ALIGN_CENTER

    @type String
    @default SC.ALIGN_CENTER
  */
  align: SC.ALIGN_CENTER,

  /**
    Change the layout direction to make this a vertical set of tabs instead
    of horizontal ones. Possible values:

      - SC.LAYOUT_HORIZONTAL
      - SC.LAYOUT_VERTICAL

    @type String
    @default SC.LAYOUT_HORIZONTAL
  */
  layoutDirection: SC.LAYOUT_HORIZONTAL,


  // ..........................................................
  // SEGMENT DEFINITION
  //

  /**
    The array of items to display.  This may be a simple array of strings, objects
    or SC.Objects.  If you pass objects or SC.Objects, you must also set the
    various itemKey properties to tell the SegmentedView how to extract the
    information it needs.

    Note: only SC.Object items support key-value coding and therefore may be
    observed by the view for changes to titles, values, icons, widths,
    isEnabled values & tooltips.

    @type Array
    @default null
  */
  items: null,

  /**
    The key that contains the title for each item.

    @type String
    @default null
  */
  itemTitleKey: null,

  /**
    The key that contains the value for each item.

    @type String
    @default null
  */
  itemValueKey: null,

  /**
    A key that determines if this item in particular is enabled.  Note if the
    control in general is not enabled, no items will be enabled, even if the
    item's enabled property returns YES.

    @type String
    @default null
  */
  itemIsEnabledKey: null,

  /**
    The key that contains the icon for each item.  If omitted, no icons will
    be displayed.

    @type String
    @default null
  */
  itemIconKey: null,

  /**
    The key that contains the desired width for each item.  If omitted, the
    width will autosize.

    @type String
    @default null
  */
  itemWidthKey: null,

  /**
    The key that contains the action for this item.  If defined, then
    selecting this item will fire the action in addition to changing the
    value.  See also itemTargetKey.

    @type String
    @default null
  */
  itemActionKey: null,

  /**
    The key that contains the target for this item.  If this and itemActionKey
    are defined, then this will be the target of the action fired.

    @type String
    @default null
  */
  itemTargetKey: null,

  /**
    The key that contains the layerId for each item.
    @property {String}
  */
  itemLayerIdKey: null,

  /**
    The key that contains the key equivalent for each item.  If defined then
    pressing that key equivalent will be like selecting the tab.  Also,
    pressing the Alt or Option key for 3 seconds will display the key
    equivalent in the tab.

    @type String
    @default null
  */
  itemKeyEquivalentKey: null,

  /**
    If YES, overflowing items are placed into a menu and an overflow segment is
    added to popup that menu.

    @type Boolean
    @default YES
  */
  shouldHandleOverflow: NO,

  /**
    The title to use for the overflow segment if it appears.

    @type String
    @default '&raquo;'
  */
  overflowTitle: '',

  /**
    The toolTip to use for the overflow segment if it appears.

    @type String
    @default 'More&hellip;'
  */
  overflowToolTip: '',

  /**
    The icon to use for the overflow segment if it appears.

    @type String
    @default null
  */
  overflowIcon: null,

  /**
    The view class used when creating segments.

    @type SC.View
    @default SC.SegmentView
  */
  segmentViewClass: SC.SegmentView,


  /** @private
    The following properties are used to map items to child views. Item keys
    are looked up on the item based on this view's value for each 'itemKey'.
    If a value in the item is found, then that value is mapped to a child
    view using the matching viewKey.

    @type Array
  */
  itemKeys: ['itemTitleKey', 'itemValueKey', 'itemIsEnabledKey', 'itemIconKey', 'itemWidthKey', 'itemToolTipKey', 'itemKeyEquivalentKey', 'itemLayerIdKey'],

  /** @private */
  viewKeys: ['title', 'value', 'isEnabled', 'icon', 'width', 'toolTip', 'keyEquivalent', 'layerId'],

  /** @private
    Call itemsDidChange once to initialize segment child views for the items that exist at
    creation time.
  */
  init: function() {
    arguments.callee.base.apply(this,arguments);

    var title = this.get('overflowTitle'),
        toolTip = this.get('overflowToolTip'),
        icon = this.get('overflowIcon'),
        overflowView;

    overflowView = this.get('segmentViewClass').create({
      controlSize: this.get('controlSize'),
      localize: this.get('localize'),
      title: title,
      toolTip: toolTip,
      icon: icon,
      isLastSegment: YES,
      isOverflowSegment: YES,
      layoutDirection: this.get('layoutDirection'),
      isVisible: this.get('shouldHandleOverflow')
    });
    this.set('overflowView', overflowView);

    this.appendChild(overflowView);

    this.itemsDidChange();
  },

  shouldHandleOverflowDidChange: function() {
    if (this.get('shouldHandleOverflow')) {
      // remeasure should show/hide it as needed
      this.invokeLast(this.remeasure);
    } else {
      this.get('overflowView').set('isVisible', NO);
    }
  }.observes('shouldHandleOverflow'),

  /** @private
    Called whenever the number of items changes.  This method populates SegmentedView's childViews, taking
    care to re-use existing childViews if possible.
  */
  itemsDidChange: function() {
    var items = this.get('items') || [],
        item,
        localItem,                        // Used to avoid altering the original items
        previousItem,
        childViews = this.get('childViews'),
        childView,
        overflowView = childViews.lastObject(),
        value = this.get('value'),        // The value can change if items that were once selected are removed
        isSelected,
        itemKeys = this.get('itemKeys'),
        itemKey,
        viewKeys = this.get('viewKeys'),
        viewKey,
        segmentViewClass = this.get('segmentViewClass'),
        i, j;

    // Update childViews
    if (childViews.get('length') - 1 > items.get('length')) {   // We've lost segments (ie. childViews)

      // Remove unneeded segments from the end back
      for (i = childViews.get('length') - 2; i >= items.get('length'); i--) {
        childView = childViews.objectAt(i);
        localItem = childView.get('localItem');

        // Remove observers from items we are losing off the end
        if (localItem instanceof SC.Object) {

          for (j = itemKeys.get('length') - 1; j >= 0; j--) {
            itemKey = this.get(itemKeys.objectAt(j));

            if (itemKey) {
              localItem.removeObserver(itemKey, this, this.itemContentDidChange);
            }
          }
        }

        // If a selected childView has been removed then update our value
        if (SC.isArray(value)) {
          value.removeObject(localItem);
        } else if (value === localItem) {
          value = null;
        }

        this.removeChild(childView);
      }

      // Update our value which may have changed
      this.set('value', value);

    } else if (childViews.get('length') - 1 < items.get('length')) {  // We've gained segments

      // Create the new segments
      for (i = childViews.get('length') - 1; i < items.get('length'); i++) {

        // We create a default SC.ButtonView-like object for each segment
        childView = segmentViewClass.create({
          controlSize: this.get('controlSize'),
          localize: this.get('localize'),
          layoutDirection: this.get('layoutDirection')
        });

        // Attach the child
        this.insertBefore(childView, overflowView);
      }
    }

    // Because the items array can be altered with insertAt or removeAt, we can't be sure that the items
    // continue to match 1-to-1 the existing views, so once we have the correct number of childViews,
    // simply update them all
    childViews = this.get('childViews');

    for (i = 0; i < items.get('length'); i++) {
      localItem = items.objectAt(i);
      childView = childViews.objectAt(i);
      previousItem = childView.get('localItem');

      if (previousItem instanceof SC.Object && !items.contains(previousItem)) {
        // If the old item is no longer in the view, remove its observers
        for (j = itemKeys.get('length') - 1; j >= 0; j--) {
          itemKey = this.get(itemKeys.objectAt(j));

          if (itemKey) {
            previousItem.removeObserver(itemKey, this, this.itemContentDidChange);
          }
        }
      }

      // Skip null/undefined items (but don't skip empty strings)
      if (SC.none(localItem)) continue;

      // Normalize the item (may be a String, Object or SC.Object)
      if (SC.typeOf(localItem) === SC.T_STRING) {

        localItem = SC.Object.create({
          'title': localItem.humanize().titleize(),
          'value': localItem
        });

        // Update our keys accordingly
        this.set('itemTitleKey', 'title');
        this.set('itemValueKey', 'value');
      } else if (SC.typeOf(localItem) === SC.T_HASH) {

        localItem = SC.Object.create(localItem);
      } else if (localItem instanceof SC.Object)  {

        // We don't need to make any changes to SC.Object items, but we can observe them
        for (j = itemKeys.get('length') - 1; j >= 0; j--) {
          itemKey = this.get(itemKeys.objectAt(j));

          if (itemKey) {
            localItem.removeObserver(itemKey, this, this.itemContentDidChange);
            localItem.addObserver(itemKey, this, this.itemContentDidChange, i);
          }
        }
      } else {
        SC.Logger.error('SC.SegmentedView items may be Strings, Objects (ie. Hashes) or SC.Objects only');
      }

      // Determine whether this segment is selected based on the view's existing value(s)
      isSelected = NO;
      if (SC.isArray(value) ? value.indexOf(localItem.get(this.get('itemValueKey'))) >= 0 : value === localItem.get(this.get('itemValueKey'))) {
        isSelected = YES;
      }
      childView.set('isSelected', isSelected);

      // Assign segment specific properties based on position
      childView.set('index', i);
      childView.set('isFirstSegment', i === 0);
      childView.set('isMiddleSegment',  i < items.get('length') - 1 && i > 0);
      childView.set('isLastSegment', i === items.get('length') - 1);

      // Be sure to update the view's properties for the (possibly new) matched item
      childView.updateItem(this, localItem);
    }

    // Force a segment remeasure to check overflow
    if (this.get('shouldHandleOverflow')) {
      this.invokeLast(this.remeasure);
    }
  }.observes('*items.[]'),

  /** @private
    This observer method is called whenever any of the relevant properties of an item change.  This only applies
    to SC.Object based items that may be observed.
  */
  itemContentDidChange: function(item, key, alwaysNull, index) {
    var items = this.get('items'),
        childViews = this.get('childViews'),
        childView;

    childView = childViews.objectAt(index);
    if (childView) {

      // Update the childView
      childView.updateItem(this, item);
    } else {
      SC.Logger.warn("Item content change was observed on item without matching segment child view.");
    }

    // Reset our measurements (which depend on width/height or title) and adjust visible views
    if (this.get('shouldHandleOverflow')) {
      this.invokeLast(this.remeasure);
    }
  },

  /** @private
    Whenever the view resizes, we need to check to see if we're overflowing.
  */
  viewDidResize: function() {
    var isHorizontal = this.get('layoutDirection') === SC.LAYOUT_HORIZONTAL,
        visibleDim = isHorizontal ? this.$().width() : this.$().height();

    // Only overflow if we've gone below the minimum dimension required to fit all the segments
    if (this.get('shouldHandleOverflow') && (this.isOverflowing || visibleDim <= this.cachedMinimumDim)) {
	  this.adjustOverflow();
    }
  },

  /** @private
    Whenever visibility changes, we need to check to see if we're overflowing.
  */
  isVisibleInWindowDidChange: function() {
    if (this.get('shouldHandleOverflow')) {
      this.invokeLast(this.remeasure);
    }
  }.observes('isVisibleInWindow'),

  /** @private
    Calling this method forces the segments to be remeasured and will also adjust the
    segments for overflow if necessary.
  */
  remeasure: function() {
    if (!this.get('shouldHandleOverflow')) { return; }
    var renderDelegate = this.get('renderDelegate'),
        childViews = this.get('childViews'),
        overflowView;

    if (this.get('isVisibleInWindow')) {
      // Make all the views visible so that they can be measured
      overflowView = childViews.lastObject();
      overflowView.set('isVisible', YES);

      for (var i = childViews.get('length') - 1; i >= 0; i--){
        childViews.objectAt(i).set('isVisible', YES);
      }


      this.cachedDims = this.segmentDimensions();
      this.cachedOverflowDim = this.overflowSegmentDim();

      this.adjustOverflow();
    }
  },

  /** @private
    This method is called to adjust the segment views to see if we need to handle for overflow.
   */
  adjustOverflow: function() {
    if (!this.get('shouldHandleOverflow')) { return; }

    var childViews = this.get('childViews'),
        childView,
        value = this.get('value'),
        overflowView = childViews.lastObject(),
        isHorizontal = this.get('layoutDirection') === SC.LAYOUT_HORIZONTAL,
        visibleDim = isHorizontal ? this.$().width() : this.$().height(),  // The inner width/height of the div
        curElementsDim = 0,
        dimToFit,
        length, i;

    // This variable is useful to optimize when we are overflowing
    this.isOverflowing = NO;
    overflowView.set('isSelected', NO);

    // Clear out the overflow items (these are the items not currently visible)
    this.overflowItems = [];

    length = this.cachedDims.length;
    for (i=0; i < length; i++) {
      childView = childViews.objectAt(i);
      curElementsDim += this.cachedDims[i];

      // check for an overflow (leave room for the overflow segment except for with the last segment)
      dimToFit = (i === length - 1) ? curElementsDim : curElementsDim + this.cachedOverflowDim;

      if (dimToFit > visibleDim) {
        // Add the localItem to the overflowItems
        this.overflowItems.pushObject(childView.get('localItem'));

        // Record that we're now overflowing
        this.isOverflowing = YES;

        childView.set('isVisible', NO);

        // If the first item is already overflowed, make the overflowView first segment
        if (i === 0) overflowView.set('isFirstSegment', YES);

        // If the overflowed segment was selected, show the overflowView as selected instead
        if (SC.isArray(value) ? value.indexOf(childView.get('value')) >= 0 : value === childView.get('value')) {
          overflowView.set('isSelected', YES);
        }
      } else {
        childView.set('isVisible', YES);

        // If the first item is not overflowed, don't make the overflowView first segment
        if (i === 0) overflowView.set('isFirstSegment', NO);
      }
    }

    // Show/hide the overflow view if we have overflowed
    if (this.isOverflowing) overflowView.set('isVisible', YES);
    else overflowView.set('isVisible', NO);

    // Store the minimum dimension (height/width) before overflow
    this.cachedMinimumDim = curElementsDim + this.cachedOverflowDim;
  },

  /**
    Return the dimensions (either heights or widths depending on the layout direction) of the DOM
    elements of the segments.  This will be measured by the view to determine which segments should
    be overflowed.

    It ignores the last segment (the overflow segment).
  */
  segmentDimensions: function() {
    var cv = this.get('childViews'),
        v, f,
        dims = [],
        isHorizontal = this.get('layoutDirection') === SC.LAYOUT_HORIZONTAL;

    for (var i = 0, length = cv.length; i < length - 1; i++) {
      v = cv[i];
      f = v.get('frame');
      dims[i] = isHorizontal ? f.width : f.height;
    }

    return dims;
  },

  /**
    Return the dimension (height or width depending on the layout direction) over the overflow segment.
  */
  overflowSegmentDim: function() {
    var cv = this.get('childViews'),
        v, f,
        isHorizontal = this.get('layoutDirection') === SC.LAYOUT_HORIZONTAL;

    v = cv.length && cv[cv.length - 1];
    if (v) {
      f = v.get('frame');
      return isHorizontal ? f.width : f.height;
    }

    return 0;
  },

  /**
    Return the index of the segment view that is the target of the mouse click.
  */
  indexForClientPosition: function(x, y) {
    var cv = this.get('childViews'),
        length, i,
        v, rect,
        point;

    point = {x: x, y: y};
    for (i = 0, length = cv.length; i < length; i++) {
      v = cv[i];

      rect = v.get('layer').getBoundingClientRect();
      rect = {
        x: rect.left,
        y: rect.top,
        width: (rect.right-rect.left),
        height: (rect.bottom - rect.top)
      };

      // Return the index early if found
      if (SC.pointInRect(point, rect)) return i;
    }

    // Default not found
    return -1;
  },

  // ..........................................................
  // RENDERING/DISPLAY SUPPORT
  //

  /**
    @type Array
    @default ['align']
    @see SC.View#displayProperties
  */
  displayProperties: ['align'],

  /**
    @type String
    @default 'segmentedRenderDelegate'
  */
  renderDelegateName: 'segmentedRenderDelegate',

  // ..........................................................
  // EVENT HANDLING
  //

  /** @private
    Determines the index into the displayItems array where the passed mouse
    event occurred.
  */
  displayItemIndexForEvent: function(evt) {
    var renderDelegate = this.get('renderDelegate');
    var x = evt.clientX;
    var y = evt.clientY;

    // Accessibility workaround: <rdar://problem/10467360> WebKit sends all event coords as 0,0 for all AXPress-triggered events
    if (x === 0 && y === 0) {
      var el = evt.target;
      if (el) {
        var offset = SC.offset(el);
        x = offset.x + Math.round(el.offsetWidth/2);
        y = offset.y + Math.round(el.offsetHeight/2);
      }
    }

    if (renderDelegate && renderDelegate.indexForClientPosition) {
      return renderDelegate.indexForClientPosition(this, x, y);
    }

    return this.indexForClientPosition(evt.clientX, evt.clientY);
  },

  /** @private */
  keyDown: function(evt) {
    var childViews,
        childView,
        i, length,
        value, isArray;

    // handle tab key
    if (evt.which === 9 || evt.keyCode === 9) {
      var view = evt.shiftKey ? this.get('previousValidKeyView') : this.get('nextValidKeyView');
      if(view) view.becomeFirstResponder();
      else evt.allowDefault();
      return YES ; // handled
    }

    // handle arrow keys
    if (!this.get('allowsMultipleSelection')) {
      childViews = this.get('childViews');

      length = childViews.get('length');
      value = this.get('value');
      isArray = SC.isArray(value);

      // Select from the left to the right
      if (evt.which === 39 || evt.which === 40) {

        if (value) {
          for(i = 0; i < length - 2; i++){
            childView = childViews.objectAt(i);
            if ( isArray ? (value.indexOf(childView.get('value'))>=0) : (childView.get('value')===value)){
              this.triggerItemAtIndex(i + 1);
            }
          }
        } else {
          this.triggerItemAtIndex(0);
        }
        return YES ; // handled

      // Select from the right to the left
      } else if (evt.which === 37 || evt.which === 38) {

        if (value) {
          for(i = 1; i < length - 1; i++) {
            childView = childViews.objectAt(i);
            if ( isArray ? (value.indexOf(childView.get('value'))>=0) : (childView.get('value')===value)){
              this.triggerItemAtIndex(i - 1);
            }
          }
        } else {
          this.triggerItemAtIndex(length - 2);
        }

        return YES; // handled
      }
    }

    return NO;
  },

  /** @private */
  mouseDown: function(evt) {
    var childViews = this.get('childViews'),
        childView,
        overflowIndex = childViews.get('length') - 1,
        index;

    if (!this.get('isEnabled')) return YES; // nothing to do

    index = this.displayItemIndexForEvent(evt);
    if (index >= 0) {
      childView = childViews.objectAt(index);
      if (childView.get('isEnabled')) childView.set('isActive', YES);
      this.activeChildView = childView;

      // if mouse was pressed on the overflow segment, popup the menu
      if (index === overflowIndex) this.showOverflowMenu();
      else this._isMouseDown = YES;
    }

    return YES;
  },

  /** @private */
  mouseUp: function(evt) {
    var activeChildView,
        index;

    index = this.displayItemIndexForEvent(evt);
    if (this._isMouseDown && (index >= 0)) {

      this.triggerItemAtIndex(index);

      // Clean up
      activeChildView = this.activeChildView;
      if (activeChildView) {
        activeChildView.set('isActive', NO);
        this.activeChildView = null;
      }
    }

    this._isMouseDown = NO;
    return YES;
  },

  /** @private */
  mouseMoved: function(evt) {
    var childViews = this.get('childViews'),
        overflowIndex = childViews.get('length') - 1,
        activeChildView,
        childView,
        index;

    if (this._isMouseDown) {
      // Update the last segment
      index = this.displayItemIndexForEvent(evt);

      activeChildView = this.activeChildView;
      childView = childViews.objectAt(index);

      if (childView && childView !== activeChildView) {
        // Changed
        if (activeChildView) activeChildView.set('isActive', NO);
        if (childView.get('isEnabled')) childView.set('isActive', YES);
        this.activeChildView = childView;

        if (index === overflowIndex) {
          this.showOverflowMenu();
          this._isMouseDown = NO;
        }
      }
    }
    return YES;
  },

  /** @private */
  mouseEntered: function(evt) {
    var childViews = this.get('childViews'),
        childView,
        overflowIndex = childViews.get('length') - 1,
        index;

    // if mouse was pressed down initially, start detection again
    if (this._isMouseDown) {
      index = this.displayItemIndexForEvent(evt);

      // if mouse was pressed on the overflow segment, popup the menu
      if (index === overflowIndex) {
        this.showOverflowMenu();
        this._isMouseDown = NO;
      } else if (index >= 0) {
        childView = childViews.objectAt(index);
        if (childView.get('isEnabled')) childView.set('isActive', YES);

        this.activeChildView = childView;
      }
    }
    return YES;
  },

  /** @private */
  mouseExited: function(evt) {
    var activeChildView;

    // if mouse was down, hide active index
    if (this._isMouseDown) {
      activeChildView = this.activeChildView;
      if (activeChildView) activeChildView.set('isActive', NO);

      this.activeChildView = null;
    }

    return YES;
  },

  /** @private */
  touchStart: function(touch) {
    var childViews = this.get('childViews'),
        childView,
        overflowIndex = childViews.get('length') - 1,
        index;

    if (!this.get('isEnabled')) return YES; // nothing to do

    index = this.displayItemIndexForEvent(touch);

    if (index >= 0) {
      childView = childViews.objectAt(index);
      childView.set('isActive', YES);
      this.activeChildView = childView;

      // if touch was on the overflow segment, popup the menu
      if (index === overflowIndex) this.showOverflowMenu();
      else this._isTouching = YES;
    }

    return YES ;
  },

  /** @private */
  touchEnd: function(touch) {
    var activeChildView,
        index;

    index = this.displayItemIndexForEvent(touch);

    if (this._isTouching && (index >= 0)) {
      this.triggerItemAtIndex(index);

      // Clean up
      activeChildView = this.activeChildView;
      activeChildView.set('isActive', NO);
      this.activeChildView = null;

      this._isTouching = NO;
    }

    return YES;
  },

  /** @private */
  touchesDragged: function(evt, touches) {
    var isTouching = this.touchIsInBoundary(evt),
        childViews = this.get('childViews'),
        overflowIndex = childViews.get('length') - 1,
        activeChildView,
        childView,
        index;

    if (isTouching) {
      if (!this._isTouching) {
        this._touchDidEnter(evt);
      }
      index = this.displayItemIndexForEvent(evt);

      activeChildView = this.activeChildView;
      childView = childViews[index];

      if (childView && childView !== activeChildView) {
        // Changed
        if (activeChildView) activeChildView.set('isActive', NO);
        childView.set('isActive', YES);

        this.activeChildView = childView;

        if (index === overflowIndex) {
          this.showOverflowMenu();
          this._isMouseDown = NO;
        }
      }
    } else {
      if (this._isTouching) this._touchDidExit(evt);
    }

    this._isTouching = isTouching;

    return YES;
  },

  /** @private */
  _touchDidExit: function(evt) {
    var activeChildView;

    if (this.isTouching) {
      activeChildView = this.activeChildView;
      activeChildView.set('isActive', NO);
      this.activeChildView = null;
    }

    return YES;
  },

  /** @private */
  _touchDidEnter: function(evt) {
    var childViews = this.get('childViews'),
        childView,
        overflowIndex = childViews.get('length') - 1,
        index;

    index = this.displayItemIndexForEvent(evt);

    if (index === overflowIndex) {
      this.showOverflowMenu();
      this._isTouching = NO;
    } else if (index >= 0) {
      childView = childViews.objectAt(index);
      childView.set('isActive', YES);
      this.activeChildView = childView;
    }

    return YES;
  },

  /** @private
    Simulates the user clicking on the segment at the specified index. This
    will update the value if possible and fire the action.
  */
  triggerItemAtIndex: function(index) {
    var childViews = this.get('childViews'),
        childView,
        sel, value, val, empty, mult;

    childView = childViews.objectAt(index);

    if (!childView.get('isEnabled')) return this; // nothing to do!

    empty = this.get('allowsEmptySelection');
    mult = this.get('allowsMultipleSelection');

    // get new value... bail if not enabled. Also save original for later.
    sel = childView.get('value');
    value = val = this.get('value') ;

    if (SC.empty(value)) {
      value = [];
    } else if (!SC.isArray(value)) {
      value = [value]; // force to array
    }

    // if we do not allow multiple selection, either replace the current
    // selection or deselect it
    if (!mult) {
      // if we allow empty selection and the current value is the same as
      // the selected value, then deselect it.
      if (empty && (value.get('length')===1) && (value.objectAt(0)===sel)) {
        value = [];

      // otherwise, simply replace the value.
      } else value = [sel] ;

    // if we do allow multiple selection, then add or remove item to the array.
    } else {
      if (value.indexOf(sel) >= 0) {
        if (value.get('length')>1 || (value.objectAt(0)!==sel) || empty) {
          value = value.without(sel);
        }
      } else value = value.concat([sel]) ;
    }

    // normalize back to non-array form
    switch(value.get('length')) {
      case 0:
        value = null;
        break;
      case 1:
        value = value.objectAt(0);
        break;
      default:
        break;
    }

    // also, trigger target if needed.
    var actionKey = this.get('itemActionKey'),
        targetKey = this.get('itemTargetKey'),
        action, target = null,
        resp = this.getPath('pane.rootResponder'),
        item;

    if (actionKey && (item = this.get('items').objectAt(index))) {
      // get the source item from the item array.  use the index stored...
      action = item.get ? item.get(actionKey) : item[actionKey];
      if (targetKey) {
        target = item.get ? item.get(targetKey) : item[targetKey];
      }
      if (resp) resp.sendAction(action, target, this, this.get('pane'),value);
    }

    if(val !== undefined && (!action || this.get('selectSegmentWhenTriggeringAction'))) {
      this.set('value', value);
    }

    // if an action/target is defined on self use that also
    action =this.get('action');
    if (action && resp) {
      resp.sendAction(action, this.get('target'), this, this.get('pane'),value);
    }
  },

  /** @private
    Invoked whenever an item is selected in the overflow menu.
  */
  selectOverflowItem: function(menu) {
    var item = menu.get('selectedItem');

    this.triggerItemAtIndex(item.get('index'));

    // Cleanup
    menu.removeObserver('selectedItem', this, 'selectOverflowItem');

    this.activeChildView.set('isActive', NO);
    this.activeChildView = null;
  },

  /** @private
    Presents the popup menu containing overflowed segments.
  */
  showOverflowMenu: function() {
    var childViews = this.get('childViews'),
        overflowViewIndex = childViews.get('length') - 1,
        overflowItems = this.overflowItems,
        overflowItemsLength,
        startIndex,
        isArray, value;

    // Check the currently selected item if it is in overflowItems
    overflowItemsLength = overflowItems.get('length');
    startIndex = childViews.get('length') - 1 - overflowItemsLength;

    value = this.get('value');
    isArray = SC.isArray(value);
    for (var i = 0; i < overflowItemsLength; i++) {
      var item = overflowItems.objectAt(i),
          itemValueKey = this.get('itemValueKey');

      if (isArray ? value.indexOf(item.get(itemValueKey)) >= 0 : value === item.get(itemValueKey)) {
        item.set('isChecked', YES);
      } else {
        item.set('isChecked', NO);
      }

      // Track the matching segment index
      item.set('index', startIndex + i);
    }

    // TODO: we can't pass a shortcut key to the menu, because it isn't a property of SegmentedView (yet?)
    var self = this;

    var menu = SC.MenuPane.create({
      layout: { width: 200 },
      items: overflowItems,
      itemTitleKey: this.get('itemTitleKey'),
      itemIconKey: this.get('itemIconKey'),
      itemIsEnabledKey: this.get('itemIsEnabledKey'),
      itemKeyEquivalentKey: this.get('itemKeyEquivalentKey'),
      itemCheckboxKey: 'isChecked',

      // We need to be able to update our overflow segment even if the user clicks outside of the menu.  Since
      // there is no callback method or observable property when the menu closes, override modalPaneDidClick().
      modalPaneDidClick: function() {
        arguments.callee.base.apply(this,arguments);

        // Cleanup
        this.removeObserver('selectedItem', self, 'selectOverflowItem');

        self.activeChildView.set('isActive', NO);
        self.activeChildView = null;
      }
    });

    var layer = this.get('layer');
    var overflowElement = layer.childNodes[layer.childNodes.length - 1];
    menu.popup(overflowElement);

    menu.addObserver("selectedItem", this, 'selectOverflowItem');
  },

  /** @private
    Whenever the value changes, update the segments accordingly.
  */
  valueDidChange: function() {
    var value = this.get('value'),
        overflowItemsLength,
        childViews = this.get('childViews'),
        overflowIndex = Infinity,
        overflowView = childViews.lastObject(),
        childView,
        isSelected;

    // The index where childViews are all overflowed
    if (this.overflowItems) {
      overflowItemsLength = this.overflowItems.get('length');
      overflowIndex = childViews.get('length') - 1 - overflowItemsLength;

      // Clear out the selected value of the overflowView (if it's set)
      overflowView.set('isSelected', NO);
    }

    for (var i = childViews.get('length') - 2; i >= 0; i--) {
      childView = childViews.objectAt(i);
      if (SC.isArray(value) ? value.indexOf(childView.get('value')) >= 0 : value === childView.get('value')) {
        childView.set('isSelected', YES);

        // If we've gone over the overflow index, the child view is represented in overflow items
        if (i >= overflowIndex) overflowView.set('isSelected', YES);
      } else {
        childView.set('isSelected', NO);
      }
    }
  }.observes('value')

});

/* >>>>>>>>>> BEGIN source/views/tab.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('views/segmented');

/**
  @static
  @type String
  @constant
*/
SC.TOP_LOCATION = 'top';

/**
  @static
  @type String
  @constant
*/
SC.TOP_TOOLBAR_LOCATION = 'top-toolbar';

/**
  @static
  @type String
  @constant
*/
SC.BOTTOM_LOCATION = 'bottom';

/**
  @class

  Incorporates a segmented view and a container view to display the selected
  tab.  Provide an array of items, which will be passed onto the segmented
  view.

  @extends SC.View
  @since SproutCore 1.0
*/
SC.TabView = SC.View.extend(
/** @scope SC.TabView.prototype */ {

  /**
    @type Array
    @default ['sc-tab-view']
    @see SC.View#classNames
  */
  classNames: ['sc-tab-view'],

  /**
    @type Array
    @default ['nowShowing']
    @see SC.View#displayProperties
  */
  displayProperties: ['nowShowing'],

  // ..........................................................
  // PROPERTIES
  //

 /**
    Set nowShowing with the page you want to display.

    @type String
    @default null
  */
  nowShowing: null,

  /**
    @type Array
    @default []
  */
  items: [],

  /**
    @type Boolean
    @default YES
  */
  isEnabled: YES,

  /**
    @type String
    @default null
  */
  itemTitleKey: null,

  /**
    @type String
    @default null
  */
  itemValueKey: null,

  /**
    @type String
    @default null
  */
  itemIsEnabledKey: null,

  /**
    @type String
    @default null
  */
  itemIconKey: null,

  /**
    @type String
    @default null
  */
  itemWidthKey: null,

  /**
    @type String
    @default null
  */
  itemToolTipKey: null,

  /**
    @type Number
    @default SC.REGULAR_BUTTON_HEIGHT
  */
  tabHeight: SC.REGULAR_BUTTON_HEIGHT,

  /**
    Possible values:

      - SC.TOP_LOCATION
      - SC.TOP_TOOLBAR_LOCATION
      - SC.BOTTOM_LOCATION

    @type String
    @default SC.TOP_LOCATION
  */
  tabLocation: SC.TOP_LOCATION,

  /**
    If set, then the tab location will be automatically saved in the user
    defaults.  Browsers that support localStorage will automatically store
    this information locally.

    @type String
    @default null
  */
  userDefaultKey: null,


  // ..........................................................
  // FORWARDING PROPERTIES
  //

  // forward important changes on to child views
  /** @private */
  _tab_nowShowingDidChange: function() {
    var v = this.get('nowShowing');
    this.get('containerView').set('nowShowing',v);
    this.get('segmentedView').set('value',v);
    return this ;
  }.observes('nowShowing'),

  /** @private */
  _tab_saveUserDefault: function() {
    // if user default is set, save also
    var v = this.get('nowShowing');
    var defaultKey = this.get('userDefaultKey');
    if (defaultKey) {
      SC.userDefaults.set([defaultKey,'nowShowing'].join(':'), v);
    }
  }.observes('nowShowing'),

  /** @private */
  _tab_itemsDidChange: function() {
    this.get('segmentedView').set('items', this.get('items'));
    return this ;
  }.observes('items'),

  /** @private
    Restore userDefault key if set.
  */
  init: function() {
    arguments.callee.base.apply(this,arguments);
    this._tab_nowShowingDidChange()._tab_itemsDidChange();
  },

  /** @private */
  awake: function() {
    arguments.callee.base.apply(this,arguments);
    var defaultKey = this.get('userDefaultKey');
    if (defaultKey) {
      defaultKey = [defaultKey,'nowShowing'].join(':');
      var nowShowing = SC.userDefaults.get(defaultKey);
      if (!SC.none(nowShowing)) this.set('nowShowing', nowShowing);
    }

  },

  /** @private */
  createChildViews: function() {
    var childViews  = [], containerView, layout,
        tabLocation = this.get('tabLocation'),
        tabHeight   = this.get('tabHeight'),
        controlSize = this.get('controlSize');

    if (tabLocation === SC.TOP_LOCATION) {
      layout = { top: tabHeight/2+1, left: 0, right: 0, bottom: 0, border: 1 };
    } else if (tabLocation === SC.TOP_TOOLBAR_LOCATION) {
      layout = { top: tabHeight+1, left: 0, right: 0, bottom: 0, border: 1 };
    } else {
      layout = { top: 0, left: 0, right: 0, bottom: (tabHeight/2) - 1, border: 1 };
    }

    containerView = this.containerView.extend({
      layout: layout,
      //adding the role
      ariaRole: 'tabpanel'
    });

    this.containerView = this.createChildView(containerView) ;
    
    //  The segmentedView managed by this tab view.  Note that this TabView uses
    //  a custom segmented view.  You can access this view but you cannot change
    // it.
    layout = (tabLocation === SC.TOP_LOCATION ||
              tabLocation === SC.TOP_TOOLBAR_LOCATION) ?
             { height: tabHeight, left: 0, right: 0, top: 0 } :
             { height: tabHeight, left: 0, right: 0, bottom: 0 } ;

    this.segmentedView = this.get('segmentedView').extend({
      layout: layout,

      controlSize: controlSize,

      /** @private
        When the value changes, update the parentView's value as well.
      */
      _sc_tab_segmented_valueDidChange: function() {
        var pv = this.get('parentView');
        if (pv) pv.set('nowShowing', this.get('value'));
      }.observes('value'),

      /** @private */
      init: function() {
        // before we setup the rest of the view, copy key config properties
        // from the owner view...
        var pv = this.get('parentView');
        if (pv) {
          SC._TAB_ITEM_KEYS.forEach(function(k) { this[k] = pv.get(k); }, this);
        }
        return arguments.callee.base.apply(this,arguments);
      }
    });

    this.segmentedView = this.createChildView(this.segmentedView) ;
    
    childViews.push(this.segmentedView);
    childViews.push(this.containerView);
    
    this.set('childViews', childViews);
    return this;
  },

  // ..........................................................
  // COMPONENT VIEWS
  //

  /**
    The containerView managed by this tab view.  Note that TabView uses a
    custom container view.  You can access this view but you cannot change
    it.

    @type SC.View
    @default SC.ContainerView
    @readOnly
  */
  containerView: SC.ContainerView.extend({ renderDelegateName: 'wellRenderDelegate' }),

  /**
    @type SC.View
    @default SC.SegmentedView
  */
  segmentedView: SC.SegmentedView

}) ;

SC._TAB_ITEM_KEYS = ['itemTitleKey', 'itemValueKey', 'itemIsEnabledKey', 'itemIconKey', 'itemWidthKey', 'itemToolTipKey', 'itemActionKey', 'itemTargetKey'];

/* >>>>>>>>>> BEGIN source/views/toolbar.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

/**
  Layout properties needed to anchor a view to the top.
  
  @static
  @constant
  @type Hash
  @default `{ top: 0 }`
*/
SC.ANCHOR_TOP = { top: 0 };

/**
  Layout properties needed to anchor a view to the left.
  
  @static
  @constant
  @type Hash
  @default `{ left: 0 }`
*/
SC.ANCHOR_LEFT = { left: 0 };

/*
  Layout properties to anchor a view to the top left
  
  @static
  @constant
  @type Hash
  @default `{ top: 0, left: 0 }`
*/
SC.ANCHOR_TOP_LEFT = { top: 0, left: 0 };

/**
  Layout properties to anchoe view to the bottom.
  
  @static
  @constant
  @type Hash
  @default `{ bottom: 0 }`
*/
SC.ANCHOR_BOTTOM = { bottom: 0 };

/**
  Layout properties to anchor a view to the right.
  
  @static
  @constant
  @type Hash
  @default `{ right: 0 }`
*/
SC.ANCHOR_RIGHT = { right: 0 } ;

/**
  Layout properties to anchor a view to the bottom right.
  
  @static
  @constant
  @type Hash
  @default `{ top: 0, right: 0 }`
*/
SC.ANCHOR_BOTTOM_RIGHT = { bottom: 0, right: 0 };

/** @class

  A toolbar view can be anchored at the top or bottom of the window to contain
  your main toolbar buttons.

  You can also override the layout property yourself or simply set the
  anchorLocation to `SC.ANCHOR_TOP` or `SC.ANCHOR_BOTTOM`.  This will configure
  the layout of your toolbar automatically when it is created.

  @extends SC.View
  @since SproutCore 1.0
*/
SC.ToolbarView = SC.View.extend(
/** @scope SC.ToolbarView.prototype */ {

  /**
    @type Array
    @default ['sc-toolbar-view']
    @see SC.View#classNames
  */
  classNames: ['sc-toolbar-view'],

  /**
    The WAI-ARIA role for toolbar view.

    @type String
    @default 'toolbar'
    @readOnly
  */
  ariaRole: 'toolbar',

  /**
    @type String
    @default 'toolbarRenderDelegate'
  */
  renderDelegateName: 'toolbarRenderDelegate',

  /**
    Default anchor location.  This will be applied automatically to the
    toolbar layout if you set it. Possible values:
    
      - SC.ANCHOR_TOP
      - SC.ANCHOR_LEFT
      - SC.ANCHOR_TOP_LEFT
      - SC.ANCHOR_BOTTOM
      - SC.ANCHOR_RIGHT
      - SC.ANCHOR_BOTTOM_RIGHT
    
    @type String
    @default null
  */
  anchorLocation: null,

  // ..........................................................
  // INTERNAL SUPPORT
  //

  /** @private */
  layout: { left: 0, height: 32, right: 0 },

  /** @private */
  init: function() {
    // apply anchor location before setting up the rest of the view.
    if (this.anchorLocation) {
      this.layout = SC.merge(this.layout, this.anchorLocation);
    }
    arguments.callee.base.apply(this,arguments);
  }

});


