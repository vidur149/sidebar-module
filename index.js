async function getData(url = '') {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'GET', // *GET, POST, PUT, DELETE, etc.
    // mode: 'no-cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *client
  });
  return await response.json(); // parses JSON response into native JavaScript objects
}

let infiniteScrolling = (function () {

  let sidenavEle;
  let blogsContainerEle;
  let pageNo;
  let hasMore;
  let isSidebarOpen;
  let loading;

  const intialise = async (nav, blogs) => {
    sidenavEle = nav;
    blogsContainerEle = blogs;
    pageNo = 0;
    hasMore = true;
    isSidebarOpen = false;
  };

  const createBlogCard = (data) => {
    let html = '';
    data.forEach(blog => {
      html += `
      <div class="post">
        <div class="post-title">
          <span class="post-status">${blog.status}</span>
          <span class="post-date">${blog.created_at.date}</span>
        </div>
        <div class="post-heading">
          ${blog.title}
          ${blog.category_title ? ` - ${blog.category_title}` : ''}
        </div>
        <div>
          ${blog.post_content}
        </div>
      </div>
      `;
    });
    return html;
  };

  const appendBlogs = (data) => {
    blogsContainerEle.innerHTML += createBlogCard(data);
  };

  const getBlogs = async () => {
    if (hasMore && !loading) {
      pageNo = pageNo + 1;
      loading = true;
      const res = await getData(
        `https://app.userhoot.com/post/list?page=${pageNo}`
      );
      loading = false;
      hasMore = res.has_more;
      appendBlogs(res.data);
    }
  };

  const closeSidebar = () => {
    isSidebarOpen = false;
    sidenavEle.classList.remove("showSideNav");
  };

  const toggleSidebar = () => {
    if (!isSidebarOpen) {
      isSidebarOpen = true;
      pageNo = 0;
      hasMore = true;
      isSidebarOpen = false;
      blogsContainerEle.scrollTop = 0;
      blogsContainerEle.innerHTML = "";
      sidenavEle.classList.add("showSideNav");
      getBlogs();
    } else {
      isSidebarOpen = false;
      sidenavEle.classList.remove("showSideNav");
    }
  };

  const fetchBlogs = async () => {
    if (blogsContainerEle.scrollTop + 20 > blogsContainerEle.clientHeight) {
      await getBlogs();
    }
  };

  return ({
    init: function () {
      const toggleLink = document.getElementById('toggle-sidebar');
      const toggleButton = document.getElementById('toggle-btn');
      const nav = document.createElement('nav');
      nav.setAttribute('class', 'sidenav');
      nav.innerHTML = `
      <div>
        <div class="sidenav-title">
          <div>What's new ?</div>
          <span id="close-sidenav">X</span>
        </div>
        <div id="blogs">
        </div>
      </div>
    `;
      document.body.appendChild(nav);

      const closeBtn = document.getElementById('close-sidenav');
      const blogsContainer = document.getElementById('blogs');
      intialise(nav, blogsContainer);
      blogsContainer.addEventListener('scroll', fetchBlogs);
      toggleLink.addEventListener('click', toggleSidebar);
      toggleButton.addEventListener('click', toggleSidebar);
      closeBtn.addEventListener('click', closeSidebar);
    }
  });
})();
