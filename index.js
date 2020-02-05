let infiniteScrolling = (function () {

  let linkEle;
  let btnEle;
  let sidenavEle;
  let isSidebarOpen = false;
  function intialise(link, btn, nav) {
    linkEle = link;
    btnEle = btn;
    sidenavEle = nav;
  }

  let toggleSidebar = () => {
    if (!isSidebarOpen) {
      isSidebarOpen = true;
      sidenavEle.classList.add("showSideNav");
    } else {
      isSidebarOpen = false;
      sidenavEle.classList.remove("showSideNav");
    }
  };


  return ({
    init: function () {
      const toggleLink = document.getElementById('toggle-sidebar');
      const toggleButton = document.getElementById('toggle-btn');
      const sidebar = document.getElementsByClassName('sidenav');

      intialise(toggleLink, toggleButton, sidebar[0]);
      toggleLink.addEventListener('click', toggleSidebar);
      toggleButton.addEventListener('click', toggleSidebar);
    }
  });
})();
