import React, { useState } from 'react';

function ImageUploaderSecondPart() {
  const [images, setImages] = useState([]);

  const handleImageUpload = e => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setImages(prevImages => [...prevImages, ...newImages]);
  };

  const handleImageDelete = index => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  return (
    <div className="container">
      <fieldset className="form-group">
        <a href="javascript:void(0)" onClick={() => document.getElementById('pro-image').click()}>
          Upload Image
        </a>
        <input
          type="file"
          id="pro-image"
          name="pro-image"
          style={{ display: 'none' }}
          className="form-control"
          multiple
          onChange={handleImageUpload}
        />
      </fieldset>
      <div className="preview-images-zone">
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
      </div>
    </div>
  );
}

export default ImageUploaderSecondPart;