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