const apikey = "lipueE0YgvfYx7Yro9sfByFDabxVMEUMYHX6tQ7XVhHaMhhHHdrAM5Pd";
const perPage = 15;
let currentPage = 1;
const gallery = document.querySelector(".images");
const loadmorebtn = document.querySelector(".load-more");
const searchinput = document.querySelector(".search-box input");
const lightBox = document.querySelector(".lightbox");
const closeBtn = lightBox.querySelector(".uil-times");
const downloadImgBtn = lightBox.querySelector(".uil-import");
let searchTerm = null;

const downloadImg = (imgURL) => {
    //console.log(imgURL);
    fetch(imgURL).then(res => res.blob()).then(file => {
        //console.log(file); // Check structure
        const a = document.createElement("a");
        a.href = URL.createObjectURL(file);
        a.download = new Date().getTime();
        a.click();
    }).catch(() => ("Failed to download image!"));

}
const showLightbox = (name, img) => {
    lightBox.querySelector("img").src = img;
    lightBox.querySelector("span").innerText = name;
    downloadImgBtn.setAttribute("data-img", img)
    lightBox.classList.add("show");
    document.body.style.overflow = "hidden";
}
const hideLightbox = () => {
    lightBox.classList.remove("show");
    document.body.style.overflow = "auto";
}
const generateHTML = (images) => {
    gallery.innerHTML += images.map(img =>
        `<li class="card" onclick="showLightbox('${img.photographer}','${img.src.large2x}')">
            <img src="${img.src.large2x}" alt="Image by ${img.photographer}">
            <div class="details">
                <div class="photographer">
                    <i class="uil uil-camera"></i>
                    <span>${img.photographer}</span>
                </div>
                <button onclick="downloadImg('${img.src.large2x}');event.stopPropagation();"> 
                <i class="uil uil-import"></i>
                </button>
            </div>
        </li>`
    ).join(""); // Join the array into a string
}
const getImages = (apiURL) => {
    loadmorebtn.innerHTML = "Loading...";
    loadmorebtn.classList.add("disabled");
    fetch(apiURL, {
        headers: { Authorization: apikey }
    })
        .then(res => res.json())
        .then(data => {
            //console.log(data); // Check structure
            generateHTML(data.photos); // Use data.photos (not data)
            loadmorebtn.innerHTML = "Loading More";
            loadmorebtn.classList.remove("disabled");
        }).catch(error => console.error("Error fetching images:", error));
}
const loadmoreimgs = () => {
    currentPage++;
    let apiURL = `https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`;
    apiURL = searchTerm ? `https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}` : apiURL;
    getImages(apiURL)
}
const loadsearchimgs = (e) => {
    if (e.target.value === "") return searchTerm = null;
    if (e.key === "Enter") {
        //console.log("Enter key Pressed");
        currentPage = 1;
        searchTerm = e.target.value;
        gallery.innerHTML = "";
        getImages(`https://api.pexels.com/v1/search?query=${searchTerm}&page=${currentPage}per_page=${perPage}`);

    }
}

getImages(`https://api.pexels.com/v1/curated?page=${currentPage}per_page=${perPage}`);
loadmorebtn.addEventListener("click", loadmoreimgs);
searchinput.addEventListener("keyup", loadsearchimgs);
closeBtn.addEventListener("click", hideLightbox);
downloadImgBtn.addEventListener("click", (e) => downloadImg(e.target.dataset.img));