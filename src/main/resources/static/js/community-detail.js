const communityPostId = window.location.pathname.split('/').pop();

const currentUserId = (user && user.userProfile) ? user.userProfile.userId : null;
let postUserId;

document.addEventListener("DOMContentLoaded", function () {
    const commentInput = document.getElementById("commentInput");
    if (user) {
        commentInput.placeholder = "댓글을 남겨보세요.";
    } else {
        commentInput.placeholder = "로그인 후 이용 가능합니다.";
    }

    const nickname = document.getElementById("nickname");
    const userProfileImage = document.getElementById("userProfileImage");
    const region2DepthName = document.getElementById("region2DepthName");
    const region3DepthName = document.getElementById("region3DepthName");
    const title = document.getElementById("title");
    const communityCategory = document.getElementById("communityCategory");
    const content = document.getElementById("content");
    const createdAt = document.getElementById("createdAt");

    fetch(`/api/community/posts/${communityPostId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("해당 게시글을 불러올 수 없습니다.");
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            postUserId = data.userId;
            nickname.innerText = data.nickname;
            userProfileImage.src = data.picUrl;
            region2DepthName.innerText = data.region2DepthName;
            region3DepthName.innerText = data.region3DepthName;
            title.innerHTML = data.title;
            content.innerHTML = data.content;
            createdAt.innerHTML = data.createdAt;
            communityCategory.innerHTML = data.communityCategoryName;
            communityCategory.href = `/community/subCategories/${data.communityCategoryId}`;
        })
        .catch(error => console.log("에러 발생: ", error));
});

function createCommentHtml(data) {
  const isPostWriter = postUserId === data.userId;
    return `
    <div class="detail-comment-wrap">
      <div class="detail-comment-header">
        <div class="detail-comment-profile">
          <img src="${data.picUrl}" alt="유저 프로필 사진" id="commentUserProfile">
        </div>
        <div class="comment-user-info">
          <div class="detail-comment-nickname">
            <a href="/" id="commentUserNickname">${data.nickname}</a>
            ${isPostWriter ? `<img src="/images/community/post-writer.svg" alt="게시글 작성자 댓글" id="postWriter" class="post-writer">` : ''}
          </div>
          
          <div class="detail-comment-region-name" id="commentUserRegion">
            <span>${data.region2DepthName}</span>
            <span>${data.region3DepthName}</span>
            <div class="detail-comment-time-wrap">
                <time class="detail-comment-time" id="commentCreatedAt"> · ${data.createdAt}</time>
            </div>
          </div>
        </div>
        
        <button class="moreOptionsButton">
          <img src="/images/community/more-options.svg" alt="더보기 옵션">
        </button>
        <div class="overlay comment-overlay"></div>
        <div class="dropdown-content">
          <button class="reportComment">댓글 신고</button>
          <button class="editComment">댓글 수정</button>
          <button class="deleteComment">댓글 삭제</button>
        </div>
      </div>
      <div class="detail-comment-content">
        <p id="commentContent">${data.content}</p>
      </div>
      <div>
        <button class="comment-like-button" id="commentLikeButton">
          <img src="/images/community/unlike.svg" alt="댓글 좋아요" id="commentLikeIcon"/>
          <span id="commentLikeCount">좋아요</span>
        </button>
        <button class="reply-button" data-comment-id="${data.id}">
          <img src="/images/community/detail-comment.svg" alt="답글" id="replyIcon"/>
          <span>답글쓰기</span>
        </button>
      </div>
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", function () {
    const commentsList = document.getElementById("commentsList");

    commentsList.addEventListener("click", function (event) {
        if (event.target && event.target.closest(".reply-button")) {
            const commentId = event.target.closest(".reply-button").getAttribute("data-comment-id");
            alert(`클릭한 댓글의 ID: ${commentId}`);
            console.log(commentId);
        }
    });
});

function updateCommentCount(count) {
    document.getElementById("commentCount").innerText = `댓글 ${count}`;
}

document.addEventListener("DOMContentLoaded", function () {
    document.addEventListener("click", function (event) {
        const target = event.target;

        if (target.id === "moreOptionsButton" || target.closest("#moreOptionsButton")) {
            const dropdownMenu = document.getElementById("dropdownMenu");
            const overlay = document.getElementById("postOverlay");

            if (dropdownMenu.style.display === "block") {
                dropdownMenu.style.display = "none";
                overlay.style.display = "none";
            } else {
                dropdownMenu.style.display = "block";
                overlay.style.display = "block";
            }

            const reportButton = document.getElementById("reportPost");
            const editButton = document.getElementById("editPost");
            const deleteButton = document.getElementById("deletePost");

            if (currentUserId === postUserId) {
                editButton.style.display = "block";
                deleteButton.style.display = "block";
                reportButton.style.display = "none";
            } else {
                editButton.style.display = "none";
                deleteButton.style.display = "none";
                reportButton.style.display = "block";
            }
        } else if (target.classList.contains("moreOptionsButton") || target.closest(".moreOptionsButton")) {
            const dropdownMenuComment = target.closest(".detail-comment-header").querySelector(".dropdown-content");
            const overlayComment = target.closest(".detail-comment-header").querySelector(".comment-overlay");

            if (dropdownMenuComment.style.display === "block") {
                dropdownMenuComment.style.display = "none";
                overlayComment.style.display = "none";
            } else {
                dropdownMenuComment.style.display = "block";
                overlayComment.style.display = "block";
            }
        } else {
            const allDropdowns = document.querySelectorAll(".dropdown-content");
            const allOverlays = document.querySelectorAll(".overlay");

            allDropdowns.forEach(menu => menu.style.display = "none");
            allOverlays.forEach(overlay => overlay.style.display = "none");
        }
    });
});

document.getElementById("submitCommentBtn").addEventListener("click", function (e) {
    e.preventDefault();
    const content = document.getElementById("commentInput").value;
    const data = {
        content: content,
        userId: currentUserId
    };

    fetch(`/api/community/posts/${communityPostId}/comments`, {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) throw new Error("댓글 등록 실패");
            return response.json();
        })
        .then(data => {
            document.getElementById("commentInput").value = "";
            return fetch(`/api/community/posts/${communityPostId}/comments`, {method: "get"});
        })
        .then(response => {
            if (!response.ok) throw new Error("댓글 리스트를 불러올 수 없습니다.");
            return response.json();
        })
        .then(data => {
            const commentCount = data.commentCount;
            const comments = data.commentList;
            document.getElementById("commentsList").innerHTML = "";
            comments.forEach(comment => {
                const commentHtml = createCommentHtml(comment);
                document.getElementById("commentsList").insertAdjacentHTML('beforeend', commentHtml);
            });
            updateCommentCount(commentCount);
        })
        .catch(error => console.error("에러 발생:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    fetch(`/api/community/posts/${communityPostId}/comments`, {method: "get"})
        .then(response => {
            if (!response.ok) throw new Error("댓글 리스트를 불러올 수 없습니다.");
            return response.json();
        })
        .then(data => {
            const commentCount = data.commentCount;
            const comments = data.commentList;
            comments.forEach(comment => {
                const commentHtml = createCommentHtml(comment);
                document.getElementById("commentsList").insertAdjacentHTML('beforeend', commentHtml);
            });
            updateCommentCount(commentCount);
        })
        .catch(error => console.log("에러 발생: ", error));
});

document.getElementById("deletePost").addEventListener("click", function () {
    document.getElementById("deleteModalOverlay").style.display = "flex";
});

document.getElementById("cancelDeleteButton").addEventListener("click", function () {
    document.getElementById("deleteModalOverlay").style.display = "none";
});

document.getElementById("deleteModalOverlay").addEventListener("click", function (event) {
    if (event.target === this) {
        document.getElementById("deleteModalOverlay").style.display = "none";
    }
});

document.getElementById("confirmDeleteButton").addEventListener("click", function () {
    fetch(`/api/community/posts/${communityPostId}`, {method: "delete"})
        .then(response => {
            if (!response.ok) throw new Error("유효하지 않은 요청입니다.");
            window.location.href = "/community";
        })
        .catch(error => console.log("에러 발생: ", error));
});
