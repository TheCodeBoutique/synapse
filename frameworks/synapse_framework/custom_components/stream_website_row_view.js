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