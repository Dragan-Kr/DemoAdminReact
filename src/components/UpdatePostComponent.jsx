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
            _id: props._id,
            title: '',
            shortDescription: '',
            mainContent: '',
            isPublished: false,
            postDate: new Date(),
            createdBy: [],
            categories: [],
            selectedOptions: '',
            images: [],
            images2: [],
            firstCategories: [],
            writers: [],
            preselectedWriterId: '',
            preselectedWriters: [],
            writerName: '',
            preselectedCategories: []
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
        this.getWriter = this.getWriter.bind(this);
    }




    componentDidMount() {
        PostService.getPostById(this.state._id).then((res) => {
            console.log("Ovo je res.data iz componentDidMount", res.data);
            this.setState({
                title: res.data.post.title,
                shortDescription: res.data.post.shortDescription,
                mainContent: res.data.post.mainContent,
                isPublished: res.data.post.isPublished,
                postDate: res.data.post.postDate,
                createdBy: res.data.post.createdBy,
                categories: res.data.post.categories,
                preselectedCategories: res.data.post.categories,
                index: res.data.post.index,
                preselectedWriterId: res.data.post.createdBy
            });

        });
        this.getListOfPreselectedCategories();
        this.getListOfPreselectedWriter();
        this.getListOfWriters();
        this.getListOfCategories();
    }


    //  
    getListOfPreselectedWriter() {
        const res = axios.get('http://localhost:8000/api/writer' + '/' + this.state.preselectedWriterId);
        console.log("getListOfPreselectedWriter=>this.state.preselectedWriterId", this.state.preselectedWriterId)
        console.log("getListOfPreselectedWriter=>res.data", res.data);
    }

    getListOfPreselectedCategories() {
        console.log("Ovo su preselectedCategoriesssssssssssss", this.state.preselectedCategories)
        let preselectedCategoriesArray = [];
        // for (let index in this.state.preselectedCategories) {
        //     let res =  axios.get('http://localhost:8000/api/category' + '/' + this.state.preselectedCategories[index]);
        //     console.log("getListOfPreselectedCategories=>res", res);
        // }

    }

    // handleFirstCategoryChange(e) {
    //     this.setState({ firstCategories: e.value, name: e.label })
    // }

    updatePost(e) {
        e.preventDefault();
        const valueArray = this.state.selectedOptions.map(item => item.value);
        // console.log("Ovo je valueArray" + JSON.stringify(valueArray));

        const formData = new FormData();

        let imagesForm = [];
        for (let i = 0; i < this.state.images2.length; i++) {

            formData.append('images2[]', this.state.images2[i]);

            imagesForm.push(formData)
        }


        //    console.log( formData.get('files'));
        // console.log("Ovo je images2", this.state.images2)



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


        // console.log("Ovo je filesArray", filesArray);


        let imagesNames = [];

        for (let i = 0; i < this.state.images2.length; i++) {
            imagesNames.push(this.state.images2[i].name);
        }
        let post = {
            title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
            isPublished: this.state.isPublished, postDate: this.state.postDate, categories: valueArray, createdBy: this.state.createdBy, images: imagesNames
        };

        //  this.setState({preselectedWriterId:post.createdBy})


        fetch('http://localhost:8000/api/image', {
            method: 'POST',
            // headers:{
            //     'Content-Type':'multipart/form-data'
            // },
            body: formData


        })

        PostService.updatePost(post, this.state._id)

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
        // console.log('Ovo je iz IsPublished evenet' + event.target.value);
        this.setState({ isPublished: event.target.checked });
    }


    changePostDateHandler(event) {
        this.setState({ postDate: event.target.value });
    }



    handleSelect(event) {
        this.setState({ selectedOptions: event });
    }

    handleWriterSelect(event) {

        this.setState({ createdBy: event.value });
    }

    getWriter() {
        return this.state.writers.map((writer) => {
            return <option value={writer.value}>
                {writer.label}
            </option>;
        });
    }




    ///////////ImageUploader constants//////////////////
    readImage = (event) => {
        if (window.File && window.FileList && window.FileReader) {
            const files = event.target.files; //FileList object        
            if (files != null) {
                console.log("Ovo je files iz readImage", files)
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    console.log("readImage=>files[i]", file)
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
        console.log("handleImageUpload=>files", files)
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

    handleOneWriterChange(e) {
        this.setState({ preselectedWriter: e.value, name: e.label })
    }


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

        const dateObject = new Date(this.state.postDate);

        const defaultDate = dateObject.toISOString().slice(0, 10);

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
                        <input className="title-input" name='title' placeholder="Title" type='text' value={this.state.title} onChange={this.changeTitleHandler} />
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
                                </a>
                            </div>


                        </div>



                    </div>

                    <div className="right-form">

                        <div className="select-content">
                            <label>Written By</label>

                            <select className='writer-select' onChange={this.handleWriterSelect}>
                                <option value="choose">
                                    {/* {this.state.preselectedWriters.map((writer,index)=><div key={index}>
                                    </div>)} */}
                                    dfs
                                </option>
                                {this.getWriter()}
                            </select>


                            {/* <Select

                                options={this.state.writers}
                                value={this.state.writers.filter((option) => {
                                    return option.value === this.state.createdBy;
                                })}
                                onChange={this.handleWriterSelect}
                                styles={colourStyles} /> */}

                        </div>

                        <div className="date-content">
                            <label>Post Date</label>
                            <input className="date-input" type='date' value={defaultDate} onChange={this.changePostDateHandler} />
                        </div>


                        <div className="categories-content">
                            <label>Categories</label>

                            <Select
                                // defaultValue={this.state.firstCategories}
                                // isClearable={value.some((v) => !v.isFixed)}
                                options={this.state.categories}
                                placeholder="Select category"
                                // value={this.state.selectedOptions ? this.state.selectedOptions:this.state.preselectedCategories}
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

                                <input type="checkbox" value={this.state.isPublished} checked={this.state.isPublished} onChange={this.changeIsPublishedHandler} />
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
        console.log('writers su:' + JSON.stringify(writers));
    }


    handleWriterChange(e) {
        this.setState({ createdBy: e.value, name: e.label })
        console.log("Ovo je createdBy iz handleWriterChange", this.state.createdBy)
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

   

} export default UpdatePostComponent;
