import React, { useState } from 'react';

// function ImageUploader() {
//   const [num, setNum] = useState(4);

//   const readImage = (event) => {
//     if (window.File && window.FileList && window.FileReader) {
//       const files = event.target.files; //FileList object
//       const output = document.querySelector(".preview-images-zone");

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
//         if (!file.type.match('image')) continue;

//         const picReader = new FileReader();

//         picReader.addEventListener('load', function (event) {
//           const picFile = event.target;
//           const html =  '<div class="preview-image preview-show-' + num + '">' +
//                         '<div class="image-cancel" data-no="' + num + '">x</div>' +
//                         '<div class="image-zone"><img id="pro-img-' + num + '" src="' + picFile.result + '"></div>' +
//                         '<div class="tools-edit-image"><a href="javascript:void(0)" data-no="' + num + '" class="btn btn-light btn-edit-image">edit</a></div>' +
//                         '</div>';

//           output.innerHTML += html;
//           setNum(num + 1);
//         });

//         picReader.readAsDataURL(file);
//       }
//       document.querySelector("#pro-image").value = '';
//     } else {
//       console.log('Browser not support');
//     }
//   }

//   return (
//     <div>
//       <input type="file" id="pro-image" onChange={readImage} />
//       <div className="preview-images-zone">
//       <fieldset className="form-group">
//         {/* <a href="javascript:void(0)" onclick="$('#pro-image').click()">Upload Image</a> */}
//         <input type="file" id="pro-image" name="pro-image" style={{display: "none"}} className="form-control" multiple />
//     </fieldset>
//     <div className="preview-images-zone">
//     <div className="preview-image preview-show-1">
//             <div className="image-cancel" data-no="1">x</div>
//             <div className="image-zone"><img id="pro-img-1" src="https://img.purch.com/w/660/aHR0cDovL3d3dy5saXZlc2NpZW5jZS5jb20vaW1hZ2VzL2kvMDAwLzA5Ny85NTkvb3JpZ2luYWwvc2h1dHRlcnN0b2NrXzYzOTcxNjY1LmpwZw=="/></div>
//             <div className="tools-edit-image"><a href="javascript:void(0)" data-no="1" class="btn btn-light btn-edit-image">edit</a></div>
//         </div>

//         <div className="preview-image preview-show-2">
//             <div className="image-cancel" data-no="2">x</div>
//             <div className="image-zone"><img id="pro-img-2" src="https://www.codeproject.com/KB/GDI-plus/ImageProcessing2/flip.jpg"/></div>
//             <div className="tools-edit-image"><a href="javascript:void(0)" data-no="2" class="btn btn-light btn-edit-image">edit</a></div>
//         </div>
//         <div className="preview-image preview-show-3">
//             <div className="image-cancel" data-no="3">x</div>
//             <div className="image-zone"><img id="pro-img-3" src="http://i.stack.imgur.com/WCveg.jpg"/></div>
//             <div className="tools-edit-image"><a href="javascript:void(0)" data-no="3" class="btn btn-light btn-edit-image">edit</a></div>
//         </div>
//     </div>

//       </div>
//     </div>
//   );
// }

// export default ImageUploader;






function ImageUploader() {
    const [num, setNum] = useState(4);
    const [images, setImages] = useState([]);
    // const [imagePaths,setImagePaths] = useState([]);
    const readImage = (event) => {
      if (window.File && window.FileList && window.FileReader) {
        const files = event.target.files; //FileList object
  
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          if (!file.type.match('image')) continue;
  
          const picReader = new FileReader();
  
          picReader.addEventListener('load', function (event) {
            const picFile = event.target;
            const newImage = picFile.result;
            setImages(prevImages => [...prevImages, newImage]);
          });
         

          picReader.readAsDataURL(file);
        }
        document.querySelector("#pro-image").value = '';
      } else {
        console.log('Browser not support');
      }
    }
  
    const handleImageUpload = e => {
      const files = Array.from(e.target.files);
      const newImages = files.map(file => URL.createObjectURL(file));
      console.log("Ovo je newImages",newImages);
      setImages(prevImages => [...prevImages, ...newImages]);
    };
  
    const handleImageDelete = index => {
      const newImages = [...images];
      newImages.splice(index, 1);
      setImages(newImages);
    };

    const handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        const newImages = files.map(file => URL.createObjectURL(file));
       
        setImages(prevImages => [...prevImages, ...newImages]);
      };
      
      const handleDragOver = (event) => {
        event.preventDefault();
      };
      
  
    return (
        <div>
            <h2>Images</h2>
        <fieldset className="form-group">
          {/* <a href="javascript:void(0)" onClick={() => document.getElementById('pro-image').click()}>
            <span>Upload a File or drag and drop</span>
          </a> */}
          <input
            type="file"
            id="pro-image"
            name="pro-image"
            style={{ display: 'none' }}
            className="form-control"
            multiple
            onChange={event => {
              readImage(event);
              handleImageUpload(event);
            }}
          />
          
        </fieldset>
        <div className="preview-images-zone" onDrop={handleDrop} onDragOver={handleDragOver}>
          {images.map((image, index) => (
            <div className={`preview-image preview-show-${index + 1}`} key={index}>
              <div className="image-cancel" data-no={index + 1} onClick={() => handleImageDelete(index)}>
                x
              </div>
              <div className="image-zone">
                <img id={`pro-img-${index + 1}`} src={image} />
              </div>
              <div className="tools-edit-image">
                <a href="javascript:void(0)" data-no={index + 1} className="btn btn-light btn-edit-image">
                  edit
                </a>
              </div>
            </div>
          ))}
          <a href="javascript:void(0)" onClick={() => document.getElementById('pro-image').click()}>
            <p>Upload a File <span> or drag and drop</span> </p>
          </a>
        </div>
       
      </div>    
    );
  }
  
  export default ImageUploader;


