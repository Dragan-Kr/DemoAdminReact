// import React, { useState, useEffect } from "react";
// import PostService from "./PostService";

// const UpdatePostComponent = (props) => {
//   const [state, setState] = useState({
//     _id: "",
//     title: "",
//     shortDescription: "",
//     mainContent: "",
//     isPublished: false,
//     postDate: new Date(),
//     createdBy: [],
//     categories: [],
//     selectedOptions: "",
//     images: [],
//   });

//   useEffect(() => {
//     const url = window.location.href;
//     const id = url.substring(url.lastIndexOf("/") + 1).split("?")[0].split("#")[0];
//     setState({ _id: id });
//     console.log("Ovo je id iz componentDidUpdate", id);
//     PostService.getPostById(id).then((res) => {
//       let post = res.data;
//       console.log("Ovo je res.data iz componentDidMount", res.data);
//       setState((prevState) => ({
//         ...prevState,
//         title: post.title,
//         shortDescription: post.shortDescription,
//         mainContent: post.mainContent,
//         isPublished: post.isPublished,
//         postDate: post.postDate,
//         createdBy: post.createdBy,
//         categories: post.categories,
//       }));
//     });
//   }, []);

//   const updatePost = (e) => {
//     e.preventDefault();

//     const valueArray = state.selectedOptions.map((item) => item.value);
//     console.log("Ovo je valueArray" + JSON.stringify(valueArray));

//     let post = {
//       title: state.title,
//       shortDescription: state.shortDescription,
//       mainContent: state.mainContent,
//       isPublished: state.isPublished,
//       postDate: state.postDate,
//       categories: valueArray,
//       createdBy: state.createdBy.value,
//     };

//     PostService.updatePost(post, state._id)
//       .then((res) => {
//         // window.location.replace('http://localhost:3000/news-list');
//       })
//       .catch((error) => {
//         console.log(error.message);
//       });
//   };

//   const changeTitleHandler = (event) => {
//     setState({ ...state, title: event.target.value });
//   };

//   const changeShortDescriptionHandler = (event) => {
//     setState({ ...state, shortDescription: event.target.value });
//   };

//   const changeMainContentHandler = (event) => {
//     setState({ ...state, mainContent: event.target.value });
//   };

//   const changeIsPublishedHandler = (event) => {
//     console.log("Ovo je iz IsPublished evenet" + event.target.value);
//     setState({ ...state, isPublished: event.target.checked });
//   };

//   const changePostDateHandler = (event) => {
//     setState({ ...state, postDate: event.target.value });
//   };

//   const handleSelect = (event) => {
//     setState({ ...state, selectedOptions: event });
//   };

//   const handleWriterSelect = (event) => {
//     console.log("Ovo je selectEvent", event);
//     setState({ ...state, createdBy: event });
//   };

//   ///////////ImageUploader constants//////////////////
//   const readImage = (event) => {
//     if (window.File && window.FileList && window.FileReader) {
//       const files = event.target.files;

//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];

//         if (!file.type.match('image')) continue;

//         const picReader = new FileReader();

//         picReader.addEventListener('load', (event) => {
//           const picFile = event.target;
//           const newImage = picFile.result;
//           setImages(prevImages => [...prevImages, newImage]);
//         });

//         picReader.readAsDataURL(file);
//       }
//       document.querySelector("#pro-image").value = '';
//     } else {
//       console.log('Browser not support');
//     }
//   };

  
//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map((file) => URL.createObjectURL(file));
//     setImages((prevImages) => [...prevImages, ...newImages]);
//     console.log("Ovo je newImages iz handleImageLoad", newImages);
//   };

//   const handleImageDelete = (index) => {
//     const newImages = [...images];
//     newImages.splice(index, 1);
//     setImages(newImages);
//   };

//   const handleDrop = (event) => {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     const newImages = files.map((file) => URL.createObjectURL(file));
//     setImages((prevImages) => [...prevImages, ...newImages]);
//   };

//   const handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   return (
//     <form>
//         <div className="heading-post">
//             <h1>Update Post</h1>
//             <div className='top-btns'>
//                 <button className="save-button" onClick={updatePost}><Isvg src={Save} />Save</button>

//             </div>


//         </div>
//         <div className="d-flex flex-row">

//             <div className="left-form">
//                 <input className="title-input" placeholder="Title" type='text' value={this.state.title} onChange={this.changeTitleHandler} />
//                 <h2>Content</h2>
//                 <div className="textarea-content">
//                     <label>Short description</label>
//                     <textarea rows="5" cols="50" placeholder="Short content of the editor..." value={this.state.shortDescription} onChange={this.changeShortDescriptionHandler}>
//                     </textarea>
//                 </div>

//                 <div className="textarea-content">
//                     <label>Main content</label>
//                     <textarea rows="20" cols="50" placeholder="Content of the editor..." value={this.state.mainContent} onChange={this.changeMainContentHandler}>
//                     </textarea>
//                 </div>

//                 <div className='image-uploader'>
//                     <h4>Images</h4>
//                     <fieldset className="form-group">
//                         <input
//                             type="file"
//                             id="pro-image"
//                             name="pro-image"
//                             style={{ display: 'none' }}
//                             className="form-control"
//                             multiple
//                             onInput={event => {
//                                 this.readImage(event);
//                                 this.handleImageUpload(event);
//                             }}
//                         />
//                     </fieldset>

//                     <div className="preview-images-zone" onDrop={this.handleDrop.bind(this)} onDragOver={this.handleDragOver.bind(this)}>
//                         {this.state.images.map((image, index) => (
//                             <div className={`preview-image preview-show-${index + 1}`} key={index}>
//                                 <div className="image-cancel" data-no={index + 1} onClick={() => this.handleImageDelete(index)}>
//                                   <Isvg src={Cancel}/>
//                                 </div>
//                                 <div className="image-zone">                                     
//                                     <img id={`pro-img-${index + 1}`} src={image} alt="" />
                                    
//                                 </div>
                                
//                             </div>
//                         ))}
//                         <a href="javascript:void(0)" onClick={() => document.getElementById('pro-image').click()}>
//                             <div className='uploader-add-link'>
//                             <Isvg src={Plus} />
//                                 <span className='span1'>Upload a File</span> 
//                                 <span className='span2'> or drag and drop</span>
//                              </div>
//                         </a>
//                     </div>


//                 </div>



//             </div>

//             <div className="right-form">

//                 <div className="select-content">
//                     <label>Written By</label>
//                     <Select

//                         options={this.state.writers}
//                         value={this.state.createdBy}
//                         onChange={this.handleWriterSelect}
//                         styles={colourStyles} />
//                 </div>

//                 <div className="date-content">
//                     <label>Post Date</label>
//                     <input className="date-input" placeholder="5 May 2022" type='date' value={this.state.postDate} onChange={this.changePostDateHandler} />
//                 </div>




//                 <div className="categories-content">
//                     <label>Categories</label>

//                     <Select
//                         options={this.state.categories}
//                         placeholder="Select category"
//                         value={this.state.selectedOptions}
//                         onChange={this.handleSelect}
//                         isSearchable={true}
//                         isMulti
//                         styles={colourStyles}
//                     />
//                 </div>

//                 <div className="published-content">
//                     <label>Published</label>
//                     <label className="switch">

//                         <input type="checkbox" value={this.state.isPublished} onChange={this.changeIsPublishedHandler} />
//                         <span className="slider round"></span>
//                     </label>

//                 </div>


//             </div>
//         </div>

//         <div>

//         </div>

//     </form>


// )
//   };