import React, { useEffect, useState } from 'react';
import PostService from '../services/PostService';

function ImageComponent({ imageFileForBlob }) {

  const [images, setImages] = useState([]);
  const [imagesNames, setImagesNames] = useState([]);
  const [tempImagesNames, setTempImagesNames] = useState([]);

  useEffect(() => {
    const fileNames = imageFileForBlob.map(file => file.name);

    setTempImagesNames(oldArray => {
      const newNames = [...new Set([...oldArray, ...fileNames, ...imagesNames])];
      return newNames;
    });



  }, [imageFileForBlob, imagesNames]);

  const handleImages = (e) => {
    const files = e.target.files;
    setImages(files);
    setImagesNames(Array.from(files).map((file) => file.name));//ponov se renderuje
  }

  const handleSubmit = () => {
    let formData = new FormData();

    if (images.length > 0) {
      let imagesForm = [];
      for (let i = 0; i < images.length; i++) {

        formData.append('images2', images[i]);
        imagesForm.push(formData)
      }




    } else {


    }



  }

  const handleDeleteImage = (index) => {
    const newImageNames = [...imagesNames];
    newImageNames.splice(index, 1);

    const newTempImageNames = [...tempImagesNames];
    newTempImageNames.splice(index, 1);

    setImagesNames(newImageNames);
    setTempImagesNames(newTempImageNames);
  };





  return (
    <div className='image-uploader'>
      <h4>IMAGES</h4>
      {Array.from(images).map((item, index) => (
        <span key={index}>
          <img style={{ padding: '10px' }} width={150} height={100} src={item ? URL.createObjectURL(item) : null} />
        </span>
      ))}
      <fieldset className="form-group">
        <input multiple type='file' onChange={handleImages} />
      </fieldset>
      <button onClick={handleSubmit}>SUBMIT</button>
      <span>
        {tempImagesNames.map((filename, index) => (
          <div key={index}>
            <img src={`http://localhost:8000/images/${filename}`} alt={filename} />
            <button onClick={() => handleDeleteImage(index)}>Delete</button>
          </div>
        ))}
      </span>
    </div>
  );
}

export default ImageComponent;


// function ImageComponent({ imageFileForBlob }) {

//   let fileNames;

//   console.log(" fileNames", typeof (fileNames))

//   const [images, setImages] = useState([]);
//   const [imagesNames, setImagesNames] = useState([]);

//   const [tempImagesNames, setTempImagesNames] = useState([]);

//   const [images2, setImages2] = useState('');

//   // setTempImagesNames(fileNames);


//   useEffect(() => {



//     function imagesHandling() {


//       fileNames = imageFileForBlob.map(file => file.name);

//       Array.from(fileNames).forEach(item => {
//         setTempImagesNames(oldArray => [...oldArray, item])
//       });


//       Array.from(imagesNames).forEach(item => {
//         setTempImagesNames(oldArray => [...oldArray, item])
//       })

//       console.log("UseEffect-tempImagesNames", tempImagesNames)
//       console.log("UseEffect-FILENAMES", fileNames)
//       console.log("UseEffect-imagesNames", imagesNames)

//     }

//     imagesHandling();


//   }, [imagesNames])


//   const handleSubmit = () => {

//     let formData = new FormData();
//     formData.append('images2', images2);

//     Array.from(images).forEach(item => {


//     })
//     setTempImagesNames(...fileNames, ...imagesNames);

//   }


//   const handleImages = (e) => {
//     const files = e.target.files;
//     setImages(files);
//     setImagesNames(Array.from(files).map((file) => file.name));
//   }


//   const handleDeleteImage = (index) => {
//     console.log("INDEX",index)
//     let newImageNames = [...imagesNames];

//     console.log("handleImageDelete->newImageNames",newImageNames)
//     let newTempImageNames = [...tempImagesNames];
//     console.log("handleImageDelete->newTempImageNames",newTempImageNames)

//     newImageNames.splice(index, 1);
//     console.log("Nakon splice-handleImageDelete->newImageNames",newImageNames)

//     newTempImageNames.splice(index, 1);
//     console.log("handleImageDelete->newTempImageNames",newTempImageNames)


//     setImagesNames(newImageNames);
//     setTempImagesNames(newTempImageNames);
//   };

//   return (
//     <div className='image-uploader'>


//       <h4>IMAGES</h4>
//       {
//         Array.from(images).map(item => {
//           return (
//             <span>
//               <img style={{ padding: '10px' }} width={150} height={100} src={item ? URL.createObjectURL(item) : null} />
//             </span>
//           )
//         })
//       }



//       <fieldset className="form-group">

//         <input multiple type='file' onChange={handleImages} />

//       </fieldset>
//       <button onClick={handleSubmit}>SUBMIT</button>
//       <span>
//         {tempImagesNames.map((filename, index) => (
//           // <img  src={`/uploads/${filename}`} alt={filename} />
//           <div>
//             <img key={index} src={'http://localhost:8000/images/' + filename} alt={filename} />
//             <button onClick={() => handleDeleteImage(index)}>Delete</button>

//           </div>
//         ))}
//       </span>

//     </div>
//   );
// }

// export default ImageComponent;







