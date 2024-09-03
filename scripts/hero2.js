fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        query: `
            query getUserProfile($username: String!) {
                matchedUser(username: $username) {
                    username
                    profile {
                        rating
                        ranking
                        solvedCount
                        submissionStats {
                            acSubmissionNum
                            waSubmissionNum
                            tleSubmissionNum
                            mleSubmissionNum
                            reSubmissionNum
                        }
                    }
                    recentSubmissionList {
                        title
                    }
                }
            }
        `,
        variables: {
            username: 'your_username_here'
        }
    })
})
.then(response => response.json())
.then(data => {
    const profileData = data.data.matchedUser.profile;
    const problemStats = data.data.matchedUser.profile.problemStats;
    const recentSubmissions = data.data.matchedUser.recentSubmissionList;

    document.getElementById('avatar').src = `https://leetcode.com/graphql/avatar/${profileData.username}`;
    document.getElementById('username').textContent = profileData.username;
    document.getElementById('rating').textContent = `Rating: ${profileData.rating}`;
    document.getElementById('solved').textContent = `Solved: ${profileData.solvedCount}`;
    document.getElementById('rank').textContent = `Rank: ${profileData.ranking}`;

    document.getElementById('submission-count').textContent = profileData.submissionStats.acSubmissionNum + profileData.submissionStats.waSubmissionNum + profileData.submissionStats.tleSubmissionNum + profileData.submissionStats.mleSubmissionNum + profileData.submissionStats.reSubmissionNum;
    document.getElementById('ac-submission-count').textContent = profileData.submissionStats.acSubmissionNum;
    document.getElementById('wa-submission-count').textContent = profileData.submissionStats.waSubmissionNum;
    document.getElementById('tle-submission-count').textContent = profileData.submissionStats.tleSubmissionNum;
    document.getElementById('mle-submission-count').textContent = profileData.submissionStats.mleSubmissionNum;
    document.getElementById('re-submission-count').textContent = profileData.submissionStats.reSubmissionNum;

    document.getElementById('total-problems').textContent = problemStats.totalProblems;
    document.getElementById('easy-problems').textContent = problemStats.easyProblems;
    document.getElementById('medium-problems').textContent = problemStats.mediumProblems;
    document.getElementById('hard-problems').textContent = problemStats.hardProblems;

    recentSubmissions.forEach(submission => {
        const listItem = document.createElement('li');
        listItem.textContent = submission.title;
        document.getElementById('recent-submissions-list').appendChild(listItem);
    });
})
.catch(error => console.error(error));