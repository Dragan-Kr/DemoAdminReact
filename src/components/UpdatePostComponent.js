import React, { Component } from "react";
import axios from "axios";
import Select from "react-select";
import PostService from "../services/PostService";
import "bootstrap/dist/css/bootstrap.min.css";

import { FormGroup, Label, Input, Options } from "reactstrap";

import Isvg from "react-inlinesvg";
import Save from "../images/save.svg";
import Plus from "../images/plus.svg";
import Cancel from "../images/cancel.svg";
import FormData from "form-data";

import { NEWS_LIST } from "../globalVariables";
import { IMAGE_API } from "../globalVariables";
import { WRITER_API } from "../globalVariables";
import { CATEGORY_API } from "../globalVariables";
import { API_REST } from "../globalVariables";

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
      writerName: "",
      preselectedCategories: [],
      preselectedCategoriesArray: [],
      preselectedWriter: [],
      selectedWriter: "",
      valueArray: [],
      imageFile: [],
      imageFileForBlob: [],
      tempImageArray: [],
      preselectedImages: [],
      imagesNames: [],
      imagesFiles: [],
      imageIndex: 0,
      newCreatedImagesNames: [],
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
    this.handleDrop = this.handleDrop.bind(this);
    this.getWriter = this.getWriter.bind(this);
  }

  async componentDidMount() {
    if (this.state._id === 0) {
      this.getListOfWriters();
      this.getListOfCategories();
    } else {
      await PostService.getPostById(this.state._id).then((res) => {
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
            imagesNames: res.data.post.images,
          },
          () => {
            this.getListOfPreselectedCategories();
            this.getPreselectedWriter();
            this.getListOfWriters();
            this.getListOfCategories();
          }
        );
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.state.imagesFiles !== prevState.imagesFiles &&
      this.state.imagesFiles.length > 0
    ) {
      const newImagesNames = Array.from(this.state.imagesFiles).map(
        (file) => "/uploads/" + file.name
      );
      const mergedFileNamesArray = [
        ...this.state.imagesNames,
        ...newImagesNames,
      ];
      this.setState({ newCreatedImagesNames: mergedFileNamesArray }, () => {
        console.log("UPDATED STATE:", this.state.imagesNames);
      });
    }
  }

  getPreselectedWriter() {
    let preselectedWriter = [];
    axios
      .get(WRITER_API + "/" + this.state.createdBy)
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

      axios
        .get(CATEGORY_API + "/" + this.state.preselectedCategories[index])
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
      if (
        this.state.title === "" &&
        this.state.selectedWriter === "" &&
        this.state.selectedOptions.length == 0
      ) {
        window.alert("Fill the Title, Written By and Categories filds");
        return;
      } else if (this.state.title === "") {
        window.alert("Fill the Title field");
        return;
      } else if (this.state.selectedWriter === "") {
        window.alert("Fill the Written By field");
        return;
      } else if (this.state.selectedOptions.length === 0) {
        window.alert("Fill the Categories field");
        return;
      }

      const selectedCategories = this.state.selectedOptions.map(
        (item) => item.value
      );

      console.log("this.state.selectedOptions", this.state.selectedOptions);
      const formData = new FormData();

      if (this.state.imagesFiles.length > 0) {
        const imagesForm = [];
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

        console.log("Ovo je filesArray", filesArray);

        const imagesNames = [];

        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          imagesNames.push(this.state.imagesFiles[i].name);
        }

        console.log("imagesNames je", imagesNames);

        let post = {
          title: this.state.title,
          shortDescription: this.state.shortDescription,
          mainContent: this.state.mainContent,
          isPublished: this.state.isPublished,
          postDate: this.state.postDate,
          categories: selectedCategories,
          createdBy: this.state.selectedWriter.value,
          images: this.state.newCreatedImagesNames,
        };

        console.log("OVVVVO JE POST", post);

        console.log("FORM DATA", formData);
        fetch(IMAGE_API, {
          method: "POST",
          body: formData,
        });

        PostService.createPost(post)
          .then((res) => {
            // window.location.replace(NEWS_LIST);
          })
          .catch((error) => {
            // window.alert('Post failed');
            console.log(error.message);
          });
      } else {
        let post = {
          title: this.state.title,
          shortDescription: this.state.shortDescription,
          mainContent: this.state.mainContent,
          isPublished: this.state.isPublished,
          postDate: this.state.postDate,
          categories: selectedCategories,
          createdBy: this.state.selectedWriter.value,
        };

        console.log("FORM DATA", formData);

        PostService.createPost(post)
          .then((res) => {
            // window.location.replace(NEWS_LIST);
          })
          .catch((error) => {
            // window.alert('Post failed');
            console.log(error.message);
          });
      }
    }

    ///UPDATE
    else {
      if (this.state.selectedOptions === "") {
        //categories nepromjenjen
        this.setState(
          { selectedOptions: this.state.preselectedCategoriesArray },
          () => {
            this.setState({ valueArray: this.state.selectedOptions }, () => {
              console.log(
                "OVO je this.state.selectedOptions",
                this.state.selectedOptions
              );
              console.log("UpdatePost=>=>valueArray", this.state.valueArray);
              const formData = new FormData();

              const imagesForm = [];
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
                console.log(
                  "Preselektovana slika koja treba da se procita",
                  file
                );
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

              let imagesNames2 = [];
              for (let i = 0; i < this.state.imagesFiles.length; i++) {
                imagesNames.push(this.state.imagesFiles[i].name);
              }

              imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
              this.setState({ imagesNames: imagesNames2 });

              if (this.state.selectedWriter === "") {
                let valueArray2 = [];
                valueArray2 = this.state.valueArray.map((item) => item.value);

                this.setState(
                  { selectedWriter: this.state.preselectedWriter },
                  () => {
                    let selectedWriterValue = this.state.selectedWriter.map(
                      (item) => item.value
                    );

                    let post = {
                      title: this.state.title,
                      shortDescription: this.state.shortDescription,
                      mainContent: this.state.mainContent,
                      isPublished: this.state.isPublished,
                      postDate: this.state.postDate,
                      categories: valueArray2,
                      createdBy: selectedWriterValue[0],
                      images: this.state.newCreatedImagesNames,
                    };

                    fetch(IMAGE_API, {
                      method: "POST",
                      body: formData,
                    });

                    if (
                      this.state.title === "" &&
                      this.state.createdBy.length === 0 &&
                      this.state.selectedOptions.length == 0
                    ) {
                      window.alert(
                        "Fill the Title, Written By and Categories filds"
                      );
                      return;
                    } else if (this.state.title === "") {
                      window.alert("Fill the Title field");
                      return;
                    } else if (this.state.createdBy.length === 0) {
                      window.alert("Fill the Written By field");
                      return;
                    } else if (this.state.selectedOptions.length === 0) {
                      window.alert("Fill the Categories field");
                      return;
                    }
                    PostService.updatePost(post, this.state._id)
                      .then((res) => {
                        // window.location.replace(NEWS_LIST);
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
                e.preventDefault();
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

                let imagesNames = [];
                let imagesNames2 = [];

                for (let i = 0; i < this.state.imagesFiles.length; i++) {
                  imagesNames.push(this.state.imagesFiles[i].name);
                  console.log(
                    "this.state.images2[i].name",
                    this.state.imagesFiles[i].name
                  );
                }
                imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
                this.setState({ imagesNames: imagesNames2 });

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
                  images: this.state.newCreatedImagesNames,
                };

                console.log("POST iz elsa", post);

                fetch(IMAGE_API, {
                  method: "POST",
                  body: formData,
                });
                if (
                  this.state.title === "" &&
                  this.state.createdBy.length === 0 &&
                  this.state.selectedOptions.length == 0
                ) {
                  window.alert(
                    "Fill the Title, Written By and Categories filds"
                  );
                  return;
                } else if (this.state.title === "") {
                  window.alert("Fill the Title field");
                  return;
                } else if (this.state.createdBy.length === 0) {
                  window.alert("Fill the Written By field");
                  return;
                } else if (this.state.selectedOptions.length === 0) {
                  window.alert("Fill the Categories field");
                  return;
                }

                PostService.updatePost(post, this.state._id)
                  .then((res) => {
                    // window.location.replace(NEWS_LIST);
                  })
                  .catch((error) => {
                    console.log(error.message);
                  });
              }
            });
          }
        );
      } else {
        const formData = new FormData();

        const imagesForm = [];
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

        let imagesNames = [];
        let imagesNames2 = [];

        for (let i = 0; i < this.state.imagesFiles.length; i++) {
          imagesNames.push(this.state.imagesFiles[i].name);
        }

        imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
        this.setState({ imagesNames: imagesNames2 });

        const valueArrayOfSelectedCategories = [];
        valueArrayOfSelectedCategories = this.state.selectedOptions.map(
          (item) => item.value
        );

        if (this.state.selectedWriter !== "") {
          console.log("Izabrane vrijednosti i pisca i kategorije");
          let post = {
            title: this.state.title,
            shortDescription: this.state.shortDescription,
            mainContent: this.state.mainContent,
            isPublished: this.state.isPublished,
            postDate: this.state.postDate,
            categories: valueArrayOfSelectedCategories,
            createdBy: this.state.selectedWriter.value,
            images: this.state.newCreatedImagesNames,
          };
          console.log("ELSE->POST", post);

          fetch(IMAGE_API, {
            method: "POST",
            body: formData,
          });
          if (
            this.state.title === "" &&
            this.state.selectedWriter === "" &&
            this.state.selectedOptions.length == 0
          ) {
            window.alert("Fill the Title, Written By and Categories filds");
            return;
          } else if (this.state.title === "") {
            window.alert("Fill the Title field");
            return;
          } else if (this.state.createdBy.length === 0) {
            window.alert("Fill the Written By field");
            return;
          } else if (this.state.selectedOptions.length === 0) {
            window.alert("Fill the Categories field");
            return;
          }

          PostService.updatePost(post, this.state._id)
            .then((res) => {
              window.location.replace(NEWS_LIST);
            })
            .catch((error) => {
              console.log(error.message);
            });
        } else {
          //pisac ostao nepromjenjen

          let valueArrayOfSelectedCategories = [];
          valueArrayOfSelectedCategories = this.state.selectedOptions.map(
            (item) => item.value
          );
          let post = {
            title: this.state.title,
            shortDescription: this.state.shortDescription,
            mainContent: this.state.mainContent,
            isPublished: this.state.isPublished,
            postDate: this.state.postDate,
            categories: valueArrayOfSelectedCategories,
            createdBy: this.state.selectedWriter.value,
            images: this.state.newCreatedImagesNames,
          };

          fetch(IMAGE_API, {
            method: "POST",
            body: formData,
          });
          if (
            this.state.title === "" &&
            this.state.createdBy.length === 0 &&
            this.state.selectedOptions.length == 0
          ) {
            window.alert("Fill the Title, Written By and Categories filds");
            return;
          } else if (this.state.title === "") {
            window.alert("Fill the Title field");
            return;
          } else if (this.state.createdBy.length === 0) {
            window.alert("Fill the Written By field");
            return;
          } else if (this.state.selectedOptions.length === 0) {
            window.alert("Fill the Categories field");
            return;
          }

          PostService.updatePost(post, this.state._id)
            .then((res) => {
              window.location.replace(NEWS_LIST);
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

    this.setState({ selectedWriter: event }, () => {
      console.log(
        "handleWriterSelect=>selectedWriter",
        this.state.selectedWriter
      );
    });
  }

  getWriter() {
    return this.state.writers.map((writer) => {
      return <option value={writer.value}>{writer.label}</option>;
    });
  }

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

  handleImages = (event) => {
    let files = event.target.files;
    console.log("HANDLE IMAGES->FILES", files);

    const mergedFilesArray = [...this.state.imagesFiles, ...files];
    this.setState({ imagesFiles: mergedFilesArray });

    // this.setState({ imagesFiles: files });
  };

  handleImageDelete = (index) => {
    const imagesNames = [...this.state.imagesNames];
    imagesNames.splice(index, 1);
    this.setState({ imagesNames: imagesNames });
    if (index >= this.state.imagesNames.length - 1) {
      const imagesFilesArray = [...this.state.imagesFiles];
      imagesFilesArray.splice(index - this.state.imagesNames.length, 1);
      this.setState({ imagesFiles: imagesFilesArray });
    }
  };

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
          {this.state._id === 0 ? <h1>Add Post</h1> : <h1>Update Post</h1>}
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
                    this.handleImages(event);
                  }}
                />
              </fieldset>

              <div
                className="preview-images-zone"
                onDrop={this.handleDrop.bind(this)}
                onDragOver={this.handleDragOver.bind(this)}
              >
                {this.state.imagesNames.length > 0 ? (
                  this.state.imagesNames.map((image, index) => (
                    <div
                      className={`preview-image preview-show-${index + 1}`}
                      key={index}
                    >
                      <div
                        className="image-cancel"
                        data-no={index + 1}
                        onClick={() => this.handleImageDelete(index)}
                        key={index}
                      >
                        <Isvg src={Cancel} />
                      </div>

                      <div className="image-zone">
                        <img
                          id={`pro-img-${index + 1}`}
                          src={`${API_REST}${image}`}
                          alt=""
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div></div>
                )}

                {this.state.imagesFiles.length > 0 ? (
                  Array.from(this.state.imagesFiles).map((item, index) => (
                    <div
                      className={`preview-image preview-show-${index + 1}`}
                      key={index}
                    >
                      <div
                        className="image-cancel"
                        data-no={index + 1}
                        onClick={() => this.handleImageDelete(index)}
                        key={index}
                      >
                        <Isvg src={Cancel} />
                      </div>

                      <div className="image-zone">
                        <img
                          id={`pro-img-${index + 1}`}
                          src={URL.createObjectURL(item)}
                          alt=""
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div></div>
                )}

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

            {/* <FormGroup>
              <Label for="exampleSelect">Select</Label>
              <Input id="exampleSelect" name="select" type="select">
                {this.state.writers.map((option) => (
                  <option key={option.value} value={ this.state.selectedWriter
                    ? this.state.selectedWriter
                    : this.state.preselectedWriter}>
                    {option.label}
                  </option>
                ))}
              </Input>
            </FormGroup> */}

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
    const res = await axios.get(WRITER_API);
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
    const res = await axios.get(CATEGORY_API);
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
//   constructor(props) {
//     super(props);

//     this.state = {
//       _id: props._id,
//       title: "",
//       shortDescription: "",
//       mainContent: "",
//       isPublished: false,
//       postDate: new Date(),
//       createdBy: "",
//       categories: [],
//       selectedOptions: "",
//       images: [],
//       images2: [],
//       firstCategories: [],
//       writers: [],
//       preselectedWriterId: "",
//       writerName: "",
//       preselectedCategories: [],
//       preselectedCategoriesArray: [],
//       preselectedWriter: [],
//       selectedWriter: "",
//       valueArray: [],
//       imageFile: [],
//       imageFileForBlob: [],
//       tempImageArray: [],
//       preselectedImages: [],
//       imagesNames: [],
//       imagesFiles: [],
//       imageIndex: 0,
//     };

//     this.changeTitleHandler = this.changeTitleHandler.bind(this);
//     this.changeTitleHandler = this.changeTitleHandler.bind(this);
//     this.changeShortDescriptionHandler =
//       this.changeShortDescriptionHandler.bind(this);
//     this.changeMainContentHandler = this.changeMainContentHandler.bind(this);
//     this.changeIsPublishedHandler = this.changeIsPublishedHandler.bind(this);
//     this.changePostDateHandler = this.changePostDateHandler.bind(this);
//     this.updatePost = this.updatePost.bind(this);
//     this.handleSelect = this.handleSelect.bind(this);
//     this.handleWriterSelect = this.handleWriterSelect.bind(this);
//     this.handleDrop = this.handleDrop.bind(this);
//     this.getWriter = this.getWriter.bind(this);
//   }

//   async componentDidMount() {
//     if (this.state._id === 0) {
//       this.getListOfWriters();
//       this.getListOfCategories();
//     } else {
//       await PostService.getPostById(this.state._id).then((res) => {
//         this.setState(
//           {
//             title: res.data.post.title,
//             shortDescription: res.data.post.shortDescription,
//             mainContent: res.data.post.mainContent,
//             isPublished: res.data.post.isPublished,
//             postDate: res.data.post.postDate,
//             createdBy: res.data.post.createdBy,
//             categories: res.data.post.categories,
//             preselectedCategories: res.data.post.categories,
//             index: res.data.post.index,
//             preselectedWriterId: res.data.post.createdBy,
//             imagesNames: res.data.post.images,
//           },
//           () => {
//             this.getListOfPreselectedCategories();
//             this.getPreselectedWriter();
//             this.getListOfWriters();
//             this.getListOfCategories();
//           }
//         );
//       });
//     }
//   }

//   getPreselectedWriter() {
//     let preselectedWriter = [];
//     axios
//       .get(WRITER_API + "/" + this.state.createdBy)
//       .then((res) => {
//         preselectedWriter.push(res.data.writer);

//         const preselectedWriter2 = preselectedWriter.map((d) => ({
//           value: d._id,
//           label: d.name + " " + d.lastName,
//         }));

//         this.setState({ preselectedWriter: preselectedWriter2 });
//       })
//       .catch(function (error) {
//         console.log("Error in fetching market updates");
//       });
//   }

//   getListOfPreselectedCategories() {
//     let preselectedCategoriesArray = [];
//     for (let index in this.state.preselectedCategories) {
//       if (
//         typeof index === "undefined" ||
//         index < 0 ||
//         index >= this.state.preselectedCategories.length
//       ) {
//         console.log("Invalid index value:", index);
//         return;
//       }

//       axios
//         .get(
//             CATEGORY_API +
//             "/" +
//             this.state.preselectedCategories[index]
//         )
//         .then((res) => {
//           console.log("getListOfPreselectedCategories=>res.data", res.data);
//           preselectedCategoriesArray.push(res.data.category);
//           console.log(
//             "then=>preselectedCategoriesArray",
//             preselectedCategoriesArray
//           );
//           const preselectedCategoriesArray2 = preselectedCategoriesArray.map(
//             (d) => ({
//               value: d._id,
//               label: d.name,
//             })
//           );
//           console.log(
//             "preselectedCategoriesArray2",
//             preselectedCategoriesArray2
//           );

//           this.setState({
//             preselectedCategoriesArray: preselectedCategoriesArray2,
//           });
//         })
//         .catch(function (error) {
//           console.log("Error in fetching market updates");
//         });
//     }
//   }

//   updatePost(e) {
//     e.preventDefault();

//     if (this.state._id === 0) {
//       if (
//         this.state.title === "" &&
//         this.state.selectedWriter === "" &&
//         this.state.selectedOptions.length == 0
//       ) {
//         window.alert("Fill the Title, Written By and Categories filds");
//         return;
//       } else if (this.state.title === "") {
//         window.alert("Fill the Title field");
//         return;
//       } else if (this.state.selectedWriter === "") {
//         window.alert("Fill the Written By field");
//         return;
//       } else if (this.state.selectedOptions.length === 0) {
//         window.alert("Fill the Categories field");
//         return;
//       }

//       const selectedCategories = this.state.selectedOptions.map(
//         (item) => item.value
//       );

//       console.log("this.state.selectedOptions", this.state.selectedOptions);
//       const formData = new FormData();

//       if (this.state.imagesFiles.length > 0) {
//         const imagesForm = [];
//         for (let i = 0; i < this.state.imagesFiles.length; i++) {
//           formData.append("images2", this.state.imagesFiles[i]);
//           imagesForm.push(formData);
//         }

//         //Array of files converting to array of objects
//         const filesArray = [];

//         // Loop through the array of files
//         for (let i = 0; i < this.state.imagesFiles.length; i++) {
//           const file = this.state.imagesFiles[i];
//           const reader = new FileReader();

//           // Use the FileReader API to read the contents of the file
//           reader.readAsDataURL(file);

//           // When the file is loaded, create an object and push it to the array
//           reader.onload = function () {
//             filesArray.push({
//               name: file.name,
//             });
//           };
//         }

//         console.log("Ovo je filesArray", filesArray);

//         const imagesNames = [];

//         for (let i = 0; i < this.state.imagesFiles.length; i++) {
//           imagesNames.push(this.state.imagesFiles[i].name);
//         }

//         console.log("imagesNames je", imagesNames);

//         this.setState({ imagesNames: imagesNames });
//         let post = {
//           title: this.state.title,
//           shortDescription: this.state.shortDescription,
//           mainContent: this.state.mainContent,
//           isPublished: this.state.isPublished,
//           postDate: this.state.postDate,
//           categories: selectedCategories,
//           createdBy: this.state.selectedWriter.value,
//           images: this.state.imagesNames,
//         };

//         console.log("FORM DATA", formData);
//         fetch(IMAGE_API, {
//           method: "POST",
//           body: formData,
//         });

//         PostService.createPost(post)
//           .then((res) => {
//             window.location.replace(NEWS_LIST);
//           })
//           .catch((error) => {
//             // window.alert('Post failed');
//             console.log(error.message);
//           });
//       } else {
//         let post = {
//           title: this.state.title,
//           shortDescription: this.state.shortDescription,
//           mainContent: this.state.mainContent,
//           isPublished: this.state.isPublished,
//           postDate: this.state.postDate,
//           categories: selectedCategories,
//           createdBy: this.state.selectedWriter.value,
//         };

//         console.log("FORM DATA", formData);

//         PostService.createPost(post)
//           .then((res) => {
//             window.location.replace(NEWS_LIST);
//           })
//           .catch((error) => {
//             // window.alert('Post failed');
//             console.log(error.message);
//           });
//       }
//     } else {
//       if (this.state.selectedOptions === "") {
//         //categories nepromjenjen
//         this.setState(
//           { selectedOptions: this.state.preselectedCategoriesArray },
//           () => {
//             this.setState({ valueArray: this.state.selectedOptions }, () => {
//               console.log(
//                 "OVO je this.state.selectedOptions",
//                 this.state.selectedOptions
//               );
//               console.log("UpdatePost=>=>valueArray", this.state.valueArray);
//               const formData = new FormData();

//               const imagesForm = [];
//               for (let i = 0; i < this.state.imagesFiles.length; i++) {
//                 formData.append("images2", this.state.imagesFiles[i]);

//                 imagesForm.push(formData);
//               }

//               //Array of files converting to array of objects
//               const filesArray = [];

//               // Loop through the array of files
//               for (let i = 0; i < this.state.imagesFiles.length; i++) {
//                 let file = this.state.imagesFiles[i];
//                 const reader = new FileReader();

//                 // Use the FileReader API to read the contents of the file
//                 console.log(
//                   "Preselektovana slika koja treba da se procita",
//                   file
//                 );
//                 reader.readAsDataURL(file);

//                 // When the file is loaded, create an object and push it to the array
//                 reader.onload = function () {
//                   filesArray.push({
//                     name: file.name,
//                     //   type: file.type,
//                     //   size: file.size,
//                     //   data: reader.r
//                   });
//                 };
//               }

//               // console.log("Ovo je filesArray", filesArray);

//               let imagesNames = [];

//               let imagesNames2 = [];
//               for (let i = 0; i < this.state.imagesFiles.length; i++) {
//                 imagesNames.push(this.state.imagesFiles[i].name);
//               }

//               imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
//               this.setState({ imagesNames: imagesNames2 });

//               if (this.state.selectedWriter === "") {
//                 let valueArray2 = [];
//                 valueArray2 = this.state.valueArray.map((item) => item.value);

//                 this.setState(
//                   { selectedWriter: this.state.preselectedWriter },
//                   () => {
//                     let selectedWriterValue = this.state.selectedWriter.map(
//                       (item) => item.value
//                     );

//                     let post = {
//                       title: this.state.title,
//                       shortDescription: this.state.shortDescription,
//                       mainContent: this.state.mainContent,
//                       isPublished: this.state.isPublished,
//                       postDate: this.state.postDate,
//                       categories: valueArray2,
//                       createdBy: selectedWriterValue[0],
//                       images: this.state.imagesNames,
//                     };

//                     fetch(IMAGE_API, {
//                       method: "POST",
//                       body: formData,
//                     });

//                     if (
//                       this.state.title === "" &&
//                       this.state.createdBy.length === 0 &&
//                       this.state.selectedOptions.length == 0
//                     ) {
//                       window.alert(
//                         "Fill the Title, Written By and Categories filds"
//                       );
//                       return;
//                     } else if (this.state.title === "") {
//                       window.alert("Fill the Title field");
//                       return;
//                     } else if (this.state.createdBy.length === 0) {
//                       window.alert("Fill the Written By field");
//                       return;
//                     } else if (this.state.selectedOptions.length === 0) {
//                       window.alert("Fill the Categories field");
//                       return;
//                     }
//                     PostService.updatePost(post, this.state._id)
//                       .then((res) => {
//                         window.location.replace(
//                             NEWS_LIST
//                         );
//                       })
//                       .catch((error) => {
//                         console.log(error.message);
//                       });
//                     console.log(
//                       "valueArray izvan setState",
//                       this.state.valueArray
//                     );
//                   }
//                 );
//               } else {
//                 e.preventDefault();
//                 console.log(
//                   "USAO U ELSE->WRITER PROMJENJEN A CATEGORIJE OSTALE ISTE"
//                 );
//                 const formData = new FormData();

//                 let imagesForm = [];
//                 for (let i = 0; i < this.state.imagesFiles.length; i++) {
//                   formData.append("images2", this.state.imagesFiles[i]);

//                   imagesForm.push(formData);
//                 }

//                 //Array of files converting to array of objects
//                 const filesArray = [];

//                 // Loop through the array of files
//                 for (let i = 0; i < this.state.imagesFiles.length; i++) {
//                   const file = this.state.imagesFiles[i];
//                   const reader = new FileReader();

//                   // Use the FileReader API to read the contents of the file
//                   reader.readAsDataURL(file);

//                   // When the file is loaded, create an object and push it to the array
//                   reader.onload = function () {
//                     filesArray.push({
//                       name: file.name,
//                     });
//                   };
//                 }

//                 let imagesNames = [];
//                 let imagesNames2 = [];

//                 for (let i = 0; i < this.state.imagesFiles.length; i++) {
//                   imagesNames.push(this.state.imagesFiles[i].name);
//                   console.log(
//                     "this.state.images2[i].name",
//                     this.state.imagesFiles[i].name
//                   );
//                 }
//                 imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
//                 this.setState({ imagesNames: imagesNames2 });

//                 let selectedOptionsValue = this.state.selectedOptions.map(
//                   (item) => item.value
//                 );
//                 let post = {
//                   title: this.state.title,
//                   shortDescription: this.state.shortDescription,
//                   mainContent: this.state.mainContent,
//                   isPublished: this.state.isPublished,
//                   postDate: this.state.postDate,
//                   categories: selectedOptionsValue,
//                   createdBy: this.state.selectedWriter.value,
//                   images: this.state.imagesNames,
//                 };

//                 console.log("POST iz elsa", post);

//                 fetch(IMAGE_API, {
//                   method: "POST",
//                   body: formData,
//                 });
//                 if (
//                   this.state.title === "" &&
//                   this.state.createdBy.length === 0 &&
//                   this.state.selectedOptions.length == 0
//                 ) {
//                   window.alert(
//                     "Fill the Title, Written By and Categories filds"
//                   );
//                   return;
//                 } else if (this.state.title === "") {
//                   window.alert("Fill the Title field");
//                   return;
//                 } else if (this.state.createdBy.length === 0) {
//                   window.alert("Fill the Written By field");
//                   return;
//                 } else if (this.state.selectedOptions.length === 0) {
//                   window.alert("Fill the Categories field");
//                   return;
//                 }

//                 PostService.updatePost(post, this.state._id)
//                   .then((res) => {
//                     window.location.replace(NEWS_LIST);
//                   })
//                   .catch((error) => {
//                     console.log(error.message);
//                   });
//               }
//             });
//           }
//         );
//       } else {
//         const formData = new FormData();

//         const imagesForm = [];
//         for (let i = 0; i < this.state.imagesFiles.length; i++) {
//           formData.append("images2", this.state.imagesFiles[i]);
//           imagesForm.push(formData);
//         }

//         //Array of files converting to array of objects
//         const filesArray = [];

//         // Loop through the array of files
//         for (let i = 0; i < this.state.imagesFiles.length; i++) {
//           const file = this.state.imagesFiles[i];
//           const reader = new FileReader();

//           // Use the FileReader API to read the contents of the file
//           reader.readAsDataURL(file);

//           // When the file is loaded, create an object and push it to the array
//           reader.onload = function () {
//             filesArray.push({
//               name: file.name,
//             });
//           };
//         }

//         let imagesNames = [];
//         let imagesNames2 = [];

//         for (let i = 0; i < this.state.imagesFiles.length; i++) {
//           imagesNames.push(this.state.imagesFiles[i].name);
//         }

//         imagesNames2 = [...this.state.imagesNames, ...imagesNames2];
//         this.setState({ imagesNames: imagesNames2 });

//         const valueArrayOfSelectedCategories = [];
//         valueArrayOfSelectedCategories = this.state.selectedOptions.map(
//           (item) => item.value
//         );

//         if (this.state.selectedWriter !== "") {
//           console.log("Izabrane vrijednosti i pisca i kategorije");
//           let post = {
//             title: this.state.title,
//             shortDescription: this.state.shortDescription,
//             mainContent: this.state.mainContent,
//             isPublished: this.state.isPublished,
//             postDate: this.state.postDate,
//             categories: valueArrayOfSelectedCategories,
//             createdBy: this.state.selectedWriter.value,
//             images: this.state.imagesNames,
//           };
//           console.log("ELSE->POST", post);

//           fetch(IMAGE_API, {
//             method: "POST",
//             body: formData,
//           });
//           if (
//             this.state.title === "" &&
//             this.state.selectedWriter === "" &&
//             this.state.selectedOptions.length == 0
//           ) {
//             window.alert("Fill the Title, Written By and Categories filds");
//             return;
//           } else if (this.state.title === "") {
//             window.alert("Fill the Title field");
//             return;
//           } else if (this.state.createdBy.length === 0) {
//             window.alert("Fill the Written By field");
//             return;
//           } else if (this.state.selectedOptions.length === 0) {
//             window.alert("Fill the Categories field");
//             return;
//           }

//           PostService.updatePost(post, this.state._id)
//             .then((res) => {
//               window.location.replace(NEWS_LIST);
//             })
//             .catch((error) => {
//               console.log(error.message);
//             });
//         } else {
//           //pisac ostao nepromjenjen

//           let valueArrayOfSelectedCategories = [];
//           valueArrayOfSelectedCategories = this.state.selectedOptions.map(
//             (item) => item.value
//           );
//           let post = {
//             title: this.state.title,
//             shortDescription: this.state.shortDescription,
//             mainContent: this.state.mainContent,
//             isPublished: this.state.isPublished,
//             postDate: this.state.postDate,
//             categories: valueArrayOfSelectedCategories,
//             createdBy: this.state.selectedWriter.value,
//             images: this.state.imagesNames,
//           };

//           fetch(IMAGE_API, {
//             method: "POST",
//             body: formData,
//           });
//           if (
//             this.state.title === "" &&
//             this.state.createdBy.length === 0 &&
//             this.state.selectedOptions.length == 0
//           ) {
//             window.alert("Fill the Title, Written By and Categories filds");
//             return;
//           } else if (this.state.title === "") {
//             window.alert("Fill the Title field");
//             return;
//           } else if (this.state.createdBy.length === 0) {
//             window.alert("Fill the Written By field");
//             return;
//           } else if (this.state.selectedOptions.length === 0) {
//             window.alert("Fill the Categories field");
//             return;
//           }

//           PostService.updatePost(post, this.state._id)
//             .then((res) => {
//               window.location.replace(NEWS_LIST);
//             })
//             .catch((error) => {
//               console.log(error.message);
//             });
//         }
//       }
//     }
//   }

//   changeTitleHandler(event) {
//     this.setState({ title: event.target.value });
//   }

//   changeShortDescriptionHandler(event) {
//     this.setState({ shortDescription: event.target.value });
//   }

//   changeMainContentHandler(event) {
//     this.setState({ mainContent: event.target.value });
//   }

//   changeIsPublishedHandler(event) {
//     this.setState({ isPublished: event.target.checked });
//   }

//   changePostDateHandler(event) {
//     this.setState({ postDate: event.target.value });
//   }

//   handleSelect(event) {
//     this.setState({ selectedOptions: event });
//   }

//   handleWriterSelect(event) {
//     console.log("EVENT", event);

//     this.setState({ selectedWriter: event }, () => {
//       console.log(
//         "handleWriterSelect=>selectedWriter",
//         this.state.selectedWriter
//       );
//     });
//   }

//   getWriter() {
//     return this.state.writers.map((writer) => {
//       return <option value={writer.value}>{writer.label}</option>;
//     });
//   }

//   handleDrop = (event) => {
//     event.preventDefault();
//     const files = Array.from(event.dataTransfer.files);
//     const newImages = files.map((file) => URL.createObjectURL(file));
//     this.setState((prevState) => ({
//       images: [...prevState.images, ...newImages],
//     }));
//   };

//   handleDragOver = (event) => {
//     event.preventDefault();
//   };

//   handleOneWriterChange(e) {
//     this.setState({ preselectedWriter: e.value, name: e.label });
//   }

//   handleImages = (event) => {
//     let files = event.target.files;
//     this.setState({ imagesFiles: files });
//     const newImagesNames = Array.from(files).map(
//       (file) => "/uploads/" + file.name
//     );
//     const mergedFileNamesArray = [...this.state.imagesNames, ...newImagesNames];
//     this.setState({ imagesNames: mergedFileNamesArray });
//   };

//   handleImageDelete = (index) => {
//     const imagesNames = [...this.state.imagesNames];
//     imagesNames.splice(index, 1);
//     this.setState({ imagesNames: imagesNames });
//     if (index >= this.state.imagesNames.length - 1) {
//       const imagesFilesArray = [...this.state.imagesFiles];
//       imagesFilesArray.splice(index - this.state.imagesNames.length, 1);
//       this.setState({ imagesFiles: imagesFilesArray });
//     }
//   };

//   render() {
//     const dropdownIndicatorStyles = (base, state) => {
//       let changes = {
//         // all your override styles
//         backgroundColor: "green",
//       };
//       return Object.assign(base, changes);
//     };

//     const colourStyles = {
//       control: (styles) => ({
//         ...styles,
//         backgroundColor: " #F4F5FC",
//         borderRadius: 10,
//         height: 50,
//         border: 0,
//         color: "white",
//         dropdownIndicator: { dropdownIndicatorStyles },
//       }),
//       option: (styles, { data, isDisabled, isFocused, isSelected }) => {
//         return {
//           ...styles,

//           height: 50,
//           dropdownIndicator: { dropdownIndicatorStyles },
//         };
//       },
//       multiValue: (styles, { data }) => {
//         return {
//           ...styles,
//           backgroundColor: "#5561B3",
//           borderRadius: 10,
//           height: 40,
//         };
//       },
//       multiValueLabel: (styles, { data }) => {
//         return {
//           ...styles,
//           color: "#FFFFFF",
//           fontSize: 16,
//           fontWeight: 500,
//           fontFamily: "'Poppins', sans-serif",
//           aliginSelf: "center",
//         };
//       },
//     };

//     const dateObject = new Date(this.state.postDate);

//     const defaultDate = dateObject.toISOString().slice(0, 10);

//     return (
//       <form>
//         <div className="heading-post">
//           {this.state._id === 0 ? <h1>Add Post</h1> : <h1>Update Post</h1>}
//           <div className="top-btns">
//             <button className="save-button" onClick={this.updatePost}>
//               <Isvg src={Save} />
//               Save
//             </button>
//           </div>
//         </div>
//         <div className="add-news-content">
//           <div className="left-form">
//             <input
//               className="title-input"
//               name="title"
//               placeholder="Title"
//               type="text"
//               value={this.state.title}
//               onChange={this.changeTitleHandler}
//             />
//             <h2>Content</h2>
//             <div className="textarea-content">
//               <label>Short description</label>
//               <textarea
//                 rows="5"
//                 cols="50"
//                 placeholder="Short content of the editor..."
//                 value={this.state.shortDescription}
//                 onChange={this.changeShortDescriptionHandler}
//               ></textarea>
//             </div>

//             <div className="textarea-content">
//               <label>Main content</label>
//               <textarea
//                 rows="20"
//                 cols="50"
//                 placeholder="Content of the editor..."
//                 value={this.state.mainContent}
//                 onChange={this.changeMainContentHandler}
//               ></textarea>
//             </div>

//             <div className="image-uploader">
//               <h4>Images</h4>
//               <fieldset className="form-group">
//                 <input
//                   type="file"
//                   id="pro-image"
//                   name="pro-image"
//                   style={{ display: "none" }}
//                   className="form-control"
//                   multiple
//                   onInput={(event) => {
//                     this.handleImages(event);
//                   }}
//                 />
//               </fieldset>

//               <div
//                 className="preview-images-zone"
//                 onDrop={this.handleDrop.bind(this)}
//                 onDragOver={this.handleDragOver.bind(this)}
//               >
//                 {this.state.imagesNames.map((image, index) => (
//                   <div
//                     className={`preview-image preview-show-${index + 1}`}
//                     key={index}
//                   >
//                     <div
//                       className="image-cancel"
//                       data-no={index + 1}
//                       onClick={() => this.handleImageDelete(index)}
//                       key={index}
//                     >
//                       <Isvg src={Cancel} />
//                     </div>

//                     <div className="image-zone">
//                       <img
//                         id={`pro-img-${index + 1}`}
//                         // src={`http://localhost:8000${image}`}
//                         src={`${API_REST}${image}`}
//                         alt=""
//                       />
//                     </div>
//                   </div>
//                 ))}
//                 <a
//                   href="javascript:void(0)"
//                   onClick={() => document.getElementById("pro-image").click()}
//                 >
//                   <div className="uploader-add-link">
//                     <Isvg src={Plus} />
//                     <span className="span1">Upload a File</span>
//                     <span className="span2"> or drag and drop</span>
//                   </div>
//                 </a>
//               </div>
//             </div>
//           </div>

//           <div className="right-form">
//             <div className="select-content">
//               <label>Written By</label>
//               <Select
//                 options={this.state.writers}
//                 value={
//                   this.state.selectedWriter
//                     ? this.state.selectedWriter
//                     : this.state.preselectedWriter
//                 }
//                 onChange={this.handleWriterSelect}
//                 styles={colourStyles}
//               />
//             </div>

//             <div className="date-content">
//               <label>Post Date</label>
//               <input
//                 className="date-input"
//                 type="date"
//                 value={defaultDate}
//                 onChange={this.changePostDateHandler}
//               />
//             </div>

//             <div className="categories-content">
//               <label>Categories</label>
//               <Select
//                 options={this.state.categories}
//                 placeholder="Select category"
//                 value={
//                   this.state.selectedOptions
//                     ? this.state.selectedOptions
//                     : this.state.preselectedCategoriesArray
//                 }
//                 onChange={this.handleSelect}
//                 isSearchable={true}
//                 isMulti
//                 styles={colourStyles}
//               />
//             </div>

//             <div className="published-content">
//               <label>Published</label>
//               <label className="switch">
//                 <input
//                   type="checkbox"
//                   value={this.state.isPublished}
//                   checked={this.state.isPublished}
//                   onChange={this.changeIsPublishedHandler}
//                 />
//                 <span className="slider round"></span>
//               </label>
//             </div>
//           </div>
//         </div>

//         <div></div>
//       </form>
//     );
//   }

//   async getListOfWriters() {
//     const res = await axios.get(WRITER_API);
//     console.log("res", res);
//     const writers = res.data.writers.map((d) => ({
//       value: d._id,
//       label: d.name + " " + d.lastName,
//     }));
//     this.setState({ writers: writers });
//     console.log("writers su:" + JSON.stringify(writers));
//   }

//   handleWriterChange(e) {
//     this.setState({ createdBy: e.value, name: e.label });
//     console.log("Ovo je createdBy iz handleWriterChange", this.state.createdBy);
//   }

//   async getListOfCategories() {
//     const res = await axios.get(CATEGORY_API);
//     const categories = res.data.categories.map((d) => ({
//       value: d._id,
//       label: d.name,
//     }));
//     this.setState({ categories: categories });
//   }

//   handleCategoryChange(e) {
//     this.setState({ categories: e.value, name: e.label });
//   }
// }
// export default UpdatePostComponent;
