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
import { fi } from 'date-fns/locale';
// import ImageComponent from './ImageComponent';


class UpdatePostComponent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            _id: props._id,
            title: "",
            shortDescription: "",
            mainContent: "",
            isPublished: false,
            postDate: new Date(),
            createdBy: "",
            categories: [],
            selectedOptions: "",
            images: [],
            images2: [],
            firstCategories: [],
            writers: [],
            preselectedWriterId: "",
            // preselectedWriters: [],
            writerName: "",
            preselectedCategories: [],
            preselectedCategoriesArray: [],
            preselectedWriter: [],
            selectedWriter: "",
            valueArray: [],
            imageFile: [],
            imageFileForBlob: [],
            tempImageArray: [],
            preselectedImages:[],

            ////
            imagesNames:[],
            imagesFiles:[]
        };

        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeTitleHandler = this.changeTitleHandler.bind(this);
        this.changeShortDescriptionHandler =
            this.changeShortDescriptionHandler.bind(this);
        this.changeMainContentHandler = this.changeMainContentHandler.bind(this);
        this.changeIsPublishedHandler = this.changeIsPublishedHandler.bind(this);
        this.changePostDateHandler = this.changePostDateHandler.bind(this);
        this.updatePost = this.updatePost.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleWriterSelect = this.handleWriterSelect.bind(this);
        // this.handleImageUpload = this.handleImageUpload.bind(this);
        // this.readImage = this.readImage.bind(this);
        this.handleDrop = this.handleDrop.bind(this);
        this.getWriter = this.getWriter.bind(this);
    }

    async componentDidMount() {

        if (this.state._id === 0) {

            this.getListOfWriters();
            this.getListOfCategories();
        }else {
            await PostService.getPostById(this.state._id)
                .then((res) => {
              
                        this.setState(
                            {
                                title: res.data.post.title,
                                shortDescription: res.data.post.shortDescription,
                                mainContent: res.data.post.mainContent,
                                isPublished: res.data.post.isPublished,
                                postDate: res.data.post.postDate,
                                createdBy: res.data.post.createdBy,
                                categories: res.data.post.categories,
                                preselectedCategories: res.data.post.categories,
                                index: res.data.post.index,
                                preselectedWriterId: res.data.post.createdBy,
                                imagesNames:res.data.post.images
                                // images:res.data.post.images //kada je odkomentarisano prikazuje slike iz baze ali kada ponovo azuriramo post ne sacuva nijednu sliku
                                // imageFile: res.data.file.data,
                                // imageFileForBlob:res.data.file2
                                // selectedOptions: res.data.categories
                            },
                            () => {
                                this.getListOfPreselectedCategories();
                                this.getPreselectedWriter();
                                this.getListOfWriters();
                                this.getListOfCategories();
                                // this.showPreselectedImage(this.state.imageFile);
                            }
                        );


                })
               
               
        }
    }
    



    // componentDidUpdate(prevProps, prevState) {
    //     if (this.state.imagesNames !== prevState.imagesNames) {
    //       this.setState({
    //         imagesNames: prevState.imagesNames
    //       });
    //     }
    //   }
      


    


    getPreselectedWriter() {
        let preselectedWriter = [];
        axios
            .get("http://localhost:8000/api/writer" + "/" + this.state.createdBy)
            .then((res) => {
                preselectedWriter.push(res.data.writer);


                const preselectedWriter2 = preselectedWriter.map((d) => ({
                    value: d._id,
                    label: d.name + " " + d.lastName,
                }));

                this.setState({ preselectedWriter: preselectedWriter2 });
            })
            .catch(function (error) {
                console.log("Error in fetching market updates");
            });
    }

    getListOfPreselectedCategories() {
        let preselectedCategoriesArray = [];
        for (let index in this.state.preselectedCategories) {
            if (
                typeof index === "undefined" ||
                index < 0 ||
                index >= this.state.preselectedCategories.length
            ) {
                console.log("Invalid index value:", index);
                return;
            }
            // console.log(" this.state.preselectedCategories[index]", this.state.preselectedCategories[index])
            axios
                .get(
                    "http://localhost:8000/api/category" +
                    "/" +
                    this.state.preselectedCategories[index]
                )
                .then((res) => {
                    console.log("getListOfPreselectedCategories=>res.data", res.data);
                    preselectedCategoriesArray.push(res.data.category);
                    console.log(
                        "then=>preselectedCategoriesArray",
                        preselectedCategoriesArray
                    );
                    const preselectedCategoriesArray2 = preselectedCategoriesArray.map(
                        (d) => ({
                            value: d._id,
                            label: d.name,
                        })
                    );
                    console.log(
                        "preselectedCategoriesArray2",
                        preselectedCategoriesArray2
                    );

                    this.setState({
                        preselectedCategoriesArray: preselectedCategoriesArray2,
                    });
                })
                .catch(function (error) {
                    console.log("Error in fetching market updates");
                });
        }
    }


    updatePost(e) {
        e.preventDefault();

        if (this.state._id === 0) {
            if (this.state.title === '' && this.state.selectedWriter === '' && this.state.selectedOptions.length == 0) {
                window.alert('Fill the Title, Written By and Categories filds');
                return;
            }

            else if (this.state.title === '') {
                window.alert('Fill the Title field');
                return;
            }

            else if (this.state.selectedWriter === '') {
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

            if (this.state.imagesFiles.length > 0) {
                let imagesForm = [];
                for (let i = 0; i < this.state.imagesFiles.length; i++) {

                    formData.append('images2', this.state.imagesFiles[i]);
                    imagesForm.push(formData)
                }


                //    console.log(  formData.get('files'));



                //Array of files converting to array of objects
                const filesArray = [];

                // Loop through the array of files
                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                    const file = this.state.imagesFiles[i];
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

                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                    imagesNames.push(this.state.imagesFiles[i].name);
                }

                console.log("imagesNames je", imagesNames)

                this.setState({imagesNames:imagesNames})


                ///////////////// 



                let post = {
                    title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
                    isPublished: this.state.isPublished, postDate: this.state.postDate, categories: selectedCategories, createdBy: this.state.selectedWriter.value, images: this.state.imagesNames
                };

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

            else {
                let post = {
                    title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
                    isPublished: this.state.isPublished, postDate: this.state.postDate, categories: selectedCategories, createdBy: this.state.selectedWriter.value
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

        } else {

            if (this.state.selectedOptions === "") {
                //categories nepromjenjen
                this.setState(
                    { selectedOptions: this.state.preselectedCategoriesArray },
                    () => {
                        ///ovde je problem

                        this.setState({ valueArray: this.state.selectedOptions }, () => {
                            console.log(
                                "OVO je this.state.selectedOptions",
                                this.state.selectedOptions
                            );
                            console.log("UpdatePost=>=>valueArray", this.state.valueArray); ///prazno
                            const formData = new FormData();

                            let imagesForm = [];
                            for (let i = 0; i < this.state.imagesFiles.length; i++) {
                                formData.append("images2", this.state.imagesFiles[i]);

                                imagesForm.push(formData);
                            }

                            //Array of files converting to array of objects
                            const filesArray = [];

                            // Loop through the array of files
                            for (let i = 0; i < this.state.imagesFiles.length; i++) {
                                let file = this.state.imagesFiles[i];
                                const reader = new FileReader();

                                // Use the FileReader API to read the contents of the file
                                console.log("Preselektovana slika koja treba da se procita", file)
                                reader.readAsDataURL(file);

                                // When the file is loaded, create an object and push it to the array
                                reader.onload = function () {
                                    filesArray.push({
                                        name: file.name,
                                        //   type: file.type,
                                        //   size: file.size,
                                        //   data: reader.r
                                    });
                                };
                            }

                            // console.log("Ovo je filesArray", filesArray);

                            let imagesNames = [];

                            let imagesNames2=[];
                            for (let i = 0; i < this.state.imagesFiles.length; i++) {
                                imagesNames.push(this.state.imagesFiles[i].name);
                            }

                            imagesNames2 = [...this.state.imagesNames,...imagesNames2]
                            this.setState({imagesNames:imagesNames2})

                            console.log(
                                "iznad let post=>this.state.selectedWriter",
                                this.state.selectedWriter
                            );
                            ////dovde
                            if (this.state.selectedWriter === "") {
                                ///writer ne promjenjen
                                console.log("USOOO");

                                let valueArray2 = [];
                                valueArray2 = this.state.valueArray.map((item) => item.value);
                                console.log("Ispod varijable=>valueArray", this.state.valueArray); ///prazno

                                this.setState(
                                    { selectedWriter: this.state.preselectedWriter },
                                    () => {
                                        console.log(
                                            "iznad let post=>this.state.selectedWriter",
                                            this.state.selectedWriter
                                        );

                                        let selectedWriterValue = this.state.selectedWriter.map(
                                            (item) => item.value
                                        );
                                        console.log("selectedWriterValue", selectedWriterValue);

                                        console.log("valueArray2", valueArray2);

                                        let post = {
                                            ////////////////////////////////////////
                                            title: this.state.title,
                                            shortDescription: this.state.shortDescription,
                                            mainContent: this.state.mainContent,
                                            isPublished: this.state.isPublished,
                                            postDate: this.state.postDate,
                                            categories: valueArray2,
                                            createdBy: selectedWriterValue[0],
                                            images: this.state.imagesNames, //valueArray2 i selectedWriterValue[0] su dobre
                                        };

                                        //  this.setState({preselectedWriterId:post.createdBy})
                                        console.log(
                                            "spod let post=>this.state.selectedWriter",
                                            this.state.selectedWriter
                                        );

                                        fetch("http://localhost:8000/api/image", {
                                            method: "POST",
                                            // headers:{
                                            //     'Content-Type':'multipart/form-data'
                                            // },
                                            body: formData,
                                        });

                                        

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
                                        PostService.updatePost(post, this.state._id)
                                            .then((res) => {
                                                // window.location.replace('http://localhost:3000/news-list');
                                            })
                                            .catch((error) => {
                                                console.log(error.message);
                                            });
                                        console.log(
                                            "valueArray izvan setState",
                                            this.state.valueArray
                                        );
                                    }
                                );
                            } else {
                                ////////////////////////////
                                e.preventDefault();

                                // let valueArray = this.state.selectedOptions.map(item => item.value);
                                // console.log("Ovo je valueArray" + JSON.stringify(valueArray));
                                // console.log("ELSE->VALUEARRAY",valueArray)

                                console.log(
                                    "USAO U ELSE->WRITER PROMJENJEN A CATEGORIJE OSTALE ISTE"
                                );
                                const formData = new FormData();

                                let imagesForm = [];
                                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                                    formData.append("images2", this.state.imagesFiles[i]);

                                    imagesForm.push(formData);
                                }

                                //Array of files converting to array of objects
                                const filesArray = [];

                                // Loop through the array of files
                                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                                    const file = this.state.imagesFiles[i];
                                    const reader = new FileReader();

                                    // Use the FileReader API to read the contents of the file
                                    reader.readAsDataURL(file);

                                    // When the file is loaded, create an object and push it to the array
                                    reader.onload = function () {
                                        filesArray.push({
                                            name: file.name,
                                        });
                                    };
                                }

                                // console.log("Ovo je filesArray", filesArray);

                                let imagesNames = [];
                                let imagesNames2=[];

                                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                                    imagesNames.push(this.state.imagesFiles[i].name);
                                    console.log("this.state.images2[i].name",this.state.imagesFiles[i].name)
                                }
                                imagesNames2 = [...this.state.imagesNames,...imagesNames2]
                                this.setState({imagesNames:imagesNames2})


                                console.log(
                                    "ELSE->Iznad let post->this.state.selectedOptions",
                                    this.state.selectedOptions
                                );

                                let selectedOptionsValue = this.state.selectedOptions.map(
                                    (item) => item.value
                                );
                                let post = {
                                    title: this.state.title,
                                    shortDescription: this.state.shortDescription,
                                    mainContent: this.state.mainContent,
                                    isPublished: this.state.isPublished,
                                    postDate: this.state.postDate,
                                    categories: selectedOptionsValue,
                                    createdBy: this.state.selectedWriter.value,
                                    images: this.state.imagesNames,
                                };

                                console.log("POST iz elsa", post);

                                //  this.setState({preselectedWriterId:post.createdBy})

                                fetch("http://localhost:8000/api/image", {
                                    method: "POST",
                                    // headers:{
                                    //     'Content-Type':'multipart/form-data'
                                    // },
                                    body: formData,
                                });
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

                                PostService.updatePost(post, this.state._id)

                                    .then((res) => {
                                        // window.location.replace('http://localhost:3000/news-list');
                                    })
                                    .catch((error) => {
                                        console.log(error.message);
                                    });
                            }
                        });
                    }
                );
            } else {
                console.log("USOO U ELSE");

                const formData = new FormData();

                let imagesForm = [];
                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                    formData.append("images2", this.state.imagesFiles[i]);

                    imagesForm.push(formData);
                }

                //Array of files converting to array of objects
                const filesArray = [];

                // Loop through the array of files
                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                    const file = this.state.imagesFiles[i];
                    const reader = new FileReader();

                    // Use the FileReader API to read the contents of the file
                    reader.readAsDataURL(file);

                    // When the file is loaded, create an object and push it to the array
                    reader.onload = function () {
                        filesArray.push({
                            name: file.name,
                            //   type: file.type,
                            //   size: file.size,
                            //   data: reader.r
                        });
                    };
                }

                // console.log("Ovo je filesArray", filesArray);

                let imagesNames = [];
                let imagesNames2=[];

                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                    imagesNames.push(this.state.imagesFiles[i].name);
                }

                imagesNames2 = [...this.state.imagesNames,...imagesNames2]
                this.setState({imagesNames:imagesNames2})

                console.log(
                    "iznad let post=>this.state.selectedWriter",
                    this.state.selectedWriter
                );
                ///

                let valueArrayOfSelectedCategories = [];
                valueArrayOfSelectedCategories = this.state.selectedOptions.map(
                    (item) => item.value
                );

                if (this.state.selectedWriter !== "") {
                    console.log("Izabrane vrijednosti i pisca i kategorije");
                    let post = {
                        ////////////////////////////////////////
                        title: this.state.title,
                        shortDescription: this.state.shortDescription,
                        mainContent: this.state.mainContent,
                        isPublished: this.state.isPublished,
                        postDate: this.state.postDate,
                        categories: valueArrayOfSelectedCategories,
                        createdBy: this.state.selectedWriter.value,
                        images: this.state.imagesNames, //valueArray2 i selectedWriterValue[0] su dobre
                    };
                    console.log("ELSE->POST", post);

                    fetch("http://localhost:8000/api/image", {
                        method: "POST",
                        // headers:{
                        //     'Content-Type':'multipart/form-data'
                        // },
                        body: formData,
                    });
                    if (this.state.title === '' && this.state.selectedWriter === '' && this.state.selectedOptions.length == 0) {
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

                    PostService.updatePost(post, this.state._id)

                        .then((res) => {
                            // window.location.replace('http://localhost:3000/news-list');
                        })
                        .catch((error) => {
                            console.log(error.message);
                        });
                } else {
                    //pisac osto nepromjenjen

                    console.log("PISAC OSTAO NEPROMJENJEN");
                    console.log("Izabrane vrijednosti i pisca i kategorije");

                    let valueArrayOfSelectedCategories = [];
                    valueArrayOfSelectedCategories = this.state.selectedOptions.map(
                        (item) => item.value
                    );
                    let post = {
                        ////////////////////////////////////////
                        title: this.state.title,
                        shortDescription: this.state.shortDescription,
                        mainContent: this.state.mainContent,
                        isPublished: this.state.isPublished,
                        postDate: this.state.postDate,
                        categories: valueArrayOfSelectedCategories,
                        createdBy: this.state.selectedWriter.value,
                        images: this.state.imagesNames, //valueArray2 i selectedWriterValue[0] su dobre
                    };
                    console.log("ELSE->POST", post);

                    fetch("http://localhost:8000/api/image", {
                        method: "POST",
                        // headers:{
                        //     'Content-Type':'multipart/form-data'
                        // },
                        body: formData,
                    });
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

                    PostService.updatePost(post, this.state._id)
                        .then((res) => {
                            // window.location.replace('http://localhost:3000/news-list');
                        })
                        .catch((error) => {
                            console.log(error.message);
                        });
                }

            }
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
        console.log("EVENT", event);
        // this.setState({ createdBy: event.value });
        this.setState({ selectedWriter: event }, () => {
            console.log(
                "handleWriterSelect=>selectedWriter",
                this.state.selectedWriter
            ); //value=....,label=....
        });
    }

    getWriter() {
        return this.state.writers.map((writer) => {
            return <option value={writer.value}>{writer.label}</option>;
        });
    }

    ///////////ImageUploader constants//////////////////
    // readImage = (event) => {
    //     console.log();
    //     if (window.File && window.FileList && window.FileReader) {
    //         const files = event.target.files; //FileList object
    //         if (files != null) {
    //             console.log("Ovo je files iz readImage", files);
    //             for (let i = 0; i < files.length; i++) {
    //                 const file = files[i];
    //                 this.state.images2.push(file);
    //                 console.log("IMAGES2", this.state.images2)

    //                 if (!file.type.match("image")) continue;

    //                 const picReader = new FileReader();

    //                 picReader.addEventListener("load", (event) => {
    //                     //bez ovoga nece da prikaze selektovanu sliku
    //                     const picFile = event.target;
    //                     const newImage = picFile.result;
    //                     console.log(
    //                         "Ovo je newImage iz picReader.addEventListener",
    //                         newImage
    //                     );
    //                     this.setState(
    //                         (prevState) => ({ images: [...prevState.images, newImage] }),
    //                         () => {
    //                             console.log("Ovo su images nakon setovanja", this.state.images);
    //                         }
    //                     );
    //                 });

    //                 console.log("Ovo je file iznad icReader.readAsDataURL(file)", file);
    //                 picReader.readAsDataURL(file); //bez ovoga nece da prikaze selektovanu sliku
    //             }
    //             document.querySelector("#pro-image").value = "";
    //         } else {
    //             return;
    //         }
    //     } else {
    //         console.log("Browser does not support");
    //     }
    // };

    // handleImageUpload = (e) => {
    //     const files = Array.from(e.target.files);
    //     console.log("handleImageUpload=>files", files);
    //     const newImages = files.map((file) => URL.createObjectURL(file));
    //     this.setState((prevState) => ({
    //         images: [...prevState.images, ...newImages],
    //     }),()=>{console.log("newImages after setState",newImages)});
    //     console.log("handleImageLoad=>newImages", newImages);
    // };



    // handleImageDelete = (index) => {
    //     const newImages = [...this.state.images];
    //     newImages.splice(index, 1);
    //     this.setState({ images: newImages });

    //     const preselectedImagesArray = [...this.state.tempImageArray];
    //     preselectedImagesArray.splice(index, 1);
    //     this.setState({ tempImageArray: preselectedImagesArray })

    //     const images2 = [...this.state.images2];
    //     images2.splice(index, 1);
    //     this.setState({ images2: images2 });
    // };

    // handlePreselectedImageDelete = (index) => {
    //     const newImages = [...this.state.tempImageArray];
    //     newImages.splice(index, 1);
    //     this.setState({ tempImageArray: newImages });
    //   };

    handleDrop = (event) => {
        event.preventDefault();
        const files = Array.from(event.dataTransfer.files);
        const newImages = files.map((file) => URL.createObjectURL(file));
        this.setState((prevState) => ({
            images: [...prevState.images, ...newImages],
        }));
    };

    handleDragOver = (event) => {
        event.preventDefault();
    };

    handleOneWriterChange(e) {
        this.setState({ preselectedWriter: e.value, name: e.label });
    }

    /////////////////////////////////////////////////


    handleImages=(event)=>{
        let files = event.target.files;
        this.setState({imagesFiles:files});
        let newImagesNames = Array.from(files).map((file) => '/uploads/' + file.name);
        let mergedFileNamesArray = [...this.state.imagesNames,...newImagesNames]
        this.setState({imagesNames:mergedFileNamesArray});
    }



handleImageDelete = (index) => {//treba podesiti kada se obrise slika da se ujedno obrise iz imagesFiles
  let imagesNames = [...this.state.imagesNames];
  imagesNames.splice(index, 1);
  this.setState({imagesNames:imagesNames});
}






    render() {
        const dropdownIndicatorStyles = (base, state) => {
            let changes = {
                // all your override styles
                backgroundColor: "green",
            };
            return Object.assign(base, changes);
        };

        const colourStyles = {
            control: (styles) => ({
                ...styles,
                backgroundColor: " #F4F5FC",
                borderRadius: 10,
                height: 50,
                border: 0,
                color: "white",
                dropdownIndicator: { dropdownIndicatorStyles },
            }),
            option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                return {
                    ...styles,

                    height: 50,
                    dropdownIndicator: { dropdownIndicatorStyles },
                };
            },
            multiValue: (styles, { data }) => {
                return {
                    ...styles,
                    backgroundColor: "#5561B3",
                    borderRadius: 10,
                    height: 40,
                };
            },
            multiValueLabel: (styles, { data }) => {
                return {
                    ...styles,
                    color: "#FFFFFF",
                    fontSize: 16,
                    fontWeight: 500,
                    fontFamily: "'Poppins', sans-serif",
                    aliginSelf: "center",
                };
            },
        };

        const dateObject = new Date(this.state.postDate);

        const defaultDate = dateObject.toISOString().slice(0, 10);

        return (
            <form>
                <div className="heading-post">
                    <h1>Update Post</h1>
                    <div className="top-btns">
                        <button className="save-button" onClick={this.updatePost}>
                            <Isvg src={Save} />
                            Save
                        </button>
                    </div>
                </div>
                <div className="add-news-content">
                    <div className="left-form">
                        <input
                            className="title-input"
                            name="title"
                            placeholder="Title"
                            type="text"
                            value={this.state.title}
                            onChange={this.changeTitleHandler}
                        />
                        <h2>Content</h2>
                        <div className="textarea-content">
                            <label>Short description</label>
                            <textarea
                                rows="5"
                                cols="50"
                                placeholder="Short content of the editor..."
                                value={this.state.shortDescription}
                                onChange={this.changeShortDescriptionHandler}
                            ></textarea>
                        </div>

                        <div className="textarea-content">
                            <label>Main content</label>
                            <textarea
                                rows="20"
                                cols="50"
                                placeholder="Content of the editor..."
                                value={this.state.mainContent}
                                onChange={this.changeMainContentHandler}
                            ></textarea>
                        </div>

                        <div className="image-uploader">
                            <h4>Images</h4>
                            <fieldset className="form-group">
                                <input
                                    type="file"
                                    id="pro-image"
                                    name="pro-image"
                                    style={{ display: "none" }}
                                    className="form-control"
                                    multiple
                                    onInput={(event) => {
                                        // this.readImage(event);
                                        // this.handleImageUpload(event);
                                        this.handleImages(event)
                                    }}
                                />
                            </fieldset>

                            <div
                                className="preview-images-zone"
                                onDrop={this.handleDrop.bind(this)}
                                onDragOver={this.handleDragOver.bind(this)}
                            >
                                {
                                    this.state.imagesNames.map((image, index) => (
                                        <div
                                            className={`preview-image preview-show-${index + 1}`}
                                            key={index}
                                        >
                                            <div
                                                className="image-cancel"
                                                data-no={index + 1}
                                                onClick={() => this.handleImageDelete(index)}
                                            >
                                                <Isvg src={Cancel} />
                                            </div>
                                           
                                            <div className="image-zone">
                                                <img id={`pro-img-${index + 1}`} src={`http://localhost:8000${image}`} alt="" />
                                            </div>
                                        </div>
                                    ))
                                }
                                <a
                                    href="javascript:void(0)"
                                    onClick={() => document.getElementById("pro-image").click()}
                                >
                                    <div className="uploader-add-link">
                                        <Isvg src={Plus} />
                                        <span className="span1">Upload a File</span>
                                        <span className="span2"> or drag and drop</span>
                                    </div>
                                </a>
                            </div>
                            {/* <ImageComponent imageFileForBlob={this.state.imageFileForBlob} /> */}
                        </div>
                    </div>

                    <div className="right-form">
                        <div className="select-content">
                            <label>Written By</label>
                            <Select
                                options={this.state.writers}
                                value={
                                    this.state.selectedWriter
                                        ? this.state.selectedWriter
                                        : this.state.preselectedWriter
                                }
                                onChange={this.handleWriterSelect}
                                styles={colourStyles}
                            />
                        </div>

                        <div className="date-content">
                            <label>Post Date</label>
                            <input
                                className="date-input"
                                type="date"
                                value={defaultDate}
                                onChange={this.changePostDateHandler}
                            />
                        </div>

                        <div className="categories-content">
                            <label>Categories</label>
                            <Select
                                options={this.state.categories}
                                placeholder="Select category"
                                value={
                                    this.state.selectedOptions
                                        ? this.state.selectedOptions
                                        : this.state.preselectedCategoriesArray
                                }
                                // value={this.state.preselectedCategoriesArray}

                                onChange={this.handleSelect}
                                isSearchable={true}
                                isMulti
                                styles={colourStyles}
                            />
                        </div>

                        <div className="published-content">
                            <label>Published</label>
                            <label className="switch">
                                <input
                                    type="checkbox"
                                    value={this.state.isPublished}
                                    checked={this.state.isPublished}
                                    onChange={this.changeIsPublishedHandler}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                    </div>
                </div>

                <div></div>
            </form>
        );
    }

    async getListOfWriters() {
        const res = await axios.get("http://localhost:8000/api/writer");
        console.log("res", res);
        const writers = res.data.writers.map((d) => ({
            value: d._id,
            label: d.name + " " + d.lastName,
        }));
        this.setState({ writers: writers });
        console.log("writers su:" + JSON.stringify(writers));
    }

    handleWriterChange(e) {
        this.setState({ createdBy: e.value, name: e.label });
        console.log("Ovo je createdBy iz handleWriterChange", this.state.createdBy);
    }

    async getListOfCategories() {
        const res = await axios.get("http://localhost:8000/api/category");
        const categories = res.data.categories.map((d) => ({
            value: d._id,
            label: d.name,
        }));
        this.setState({ categories: categories });
    }

    handleCategoryChange(e) {
        this.setState({ categories: e.value, name: e.label });
    }
}
export default UpdatePostComponent;






































// class UpdatePostComponent extends Component {
//     constructor(props) {
//         super(props);

//         this.state = {
//             _id: props._id,
//             title: "",
//             shortDescription: "",
//             mainContent: "",
//             isPublished: false,
//             postDate: new Date(),
//             createdBy: "",
//             categories: [],
//             selectedOptions: "",
//             images: [],
//             images2: [],
//             firstCategories: [],
//             writers: [],
//             preselectedWriterId: "",
//             // preselectedWriters: [],
//             writerName: "",
//             preselectedCategories: [],
//             preselectedCategoriesArray: [],
//             preselectedWriter: [],
//             selectedWriter: "",
//             valueArray: [],
//             imageFile: [],
//             imageFileForBlob: [],
//             tempImageArray: [],
//         };

//         this.changeTitleHandler = this.changeTitleHandler.bind(this);
//         this.changeTitleHandler = this.changeTitleHandler.bind(this);
//         this.changeShortDescriptionHandler =
//             this.changeShortDescriptionHandler.bind(this);
//         this.changeMainContentHandler = this.changeMainContentHandler.bind(this);
//         this.changeIsPublishedHandler = this.changeIsPublishedHandler.bind(this);
//         this.changePostDateHandler = this.changePostDateHandler.bind(this);
//         this.updatePost = this.updatePost.bind(this);
//         this.handleSelect = this.handleSelect.bind(this);
//         this.handleWriterSelect = this.handleWriterSelect.bind(this);
//         this.handleImageUpload = this.handleImageUpload.bind(this);
//         this.readImage = this.readImage.bind(this);
//         this.handleDrop = this.handleDrop.bind(this);
//         this.getWriter = this.getWriter.bind(this);
//     }

//     async componentDidMount() {

//         if (this.state._id === 0) {

//             this.getListOfWriters();
//             this.getListOfCategories();


//         } else {
//             await PostService.getPostById(this.state._id)
//                 .then((res) => {
//                     console.log("Array.isArray(res.data", Array.isArray(res.data));


//                     if (Array.isArray(res.data)) {

//                         console.log("RES->provjera niza", res);

//                         let tempFileDataArr = [];
//                         let tempFile2DataArr = [];

//                         for (let index in res.data) {
//                             tempFileDataArr.push(res.data[index].file.data);//file sadrzi samo data
//                             tempFile2DataArr.push(res.data[index].file2) //file2 sadrzi i name i data
//                         }
//                         console.log("tempFileDataArr", tempFileDataArr)//Sadrzi data od slike
//                         console.log("tempFile2DataArr", tempFile2DataArr)//Sadrzi name i data od slike


//                         ////
//                         this.setState(
//                             {
//                                 title: res.data[0].post.title,//Stoji data[0] zato sto je isti post kod svih elemenata kod data niza 
//                                 shortDescription: res.data[0].post.shortDescription,
//                                 mainContent: res.data[0].post.mainContent,
//                                 isPublished: res.data[0].post.isPublished,
//                                 postDate: res.data[0].post.postDate,
//                                 createdBy: res.data[0].post.createdBy,
//                                 categories: res.data[0].post.categories,
//                                 preselectedCategories: res.data[0].post.categories,
//                                 index: res.data[0].post.index,
//                                 preselectedWriterId: res.data[0].post.createdBy,
//                                 imageFile: tempFileDataArr,///data:image/jpeg;base64,/......
//                                 imageFileForBlob: tempFile2DataArr
//                                 // selectedOptions: res.data.categories ovo treba da bude selektovano
//                             },
//                             () => {
//                                 console.log("TITLE", this.state.title)
//                                 this.getListOfPreselectedCategories();
//                                 this.getPreselectedWriter();
//                                 this.getListOfWriters();
//                                 this.getListOfCategories();
//                                 this.showPreselectedImage(this.state.imageFile);
//                             }
//                         );



//                     } else {
//                         this.setState(
//                             {
//                                 title: res.data.post.title,
//                                 shortDescription: res.data.post.shortDescription,
//                                 mainContent: res.data.post.mainContent,
//                                 isPublished: res.data.post.isPublished,
//                                 postDate: res.data.post.postDate,
//                                 createdBy: res.data.post.createdBy,
//                                 categories: res.data.post.categories,
//                                 preselectedCategories: res.data.post.categories,
//                                 index: res.data.post.index,
//                                 preselectedWriterId: res.data.post.createdBy,
//                                 // imageFile: res.data.file.data,
//                                 // imageFileForBlob:res.data.file2
//                                 // selectedOptions: res.data.categories
//                             },
//                             () => {
//                                 this.getListOfPreselectedCategories();
//                                 this.getPreselectedWriter();
//                                 this.getListOfWriters();
//                                 this.getListOfCategories();
//                                 // this.showPreselectedImage(this.state.imageFile);
//                             }
//                         );


//                     }
//                 })
//                 .catch(function (error) {
//                     console.log("Error in data");
//                 });
//         }
//     }




//     showPreselectedImage(imageFile) {

//         let dataurls = this.state.imageFile;
//         let filenames = this.state.imageFileForBlob.map(file => file.name);

//         let tempImageArray = [];
//         let tempBlobArray = [];//U njega pusujemo fajlove u njega

//         dataurls.forEach((dataurl, index) => {
//             let arr = dataurl.split(','),
//                 mime = arr[0].match(/:(.*?);/)[1],
//                 bstr = window.atob(arr[1]),
//                 n = bstr.length,
//                 u8arr = new Uint8Array(n);

//             while (n--) {
//                 u8arr[n] = bstr.charCodeAt(n);
//             }

//             let file = new File([u8arr], filenames[index], { type: mime });

//             tempImageArray.push(dataurl);
//             tempBlobArray.push({ file });
//         });

//         let testArr = tempBlobArray.map(blob => blob.file);

//         this.setState({ tempImageArray });
//         this.setState({ images: tempImageArray }, () => {
//             console.log("Ovo su images iz showPreselectedImage", this.state.images)
//         });
//         this.setState({ images2: testArr });

//     }



//     getPreselectedWriter() {
//         let preselectedWriter = [];
//         axios
//             .get("http://localhost:8000/api/writer" + "/" + this.state.createdBy)
//             .then((res) => {
//                 preselectedWriter.push(res.data.writer);


//                 const preselectedWriter2 = preselectedWriter.map((d) => ({
//                     value: d._id,
//                     label: d.name + " " + d.lastName,
//                 }));

//                 this.setState({ preselectedWriter: preselectedWriter2 });
//             })
//             .catch(function (error) {
//                 console.log("Error in fetching market updates");
//             });
//     }

//     getListOfPreselectedCategories() {
//         let preselectedCategoriesArray = [];
//         for (let index in this.state.preselectedCategories) {
//             if (
//                 typeof index === "undefined" ||
//                 index < 0 ||
//                 index >= this.state.preselectedCategories.length
//             ) {
//                 console.log("Invalid index value:", index);
//                 return;
//             }
//             // console.log(" this.state.preselectedCategories[index]", this.state.preselectedCategories[index])
//             axios
//                 .get(
//                     "http://localhost:8000/api/category" +
//                     "/" +
//                     this.state.preselectedCategories[index]
//                 )
//                 .then((res) => {
//                     console.log("getListOfPreselectedCategories=>res.data", res.data);
//                     preselectedCategoriesArray.push(res.data.category);
//                     console.log(
//                         "then=>preselectedCategoriesArray",
//                         preselectedCategoriesArray
//                     );
//                     const preselectedCategoriesArray2 = preselectedCategoriesArray.map(
//                         (d) => ({
//                             value: d._id,
//                             label: d.name,
//                         })
//                     );
//                     console.log(
//                         "preselectedCategoriesArray2",
//                         preselectedCategoriesArray2
//                     );

//                     this.setState({
//                         preselectedCategoriesArray: preselectedCategoriesArray2,
//                     });
//                 })
//                 .catch(function (error) {
//                     console.log("Error in fetching market updates");
//                 });
//         }
//     }


//     updatePost(e) {
//         e.preventDefault();

//         if (this.state._id === 0) {
//             if (this.state.title === '' && this.state.selectedWriter === '' && this.state.selectedOptions.length == 0) {
//                 window.alert('Fill the Title, Written By and Categories filds');
//                 return;
//             }

//             else if (this.state.title === '') {
//                 window.alert('Fill the Title field');
//                 return;
//             }

//             else if (this.state.selectedWriter === '') {
//                 window.alert('Fill the Written By field');
//                 return;
//             }
//             else if (this.state.selectedOptions.length === 0) {
//                 window.alert('Fill the Categories field');
//                 return;
//             }

//             const selectedCategories = this.state.selectedOptions.map(item => item.value);


//             console.log("this.state.selectedOptions", this.state.selectedOptions)
//             const url = 'http://localhost:8000/api/post';
//             const formData = new FormData();

//             if (this.state.images2.length > 0) {
//                 let imagesForm = [];
//                 for (let i = 0; i < this.state.images2.length; i++) {

//                     formData.append('images2', this.state.images2[i]);
//                     imagesForm.push(formData)
//                 }


//                 //    console.log(  formData.get('files'));
//                 console.log("Ovo je images2", this.state.images2)



//                 //Array of files converting to array of objects
//                 const filesArray = [];

//                 // Loop through the array of files
//                 for (let i = 0; i < this.state.images2.length; i++) {
//                     const file = this.state.images2[i];
//                     const reader = new FileReader();

//                     // Use the FileReader API to read the contents of the file
//                     reader.readAsDataURL(file);

//                     // When the file is loaded, create an object and push it to the array
//                     reader.onload = function () {
//                         filesArray.push({
//                             name: file.name,
//                             //   type: file.type,
//                             //   size: file.size,
//                             //   data: reader.result,
//                         });
//                     };
//                 }


//                 console.log("Ovo je filesArray", filesArray);




//                 let imagesNames = [];

//                 for (let i = 0; i < this.state.images2.length; i++) {
//                     imagesNames.push(this.state.images2[i].name);

//                 }

//                 console.log("imagesNames je", imagesNames)

//                 ///////////////// 



//                 let post = {
//                     title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
//                     isPublished: this.state.isPublished, postDate: this.state.postDate, categories: selectedCategories, createdBy: this.state.selectedWriter.value, images: imagesNames
//                 };

//                 console.log("FORM DATA", formData)
//                 fetch('http://localhost:8000/api/image', {
//                     method: 'POST',
//                     // headers:{
//                     //     'Content-Type':'multipart/form-data'
//                     // },
//                     body: formData


//                 })

//                 PostService.createPost(post)
//                     .then(res => {
//                         // navigate('/news-list/');
//                         window.location.replace('http://localhost:3000/news-list');

//                     }).catch((error) => {
//                         // window.alert('Post failed');
//                         console.log(error.message);
//                     });
//             }
//             else {

//                 let post = {
//                     title: this.state.title, shortDescription: this.state.shortDescription, mainContent: this.state.mainContent,
//                     isPublished: this.state.isPublished, postDate: this.state.postDate, categories: selectedCategories, createdBy: this.state.selectedWriter.value
//                 };
//                 console.log("Ovo su categories", this.state.categories)

//                 console.log("FORM DATA", formData)


//                 PostService.createPost(post)
//                     .then(res => {
//                         // navigate('/news-list/');
//                         window.location.replace('http://localhost:3000/news-list');

//                     }).catch((error) => {
//                         // window.alert('Post failed');
//                         console.log(error.message);
//                     });

//             }





//         } else {

//             if (this.state.selectedOptions === "") {
//                 //categories nepromjenjen
//                 this.setState(
//                     { selectedOptions: this.state.preselectedCategoriesArray },
//                     () => {
//                         ///ovde je problem

//                         this.setState({ valueArray: this.state.selectedOptions }, () => {
//                             console.log(
//                                 "OVO je this.state.selectedOptions",
//                                 this.state.selectedOptions
//                             );
//                             console.log("UpdatePost=>=>valueArray", this.state.valueArray); ///prazno
//                             const formData = new FormData();

//                             let imagesForm = [];
//                             for (let i = 0; i < this.state.images2.length; i++) {
//                                 formData.append("images2", this.state.images2[i]);

//                                 imagesForm.push(formData);
//                             }

//                             //Array of files converting to array of objects
//                             const filesArray = [];

//                             // Loop through the array of files
//                             for (let i = 0; i < this.state.images2.length; i++) {
//                                 let file = this.state.images2[i];
//                                 const reader = new FileReader();

//                                 // Use the FileReader API to read the contents of the file
//                                 console.log("Preselektovana slika koja treba da se procita", file)
//                                 reader.readAsDataURL(file);

//                                 // When the file is loaded, create an object and push it to the array
//                                 reader.onload = function () {
//                                     filesArray.push({
//                                         name: file.name,
//                                         //   type: file.type,
//                                         //   size: file.size,
//                                         //   data: reader.r
//                                     });
//                                 };
//                             }

//                             // console.log("Ovo je filesArray", filesArray);

//                             let imagesNames = [];

//                             for (let i = 0; i < this.state.images2.length; i++) {
//                                 imagesNames.push(this.state.images2[i].name);
//                             }

//                             console.log(
//                                 "iznad let post=>this.state.selectedWriter",
//                                 this.state.selectedWriter
//                             );
//                             ////dovde
//                             if (this.state.selectedWriter === "") {
//                                 ///writer ne promjenjen
//                                 console.log("USOOO");

//                                 let valueArray2 = [];
//                                 valueArray2 = this.state.valueArray.map((item) => item.value);
//                                 console.log("Ispod varijable=>valueArray", this.state.valueArray); ///prazno

//                                 this.setState(
//                                     { selectedWriter: this.state.preselectedWriter },
//                                     () => {
//                                         console.log(
//                                             "iznad let post=>this.state.selectedWriter",
//                                             this.state.selectedWriter
//                                         );

//                                         let selectedWriterValue = this.state.selectedWriter.map(
//                                             (item) => item.value
//                                         );
//                                         console.log("selectedWriterValue", selectedWriterValue);

//                                         console.log("valueArray2", valueArray2);

//                                         let post = {
//                                             ////////////////////////////////////////
//                                             title: this.state.title,
//                                             shortDescription: this.state.shortDescription,
//                                             mainContent: this.state.mainContent,
//                                             isPublished: this.state.isPublished,
//                                             postDate: this.state.postDate,
//                                             categories: valueArray2,
//                                             createdBy: selectedWriterValue[0],
//                                             images: imagesNames, //valueArray2 i selectedWriterValue[0] su dobre
//                                         };

//                                         //  this.setState({preselectedWriterId:post.createdBy})
//                                         console.log(
//                                             "spod let post=>this.state.selectedWriter",
//                                             this.state.selectedWriter
//                                         );

//                                         fetch("http://localhost:8000/api/image", {
//                                             method: "POST",
//                                             // headers:{
//                                             //     'Content-Type':'multipart/form-data'
//                                             // },
//                                             body: formData,
//                                         });

//                                         console.log("Post.createdBy", post.createdBy);
//                                         console.log("Post.categories", post.categories);
//                                         console.log("POST", post);

//                                         if (this.state.title === '' && this.state.createdBy.length === 0 && this.state.selectedOptions.length == 0) {
//                                             window.alert('Fill the Title, Written By and Categories filds');
//                                             return;
//                                         }

//                                         else if (this.state.title === '') {
//                                             window.alert('Fill the Title field');
//                                             return;
//                                         }

//                                         else if (this.state.createdBy.length === 0) {
//                                             window.alert('Fill the Written By field');
//                                             return;
//                                         }
//                                         else if (this.state.selectedOptions.length === 0) {
//                                             window.alert('Fill the Categories field');
//                                             return;
//                                         }
//                                         PostService.updatePost(post, this.state._id)
//                                             .then((res) => {
//                                                 window.location.replace('http://localhost:3000/news-list');
//                                             })
//                                             .catch((error) => {
//                                                 console.log(error.message);
//                                             });
//                                         console.log(
//                                             "valueArray izvan setState",
//                                             this.state.valueArray
//                                         );
//                                     }
//                                 );
//                             } else {
//                                 ////////////////////////////
//                                 e.preventDefault();

//                                 // let valueArray = this.state.selectedOptions.map(item => item.value);
//                                 // console.log("Ovo je valueArray" + JSON.stringify(valueArray));
//                                 // console.log("ELSE->VALUEARRAY",valueArray)

//                                 console.log(
//                                     "USAO U ELSE->WRITER PROMJENJEN A CATEGORIJE OSTALE ISTE"
//                                 );
//                                 const formData = new FormData();

//                                 let imagesForm = [];
//                                 for (let i = 0; i < this.state.images2.length; i++) {
//                                     formData.append("images2", this.state.images2[i]);

//                                     imagesForm.push(formData);
//                                 }

//                                 //Array of files converting to array of objects
//                                 const filesArray = [];

//                                 // Loop through the array of files
//                                 for (let i = 0; i < this.state.images2.length; i++) {
//                                     const file = this.state.images2[i];
//                                     const reader = new FileReader();

//                                     // Use the FileReader API to read the contents of the file
//                                     reader.readAsDataURL(file);

//                                     // When the file is loaded, create an object and push it to the array
//                                     reader.onload = function () {
//                                         filesArray.push({
//                                             name: file.name,
//                                         });
//                                     };
//                                 }

//                                 // console.log("Ovo je filesArray", filesArray);

//                                 let imagesNames = [];

//                                 for (let i = 0; i < this.state.images2.length; i++) {
//                                     imagesNames.push(this.state.images2[i].name);
//                                 }

//                                 console.log(
//                                     "ELSE->Iznad let post->this.state.selectedOptions",
//                                     this.state.selectedOptions
//                                 );

//                                 let selectedOptionsValue = this.state.selectedOptions.map(
//                                     (item) => item.value
//                                 );
//                                 let post = {
//                                     title: this.state.title,
//                                     shortDescription: this.state.shortDescription,
//                                     mainContent: this.state.mainContent,
//                                     isPublished: this.state.isPublished,
//                                     postDate: this.state.postDate,
//                                     categories: selectedOptionsValue,
//                                     createdBy: this.state.selectedWriter.value,
//                                     images: imagesNames,
//                                 };

//                                 console.log("POST iz elsa", post);

//                                 //  this.setState({preselectedWriterId:post.createdBy})

//                                 fetch("http://localhost:8000/api/image", {
//                                     method: "POST",
//                                     // headers:{
//                                     //     'Content-Type':'multipart/form-data'
//                                     // },
//                                     body: formData,
//                                 });
//                                 if (this.state.title === '' && this.state.createdBy.length === 0 && this.state.selectedOptions.length == 0) {
//                                     window.alert('Fill the Title, Written By and Categories filds');
//                                     return;
//                                 }

//                                 else if (this.state.title === '') {
//                                     window.alert('Fill the Title field');
//                                     return;
//                                 }

//                                 else if (this.state.createdBy.length === 0) {
//                                     window.alert('Fill the Written By field');
//                                     return;
//                                 }
//                                 else if (this.state.selectedOptions.length === 0) {
//                                     window.alert('Fill the Categories field');
//                                     return;
//                                 }

//                                 PostService.updatePost(post, this.state._id)

//                                     .then((res) => {
//                                         window.location.replace('http://localhost:3000/news-list');
//                                     })
//                                     .catch((error) => {
//                                         console.log(error.message);
//                                     });
//                             }
//                         });
//                     }
//                 );
//             } else {
//                 console.log("USOO U ELSE");

//                 const formData = new FormData();

//                 let imagesForm = [];
//                 for (let i = 0; i < this.state.images2.length; i++) {
//                     formData.append("images2", this.state.images2[i]);

//                     imagesForm.push(formData);
//                 }

//                 //Array of files converting to array of objects
//                 const filesArray = [];

//                 // Loop through the array of files
//                 for (let i = 0; i < this.state.images2.length; i++) {
//                     const file = this.state.images2[i];
//                     const reader = new FileReader();

//                     // Use the FileReader API to read the contents of the file
//                     reader.readAsDataURL(file);

//                     // When the file is loaded, create an object and push it to the array
//                     reader.onload = function () {
//                         filesArray.push({
//                             name: file.name,
//                             //   type: file.type,
//                             //   size: file.size,
//                             //   data: reader.r
//                         });
//                     };
//                 }

//                 // console.log("Ovo je filesArray", filesArray);

//                 let imagesNames = [];

//                 for (let i = 0; i < this.state.images2.length; i++) {
//                     imagesNames.push(this.state.images2[i].name);
//                 }

//                 console.log(
//                     "iznad let post=>this.state.selectedWriter",
//                     this.state.selectedWriter
//                 );
//                 ///

//                 let valueArrayOfSelectedCategories = [];
//                 valueArrayOfSelectedCategories = this.state.selectedOptions.map(
//                     (item) => item.value
//                 );

//                 if (this.state.selectedWriter !== "") {
//                     console.log("Izabrane vrijednosti i pisca i kategorije");
//                     let post = {
//                         ////////////////////////////////////////
//                         title: this.state.title,
//                         shortDescription: this.state.shortDescription,
//                         mainContent: this.state.mainContent,
//                         isPublished: this.state.isPublished,
//                         postDate: this.state.postDate,
//                         categories: valueArrayOfSelectedCategories,
//                         createdBy: this.state.selectedWriter.value,
//                         images: imagesNames, //valueArray2 i selectedWriterValue[0] su dobre
//                     };
//                     console.log("ELSE->POST", post);

//                     fetch("http://localhost:8000/api/image", {
//                         method: "POST",
//                         // headers:{
//                         //     'Content-Type':'multipart/form-data'
//                         // },
//                         body: formData,
//                     });
//                     if (this.state.title === '' && this.state.selectedWriter === '' && this.state.selectedOptions.length == 0) {
//                         window.alert('Fill the Title, Written By and Categories filds');
//                         return;
//                     }

//                     else if (this.state.title === '') {
//                         window.alert('Fill the Title field');
//                         return;
//                     }

//                     else if (this.state.createdBy.length === 0) {
//                         window.alert('Fill the Written By field');
//                         return;
//                     }
//                     else if (this.state.selectedOptions.length === 0) {
//                         window.alert('Fill the Categories field');
//                         return;
//                     }

//                     PostService.updatePost(post, this.state._id)

//                         .then((res) => {
//                             window.location.replace('http://localhost:3000/news-list');
//                         })
//                         .catch((error) => {
//                             console.log(error.message);
//                         });
//                 } else {
//                     //pisac osto nepromjenjen

//                     console.log("PISAC OSTAO NEPROMJENJEN");
//                     console.log("Izabrane vrijednosti i pisca i kategorije");

//                     let valueArrayOfSelectedCategories = [];
//                     valueArrayOfSelectedCategories = this.state.selectedOptions.map(
//                         (item) => item.value
//                     );
//                     let post = {
//                         ////////////////////////////////////////
//                         title: this.state.title,
//                         shortDescription: this.state.shortDescription,
//                         mainContent: this.state.mainContent,
//                         isPublished: this.state.isPublished,
//                         postDate: this.state.postDate,
//                         categories: valueArrayOfSelectedCategories,
//                         createdBy: this.state.selectedWriter.value,
//                         images: imagesNames, //valueArray2 i selectedWriterValue[0] su dobre
//                     };
//                     console.log("ELSE->POST", post);

//                     fetch("http://localhost:8000/api/image", {
//                         method: "POST",
//                         // headers:{
//                         //     'Content-Type':'multipart/form-data'
//                         // },
//                         body: formData,
//                     });
//                     if (this.state.title === '' && this.state.createdBy.length === 0 && this.state.selectedOptions.length == 0) {
//                         window.alert('Fill the Title, Written By and Categories filds');
//                         return;
//                     }

//                     else if (this.state.title === '') {
//                         window.alert('Fill the Title field');
//                         return;
//                     }

//                     else if (this.state.createdBy.length === 0) {
//                         window.alert('Fill the Written By field');
//                         return;
//                     }
//                     else if (this.state.selectedOptions.length === 0) {
//                         window.alert('Fill the Categories field');
//                         return;
//                     }

//                     PostService.updatePost(post, this.state._id)
//                         .then((res) => {
//                             window.location.replace('http://localhost:3000/news-list');
//                         })
//                         .catch((error) => {
//                             console.log(error.message);
//                         });
//                 }

//             }
//         }

//     }

//     changeTitleHandler(event) {
//         this.setState({ title: event.target.value });
//     }

//     changeShortDescriptionHandler(event) {
//         this.setState({ shortDescription: event.target.value });
//     }

//     changeMainContentHandler(event) {
//         this.setState({ mainContent: event.target.value });
//     }

//     changeIsPublishedHandler(event) {
//         // console.log('Ovo je iz IsPublished evenet' + event.target.value);
//         this.setState({ isPublished: event.target.checked });
//     }

//     changePostDateHandler(event) {
//         this.setState({ postDate: event.target.value });
//     }

//     handleSelect(event) {
//         this.setState({ selectedOptions: event });
//     }

//     handleWriterSelect(event) {
//         console.log("EVENT", event);
//         // this.setState({ createdBy: event.value });
//         this.setState({ selectedWriter: event }, () => {
//             console.log(
//                 "handleWriterSelect=>selectedWriter",
//                 this.state.selectedWriter
//             ); //value=....,label=....
//         });
//     }

//     getWriter() {
//         return this.state.writers.map((writer) => {
//             return <option value={writer.value}>{writer.label}</option>;
//         });
//     }

//     ///////////ImageUploader constants//////////////////
//     readImage = (event) => {
//         console.log();
//         if (window.File && window.FileList && window.FileReader) {
//             const files = event.target.files; //FileList object
//             if (files != null) {
//                 console.log("Ovo je files iz readImage", files);
//                 for (let i = 0; i < files.length; i++) {
//                     const file = files[i];
//                     this.state.images2.push(file);
//                     console.log("IMAGES2", this.state.images2)


//                     if (!file.type.match("image")) continue;

//                     const picReader = new FileReader();

//                     picReader.addEventListener("load", (event) => {
//                         //bez ovoga nece da prikaze selektovanu sliku
//                         const picFile = event.target;
//                         const newImage = picFile.result;
//                         console.log(
//                             "Ovo je newImage iz picReader.addEventListener",
//                             newImage
//                         );
//                         this.setState(
//                             (prevState) => ({ images: [...prevState.images, newImage] }),
//                             () => {
//                                 console.log("Ovo su images nakon setovanja", this.state.images);
//                             }
//                         );
//                     });

//                     console.log("Ovo je file iznad icReader.readAsDataURL(file)", file);
//                     picReader.readAsDataURL(file); //bez ovoga nece da prikaze selektovanu sliku
//                 }
//                 document.querySelector("#pro-image").value = "";
//             } else {
//                 return;
//             }
//         } else {
//             console.log("Browser does not support");
//         }
//     };

//     handleImageUpload = (e) => {
//         const files = Array.from(e.target.files);
//         console.log("handleImageUpload=>files", files);
//         const newImages = files.map((file) => URL.createObjectURL(file));
//         this.setState((prevState) => ({
//             images: [...prevState.images, ...newImages],
//         }));
//         console.log("handleImageLoad=>newImages", newImages);
//     };



//     handleImageDelete = (index) => {
//         const newImages = [...this.state.images];
//         newImages.splice(index, 1);
//         this.setState({ images: newImages });

//         const preselectedImagesArray = [...this.state.tempImageArray];
//         preselectedImagesArray.splice(index, 1);
//         this.setState({ tempImageArray: preselectedImagesArray })

//         const images2 = [...this.state.images2];
//         images2.splice(index, 1);
//         this.setState({ images2: images2 });
//     };

//     // handlePreselectedImageDelete = (index) => {
//     //     const newImages = [...this.state.tempImageArray];
//     //     newImages.splice(index, 1);
//     //     this.setState({ tempImageArray: newImages });
//     //   };

//     handleDrop = (event) => {
//         event.preventDefault();
//         const files = Array.from(event.dataTransfer.files);
//         const newImages = files.map((file) => URL.createObjectURL(file));
//         this.setState((prevState) => ({
//             images: [...prevState.images, ...newImages],
//         }));
//     };

//     handleDragOver = (event) => {
//         event.preventDefault();
//     };

//     handleOneWriterChange(e) {
//         this.setState({ preselectedWriter: e.value, name: e.label });
//     }

//     /////////////////////////////////////////////////

//     render() {
//         const dropdownIndicatorStyles = (base, state) => {
//             let changes = {
//                 // all your override styles
//                 backgroundColor: "green",
//             };
//             return Object.assign(base, changes);
//         };

//         const colourStyles = {
//             control: (styles) => ({
//                 ...styles,
//                 backgroundColor: " #F4F5FC",
//                 borderRadius: 10,
//                 height: 50,
//                 border: 0,
//                 color: "white",
//                 dropdownIndicator: { dropdownIndicatorStyles },
//             }),
//             option: (styles, { data, isDisabled, isFocused, isSelected }) => {
//                 return {
//                     ...styles,

//                     height: 50,
//                     dropdownIndicator: { dropdownIndicatorStyles },
//                 };
//             },
//             multiValue: (styles, { data }) => {
//                 return {
//                     ...styles,
//                     backgroundColor: "#5561B3",
//                     borderRadius: 10,
//                     height: 40,
//                 };
//             },
//             multiValueLabel: (styles, { data }) => {
//                 return {
//                     ...styles,
//                     color: "#FFFFFF",
//                     fontSize: 16,
//                     fontWeight: 500,
//                     fontFamily: "'Poppins', sans-serif",
//                     aliginSelf: "center",
//                 };
//             },
//         };

//         const dateObject = new Date(this.state.postDate);

//         const defaultDate = dateObject.toISOString().slice(0, 10);

//         return (
//             <form>
//                 <div className="heading-post">
//                     <h1>Update Post</h1>
//                     <div className="top-btns">
//                         <button className="save-button" onClick={this.updatePost}>
//                             <Isvg src={Save} />
//                             Save
//                         </button>
//                     </div>
//                 </div>
//                 <div className="add-news-content">
//                     <div className="left-form">
//                         <input
//                             className="title-input"
//                             name="title"
//                             placeholder="Title"
//                             type="text"
//                             value={this.state.title}
//                             onChange={this.changeTitleHandler}
//                         />
//                         <h2>Content</h2>
//                         <div className="textarea-content">
//                             <label>Short description</label>
//                             <textarea
//                                 rows="5"
//                                 cols="50"
//                                 placeholder="Short content of the editor..."
//                                 value={this.state.shortDescription}
//                                 onChange={this.changeShortDescriptionHandler}
//                             ></textarea>
//                         </div>

//                         <div className="textarea-content">
//                             <label>Main content</label>
//                             <textarea
//                                 rows="20"
//                                 cols="50"
//                                 placeholder="Content of the editor..."
//                                 value={this.state.mainContent}
//                                 onChange={this.changeMainContentHandler}
//                             ></textarea>
//                         </div>

//                         <div className="image-uploader">
//                             <h4>Images</h4>
//                             <fieldset className="form-group">
//                                 <input
//                                     type="file"
//                                     id="pro-image"
//                                     name="pro-image"
//                                     style={{ display: "none" }}
//                                     className="form-control"
//                                     multiple
//                                     onInput={(event) => {
//                                         this.readImage(event);
//                                         this.handleImageUpload(event);
//                                     }}
//                                 />
//                             </fieldset>

//                             <div
//                                 className="preview-images-zone"
//                                 onDrop={this.handleDrop.bind(this)}
//                                 onDragOver={this.handleDragOver.bind(this)}
//                             >
//                                 {
//                                     this.state.images.map((image, index) => (
//                                         <div
//                                             className={`preview-image preview-show-${index + 1}`}
//                                             key={index}
//                                         >
//                                             <div
//                                                 className="image-cancel"
//                                                 data-no={index + 1}
//                                                 onClick={() => this.handleImageDelete(index)}
//                                             >
//                                                 <Isvg src={Cancel} />
//                                             </div>
                                           
//                                             <div className="image-zone">
//                                                 <img id={`pro-img-${index + 1}`} src={image} alt="" />
//                                             </div>
//                                         </div>
//                                     ))
//                                 }
//                                 <a
//                                     href="javascript:void(0)"
//                                     onClick={() => document.getElementById("pro-image").click()}
//                                 >
//                                     <div className="uploader-add-link">
//                                         <Isvg src={Plus} />
//                                         <span className="span1">Upload a File</span>
//                                         <span className="span2"> or drag and drop</span>
//                                     </div>
//                                 </a>
//                             </div>
//                             {/* <ImageComponent imageFileForBlob={this.state.imageFileForBlob} /> */}
//                         </div>
//                     </div>

//                     <div className="right-form">
//                         <div className="select-content">
//                             <label>Written By</label>
//                             <Select
//                                 options={this.state.writers}
//                                 value={
//                                     this.state.selectedWriter
//                                         ? this.state.selectedWriter
//                                         : this.state.preselectedWriter
//                                 }
//                                 onChange={this.handleWriterSelect}
//                                 styles={colourStyles}
//                             />
//                         </div>

//                         <div className="date-content">
//                             <label>Post Date</label>
//                             <input
//                                 className="date-input"
//                                 type="date"
//                                 value={defaultDate}
//                                 onChange={this.changePostDateHandler}
//                             />
//                         </div>

//                         <div className="categories-content">
//                             <label>Categories</label>
//                             <Select
//                                 options={this.state.categories}
//                                 placeholder="Select category"
//                                 value={
//                                     this.state.selectedOptions
//                                         ? this.state.selectedOptions
//                                         : this.state.preselectedCategoriesArray
//                                 }
//                                 // value={this.state.preselectedCategoriesArray}

//                                 onChange={this.handleSelect}
//                                 isSearchable={true}
//                                 isMulti
//                                 styles={colourStyles}
//                             />
//                         </div>

//                         <div className="published-content">
//                             <label>Published</label>
//                             <label className="switch">
//                                 <input
//                                     type="checkbox"
//                                     value={this.state.isPublished}
//                                     checked={this.state.isPublished}
//                                     onChange={this.changeIsPublishedHandler}
//                                 />
//                                 <span className="slider round"></span>
//                             </label>
//                         </div>
//                     </div>
//                 </div>

//                 <div></div>
//             </form>
//         );
//     }

//     async getListOfWriters() {
//         const res = await axios.get("http://localhost:8000/api/writer");
//         console.log("res", res);
//         const writers = res.data.writers.map((d) => ({
//             value: d._id,
//             label: d.name + " " + d.lastName,
//         }));
//         this.setState({ writers: writers });
//         console.log("writers su:" + JSON.stringify(writers));
//     }

//     handleWriterChange(e) {
//         this.setState({ createdBy: e.value, name: e.label });
//         console.log("Ovo je createdBy iz handleWriterChange", this.state.createdBy);
//     }

//     async getListOfCategories() {
//         const res = await axios.get("http://localhost:8000/api/category");
//         const categories = res.data.categories.map((d) => ({
//             value: d._id,
//             label: d.name,
//         }));
//         this.setState({ categories: categories });
//     }

//     handleCategoryChange(e) {
//         this.setState({ categories: e.value, name: e.label });
//     }
// }
// export default UpdatePostComponent;