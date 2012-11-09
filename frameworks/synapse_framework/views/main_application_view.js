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
      value: sc_static('/images/synapse_icon.png'),
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
        buttonIcon: sc_static('/images/account_icon.png'),
      },
      
      {
        value: "SYN.ShareView",
        itemWidth: 75,
        title: "Share",
        buttonIcon:sc_static('/images/share_icon.png'),
      }, 
      
      {
        value: "SYN.StreamView",
        itemWidth: 75,
        title: "Stream",
        buttonIcon:sc_static('/images/stream_icon.png'),
      },
      
      {
        value: "SYN.UsersView",
        itemWidth: 75,
        title: "Users",
        buttonIcon:sc_static('/images/users_icon.png'),
      }
       
    ],
    
    itemTitleKey: 'title',
    itemValueKey: 'value',
    itemWidthKey: 'itemWidth',
    itemIconKey: 'buttonIcon',
  }),
  
});
