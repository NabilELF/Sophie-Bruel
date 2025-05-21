const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#password-input");
const connectButton = document.querySelector(".connect-button");
const passwordContainer = document.querySelector(".password-container");

connectButton.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  const reponse = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  // event.preventDefault();

  if (reponse.ok) {
    const data = await reponse.json();
    localStorage.setItem("token", data.token);
    window.location.href = "index.html";
  } else {
    const existingMessage = document.querySelector(".wrongLogin");
    if (existingMessage) existingMessage.remove();

    const wrongLogin = document.createElement("p");
    wrongLogin.className = "wrongLogin";
    wrongLogin.style.marginTop = "10px";
    wrongLogin.style.color = "red";
    wrongLogin.innerHTML = "Erreur dans l’identifiant ou le mot de passe";
    passwordContainer.appendChild(wrongLogin);
  }
});
