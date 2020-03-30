function _register(){
  if('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js', {scope: '/'})
      .then(function() { console.log('Service Worker Registered'); });
  }
}

navigator.serviceWorker.getRegistrations().then(
  function(registrations) {

    if (navigator.onLine){
      for(let registration of registrations) {
        registration.unregister();
      }
    }

  });