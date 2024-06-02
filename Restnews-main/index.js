document.getElementById('fetch-posts').addEventListener('click', fetchPosts);

function fetchPosts() {
    const postUrl = 'https://jsonplaceholder.typicode.com/posts';
    const userUrl = 'https://jsonplaceholder.typicode.com/users';
    
    Promise.all([
        fetch(postUrl).then(response => response.json()),
        fetch(userUrl).then(response => response.json())
    ])
    .then(([postsData, usersData]) => {
        const postsContainer = document.getElementById('posts-container');
        postsContainer.innerHTML = '';
        
        postsData.forEach(post => {
            const postElement = document.createElement('div');
            postElement.classList.add('post');

            const user = usersData.find(user => user.id === post.userId);
            postElement.innerHTML = `
                <p><strong>Name:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <h2>${post.title}</h2>
                <p>${post.body}</p>
                <button class="details-button" data-post-id="${post.id}">Show Details</button>
                <div class="post-detail" id="post-detail-${post.id}"></div>
            `;

            // Style the details button
            const detailsButton = postElement.querySelector('.details-button');
            detailsButton.style.display = 'block';
            detailsButton.style.width = '20%';
            detailsButton.style.padding = '11px';
            detailsButton.style.fontSize = '16px';
            detailsButton.style.cursor = 'pointer';
            detailsButton.style.border = 'none';
            // detailsButton.style.borderRadius = '25px';
            detailsButton.style.backgroundColor = 'rgb(150, 124, 175);';
            detailsButton.style.marginTop = '10px';
            detailsButton.style.marginBottom = '10px';

            detailsButton.addEventListener('mouseover', () => {
                detailsButton.style.backgroundColor = 'rgba(87, 171, 188, 0.552)';
            });
            
            detailsButton.addEventListener('mouseout', () => {
                detailsButton.style.backgroundColor = 'rgb(87, 172, 188)';
            });

            // Add click event listener to the details button
            detailsButton.addEventListener('click', (event) => {
                const postId = event.target.getAttribute('data-post-id');
                fetchPostDetails(postId);
            });

            postsContainer.appendChild(postElement);
        });
    })
    .catch(error => console.error('Error fetching posts:', error));
}

function fetchPostDetails(postId) {
    const postUrl = `https://jsonplaceholder.typicode.com/posts/${postId}`;
    const commentsUrl = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;

    Promise.all([
        fetch(postUrl).then(response => response.json()),
        fetch(commentsUrl).then(response => response.json())
    ])
    .then(([postData, commentsData]) => {
        const postDetailContainer = document.getElementById(`post-detail-${postId}`);
        postDetailContainer.innerHTML = `
            <h3>Post Details</h3>
            <p>${postData.body}</p>
            <h3>Comments:</h3>
            <ul>
                ${commentsData.map(comment => `<li><strong>${comment.name}</strong>: ${comment.body}</li>`).join('')}
            </ul>
        `;
    })
    .catch(error => console.error('Error fetching post details or comments:', error));
}

