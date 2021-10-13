/*
 * RENAULTIVO WEB SYSTEM
 * Welcome to the Source Code of the Renaultivo Web System :)
 * RELEASE: 08/26/2021
 */

(() => {

  let defaultHandlers = {

  }

  let globalHandlers = {

  }

  const styles = createCSSObject({
    main: {
      test: {
        color: '#DDDDDD',
        fontSize: '50px'
      }
    }
  });

  function openIntentHandlerOptionsMenu(intent, data=null) {
    
    window.System.apps[globalHandlers[intent][0]].onIntent({
      name: intent,
      data
    });

  }

  function setDefaultHandler(intent, app) {
    defaultHandlers[intent] = app;
  }

  function addGlobalListener(intent, app) {

    if (!globalHandlers[intent]) {
      globalHandlers[intent] = new Array();
    }

    globalHandlers[intent].push(app);
    
  }

  function handle(intent, data=null) {
    
    if (defaultHandlers[intent] != null) {

      defaultHandlers[intent].onIntent(intent, data);

    } else if (globalHandlers[intent] != null) {
      
      if (globalHandlers[intent].length > 1) {
        openIntentHandlerOptionsMenu(intent, data);
      } else {
        
        window.System.apps[globalHandlers[intent][0]].onIntent({
          name: intent,
          data
        });
  
      }

    } else {

      System.toast.open(
        <div style={styles.main.test}>test</div>
      );

    }

  }

  window.getGlobalIntentListeners = () => {
    return globalHandlers;
  }

	window.System.Intent = {
    handle: handle,
    setDefaultHandler: setDefaultHandler,
    addGlobalListener: addGlobalListener    
  }

})()