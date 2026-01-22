/* ================= CURRENT USER (ASAL) ================= */
let currentUser = JSON.parse(localStorage.getItem("currentUser")) || {
  name: "Student"
};

/* ================= DATE & TIME (ASAL) ================= */
function updateTime() {
  const now = new Date();
  const date = document.getElementById("date");
  const time = document.getElementById("time");
  if (date) date.innerText = now.toLocaleDateString("en-MY");
  if (time) time.innerText = now.toLocaleTimeString("en-MY");
}
setInterval(updateTime, 1000);
updateTime();

/* ================= LOAD CHAT (ASAL) ================= */
function loadCommunityChat() {
  const course = document.getElementById("courseSelect").value;
  const chatBox = document.getElementById("chatBox");
  chatBox.innerHTML = "";

  let messages = JSON.parse(localStorage.getItem("community_" + course)) || [];

  messages.forEach(msg => {
    const div = document.createElement("div");
    div.classList.add("chat-message");
    div.classList.add(msg.user === currentUser.name ? "chat-me" : "chat-other");
    div.innerHTML = `<b>${msg.user}</b>${msg.text}`;
    chatBox.appendChild(div);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
}

/* ================= SEND MESSAGE (TAMBAH) ================= */
function sendCommunityMessage() {
  const input = document.getElementById("chatInput");
  if (!input.value.trim()) return;

  const course = document.getElementById("courseSelect").value;
  let messages = JSON.parse(localStorage.getItem("community_" + course)) || [];

  messages.push({
    user: currentUser.name,
    text: input.value
  });

  localStorage.setItem("community_" + course, JSON.stringify(messages));
  input.value = "";
  loadCommunityChat();
}

/* ================= ON LOAD ================= */

document.addEventListener("DOMContentLoaded", loadCommunityChat);
function togglePost() {
  const modal = document.getElementById("postModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function submitPost() {
  const img = document.getElementById("postImage");
  const caption = document.getElementById("postCaption");

  if (!img.files[0] || !caption.value.trim()) {
    alert("Please add image and caption");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    const posts = JSON.parse(localStorage.getItem("homePosts")) || [];
    posts.unshift({
      image: reader.result,
      caption: caption.value
    });
    localStorage.setItem("homePosts", JSON.stringify(posts));
    togglePost();
    renderHomeFeed();
  };
  reader.readAsDataURL(img.files[0]);
}

function renderHomeFeed() {
  const feed = document.getElementById("homeFeed");
  if (!feed) return;

  feed.innerHTML = "";
  const posts = JSON.parse(localStorage.getItem("homePosts")) || [];

  posts.forEach(p => {
    const div = document.createElement("div");
    div.innerHTML = `
      <img src="${p.image}" style="width:100%;border-radius:12px">
      <p>${p.caption}</p>
    `;
    feed.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderHomeFeed);
   /* ================= ANNOUNCEMENT POST ================= */

function toggleAnnPost() {
  const modal = document.getElementById("annPostModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function submitAnnPost() {
  const img = document.getElementById("annImage");
  const caption = document.getElementById("annCaption");

  if (!img.files[0] || !caption.value.trim()) {
    alert("Please add image and caption");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    let posts = JSON.parse(localStorage.getItem("annPosts")) || [];

    posts.unshift({
      image: reader.result,
      caption: caption.value,
      likes: 0,
      likedBy: [],
      comments: []
    });

    localStorage.setItem("annPosts", JSON.stringify(posts));
    toggleAnnPost();
    renderAnnFeed();
  };

  reader.readAsDataURL(img.files[0]);
}

function renderAnnFeed() {
  const feed = document.getElementById("feedann");
  if (!feed) return;

  feed.innerHTML = "";
  const posts = JSON.parse(localStorage.getItem("annPosts")) || [];

  posts.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "ann-post";

    div.innerHTML = `
      <img src="${p.image}">
      <p>${p.caption}</p>

      <div class="ann-actions">
        <span onclick="likeAnnPost(${index})">❤️ ${p.likes}</span>
        <span onclick="commentAnnPost(${index})">💬 Comment</span>
      </div>

      <div class="ann-comments">
        ${p.comments.map(c => `<div>• ${c}</div>`).join("")}
      </div>
    `;

    feed.appendChild(div);
  });
}

function likeAnnPost(index) {
  let posts = JSON.parse(localStorage.getItem("annPosts"));
  if (!posts[index].likedBy.includes(currentUser.name)) {
    posts[index].likes++;
    posts[index].likedBy.push(currentUser.name);
    localStorage.setItem("annPosts", JSON.stringify(posts));
    renderAnnFeed();
  }
}

function commentAnnPost(index) {
  const text = prompt("Write a comment");
  if (!text) return;

  let posts = JSON.parse(localStorage.getItem("annPosts"));
  posts[index].comments.push(`${currentUser.name}: ${text}`);
  localStorage.setItem("annPosts", JSON.stringify(posts));
  renderAnnFeed();
}

document.addEventListener("DOMContentLoaded", renderAnnFeed);
/* ================= EVENT POST ================= */

function toggleEventPost() {
  const modal = document.getElementById("eventPostModal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function submitEventPost() {
  const img = document.getElementById("eventImage");
  const caption = document.getElementById("eventCaption");

  if (!caption.value.trim()) {
    alert("Please add event details");
    return;
  }

  const reader = new FileReader();
  reader.onload = function () {
    let posts = JSON.parse(localStorage.getItem("eventPosts")) || [];

    posts.unshift({
      image: img.files[0] ? reader.result : null,
      caption: caption.value
    });

    localStorage.setItem("eventPosts", JSON.stringify(posts));
    toggleEventPost();
    renderEventFeed();
  };

  if(img.files[0]){
    reader.readAsDataURL(img.files[0]);
  } else {
    reader.onload(); // just text, no image
  }
}

function renderEventFeed() {
  const feed = document.getElementById("feedevent");
  if (!feed) return;

  feed.innerHTML = "";

  let posts = JSON.parse(localStorage.getItem("eventPosts")) || [];

  // If no posts yet, preload example events
  if(posts.length === 0){
    posts = [
      {
        caption: `1. Club & Society Registration Day\n• Date: 15 March 2026\n• Time: 9.00 AM – 4.00 PM\n• Location: Student Centre, UiTM Segamat\nAn event for students to explore and register for various clubs and societies.`
      },
      {
        caption: `2. Career Talk: Preparing for the Future\n• Date: 20 March 2026\n• Time: 10.00 AM – 12.00 PM\n• Location: Dewan Kuliah 1\nA career talk session to help students gain insights into career planning.`
      },
      {
        caption: `3. Interfaculty Sports Day\n• Date: 25 March 2026\n• Time: 8.00 AM – 5.00 PM\n• Location: UiTM Segamat Sports Complex\nA sports event that encourages teamwork and healthy competition among faculties.`
      }
    ];
    localStorage.setItem("eventPosts", JSON.stringify(posts));
  }

  posts.forEach((p, index) => {
    const div = document.createElement("div");
    div.className = "event-post";
    div.innerHTML = `
      ${p.image ? `<img src="${p.image}" class="post-img">` : ''}
      <p>${p.caption.replace(/\n/g,'<br>')}</p>
    `;
    feed.appendChild(div);
  });
}

document.addEventListener("DOMContentLoaded", renderEventFeed);
