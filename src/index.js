document.addEventListener('DOMContentLoaded', () => {
  const githubForm = document.getElementById('github-form');
  const searchInput = document.getElementById('search');
  const userList = document.getElementById('user-list');
  const reposList = document.getElementById('repos-list');
  const toggleSearchButton = document.getElementById('toggle-search');

  let searchType = 'users'; // default search type

  githubForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = searchInput.value;
    if (searchType === 'users') {
      searchGitHubUsers(query);
    } else {
      searchGitHubRepos(query);
    }
  });

  toggleSearchButton.addEventListener('click', () => {
    if (searchType === 'users') {
      searchType = 'repos';
      searchInput.placeholder = 'Search GitHub repos';
      toggleSearchButton.innerText = 'Search Users';
    } else {
      searchType = 'users';
      searchInput.placeholder = 'Search GitHub users';
      toggleSearchButton.innerText = 'Search Repos';
    }
  });

  function searchGitHubUsers(query) {
    fetch(`https://api.github.com/search/users?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => response.json())
    .then(data => {
      displayUsers(data.items);
    });
  }

  function searchGitHubRepos(query) {
    fetch(`https://api.github.com/search/repositories?q=${query}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => response.json())
    .then(data => {
      displayRepos(data.items);
    });
  }

  function displayUsers(users) {
    userList.innerHTML = '';
    reposList.innerHTML = ''; // Clear previous repositories
    users.forEach(user => {
      const li = document.createElement('li');
      li.innerHTML = `
        <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
        <a href="${user.html_url}" target="_blank">${user.login}</a>
      `;
      li.addEventListener('click', () => {
        fetchUserRepos(user.login);
      });
      userList.appendChild(li);
    });
  }

  function displayRepos(repos) {
    userList.innerHTML = ''; // Clear previous users
    reposList.innerHTML = '';
    repos.forEach(repo => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description}</p>
      `;
      reposList.appendChild(li);
    });
  }

  function fetchUserRepos(username) {
    fetch(`https://api.github.com/users/${username}/repos`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    .then(response => response.json())
    .then(repos => {
      displayUserRepos(repos);
    });
  }

  function displayUserRepos(repos) {
    reposList.innerHTML = '';
    repos.forEach(repo => {
      const li = document.createElement('li');
      li.innerHTML = `
        <a href="${repo.html_url}" target="_blank">${repo.name}</a>
        <p>${repo.description}</p>
      `;
      reposList.appendChild(li);
    });
  }
});