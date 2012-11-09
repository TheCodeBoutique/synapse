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