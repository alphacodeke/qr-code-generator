(function () {
  const form = document.getElementById("qr-form");
  const input = document.getElementById("link-input");
  const button = document.getElementById("generate-btn");
  const resultPanel = document.getElementById("result-panel");
  const resultImage = document.getElementById("result-image");
  const resultLink = document.getElementById("result-link");
  const downloadBtn = document.getElementById("download-btn");
  const errorBox = document.getElementById("error-box");

  function getCookie(name) {
    const cookies = document.cookie ? document.cookie.split(";") : [];
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.startsWith(name + "=")) {
        return decodeURIComponent(cookie.slice(name.length + 1));
      }
    }
    return null;
  }

  function showError(message) {
    errorBox.textContent = message;
    errorBox.classList.remove("hidden");
  }

  function clearError() {
    errorBox.textContent = "";
    errorBox.classList.add("hidden");
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    clearError();

    const value = input.value.trim();
    if (!value) {
      showError("Enter a link before generating a code.");
      input.focus();
      return;
    }

    button.disabled = true;
    button.querySelector("span").textContent = "Working";

    const payload = new FormData();
    payload.append("link", value);
    payload.append("csrfmiddlewaretoken", getCookie("csrftoken"));

    fetch(form.dataset.generateUrl || "/generate/", {
      method: "POST",
      body: payload,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then(function (response) {
        return response.json().then(function (data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function (result) {
        if (!result.ok) {
          showError(result.data.error || "Something went wrong. Try again.");
          return;
        }

        resultImage.src = result.data.image_url;
        resultLink.href = result.data.link;
        resultLink.textContent = result.data.link;
        downloadBtn.href = result.data.image_url;
        downloadBtn.setAttribute("download", "qr-" + result.data.id + ".png");
        resultPanel.classList.remove("hidden");
      })
      .catch(function () {
        showError("Could not reach the server. Check your connection.");
      })
      .finally(function () {
        button.disabled = false;
        button.querySelector("span").textContent = "Generate";
      });
  });
})();
