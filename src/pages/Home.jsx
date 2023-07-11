import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL, uploadBytes, getMetadata } from 'firebase/storage';

const Home = () => {
  const [imageUrls, setImageUrls] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    // Initialize Firebase storage
    const storage = getStorage();

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
            />
          </div>
        ))}
      </section>
    </main>
  );
};

export default Home;
