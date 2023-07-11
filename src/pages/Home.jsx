import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, getMetadata } from 'firebase/storage';
import { createCanvas, loadImage } from 'canvas';

const Home = () => {
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    // Initialize Firebase storage
    const storage = getStorage();

    getDataOneCard();

    // Create a reference to the 'img' folder in your Firebase storage bucket
    const imagesRef = ref(storage, 'img');

    // Fetch all the images in the 'img' folder
    listAll(imagesRef)
      .then((res) => {
        // Get the download URL for each image and store them in state
        const promises = res.items.map((item) =>
          getDownloadURL(item).then((url) => url)
        );
        Promise.all(promises).then((urls) => {
          setImageUrls(urls);
        });
      })
      .catch((error) => {
        console.log('Error fetching images:', error);
      });
  }, []);

  const getDataOneCard = (Id) => {
		axios.get(`https://pok3mon.online/api/users`)
		.then(response => {
			console.log(response.data);
		})
		.catch(error => console.error('On get one pokemon card error', error))
		.then(() => { 
	
		})
	}

  const handleImageClick = (imageUrl, imgId, src) => {

    var img = document.getElementById(imgId);

    Swal.fire({
      title: 'Select Filter',
      html: `<div><select id="filter-select" class="swal2-input"><option value="grayscale">Grayscale</option><option value="sepia">Sepia</option><option value="blur">Blur</option></select></div>
        <div><img src="${src}" class="swal2-image" alt="Selected Image"></div>`,
      showCancelButton: true,
      confirmButtonText: 'Apply',
      preConfirm: () => {
        const filterSelect = document.getElementById('filter-select');
        const selectedFilter = filterSelect.value;
        applyFilter(selectedFilter, imageUrl);
      },
      didOpen: () => {
        Swal.getPopup().querySelector('.swal2-image').style.maxWidth = '400px';
        Swal.getPopup().querySelector('.swal2-image').style.maxHeight = '200px';
        img.onload = function() {
          pixelsJS.filterImg(img, "grayscale");
        };
      }
    });
    
    
  };

  const applyFilter = async (filter, imageUrl) => {
    const canvas = createCanvas();
    const ctx = canvas.getContext('2d');
    const img = await loadImage(imageUrl);
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
  
    // Apply the filter based on the selected option
    if (filter === 'grayscale') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const gray = (r + g + b) / 3;
        pixels[i] = pixels[i + 1] = pixels[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
    } else if (filter === 'sepia') {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const newR = Math.min(255, r * 0.393 + g * 0.769 + b * 0.189);
        const newG = Math.min(255, r * 0.349 + g * 0.686 + b * 0.168);
        const newB = Math.min(255, r * 0.272 + g * 0.534 + b * 0.131);
        pixels[i] = newR;
        pixels[i + 1] = newG;
        pixels[i + 2] = newB;
      }
      ctx.putImageData(imageData, 0, 0);
    } else if (filter === 'blur') {
      ctx.filter = 'blur(5px)';
    }
  
    const filteredImageURL = canvas.toDataURL();
  
    // Save the filtered image to Firebase
    const storage = getStorage();
    const imagesRef = ref(storage, 'img');
    const filteredImageRef = ref(imagesRef, `filtered_${Date.now()}.png`);
  
    fetch(filteredImageURL)
      .then((response) => response.blob())
      .then((blob) => uploadBytes(filteredImageRef, blob))
      .then(() => {
        setImageUrls((prevUrls) => [...prevUrls, filteredImageURL]);
        Swal.fire('Filter Applied', 'Filter applied successfully!', 'success');
      })
      .catch((error) => {
        console.log('Error saving filtered image:', error);
        Swal.fire('Error', 'An error occurred while saving the filtered image.', 'error');
      });
  };
  
  

  const handleImageUpload = () => {
    Swal.fire({
      title: 'Upload Image',
      text: 'Please select an image file:',
      input: 'file',
      inputAttributes: {
        accept: 'image/*'
      },
      showCancelButton: true,
      confirmButtonText: 'Upload',
      showLoaderOnConfirm: true,
      preConfirm: (file) => {
        if (file) {
          const storage = getStorage();
          const imagesRef = ref(storage, `img/${file.name}`);

          return uploadBytes(imagesRef, file)
            .then(() => {
              return getMetadata(imagesRef)
                .then(() => {
                  return getDownloadURL(imagesRef)
                    .then((url) => {
                      setImageUrls((prevUrls) => [...prevUrls, url]);
                      return 'Upload successful!';
                    })
                    .catch((error) => {
                      throw new Error('Error getting download URL');
                    });
                })
                .catch((error) => {
                  throw new Error('Error getting metadata');
                });
            })
            .catch((error) => {
              throw new Error('Error uploading image');
            });
        } else {
          throw new Error('No file selected');
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      if (result.value) {
        Swal.fire('Success', result.value, 'success');
      }
    });
  };

  return (
    <main className='container'>
      <section className='row mt-5'></section>

      <div className='btn rounded upload-btn' onClick={handleImageUpload}>
        <i className='fas fa-plus'></i>
      </div>

      <section className='row'>
        {imageUrls.map((imageUrl, index) => (
          <div className='col-12 col-md-3' key={index}>
            <img
              className='rounded my-4'
              src={imageUrl}
              alt={`Image ${index}`}
              width='100%'
              height='90%'
              id={index}
              onClick={() => handleImageClick(imageUrl, index, imageUrl)}
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default Home;
