Synapse.AuthenticatedState = SC.State.extend({

  enterState: function() {
    console.log("Entering Authenticated State");  
    Synapse.viewController.set('mainView','SYN.MainApplicationView');
    Synapse.viewController.set('shareViewNowShowing','SYN.createBlogView');
    
    var userName = Synapse.authController.get('username');
    var passWord = Synapse.authController.get('password');
    var ticket = Synapse.URL.login + '?u=' + userName + '&pw=' + passWord;
  
    SC.Request.getUrl(ticket)
      .json(YES)
      .header('X-Version', '1.0')
      .notify(this, 'didFetchTicket')
      .send();
    
  },
  
  didFetchTicket: function(response) {
    if (SC.$ok(response)) {
      console.log("we are all good for the Ticket API");
      
      var rawRequest = response.rawRequest.response;
       console.log("rawRequest =" + rawRequest);
      
      var xmlDOC = $.parseXML(rawRequest);
       console.log("xmlDOC =" + xmlDOC);
      
      var xmlContent = $(xmlDOC);
       console.log("xmlContent = " + xmlContent);
      
      var contentTicket = xmlContent.find("ticket").text();
       console.log("contentTicket = " + contentTicket);
      
      var content = Synapse.store.createRecord(Synapse.Session,{
        sessionID: contentTicket 
      })
      console.log("content = " + content);
      
      Synapse.sessionController.set('content', content);
      
      this.gotoState('mainNavState');
      
    } else {
      console.log("Ticket API error");
    }
    
  },
  
  exitState: function() {
    
  },
  
  mainNavState: SC.State.plugin('Synapse.MainNavState')
  
});