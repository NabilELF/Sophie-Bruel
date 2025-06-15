// MAIN PAGE

//PAGE LOGIN OU LOGOUT

const token = localStorage.getItem("token");
const isLoggedIn = !!token; // true si existe

const loginLink = document.getElementById("login-link");
const triContainer = document.querySelector(".tri-container");
const modifierButton = document.querySelector(".modifier-button");

if (isLoggedIn) {
  loginLink.textContent = "logout";
  triContainer.style.display = "none";
  modifierButton.style.display = "inline-block";
} else {
  loginLink.textContent = "login";
  triContainer.style.display = "flex";
  modifierButton.style.display = "none";
}

loginLink.addEventListener("click", () => {
  if (localStorage.getItem("token")) {
    // Déconnexion
    localStorage.removeItem("token");
    window.location.reload();
  } else {
    // Rediriger vers la page de login
    window.location.href = "login.html";
  }
});

// Creer la gallery

const gallery = document.querySelector(".gallery");

async function createGallery() {
  const response = await fetch("http://localhost:5678/api/works");
  const works = await response.json();

  gallery.innerHTML = "";

  works.forEach((work) => {
    const figure = document.createElement("figure");
    figure.dataset.id = work.id;
    figure.dataset.categoryId = work.categoryId;

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const figCaption = document.createElement("figcaption");
    figCaption.innerHTML = work.title;

    figure.appendChild(img);
    figure.appendChild(figCaption);
    gallery.appendChild(figure);
  });
}

createGallery();

// Trier avec les buttons

const triButtons = document.querySelectorAll(".tri-buttons");

triButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const categoryButton = button.dataset.categoryId;

    const galleryImages = document.querySelectorAll(".gallery figure");

    triButtons.forEach((btn) => btn.classList.remove("tri-buttons-active"));
    button.classList.add("tri-buttons-active");

    galleryImages.forEach((image) => {
      const categoryImage = image.dataset.categoryId;

      //Remettre toutes les photos à chaque click
      image.style.display = "";

      if (categoryImage !== categoryButton) {
        image.style.display = "none";
      }
      if (categoryButton === "tous") {
        image.style.display = "";
      }
    });
  });
});

// MODAL

//Faire apparaitre la modale

const projects = document.querySelector(".projects");
const modifier = document.querySelector(".modifier-button");
const modalContainer = document.querySelector(".modal-container");
const modalPhotos = document.querySelector(".modal-photos");
const closeModal = document.querySelectorAll(".close-modal");
const modalContainerTwo = document.querySelector(".modal-container-two");

modifier.addEventListener("click", () => {
  modalContainer.style.opacity = "1";
  modalContainer.style.transform = "translateY(0)";
});

// Faire disparaitre la modale

closeModal.forEach((button) => {
  button.addEventListener("click", () => {
    modalContainer.style.opacity = "0";
    modalContainer.style.transform = "translateY(-100%)";
  });
});

modalContainer.addEventListener("click", (event) => {
  if (event.target === modalContainer) {
    modalContainer.style.opacity = "0";
    modalContainer.style.transform = "translateY(-100%)";
  }
});

modalContainerTwo.addEventListener("click", (event) => {
  if (!event.target.closest(".modal-content")) {
    modalContainer.style.opacity = "0";
    modalContainer.style.transform = "translateY(-100%)";
  }
});

// création de la modale, importation des photos

async function createModal() {
  await createGallery();

  const galleryImages = document.querySelectorAll(".gallery figure");

  galleryImages.forEach((image) => {
    const img = image.querySelector("img");
    const modalPhotoContainer = document.createElement("div");
    modalPhotoContainer.classList.add("modal-photo-container");
    modalPhotoContainer.dataset.id = image.dataset.id;

    modalPhotoContainer.innerHTML = `
    <img src=${img.src} alt=${img.alt} class="modal-photo">
    <img src="./assets/icons/trashbin.png" alt="delete" class="modal-delete-icons">`;

    modalPhotos.appendChild(modalPhotoContainer);
  });

  const modalDeleteIcons = document.querySelectorAll(".modal-delete-icons");

  modalDeleteIcons.forEach((icon) => {
    icon.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();

      const parentDiv = icon.parentElement;
      const id = parentDiv.dataset.id;
      const token = localStorage.getItem("token");

      try {
        const response = await fetch(`http://localhost:5678/api/works/${id}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          parentDiv.remove();

          const match = Array.from(galleryImages).find(
            (match) => match.dataset.id === id
          );

          if (match) {
            match.remove();
          }
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    });
  });
}

createModal();

// Changer de modal

const addPhotoButton = document.querySelector(".modal-add-photo");
const modalDeleteWork = document.querySelector(".modal-content-delete-work");
const modalAddWork = document.querySelector(".modal-content-add-work");
const backModal = document.querySelector(".back-modal");

addPhotoButton.addEventListener("click", () => {
  modalDeleteWork.style.display = "none";
  modalAddWork.style.display = "flex";
});

backModal.addEventListener("click", () => {
  modalDeleteWork.style.display = "flex";
  modalAddWork.style.display = "none";
});

// Ajouter des projets

const addPhotoBtn = document.querySelector(".add-photo-button");
const addPhotoIcon = document.querySelector(".add-photo-icon");
const addWorkBtn = document.querySelector(".add-work-button");
const title = document.getElementById("title");
const titleWorkContainer = document.querySelector(".title-work-container");
const photoInfo = document.querySelector(".photo-info");
const uploadPhoto = document.querySelector(".upload-photo");

addPhotoBtn.addEventListener("click", () => {
  imageInput.click(); // ouvrir le sélecteur de fichier
});

imageInput.addEventListener("change", () => {
  //Récupérer le premier fichier sélectionné
  const file = imageInput.files[0];

  //création du fichier pour lire l'image localement
  const reader = new FileReader();

  //prendre le résultat de reader et le mettre dans src de l'image
  reader.onload = () => {
    //Afficher l'image
    addPhotoIcon.src = reader.result;

    // masquer le bouton et le texte
    addPhotoBtn.style.display = "none";
    photoInfo.style.display = "none";
    uploadPhoto.style.padding = "0px";
    uploadPhoto.style.height = "140px";
    addPhotoIcon.style.height = "100%";
    addPhotoIcon.style.width = "auto";
  };

  reader.readAsDataURL(file);
});

addWorkBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  if (title.value === "") {
    const emptyTitleMsg = document.querySelector(".emptyTitle");
    if (emptyTitleMsg) emptyTitleMsg.remove();

    const emptyTitle = document.createElement("p");
    emptyTitle.className = "emptyTitle";
    emptyTitle.style.marginTop = "10px";
    emptyTitle.style.color = "red";
    emptyTitle.innerHTML = "Veuillez indiquer un titre";
    titleWorkContainer.appendChild(emptyTitle);
  } else {
    const imageFile = imageInput.files[0];

    const formData = new FormData();
    formData.append("title", title.value.trim());
    formData.append("category", 3);
    formData.append("image", imageFile);

    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData,
    });

    if (response.ok) {
      const newWork = document.createElement("figure");
      newWork.innerHTML = `
        <img src="${URL.createObjectURL(imageFile)}" alt="newWork">
        <figcaption>${title.value.trim()}</figcaption>
      `;
      gallery.appendChild(newWork);
      await createModal();
    } else {
      alert("Erreur lors de l'envoi");
    }
  }
});

// Changer la couleur du button pour ajouter un projet (gris ou vert)

function buttonColorChange() {
  const hasImage = imageInput.files.length > 0;
  const hasTitle = title.value.trim() !== "";

  if (hasImage && hasTitle) {
    addWorkBtn.classList.add("modal-add-photo");
    addWorkBtn.classList.remove("add-work-button");
  } else {
    addWorkBtn.classList.remove("modal-add-photo");
    addWorkBtn.classList.add("add-work-button");
  }
}

imageInput.addEventListener("change", buttonColorChange);
title.addEventListener("input", buttonColorChange);

buttonColorChange();
