import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import PostService from '../services/PostService';
import ImageUploader from './ImageUploader';
import ImageUploaderSecondPart from './ImageUploaderSecondPart';
import Isvg from 'react-inlinesvg';
import Save from "../images/save.svg";
import Eye from "../images/eye.svg";
import Plus from "../images/plus.svg";
import Cancel from '../images/cancel.svg';
// import FormData from 'formdata';
import FormData from 'form-data';
import { format } from 'date-fns'
import Index from '../pages/Pages/index';

class UpdatePostComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            _id: '',       
            title: '',
            shortDescription: '',
            mainContent: '',
            isPublished: false,
            postDate: new Date(),
            createdBy: [],
            categories: [],
            selectedOptions: '',
            images: []
        };

        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeShortDescriptionHandler = this.changeShortDescriptionHandler.bind(this);
        this.changeMainContentHandler = this.changeMainContentHandler.bind(this);
        this.changeIsPublishedHandler = this.changeIsPublishedHandler.bind(this);
        this.changePostDateHandler = this.changePostDateHandler.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleWriterSelect = this.handleWriterSelect.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.readImage = this.readImage.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }


    componentWillMount(){
        const url = window.location.href;
        const id = url.substring(url.lastIndexOf('/') + 1).split("?")[0].split("#")[0];
        this.setState({_id:id});
        console.log("Ovo je id iz componentDidUpdate",id);
        PostService.getPostById(id).then((res) =>{
            let post = res.data;
            console.log("Ovo je res.data iz componentDidMount",res.data);
            this.setState({title: post.title,
                shortDescription: post.shortDescription,
                mainContent:post.mainContent,
                isPublished:post.isPublished,
                postDate:post.postDate,
                createdBy:post.createdBy,
                categories:post.categories
            });

        });
    }


    

    updatePost(e) {
        e.preventDefault();
       
        const valueArray = this.state.selectedOptions.map(item => item.value);
        console.log("Ovo je valueArray" + JSON.stringify(valueArray));
    

        let post = {
            title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
            isPublished: this.state.isPublished, postDate: this.state.postDate, categories: valueArray, createdBy: this.state.createdBy.value,
            
        };


       
       
        PostService.updatePost(post,this.state._id)

            .then(res => {
               
                // window.location.replace('http://localhost:3000/news-list');
            }).catch((error) => {
                console.log(error.message);
            });

    }

    

    changeTitleHandler(event) {
        this.setState({ title: event.target.value });
    }

    changeShortDescriptionHandler(event) {
        this.setState({ shortDescription: event.target.value });
    }

    changeMainContentHandler(event) {
        this.setState({ mainContent: event.target.value });
    }

    changeIsPublishedHandler(event) {
        console.log('Ovo je iz IsPublished evenet' + event.target.value);
        this.setState({ isPublished: event.target.checked });
    }


    changePostDateHandler(event) {
        this.setState({ postDate: event.target.value });
    }



    handleSelect(event) {
        this.setState({ selectedOptions: event });
    }

    handleWriterSelect(event) {

        console.log("Ovo je selectEvent", event);
        this.setState({ createdBy: event });
    }

    ///////////ImageUploader constants//////////////////
    readImage = (event) => {
        if (window.File && window.FileList && window.FileReader) {
            const files = event.target.files; //FileList object
           
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                console.log("Ovo je file iz readImage", file)
                if (!file.type.match('image')) continue;

                const picReader = new FileReader();

                picReader.addEventListener('load', (event) => {
                    const picFile = event.target;
                    const newImage = picFile.result;
                    console.log("Ovo je newImage iz readImage", newImage);
                    this.setState(prevState => ({ images: [...prevState.images, newImage] }))
                });

                picReader.readAsDataURL(file);
            }
            document.querySelector("#pro-image").value = '';
        } else {
            console.log('Browser not support');
        }
    }

    handleImageUpload = e => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        this.setState(prevState => ({ images: [...prevState.images, ...newImages] }));
        console.log("Ovo je newImages iz handleImageLoad", newImages);
    };

    handleImageDelete = index => {
        const newImages = [...this.state.images];
        newImages.splice(index, 1);
        this.setState({ images: newImages });
    };

    handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        this.setState(prevState => ({ images: [...prevState.images, ...newImages] }));
    };

    handleDragOver = (event) => {
        event.preventDefault();
    };



    /////////////////////////////////////////////////

    render() {

        const dropdownIndicatorStyles = (base, state) => {
            let changes = {
                // all your override styles
                backgroundColor: "green"
            };
            return Object.assign(base, changes);
        };


        const colourStyles = {
            control: styles => ({
                ...styles, backgroundColor: ' #F4F5FC', borderRadius: 10, height: 50, border: 0, color: "white",
                dropdownIndicator: { dropdownIndicatorStyles }
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return (
                    {
                        ...styles,
                        

                        height: 50,
                        dropdownIndicator: { dropdownIndicatorStyles }
                    }
                );
            },
            multiValue: (styles, { data }) => {
                return {
                    ...styles,
                    backgroundColor: "#5561B3",
                    borderRadius: 10,
                    height: 40
                }

            }, multiValueLabel: (styles, { data }) => {
                return {
                    ...styles,
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: "'Poppins', sans-serif",
                    aliginSelf: 'center'

                }
            }


        };





        return (
            <form>
                <div className="heading-post">
                    <h1>Update Post</h1>
                    <div className='top-btns'>
                        <button className="save-button" onClick={this.updatePost}><Isvg src={Save} />Save</button>

                    </div>


                </div>
                <div className="d-flex flex-row">

                    <div className="left-form">
                        <input className="title-input" placeholder="Title" type='text' value={this.state.title} onChange={this.changeTitleHandler} />
                        <h2>Content</h2>
                        <div className="textarea-content">
                            <label>Short description</label>
                            <textarea rows="5" cols="50" placeholder="Short content of the editor..." value={this.state.shortDescription} onChange={this.changeShortDescriptionHandler}>
                            </textarea>
                        </div>

                        <div className="textarea-content">
                            <label>Main content</label>
                            <textarea rows="20" cols="50" placeholder="Content of the editor..." value={this.state.mainContent} onChange={this.changeMainContentHandler}>
                            </textarea>
                        </div>

                        <div className='image-uploader'>
                            <h4>Images</h4>
                            <fieldset className="form-group">
                                <input
                                    type="file"
                                    id="pro-image"
                                    name="pro-image"
                                    style={{ display: 'none' }}
                                    className="form-control"
                                    multiple
                                    onInput={event => {
                                        this.readImage(event);
                                        this.handleImageUpload(event);
                                    }}
                                />
                            </fieldset>

                            <div className="preview-images-zone" onDrop={this.handleDrop.bind(this)} onDragOver={this.handleDragOver.bind(this)}>
                                {this.state.images.map((image, index) => (
                                    <div className={`preview-image preview-show-${index + 1}`} key={index}>
                                        <div className="image-cancel" data-no={index + 1} onClick={() => this.handleImageDelete(index)}>
                                          <Isvg src={Cancel}/>
                                        </div>
                                        <div className="image-zone">                                     
                                            <img id={`pro-img-${index + 1}`} src={image} alt="" />
                                            
                                        </div>
                                        
                                    </div>
                                ))}
                                <a href="javascript:void(0)" onClick={() => document.getElementById('pro-image').click()}>
                                    <div className='uploader-add-link'>
                                    <Isvg src={Plus} />
                                        <span className='span1'>Upload a File</span> 
                                        <span className='span2'> or drag and drop</span>
                                     </div>
                                </a>
                            </div>


                        </div>



                    </div>

                    <div className="right-form">

                        <div className="select-content">
                            <label>Written By</label>
                            <Select

                                options={this.state.writers}
                                value={this.state.createdBy}
                                onChange={this.handleWriterSelect}
                                styles={colourStyles} />
                        </div>

                        <div className="date-content">
                            <label>Post Date</label>
                            <input className="date-input" placeholder="5 May 2022" type='date' value={this.state.postDate} onChange={this.changePostDateHandler} />
                        </div>




                        <div className="categories-content">
                            <label>Categories</label>

                            <Select
                                options={this.state.categories}
                                placeholder="Select category"
                                value={this.state.selectedOptions}
                                onChange={this.handleSelect}
                                isSearchable={true}
                                isMulti
                                styles={colourStyles}
                            />
                        </div>

                        <div className="published-content">
                            <label>Published</label>
                            <label className="switch">

                                <input type="checkbox" value={this.state.isPublished} onChange={this.changeIsPublishedHandler} />
                                <span className="slider round"></span>
                            </label>

                        </div>


                    </div>
                </div>

                <div>

                </div>

            </form>


        )



    }

    async getListOfWriters() {
        const res = await axios.get('http://localhost:8000/api/writer');
        console.log('res', res);
        const writers = res.data.writers.map(d => ({
            "value": d._id,
            "label": d.name + ' ' + d.lastName
        }))
        this.setState({ writers: writers })
        console.log('selectWriters su:' + JSON.stringify(writers));
    }

  

    handleWriterChange(e) {
        this.setState({ createdBy: e.value, name: e.label })
    }





    async getListOfCategories() {
        const res = await axios.get('http://localhost:8000/api/category');
        const categories = res.data.categories.map(d => ({
            "value": d._id,
            "label": d.name
        }))
        this.setState({ categories: categories })
    }

    handleCategoryChange(e) {
        this.setState({ categories: e.value, name: e.label })
    }

    componentDidMount() {
       
        this.getListOfWriters();
        this.getListOfCategories();

    }

} export default UpdatePostComponent;
