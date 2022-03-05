let userFormEl = document.querySelector("#user-form");
let nameInputEl = document.querySelector("#username");
let repoContainerEl = document.querySelector("#repos-container");
let reporSearchTerm = document.querySelector("#repo-search-term");

let getUserRepos = function() {
    let getUserRepos = function(user) {
        //format the github ape url
        let apiUrl = "https://api.github.com/users/" + user + "/repos";

        //make a request to the url
        fetch(apiUrl)
        .then(function(response) {
            //request was successful
            if (response.ok) {
            response.json().then(function(data) {
                displayRepos(data, user);            
            });
        } else {
            alert("Error: GitHub User Not Found");
        }
        })
        .catch(function(error) {
            //Notice this 'catch()' getting chained onto the end of the '.then()' method
            alert("Unable to connect to GitHub");
        })
    };
};

let formSubmitHandler = function(event) {
    event.preventDefault();
    console.log(event);
    //get value from input element
    let username = nameInputEl.value.trim();

    if (username) {
        getUserRepos(username);
        nameInputEl.value = "";
    } else {
        alert("Please enter a GitHub Username");
    }
};

userFormEl.addEventListener("submit", formSubmitHandler);

let displayRepos = function(repos, searchTerm) {
    // check if api returned any repos
    if (repos.length === 0) {
        repoContainerEl.textContent = "No repos found.";
        return;
    }
    console.log(repo);
    console.log(searchTerm);
    //clear old content
    repoContainerEl.textContent = "";
    reporSearchTerm.textContent = searchTerm;

    //loop over repos
    for (var i = 0; i < repos.length; i++) {
        //format repo name
        let repoName = repos[i].owner.login + "/" + repos[i].name;

        //create a container for each repo
        let titleEl = document.createElement("div");
        repoContainerEl.classList = "list-item flex-row justify-space-between align-center";

        //create a span element to hold repository name
        let titleEl = document.createElement("span");
        titleEl.textContent = repoName;

        //create a status element
        let statusEl = document.createElement("span");
        statusEl.classList = "flex-row align-center";

        //check if current repo has issues or not
        if (repos[i].open_issues_count > 0) {
            statusEl.innerHTML = 
            "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
        }

        //append to container
        repoContainerEl.appendChild(titleEl);

        //append container to the dom
        repoContainerEl.appendChild(repoEl);
    }
};

getUserRepos();