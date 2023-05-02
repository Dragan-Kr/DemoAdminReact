import React from 'react';

function ImageComponent(props) {
  return (
    <div>
      <img src={`/images/${props.imageFileName}`} alt="image" />
    </div>
  );
}

export default ImageComponent;