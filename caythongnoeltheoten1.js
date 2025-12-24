
document.addEventListener('DOMContentLoaded', function () {

  const inputImg = document.getElementById('janinputIMG1');
  if (inputImg) {
    inputImg.addEventListener('change', function (event) {
      const file = event.target.files[0];
      if (file) {
        const blobURL = URL.createObjectURL(file);
        document.getElementById('janpreview1').src = blobURL;
        document.getElementById('anhnen').value = blobURL;
      }
    });
  }


  window.janselectImage1 = function (src) {
    document.getElementById('janpreview1').src = src;
    document.getElementById('anhnen').value = src;

    const uploadTabEl = document.querySelector('#upload-tab');
    if (uploadTabEl) {
      const uploadTab = new bootstrap.Tab(uploadTabEl);
      uploadTab.show();
    }
  };

  const chonanhnen = document.getElementById('chonanhnen');
  if (chonanhnen) {
    chonanhnen.addEventListener('change', function () {
      const phanchonanh = document.getElementById('phanchonanh');
      phanchonanh.style.display = this.checked ? 'block' : 'none';
    });
  }

});

