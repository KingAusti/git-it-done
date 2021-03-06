let userFormEl = document.querySelector("#user-form");
let languageButtonsEl = document.querySelector("#language-buttons");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let repoSearchTerm = document.querySelector("#repo-search-term");

let formSubmitHandler = function(event) {
    //prevent browser refresh
    event.preventDefault();
    console.log(event);
    //get value from input element
    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);

        //clear old content
        repoContainerEl.textContent = "";
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub Username");
    }
};

let buttonClickHandler = function(event) {
    //get the language attribute from the clicked element
    let language = event.target.getAttribute("data-language");

    if (language) {
        getFeaturedRepos(language);

        //clear old content
        repoContainerEl.textContent = "";
    }
};


    let getUserRepos = function(user) {
        //format the github ape url
        let apiUrl = "https://api.github.com/users/" + user + "/repos";

        //make a request to the url
        fetch(apiUrl)
            .then(function(response) {
            //request was successful
            if (response.ok) {
            console.log(response);
            response.json().then(function(data) {
                console.log(data);
                displayRepos(data, user);            
            });
        } else {
            alert("Error:" + response.statusText);
        }
        })
        .catch(function(error) {
            //Notice this 'catch()' getting chained onto the end of the '.then()' method
            alert("Unable to connect to GitHub");
        });
    };

let displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repos found.";
        return;
    }
    console.log(repos);
    console.log(searchTerm);
    //clear old content

    repoSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;
        //create a container for each repo
        let repoEl = document.createElement("a");
        repoEl.classList = "list-item flex-row justify-space-between align-center";
        repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
        //create a span element to hold repository name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;
        repoEl.appendChild(titleEl);
        //create a status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";
        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        } else {
            statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
        }
        //append to container
        repoEl.appendChild(statusEl);
        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

let getFeaturedRepos = function(language) {
    //format the github api url
    let apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

    fetch(apiUrl).then(function(response) {
        if (response.ok) {
            response.json().then(function(data){
                displayRepos(data.items, language);
            });
        } else {
            alert("Error: GitHub User Not Found!")
        }
    });
};

languageButtonsEl.addEventListener("click", buttonClickHandler);
userFormEl.addEventListener("submit", formSubmitHandler);