document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("send-notification-button")
    .addEventListener("click", function () {
      // Get the current page URL and title
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var currentPageUrl = tabs[0].url;
        var currentPageTitle = tabs[0].title;

        // Get the API token and user token from local storage
        chrome.storage.local.get(["apiToken", "userToken"], function (items) {
          // If the API token and user token are not present in local storage, request them from the user
          if (!items.apiToken || !items.userToken) {
            var apiToken = prompt("Please enter your Pushover API token:");
            var userToken = prompt("Please enter your Pushover user token:");

            // Save the API token and user token in local storage
            chrome.storage.local.set({
              apiToken: apiToken,
              userToken: userToken,
            });
          }

          // Send the push notification to your smartphone using the Pushover API
          sendPushNotification(
            items.apiToken,
            items.userToken,
            currentPageTitle,
            currentPageUrl,
            currentPageUrl
          );
        });
      });
    });
});

// Sends a push notification to your smartphone using the Pushover API
function sendPushNotification(apiToken, userToken, title, message, url) {
  fetch("https://api.pushover.net/1/messages.json", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "token=" +
      encodeURIComponent(apiToken) +
      "&user=" +
      encodeURIComponent(userToken) +
      "&title=" +
      encodeURIComponent(title) +
      "&message=" +
      encodeURIComponent(message) +
      "&url=" +
      encodeURIComponent(url),
  }).then(function (response) {
    // Get the result element
    var resultElement = document.getElementById("result");
    console.log(response);

    // Handle the response from the Pushover API
    if (response.ok) {
      resultElement.innerHTML = "Push notification sent successfully!";
    } else {
      resultElement.innerHTML =
        "An error occurred while sending the push notification. Please try again.";
    }
  });
}
