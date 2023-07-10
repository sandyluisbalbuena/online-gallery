import React, { useEffect, useState } from 'react';
import { getStorage, ref, listAll, getDownloadURL } from 'firebase/storage';

const Home = () => {
  const [imageUrls, setImageUrls] = useState([]);

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

  return (
    <main className='container'>

      <section className='row mt-5'></section>

      <section className='row'>

      {imageUrls.map((imageUrl, index) => (
        <div className='col-12 col-md-2'  key={index}>
          <img className='rounded my-4' src={imageUrl} alt={`Image ${index}`} width='100%' height='90%'/>
        </div>
      ))}

      </section>

    </main>
    
  );
};

export default Home;
