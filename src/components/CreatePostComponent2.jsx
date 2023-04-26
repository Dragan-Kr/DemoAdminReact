import React, { Component } from 'react';
import axios from 'axios';
import Select from 'react-select';
import PostService from '../services/PostService';
import ImageService from '../services/ImageService';
import ImageUploader from './ImageUploader';
import ImageUploaderSecondPart from './ImageUploaderSecondPart';
import Isvg from 'react-inlinesvg';
import Save from "../images/save.svg";
import Eye from "../images/eye.svg";
import Plus from "../images/plus.svg";
import Cancel from '../images/cancel.svg';
import FormData from 'form-data';



class CreatePostComponent extends Component {
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
            images: [],
            images2: []
            // formData: new FormData() 
        };

        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeShortDescriptionHandler = this.changeShortDescriptionHandler.bind(this);
        this.changeMainContentHandler = this.changeMainContentHandler.bind(this);
        this.changeIsPublishedHandler = this.changeIsPublishedHandler.bind(this);
        this.changePostDateHandler = this.changePostDateHandler.bind(this);
        this.savePost = this.savePost.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleWriterSelect = this.handleWriterSelect.bind(this);
        this.handleImageUpload = this.handleImageUpload.bind(this);
        this.readImage = this.readImage.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
    }

    savePost(e) {
        e.preventDefault();


        if (this.state.title === '' && this.state.createdBy.length === 0 && this.state.selectedOptions.length == 0) {
            window.alert('Fill the Title, Written By and Categories filds');
            return;
        }

        else if (this.state.title === '') {
            window.alert('Fill the Title field');
            return;
        }

        else if (this.state.createdBy.length === 0) {
            window.alert('Fill the Written By field');
            return;
        }
        else if (this.state.selectedOptions.length === 0) {
            window.alert('Fill the Categories field');
            return;
        }

        const selectedCategories = this.state.selectedOptions.map(item => item.value);


        console.log("this.state.selectedOptions", this.state.selectedOptions)
        const url = 'http://localhost:8000/api/post';
        const formData = new FormData();

        if(this.state.images2.length>0) { 
        let imagesForm = [];
        for (let i = 0; i < this.state.images2.length; i++) {

            formData.append('images2[]', this.state.images2[i]);

            imagesForm.push(formData)
        }


        //    console.log(  formData.get('files'));
        console.log("Ovo je images2", this.state.images2)



        //Array of files converting to array of objects
        const filesArray = [];

        // Loop through the array of files
        for (let i = 0; i < this.state.images2.length; i++) {
            const file = this.state.images2[i];
            const reader = new FileReader();

            // Use the FileReader API to read the contents of the file
            reader.readAsDataURL(file);

            // When the file is loaded, create an object and push it to the array
            reader.onload = function () {
                filesArray.push({
                    name: file.name,
                    //   type: file.type,
                    //   size: file.size,
                    //   data: reader.result,
                });
            };
        }


        console.log("Ovo je filesArray", filesArray);




        let imagesNames = [];

        for (let i = 0; i < this.state.images2.length; i++) {
            imagesNames.push(this.state.images2[i].name);

        }

        console.log("imagesNames je", imagesNames)

        ///////////////// 


        console.log("iznda posta=>selectedCategories", selectedCategories)
        console.log("iznad posta=>this.state.createdBy", this.state.createdBy.value)
        let post = {
            title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
            isPublished: this.state.isPublished, postDate: this.state.postDate, categories: selectedCategories, createdBy: this.state.createdBy.value, images: imagesNames
        };
        console.log("Ovo su categories", this.state.categories)

        console.log("FORM DATA", formData)
        fetch('http://localhost:8000/api/image', {
            method: 'POST',
            // headers:{
            //     'Content-Type':'multipart/form-data'
            // },
            body: formData


        })

        PostService.createPost(post)
            .then(res => {
                // navigate('/news-list/');
                window.location.replace('http://localhost:3000/news-list');

            }).catch((error) => {
                // window.alert('Post failed');
                console.log(error.message);
            });
        }
        else{

            let post = {
                title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
                isPublished: this.state.isPublished, postDate: this.state.postDate, categories: selectedCategories, createdBy: this.state.createdBy.value
            };
            console.log("Ovo su categories", this.state.categories)
    
            console.log("FORM DATA", formData)
           
    
            PostService.createPost(post)
                .then(res => {
                    // navigate('/news-list/');
                    window.location.replace('http://localhost:3000/news-list');
    
                }).catch((error) => {
                    // window.alert('Post failed');
                    console.log(error.message);
                });

        }
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

    // cancel(){
    //     this.props.history.push('/post');
    // }


    handleSelect(event) {
        //  console.log('Ovo je event', event.target.value);
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

            console.log("Ovo su files iz readImage", files);
            if (files != null) {
                // console.log("Ovo je files iz readImage",files)
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    this.state.images2.push(file);
                    console.log("Ovo je images2", this.state.images2)
                    console.log("Ovo je jedan file iz readImage", file)
                    if (!file.type.match('image')) continue;

                    const picReader = new FileReader();

                    picReader.addEventListener('load', (event) => {
                        const picFile = event.target;
                        const newImage = picFile.result;
                        console.log("Ovo je newImage iz picReader.addEventListener", newImage);
                        this.setState(prevState => ({ images: [...prevState.images, newImage] }))
                    });

                    picReader.readAsDataURL(file);
                }
                document.querySelector("#pro-image").value = '';
            } else { return }
        } else {
            console.log('Browser not support');
        }
    }

    handleImageUpload = e => {
        const files = Array.from(e.target.files);
        const newImages = files.map(file => URL.createObjectURL(file));
        console.log("files iz handleImageUpload", files);
        this.setState(prevState => ({ images: [...prevState.images, ...newImages] }));
        console.log("Ovo je newImages iz handleImageLoad", newImages);
    };

    handleImageDelete = index => {
        const newImages = [...this.state.images];
        newImages.splice(index, 1);
        this.setState({ images: newImages });

        const images2 =[...this.state.images2];
        images2.splice(index,1);
        this.setState({images2:images2});
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
                        // backgroundColor: '##5561B3',
                        // color: '##5561B3',

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
                    //  textAlign: "center"
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
                    <h1>Add New Post</h1>
                    <div className='top-btns'>
                        <button className="preview-button"><Isvg src={Eye} />Preview</button>
                        <button className="save-button" onClick={this.savePost}><Isvg src={Save} />Save</button>
                    </div>

                </div>
                {/* <button className="save-button" onClick={this.savePost}><span>Save</span></button> */}
                <div className="add-news-content">

                    <div className="left-form">
                        <input className="title-input" placeholder="Title" type='text' value1={this.state.title} onChange={this.changeTitleHandler} required />
                        <h2>Content</h2>
                        <div className="textarea-content">
                            <label>Short description</label>
                            <textarea rows="5" cols="50" placeholder="Short content of the editor..." value2={this.state.shortDescription} onChange={this.changeShortDescriptionHandler}>
                            </textarea>
                        </div>

                        <div className="textarea-content">
                            <label>Main content</label>

                            <textarea rows="20" cols="50" placeholder="Content of the editor..." value3={this.state.mainContent} onChange={this.changeMainContentHandler}>
                            </textarea>
                        </div>

                        <div className='image-uploader'>
                            {/* <ImageUploader /> */}
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
                                            <Isvg src={Cancel} />
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
                                    {/* <Isvg src={Plus} /> */}
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
                            <input className="date-input" placeholder="5 May 2022" type='date' value6={this.state.postDate} onChange={this.changePostDateHandler} />
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
                            {/* <SwitchBooleanComponent /> */}
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
        //const outputArr = inputObj.writers.map(writer => writer);
        const writers = res.data.writers.map(d => ({
            "value": d._id,
            "label": d.name + ' ' + d.lastName
        }))
        this.setState({ writers: writers })
        console.log('selectWriters su:' + JSON.stringify(writers));
    }

    //   componentDidMount(){
    //     this.getListOfWriters();
    // }

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

} export default CreatePostComponent;
