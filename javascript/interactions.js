async function dataMoreOpen(id) {
  var dataMore = document.getElementById("dataMore");
  dataMore.style.display = "block";

  setTimeout(() => {
    document.getElementById("userProfileLocal").style.display = "block";
    document.getElementById("loadDiv").style.display = "none";
  }, 1500);
}

async function dataMoreClose() {
  var dataMore = document.getElementById("dataMore");
  dataMore.style.display = "none";
  document.getElementById("userProfileLocal").style.display = "none";
  document.getElementById("loadDiv").style.display = "block";
}
