/* >>>>>>>>>> BEGIN source/core.js */
// ==========================================================================
// Project:   SYN
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals SYN */

/** @namespace

  My cool new framework.  Describe your framework.
  
  @extends SC.Object
*/
SYN = SC.Object.create(
  /** @scope SYN.prototype */ {

  NAMESPACE: 'SYN',
  VERSION: '0.1.0',

  // TODO: Add global constants or singleton objects needed by your app here.

}) ;

/* >>>>>>>>>> BEGIN source/custom_components/segment.js */
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
SYN.SegmentView = SC.View.extend(SC.Control,
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
  toolTip: NO,

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
  layoutDirection: SC.LAYOUT_VERTICAL,   

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

/* >>>>>>>>>> BEGIN source/custom_components/segmented.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('custom_components/segment');

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
SYN.SegmentedView = SC.View.extend(SC.Control,
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
  align: SC.ALIGN_LEFT,

  /**
    Change the layout direction to make this a vertical set of tabs instead
    of horizontal ones. Possible values:

      - SC.LAYOUT_HORIZONTAL
      - SC.LAYOUT_VERTICAL

    @type String
    @default SC.LAYOUT_HORIZONTAL
  */
  layoutDirection: SC.LAYOUT_VERTICAL,


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
      isOverflowSegment: w,
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

/* >>>>>>>>>> BEGIN source/custom_components/stream_blog_row_view.js */
SYN.StreamBlogRowView = SC.ScrollView.extend({
  layout:{left: 0, right: 0, height: 195, top: 0},
  hasHorizontalScroller: YES,
  hasVerticalScroller: NO,
  isVerticalScrollerVisible: NO,
  alwaysBounceVertical: NO,
  contentRow: '',

  contentView: SC.CollectionView.extend(SC.FlowedLayout, {
    defaultFlowSpacing: { left:0, right:0 },
    flowPadding: { left: 0, bottom: 0, right: 0, top: 0 },
    layoutDirection: SC.LAYOUT_HORIZONTAL,
    canWrap: NO,
    contentBinding:'.parentView.parentView.contentRow',

   exampleView: SC.View.extend({
      classNames: ['stream-cell-container'],
      layout:{ height: 195,  width:185 },
      render:function(context) {
        var content = this.getPath('content');
        if (!content) return
        var img = content.get('userIconSmall');
        var blogTitle = content.getPath('blogs.firstObject.title');
        var blogicon = content.getPath('blogs.firstObject.icon');
       
        var userIcon = ['<div class="user-icon" style="background-image:url('+img+')">','</div>'].join('');
        var blogIcon = ['<div class="photo-preview" style="background-image:url('+blogicon+')">','</div>'].join('');
        var title = ['<div class="title">',blogTitle,'</div>',].join('');
        context.push(userIcon, title, blogIcon);
      },
      
      mouseDown: function(evt) {
         // Sprouttrailers.statechart.sendEvent('doShowQuickPreview', this.getPath('content.location'), 2);
      }
      
    })
    
  })
  
});
/* >>>>>>>>>> BEGIN source/custom_components/stream_photo_row_view.js */
SYN.StreamPhotoRowView = SC.ScrollView.extend({
  layout:{left: 0, right: 0, height: 195, top: 0},
  hasHorizontalScroller: YES,
  hasVerticalScroller: NO,
  isVerticalScrollerVisible: NO,
  alwaysBounceVertical: NO,
  contentRow: '',

  contentView: SC.CollectionView.extend(SC.FlowedLayout, {
    defaultFlowSpacing: { left:0, right:0 },
    flowPadding: { left: 0, bottom: 0, right: 0, top: 0 },
    layoutDirection: SC.LAYOUT_HORIZONTAL,
    canWrap: NO,
    contentBinding:'.parentView.parentView.contentRow',

   exampleView: SC.View.extend({
      classNames: ['stream-cell-container'],
      layout:{ height: 195,  width:185 },
      render:function(context) {
        var content = this.getPath('content');
        if (!content) return
        var photo = content.getPath('photos.firstObject.file');
        var img = content.get('userIconSmall');
        var photoTitle = content.getPath('photos.firstObject.title');
        
        var userIcon = ['<div class="user-icon" style="background-image:url('+img+')">','</div>'].join('');
        var title = ['<div class="title">',photoTitle,'</div>',].join('');
        var userPhoto = ['<div class="photo-preview shadow-bottom" style="background-image:url('+photo+')">','</div>'].join('');
        
        context.push(userIcon, title, userPhoto);
      },
      
      mouseDown: function(evt) {
         // Sprouttrailers.statechart.sendEvent('doShowQuickPreview', this.getPath('content.location'), 2);
      }
      
    })
    
  })
  
});
/* >>>>>>>>>> BEGIN source/custom_components/stream_title_cells.js */
SYN.StreamTitleCells = SC.View.extend ({
  classNames: ['shadow-right'],
  childViews: ['blogTitleCell', 'photoTitleCell', 'videoTitleCell', 'websiteTitleCell'],
  
  blogTitleCell: SC.View.design ({
    layout: { top: 0, left: 0, height: 195, right: 0 },
    
    render: function(context){
			context.push([
				'<div class="absolute">',"Blog",'</div>',
			].join(''))
		},
        
  }),
  
  photoTitleCell: SC.View.design ({
    layout: { top: 195, left: 0, height: 195, right: 0 },
    
    render: function(context){
			context.push([
				'<div class="absolute">',"Photo",'</div>',
			].join(''))
		},
    
  }),
  
  videoTitleCell: SC.View.design ({
    layout: { top: 390, left: 0, height: 195, right: 0 },
    
    render: function(context){
			context.push([
				'<div class="absolute">',"Vidoe",'</div>',
			].join(''))
		},
    
  }),
  
  websiteTitleCell: SC.View.design ({
    layout: { top: 585, left: 0, height: 195, right: 0 },
    
    render: function(context){
			context.push([
				'<div class="absolute">',"Website",'</div>',
			].join(''))
		},
    
  }),
    
});
/* >>>>>>>>>> BEGIN source/custom_components/stream_video_row_view.js */
SYN.StreamVideoRowView = SC.ScrollView.extend({
  layout:{left: 0, right: 0, height: 195, top: 0},
  hasHorizontalScroller: YES,
  hasVerticalScroller: NO,
  isVerticalScrollerVisible: NO,
  alwaysBounceVertical: NO,
  contentRow: '',

  contentView: SC.CollectionView.extend(SC.FlowedLayout, {
    defaultFlowSpacing: { left:0, right:0 },
    flowPadding: { left: 0, bottom: 0, right: 0, top: 0 },
    layoutDirection: SC.LAYOUT_HORIZONTAL,
    canWrap: NO,
    contentBinding:'.parentView.parentView.contentRow',

   exampleView: SC.View.extend({
      classNames: ['stream-cell-container'],
      layout:{ height: 195,  width:185 },
      render:function(context) {
        var content = this.getPath('content');
        if (!content) return
        var photo = content.getPath('photos.firstObject.file');
        var img = content.get('userIconSmall');
        var userIcon = ['<div class="user-icon" style="background-image:url('+img+')">','</div>'].join('');
        var userPhoto = ['<div class="photo-preview shadow-bottom" style="background-image:url('+photo+')">','</div>'].join('');
        context.push(userIcon, userPhoto);
      },
      
      mouseDown: function(evt) {
         // Sprouttrailers.statechart.sendEvent('doShowQuickPreview', this.getPath('content.location'), 2);
      }
      
    })
    
  })
  
});
/* >>>>>>>>>> BEGIN source/custom_components/stream_website_row_view.js */
SYN.StreamWebsiteRowView = SC.ScrollView.extend({
  layout:{left: 0, right: 0, height: 195, top: 0},
  hasHorizontalScroller: YES,
  hasVerticalScroller: NO,
  isVerticalScrollerVisible: NO,
  alwaysBounceVertical: NO,
  contentRow: '',

  contentView: SC.CollectionView.extend(SC.FlowedLayout, {
    defaultFlowSpacing: { left:0, right:0 },
    flowPadding: { left: 0, bottom: 0, right: 0, top: 0 },
    layoutDirection: SC.LAYOUT_HORIZONTAL,
    canWrap: NO,
    contentBinding:'.parentView.parentView.contentRow',

   exampleView: SC.View.extend({
      classNames: ['stream-cell-container'],
      layout:{ height: 195,  width:185 },
      
      render:function(context) {
        var content = this.getPath('content');
        if (!content) return
        // var websiteURL = content.getPath('websites.firstObject.url');
        var img = content.get('userIconSmall');
        var websiteTitle = content.getPath('websites.firstObject.title');
        
        var userIcon = ['<div class="user-icon" style="background-image:url('+img+')">','</div>'].join('');
        var title = ['<div class="title">',websiteTitle,'</div>',].join('');
       //  var websitePreview = ['<iframe class="photo-preview" src="' + websiteURL +'" seamless="seamless"></iframe>'].join('');
        // var userPhoto = ['<div class="photo-preview" style="background-image:url('+photo+')">','</div>'].join('');
        context.push(userIcon, title);
      },
      
      mouseDown: function(evt) {
         // Sprouttrailers.statechart.sendEvent('doShowQuickPreview', this.getPath('content.location'), 2);
      },
      
    })
    
  })
  
});
/* >>>>>>>>>> BEGIN source/custom_components/strings.js */
// ==========================================================================
// Project:   SYN Strings
// Copyright: @2012 My Company, Inc.
// ==========================================================================
/*globals SYN */

// Place strings you want to localize here.  In your app, use the key and
// localize it using "key string".loc().  HINT: For your key names, use the
// english string with an underscore in front.  This way you can still see
// how your UI will look and you'll notice right away when something needs a
// localized string added to this file!
//
SC.stringsFor('English', {
  "S.Button.Cancel": "Cancel",
  "S.Button.Save": "Save",

  "S.Account.AddPhoto": "Add Photo",
  "S.Account.BasicInfo": "Basic Information",
  "S.Account.FirstName": "First Name",
  "S.Account.LastName": "Last Name",
  "S.Account.Location": "Location",
  "S.Account.Email": "Email",
  "S.Account.UpdatePassword": "Update Password",
  "S.Account.Password": "Password",
  "S.Account.ConfirmPassword": "Confirm Password",

  "S.Share.WhatToShare": "Choose what you want to share:",
  "S.Share.Blog": "Blog",
  "S.Share.Photo": "Photo",
  "S.Share.Video": "Video",
  "S.Share.WebSite": "Web Site",

  "S.Share.Blog.PostBlog": "Post a new blog",
  "S.Share.Blog.Title": "Blog Title:",
  "S.Share.Blog.Content": "Blog Content:",

  "S.Share.Photo.PostPhoto": "Share a photo",
  "S.Share.Photo.Title": "Photo Title:",
  "S.Share.Photo.Content": "Photo Description:",

  "S.Share.Video.PostVideo": "Share a video",
  "S.Share.Video.Title": "Video Title:",
  "S.Share.Video.Content": "Video Description:",

  "S.Share.WebSite.PostWebSite": "Share a website",
  "S.Share.WebSite.Title": "Website Title:",
  "S.Share.WebSite.Url": "Website URL:",
  "S.Share.WebSite.Content": "Website Description:"
}) ;

/* >>>>>>>>>> BEGIN source/custom_components/tab.js */
// ==========================================================================
// Project:   SproutCore - JavaScript Application Framework
// Copyright: ©2006-2011 Strobe Inc. and contributors.
//            Portions ©2008-2011 Apple Inc. All rights reserved.
// License:   Licensed under MIT license (see license.js)
// ==========================================================================

sc_require('custom_components/segmented');

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
SYN.TabView = SC.View.extend(
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
        controlSize = this.get('controlSize');

        layout = { top: 0, right: 0, bottom: 0, left: 75 },

    containerView = this.containerView.extend({
      layout: layout,
      //adding the role
      ariaRole: 'tabpanel'
    });

    this.containerView = this.createChildView(containerView) ;
    
    //  The segmentedView managed by this tab view.  Note that this TabView uses
    //  a custom segmented view.  You can access this view but you cannot change
    // it.
    layout = { left: 0, width: 75, top: 10, bottom: 0 }

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
  containerView: SC.ContainerView.extend({ 
    renderDelegateName: 'wellRenderDelegate',
  }),

  /**
    @type SC.View
    @default SC.SegmentedView
  */
  segmentedView: SC.SegmentedView

}) ;

SC._TAB_ITEM_KEYS = ['itemTitleKey', 'itemValueKey', 'itemIsEnabledKey', 'itemIconKey', 'itemWidthKey', 'itemToolTipKey', 'itemActionKey', 'itemTargetKey'];

/* >>>>>>>>>> BEGIN source/views/account_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.AccountView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the AccountView content here.  

SYN.AccountView = SC.View.extend(
  /** @scope SYN.AccountView.prototype */ {
  layout: { top: 0, right: 0, bottom: 0, left: 0 },
  childViews: [ 'userPhotoButton', 'userPhoto', 'basicInfoView', 'updatePasswordView', 'cancelButton', 'saveButton' ],

	userPhotoButton: SC.ButtonView.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius', 'userButtonPhoto'],
		layout: { top: 30, left: 45, height: 120, width: 130, zIndex: 100 },
		localize: YES,
		action: '',
		target: '',
		title: 'S.Account.AddPhoto',		
	}),
	
	userPhoto: SC.ImageView.design({
	  layout: { top: 30, left: 48, height: 100, width: 125 },
	  value: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/user_photo_placeholder.png', // this is tmp. It should be a value binding
	}),

	basicInfoView: SC.View.design ({
		layout: { top: 30, left: 200, height: 150, right: 100 },
		childViews: [ 'sectionLabel', 'firstName', 'lastName', 'location', 'email' ],
		classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
		
		render: function(context){
			context.push([
				'<div class="forms-alt basic-information-first absolute">','</div>',	
				'<div class="forms-alt basic-information-last absolute">','</div>',		
				'<div class="forms-alt basic-information-location absolute">','</div>',
				'<div class="forms-alt basic-information-email absolute">','</div>',		
			].join(''))
		},

		sectionLabel: SC.LabelView.design ({
			layout: { top: 15, right: 25, left: 25, height: 30 },
			localize: YES,
			value: 'S.Account.BasicInfo'
		}),

		firstName: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 40, left: 40, height: 25, width: 260 },
			localize: YES,
			hint: 'S.Account.FirstName',
			value: ''
		}),

		lastName: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 40, right: 40, height: 25, width: 260 },
			localize: YES,
			hint: 'S.Account.LastName',
			value: ''
		}),

		location: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 95, left: 40, height: 25, width: 260 },
			localize: YES,
			hint: 'S.Account.Location',
			value: ''
		}),

		email: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 95, right: 40, height: 25, width: 260 },
			type: 'email',
			localize: YES,
			hint: 'S.Account.Email',
			value: ''
		})
	}),

	updatePasswordView: SC.View.design ({
		layout: { top: 200, left: 200, height: 100, right: 100 },
		childViews: [ 'sectionLabel', 'password', 'confirmPassword' ],
		classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
		
		render: function(context){
			context.push([
				'<div class="forms-alt update-password-password absolute">','</div>',	
				'<div class="forms-alt update-password-password-confirm absolute">','</div>',
			].join(''))
		},

		sectionLabel: SC.LabelView.design ({
			layout: { top: 15, right: 25, left: 25, height: 30 },
			localize: YES,
			value: 'S.Account.UpdatePassword'
		}),

		password: SC.TextFieldView.design ({
		  classNames: ['text_field_signin'],
			layout: { top: 40, left: 40, height: 25, width: 260 },
			type: 'password',
			localize: YES,
			hint: 'S.Account.Password',
			value: ''
		}),

		confirmPassword: SC.TextFieldView.design ({
			classNames: ['text_field_signin'],
			layout: { top: 40, right: 40, height: 25, width: 260 },
			type: 'password',
			localize: YES,
			hint: 'S.Account.ConfirmPassword',
			value: ''
		}),
	
	}),
	
  cancelButton: SC.ButtonView.design ({
    classNames: ['signin_action_button'],
 	  layout: { top: 320, right: 220, height: 25, width: 100 },
 	  localize: YES,
 	  action: 'cancelAccountUpdate',
	  target: 'Synapse.statechart',
 	  title: 'S.Button.Cancel'
  }),
  
  saveButton: SC.ButtonView.design ({
    classNames: ['signin_action_button'],
 	  layout: { top: 320, right: 100, height: 25, width: 100 },
 	  localize: YES,
 	  action: 'saveAccountUpdate',
 	  target: 'Synapse.statechart',
 	  title: 'S.Button.Save'
  })

});

/* >>>>>>>>>> BEGIN source/views/login_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.LoginView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// The login view... it does what it sounds like.  Imported layout from the TCB.LoginView



SYN.LoginView = SC.View.extend ({
	childViews: ['appIcon', 'viewContainer'],

	
	appIcon: SC.ImageView.design({
	  layout: { top: 165, left: 125, height: 56, width: 300 },
    value: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/synapse_icon_horizontal.png',
    canLoadInBackground: YES,
  }),
	
	viewContainer: SC.View.design({
		classNames: ['embeded_gradient'],
	  layout: { top: 215, centerX: 0, height: 300, width: 755 },
	  childViews: ['actionButton', 'viewDescription', 'userNameForm', 'passwordForm', 'errorMessage'],
	
		render: function(context){
			context.push([
				'<div class="shadow_view anchor_top absolute">','</div>',
				'<div class="shadow_view flipped_element anchor_bottom absolute">','</div>',
				'<div class="sign_in_text text_style absolute">',"Sign In",'</div>',	
				'<div class="line absolute">','</div>',
				'<div class="line_forms_signin absolute">','</div>',
				'<div class="forms signin_forms absolute">','</div>',		
			].join(''))		
		},

		actionButton: SC.ButtonView.design({
			classNames: ['signin_action_button'],
		  layout: { right: 50, bottom: 20, height: 25, width: 100 },
		  title: 'Sign In',
		  action: 'ignoreAuth',
		  target: 'Synapse.statechart',
		  isDefault: YES
		}),

		viewDescription: SC.LabelView.design({
			classNames: ['text_style_paragraph'],
		  layout: { top: 120, left: 35, height: 100, width: 300 },
		  value: 'Login to your Synapse account to share and recieve information.  New to Synapse?  Select the signup button.'
		}),
		
		userNameForm: SC.TextFieldView.design({
			classNames: ['text_field_signin'],
		  layout: { top: 112, right: 98, height: 36, width: 260 },
		  hint: 'Email',
		  valueBinding: 'Synapse.authController.username',
		  isPassword: NO,
		  isTextArea: NO
		}),
		
		passwordForm: SC.TextFieldView.design({
			classNames: ['text_field_signin'],
		  layout: { top: 153, right: 98, height: 36, width: 260 },
		  hint: 'Password',
		  valueBinding: 'Synapse.authController.password',
		  isPassword: YES,
		  isTextArea: NO
		}),
		
		errorMessage: SC.LabelView.design({
		  classNames: ['text_style_paragraph'],
		  layout: { top: 200, right: 98, height: 40, width: 260 },
		  valueBinding: 'Synapse.loginController.errorMessage'
		}),
	  
	}),	
 
});


/* >>>>>>>>>> BEGIN source/views/main_application_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.MainApplicationView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// The main application view is the tabView with navigation buttons on the left.
// We will be swapping out content in the containerView on the right with reg sc.views.
// The content showen on the right is based on the button selected on the left nav.
// All of the views that will be swapped out are created in the /frameworks/synapse_framework/views
// directory. 

SYN.MainApplicationView = SC.View.extend(
  /** @scope SYN.MainApplicationView.prototype */ {
  layout: { top: 0, right: 0, bottom: 0, left: 0 },
  childViews: ['interfaceView','toolBarBase'],
  
  toolBarBase:  SC.ToolbarView.design ({
    classNames: ['base-nav'],
    layout: { top: 0, left: 0, bottom: 0, width: 75 },
    childViews: ['appIcon'],
    
    appIcon: SC.ImageView.design({
      layout: { bottom: 0, left: 16, height: 300, width: 56 },
      value: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/synapse_icon.png',
    }),
    
  }),
  
  interfaceView: SYN.TabView.design({
    classNames: ['custom-tab'],
    layout: { top: 0, right: 0, bottom: 0, left: 0, zIndex: 10 },
    nowShowing: "SYN.StreamView",
    tabHeight: 75,
     
    items: [
      {
        value: "SYN.AccountView",
        itemWidth: 75,
        title: "Account",
        buttonIcon: '/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/account_icon.png',
      },
      
      {
        value: "SYN.ShareView",
        itemWidth: 75,
        title: "Share",
        buttonIcon:'/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/share_icon.png',
      }, 
      
      {
        value: "SYN.StreamView",
        itemWidth: 75,
        title: "Stream",
        buttonIcon:'/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/stream_icon.png',
      },
      
      {
        value: "SYN.UsersView",
        itemWidth: 75,
        title: "Users",
        buttonIcon:'/static/synapse_framework/en/70fa9a730740f19ca6b356099b3a8fecb7bd93b2/source/resources/images/users_icon.png',
      }
       
    ],
    
    itemTitleKey: 'title',
    itemValueKey: 'value',
    itemWidthKey: 'itemWidth',
    itemIconKey: 'buttonIcon',
  }),
  
});

/* >>>>>>>>>> BEGIN source/views/share/create_blog_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.createBlogView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createBlogView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postBlogView'],
	
	postBlogView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },	
    childViews: ['sectionLabel', 'titleField', 'contentField'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },
    
    sectionLabel: SC.LabelView.design ({
    	layout: { top: 20, left: 20, height: 30, width: 225 },
    	localize: YES,
    	value: 'S.Share.Blog.PostBlog'
    }),
    
    titleField: SC.TextFieldView.design ({
      classNames: ['text_field_signin'],
    	layout: { top: 62, left: 265, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.Blog.Title',
    	valueBinding: 'Synapse.blogController.title'
    }),
    
    contentField: SC.TextFieldView.design ({
      classNames: ['text_field_signin'],
    	layout: { top: 112, left: 265, bottom: 125, right: 30 },
    	isTextArea: YES,
    	localize: YES,
    	hint: 'S.Share.Blog.Content',
    	valueBinding: 'Synapse.blogController.description'
    })
    
  }),
    
});
/* >>>>>>>>>> BEGIN source/views/share/create_photo_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.createPhotoView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createPhotoView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postPhotoView'],
	
	postPhotoView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },
    childViews: ['sectionLabel', 'titleField', 'contentField', 'fileField', 'previewPhotoView'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },

	  sectionLabel: SC.LabelView.extend({
		  layout: { top: 20, left: 20, height: 30, width: 225 },
		  localize: YES,
		  value: 'S.Share.Photo.PostPhoto'
	  }),

	  titleField: SC.TextFieldView.extend ({
		  layout: { top: 62, left: 265, height: 35, width: 271 },
		  type: 'email',
		  localize: YES,
		  hint: 'S.Share.Photo.Title',
		  valueBinding: 'Synapse.photoController.title'
	  }),

	  contentField: SC.TextFieldView.extend ({
		  layout: { top: 112, left: 265, bottom: 125, right: 30 },
		  isTextArea: YES,
		  localize: YES,
		  hint: 'S.Share.Photo.Content',
		  valueBinding: 'Synapse.photoController.description'
	  }),

	  fileField: SC.TextFieldView.extend ({
		  layout: { top: 65, left: 605, height: 30, width: 270 },
		  type: 'file',

		  inputChanged: function(evt){
			  var input = evt.target;
			  if (input.files && input.files[0]){
				  Synapse.fileshareController.loadInputFileData(input.files[0], 'image');
			  }
		  },

		  didCreateLayer: function(){
			  var that = this;
			  var layer = this.get('layer');

			  // only accept image inputs
			  $(layer).find('input').attr('accept','image/*');

			  $(layer).bind('change', function(evt){
				  that.inputChanged(evt);
			  });
		  }
	  
	  }),

    previewPhotoView: SC.ImageView.extend ({
		  layout: { top: 180, left: 265, height: 300, width: 400 },
      valueBinding: SC.Binding.from('Synapse.fileshareController.inputFileData')
    }),
    
  }),
  
});
/* >>>>>>>>>> BEGIN source/views/share/create_video_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.createVideoView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createVideoView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postVideoView'],
	
	postVideoView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },
    childViews: ['sectionLabel', 'titleField', 'contentField', 'fileField'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },
    
    sectionLabel: SC.LabelView.extend({
    	layout: { top: 20, left: 20, height: 30, width: 225 },
    	localize: YES,
    	value: 'S.Share.Video.PostVideo'
    }),
    
    titleField: SC.TextFieldView.extend({
    	layout: { top: 62, left: 265, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.Video.Title',
    	valueBinding: 'Synapse.videoController.title'
    }),
    
    contentField: SC.TextFieldView.extend({
    	layout: { top: 112, left: 265, bottom: 125, right: 30 },
    	isTextArea: YES,
    	localize: YES,
    	hint: 'S.Share.Video.Content',
    	valueBinding: 'Synapse.videoController.description'
    }),


    fileField: SC.TextFieldView.extend ({
      layout: { top: 65, left: 605, height: 30, width: 270 },
      type: 'file',

      inputChanged: function(evt){
          var input = evt.target;
          if (input.files && input.files[0]){
              Synapse.fileshareController.loadInputFileData(input.files[0], 'video');
          }
      },

      didCreateLayer: function(){
        var that = this;
        var layer = this.get('layer');

        // only accept video inputs
        $(layer).find('input').attr('accept','video/*');

        $(layer).bind('change', function(evt){
          that.inputChanged(evt);
        });
      }

    })

    
  }),  
        
});
/* >>>>>>>>>> BEGIN source/views/share/create_website_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.createWebSiteView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.createWebSiteView = SC.View.extend({
	layout: { top: 0, right: 0, bottom: 0, left: 0 },
	childViews: ['postWebsiteView'],
	
	postWebsiteView: SC.View.design ({
	  classNames: ['base-content-wrapper', 'base-content-border', 'ten-point-radius'],
	  layout: { top: 20, right: 20, bottom: 20, left: 20 },	
    childViews: ['sectionLabel', 'titleField', 'urlField', 'contentField'],
    
    render: function(context){
    	context.push([
    		'<div class="forms-alt blog-title absolute">','</div>',	
    		'<div class="forms-alt share-url absolute">','</div>',	
    		'<div class="forms-alt blog-description absolute">','</div>',
    	].join(''))
    },
    
    sectionLabel: SC.LabelView.extend({
    	layout: { top: 20, left: 20, height: 30, width: 225 },
    	localize: YES,
    	value: 'S.Share.WebSite.PostWebSite'
    }),
    
    titleField: SC.TextFieldView.extend({
    	layout: { top: 62, left: 265, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.WebSite.Title',
    	valueBinding: 'Synapse.websiteController.title'
    }),
    
    urlField: SC.TextFieldView.extend({
    	layout: { top: 62, right: 32, height: 35, width: 271 },
    	type: 'email',
    	localize: YES,
    	hint: 'S.Share.WebSite.Url',
    	valueBinding: 'Synapse.websiteController.url'
    }),
    
    contentField: SC.TextFieldView.extend({
    	layout: { top: 112, left: 265, bottom: 125, right: 30 },
    	isTextArea: YES,
    	localize: YES,
    	hint: 'S.Share.WebSite.Content',
    	valueBinding: 'Synapse.websiteController.description'
    })
    
  }),
    
});
/* >>>>>>>>>> BEGIN source/views/share/main_share_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.ShareView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the shareViews content here.  

SYN.ShareView = SC.View.extend(
  /** @scope SYN.ShareView.prototype */ {
  layout: { top: 0, right: 0, bottom: 0, left: 0 },
  childViews: ['sectionLabel', 'contentTypeBar', 'formView', 'cancelButton', 'saveButton'],

  sectionLabel: SC.LabelView.design ({
		layout: { top: 15, right: 25, left: 25, height: 30 },
		localize: YES,
		value: 'S.Share.WhatToShare'
  }),

  contentTypeBar: SC.View.design ({
    classNames: ['embeded_gradient'],
  	layout: { top: 40, right: 20, left: 20, height: 125 },
  	childViews: [ 'blogButton', 'photoButton', 'videoButton', 'websiteButton' ],
  	
  	render: function(context){
			context.push([
				'<div class="shadow_view_long anchor_top absolute">','</div>',
				'<div class="shadow_view_long flipped_element anchor_bottom absolute">','</div>',	
			].join(''))		
		},

  	blogButton: SC.ButtonView.extend({
			layout: { left: .20, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToBlogPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.Blog'
		}),

  	photoButton: SC.ButtonView.extend({
			layout: { left: 0.40, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToPhotoPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.Photo'
		}),

  	videoButton: SC.ButtonView.extend({
			layout: { left: 0.60, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToVideoPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.Video'
		}),

  	websiteButton: SC.ButtonView.extend({
			layout: { left: 0.80, centerY: 0, height: 100, width: 90 },
			localize: YES,
			action: 'goToWebPostState',
			target: 'Synapse.statechart',
			title: 'S.Share.WebSite'
		})
  }),

 	formView: SC.ContainerView.design({
 	  layout: { top: 185, right: 0, bottom: 0, left: 0 },
    nowShowingBinding: 'Synapse.viewController.shareViewNowShowing'
	}),

  cancelButton: SC.ButtonView.extend({
    classNames: ['cancel_action_button'],
	  layout: { bottom: 50, right: 170, height: 25, width: 100 },
		localize: YES,
		action: 'cancelPost',
		target: 'Synapse.statechart',
		title: 'S.Button.Cancel'
	}),
	
	saveButton: SC.ButtonView.extend({
	  classNames: ['signin_action_button'],
	  layout: { bottom: 50, right: 50, height: 25, width: 100 },
		localize: YES,
		action: 'commitPost',
		target: 'Synapse.statechart',
		title: 'S.Button.Save'
	})
	
});

/* >>>>>>>>>> BEGIN source/views/stream_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.StreamView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the StreamView content here.  

SYN.StreamView = SC.View.extend(
  /** @scope SYN.StreamView.prototype */ {
  layout: { top: 0, right: 0, bottom: 0, left: 0 },
  childViews: ['titleCells', 'blogRow', 'photoRow', 'videoRow', 'websiteRow'],
  
  titleCells: SYN.StreamTitleCells.extend ({
    layout: { top: 0, left: 0, bottom: 0, width: 200, zIndex: 10 }
  }),
  
  blogRow: SYN.StreamBlogRowView.extend ({
    layout: { left: 200, right: 0, top: 0, height: 195 },
    contentRowBinding: 'Synapse.userController.content'

  }),
  
  photoRow: SYN.StreamPhotoRowView.extend ({
    layout: { left: 200, right: 0, top: 195, height: 195 },
    contentRowBinding: 'Synapse.userController.content'

  }),
  
  videoRow: SYN.StreamVideoRowView.extend ({
    layout: { left: 200, right: 0, top: 390, height: 195 },
    contentRowBinding: 'Synapse.userController.content'
  }),
 
  websiteRow: SYN.StreamWebsiteRowView.extend ({
    layout: { left: 200, right: 0, top: 585, height: 195 },
    contentRowBinding: 'Synapse.userController.content'
  })
    
});
/* >>>>>>>>>> BEGIN source/views/users_view.js */
// ==========================================================================
// Project:   synapse framework
// View: SYN.UsersView
// Copyright: @2012 Appnovation, Inc.
// ==========================================================================


// Put the UsersView content here.  

SYN.UsersView = SC.View.extend(
  /** @scope SYN.UsersView.prototype */ {
  layout: { top: 0, right: 0, bottom: 0, left: 0 },
});
